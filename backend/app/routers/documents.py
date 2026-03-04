"""
Documents router — upload, extract, analyze, integrate, delete.
All endpoints filter by user_id from JWT.
"""

import copy
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile

from app.database import get_db
from app.dependencies import get_current_user
from app.models.document import (
    DocumentResponse,
    DocumentStatus,
    ExtractionResult,
    IntegrationRequest,
)
from app.models.user import UserInDB
from app.services import extractors, patrimoine, storage
from app.services.qwen_agent import analyze_document

router = APIRouter(prefix="/documents", tags=["documents"])

# In-memory store for dev without MongoDB
_mem_docs: dict[str, dict] = {}

DOMAINS = ("dashboard", "epargne", "bourse", "immobilier", "private_equity")


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile,
    user: UserInDB = Depends(get_current_user),
):
    """Upload a file, save it, extract text immediately."""
    if not file.filename:
        raise HTTPException(400, "Nom de fichier manquant")

    content_type = file.content_type or "application/octet-stream"
    doc_id, storage_path = await storage.save_upload(user.id, file)

    doc = {
        "_id": doc_id,
        "user_id": user.id,
        "filename": f"{doc_id}_{file.filename}",
        "original_name": file.filename,
        "content_type": content_type,
        "status": DocumentStatus.extracting.value,
        "storage_path": storage_path,
        "raw_text": None,
        "extracted_data": [],
        "upload_date": datetime.utcnow(),
        "integrated_at": None,
        "error_message": None,
    }

    # Extract text immediately
    file_bytes = storage.get_file(storage_path)
    if file_bytes:
        try:
            raw_text = extractors.extract_text(file_bytes, content_type, file.filename)
            doc["raw_text"] = raw_text
            doc["status"] = DocumentStatus.uploaded.value
        except Exception as e:
            doc["status"] = DocumentStatus.error.value
            doc["error_message"] = str(e)
    else:
        doc["status"] = DocumentStatus.error.value
        doc["error_message"] = "Fichier introuvable après upload"

    # Persist
    db = get_db()
    if db is not None:
        await db.documents.insert_one(doc)
    else:
        _mem_docs[doc_id] = doc

    return _to_response(doc)


@router.get("", response_model=list[DocumentResponse])
async def list_documents(user: UserInDB = Depends(get_current_user)):
    """List all documents for the current user."""
    db = get_db()
    if db is not None:
        cursor = db.documents.find({"user_id": user.id}).sort("upload_date", -1)
        docs = await cursor.to_list(length=200)
    else:
        docs = [d for d in _mem_docs.values() if d["user_id"] == user.id]
        docs.sort(key=lambda d: d["upload_date"], reverse=True)

    return [_to_response(d) for d in docs]


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    user: UserInDB = Depends(get_current_user),
):
    """Get a single document with extraction results."""
    doc = await _find_doc(doc_id, user.id)
    if not doc:
        raise HTTPException(404, "Document introuvable")
    return _to_response(doc)


@router.post("/{doc_id}/analyze", response_model=DocumentResponse)
async def analyze_doc(
    doc_id: str,
    user: UserInDB = Depends(get_current_user),
):
    """Trigger Qwen analysis on an uploaded document."""
    doc = await _find_doc(doc_id, user.id)
    if not doc:
        raise HTTPException(404, "Document introuvable")

    if not doc.get("raw_text"):
        raise HTTPException(400, "Aucun texte extrait du document")

    # Update status to analyzing
    await _update_doc(doc_id, user.id, {"status": DocumentStatus.analyzing.value})

    try:
        # Gather current patrimoine data
        db = get_db()
        current_data: dict[str, dict] = {}
        for domain in DOMAINS:
            data = await patrimoine.get_domain_data(db, user.id, domain)
            if data:
                current_data[domain] = data

        # Run Qwen analysis
        results = await analyze_document(
            doc["raw_text"],
            current_data,
            doc["content_type"],
        )

        # Store results
        results_dicts = [r.model_dump(by_alias=True) for r in results]
        await _update_doc(doc_id, user.id, {
            "status": DocumentStatus.ready.value,
            "extracted_data": results_dicts,
        })

        doc = await _find_doc(doc_id, user.id)
        return _to_response(doc)

    except Exception as e:
        await _update_doc(doc_id, user.id, {
            "status": DocumentStatus.error.value,
            "error_message": str(e),
        })
        raise HTTPException(500, f"Erreur d'analyse : {e}")


