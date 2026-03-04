"""
File storage service for document uploads.
Uses filesystem when Docker volume is mounted, in-memory fallback otherwise.
"""

import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import settings

# In-memory fallback for dev without Docker volumes
_mem_files: dict[str, bytes] = {}


async def save_upload(user_id: str, file: UploadFile) -> tuple[str, str]:
    """Save uploaded file. Returns (doc_id, storage_path)."""
    doc_id = str(uuid.uuid4())
    content = await file.read()
    safe_name = (file.filename or "upload").replace("/", "_").replace("\\", "_")
    relative_path = f"{user_id}/{doc_id}_{safe_name}"

    upload_dir = Path(settings.upload_dir)
    user_dir = upload_dir / user_id

    try:
        user_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / relative_path
        file_path.write_bytes(content)
    except OSError:
        # Filesystem unavailable — use in-memory store
        _mem_files[relative_path] = content

    return doc_id, relative_path


def get_file(storage_path: str) -> bytes | None:
    """Retrieve file bytes by storage path."""
    file_path = Path(settings.upload_dir) / storage_path
    if file_path.exists():
        return file_path.read_bytes()
    return _mem_files.get(storage_path)


def delete_file(storage_path: str) -> None:
    """Delete a stored file."""
    file_path = Path(settings.upload_dir) / storage_path
    if file_path.exists():
        file_path.unlink(missing_ok=True)
    _mem_files.pop(storage_path, None)
