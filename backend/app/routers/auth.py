import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db, is_mongo_available
from app.dependencies import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.models.user import (
    RefreshRequest,
    TokenResponse,
    UserCreate,
    UserInDB,
    UserLogin,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserCreate):
    if not is_mongo_available():
        raise HTTPException(503, "Base de données indisponible")

    db = get_db()

    # Check email uniqueness
    existing = await db["users"].find_one({"email": body.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Un compte avec cet email existe déjà",
        )

    user_id = str(uuid.uuid4())
    now = datetime.utcnow()

    user_doc = {
        "_id": user_id,
        "email": body.email,
        "hashed_password": hash_password(body.password),
        "nom": body.nom,
        "prenom": body.prenom,
        "role": "abonne",
        "preferences": {},
        "onboarding_completed": False,
        "created_at": now,
        "last_login": None,
    }

    await db["users"].insert_one(user_doc)

    return UserResponse(
        id=user_id,
        email=body.email,
        nom=body.nom,
        prenom=body.prenom,
        role="abonne",
        created_at=now,
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin):
    if not is_mongo_available():
        # Dev mode: accept demo credentials without DB
        from app.dependencies import MOCK_USER, verify_password as _vp
        if body.email == MOCK_USER.email and _vp(body.password, MOCK_USER.hashed_password):
            return TokenResponse(
                access_token=create_access_token(MOCK_USER.id),
                refresh_token=create_refresh_token(MOCK_USER.id),
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )

    db = get_db()
    user_doc = await db["users"].find_one({"email": body.email})

    if not user_doc or not verify_password(body.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )

    # Update last_login
    await db["users"].update_one(
        {"_id": user_doc["_id"]},
        {"$set": {"last_login": datetime.utcnow()}},
    )

    return TokenResponse(
        access_token=create_access_token(user_doc["_id"]),
        refresh_token=create_refresh_token(user_doc["_id"]),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest):
    if not is_mongo_available():
        raise HTTPException(503, "Base de données indisponible")

    try:
        payload = decode_token(body.refresh_token)
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token invalide",
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalide ou expiré",
        )

    # Verify user still exists
    db = get_db()
    user_doc = await db["users"].find_one({"_id": user_id})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
        )

    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(user: UserInDB = Depends(get_current_user)):
    return UserResponse(
        id=user.id,
        email=user.email,
        nom=user.nom,
        prenom=user.prenom,
        role=user.role,
        preferences=user.preferences,
        onboarding_completed=user.onboarding_completed,
        created_at=user.created_at,
        last_login=user.last_login,
    )
