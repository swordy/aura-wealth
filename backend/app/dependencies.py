from datetime import datetime, timedelta

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.config import settings
from app.database import get_db, is_mongo_available
from app.models.user import Role, UserInDB

# OAuth2 scheme — tokenUrl points to the login endpoint
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.api_prefix}/auth/login",
    auto_error=False,  # Don't auto-raise 401, we handle fallback ourselves
)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# Fallback mock user for dev mode without MongoDB
MOCK_USER = UserInDB(
    id="mock-user-001",
    email="demo@aura.fr",
    hashed_password=hash_password("demo1234"),
    nom="Dupont",
    prenom="Jean",
    role=Role.abonne,
)


def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": user_id, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_refresh_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    payload = {"sub": user_id, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token. Raises JWTError on invalid/expired."""
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
) -> UserInDB:
    """
    JWT-based auth when MongoDB is available.
    Falls back to mock user in dev mode without DB.
    """
    # Fallback: no MongoDB → return mock user (dev mode)
    if not is_mongo_available():
        return MOCK_USER.model_copy()

    # If MongoDB is available, JWT is required
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token manquant",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_token(token)
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")
        if user_id is None or token_type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch user from MongoDB
    db = get_db()
    user_doc = await db["users"].find_one({"_id": user_id})
    if user_doc is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserInDB(
        id=user_doc["_id"],
        email=user_doc["email"],
        hashed_password=user_doc["hashed_password"],
        nom=user_doc["nom"],
        prenom=user_doc["prenom"],
        role=Role(user_doc.get("role", "abonne")),
        preferences=user_doc.get("preferences", {}),
        onboarding_completed=user_doc.get("onboarding_completed", False),
        created_at=user_doc.get("created_at", datetime.utcnow()),
        last_login=user_doc.get("last_login"),
    )


def require_role(*allowed: Role):
    async def checker(user: UserInDB = Depends(get_current_user)):
        if user.role not in allowed:
            raise HTTPException(403, "Accès interdit pour ce rôle")
        return user

    return checker
