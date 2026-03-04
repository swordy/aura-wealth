from datetime import datetime
from enum import Enum

from pydantic import EmailStr, Field

from app.models.common import CamelModel


class Role(str, Enum):
    visiteur = "visiteur"
    abonne = "abonne"
    super_admin = "super_admin"


class UserInDB(CamelModel):
    id: str
    email: EmailStr
    hashed_password: str
    nom: str
    prenom: str
    role: Role = Role.abonne
    preferences: dict = {}
    onboarding_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: datetime | None = None


class UserResponse(CamelModel):
    id: str
    email: EmailStr
    nom: str
    prenom: str
    role: Role
    preferences: dict = {}
    onboarding_completed: bool = False
    created_at: datetime | None = None
    last_login: datetime | None = None


class UserCreate(CamelModel):
    email: EmailStr
    password: str = Field(min_length=8)
    nom: str = Field(min_length=1)
    prenom: str = Field(min_length=1)


class UserLogin(CamelModel):
    email: EmailStr
    password: str


class TokenResponse(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(CamelModel):
    refresh_token: str