@router.post("/{doc_id}/integrate", response_model=DocumentResponse)
async def integrate_document(
    doc_id: str,
    body: IntegrationRequest,
    user: UserInDB = Depends(get_current_user),
):
    """Apply user-approved extraction results to patrimoine data."""
    doc = await _find_doc(doc_id, user.id)
    if not doc:
        raise HTTPException(404, "Document introuvable")

    db = get_db()

    # Group results by domain
    by_domain: dict[str, list[ExtractionResult]] = {}
    for result in body.results:
        by_domain.setdefault(result.domain, []).append(result)

    # Apply each domain's changes
    for domain, results in by_domain.items():
        if domain not in DOMAINS:
            continue

        patch: dict = {}
        for r in results:
            if r.action == "create" and r.field_path.rstrip("[]").endswith("s"):
                # Array append (livrets, positions, fonds, etc.)
                array_key = r.field_path.rstrip("[]")
                patch[f"__append_{array_key}"] = r.new_value
            else:
                patch[r.field_path] = r.new_value

        if patch:
            await patrimoine.patch_domain_data(db, user.id, domain, patch, source="document")

    # Mark as integrated
    await _update_doc(doc_id, user.id, {
        "status": DocumentStatus.integrated.value,
        "integrated_at": datetime.utcnow(),
    })

    doc = await _find_doc(doc_id, user.id)
    return _to_response(doc)


@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    user: UserInDB = Depends(get_current_user),
):
    """Delete a document and its stored file."""
    doc = await _find_doc(doc_id, user.id)
    if not doc:
        raise HTTPException(404, "Document introuvable")

    # Delete stored file
    if doc.get("storage_path"):
        storage.delete_file(doc["storage_path"])

    # Delete from DB
    db = get_db()
    if db is not None:
        await db.documents.delete_one({"_id": doc_id, "user_id": user.id})
    else:
        _mem_docs.pop(doc_id, None)

    return {"ok": True}


# ─── Helpers ────────────────────────────────────────────────────────

async def _find_doc(doc_id: str, user_id: str) -> dict | None:
    db = get_db()
    if db is not None:
        return await db.documents.find_one({"_id": doc_id, "user_id": user_id})
    doc = _mem_docs.get(doc_id)
    if doc and doc["user_id"] == user_id:
        return copy.deepcopy(doc)
    return None


async def _update_doc(doc_id: str, user_id: str, fields: dict) -> None:
    db = get_db()
    if db is not None:
        await db.documents.update_one(
            {"_id": doc_id, "user_id": user_id},
            {"$set": fields},
        )
    else:
        doc = _mem_docs.get(doc_id)
        if doc and doc["user_id"] == user_id:
            doc.update(fields)


def _to_response(doc: dict | None) -> DocumentResponse:
    if doc is None:
        raise HTTPException(404, "Document introuvable")

    extracted = doc.get("extracted_data", [])
    parsed_results: list[ExtractionResult] = []
    for item in extracted:
        if isinstance(item, dict):
            parsed_results.append(ExtractionResult(**item))
        elif isinstance(item, ExtractionResult):
            parsed_results.append(item)

    return DocumentResponse(
        id=doc["_id"],
        filename=doc["filename"],
        original_name=doc["original_name"],
        content_type=doc["content_type"],
        status=DocumentStatus(doc["status"]),
        raw_text=doc.get("raw_text"),
        extracted_data=parsed_results,
        upload_date=doc["upload_date"],
        integrated_at=doc.get("integrated_at"),
        error_message=doc.get("error_message"),
    )
