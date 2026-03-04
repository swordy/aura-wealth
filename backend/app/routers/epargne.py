from fastapi import APIRouter, Body, Depends

from app.data.mock_data import EPARGNE
from app.database import get_db, is_mongo_available
from app.dependencies import get_current_user, require_role
from app.models.epargne import EpargneData
from app.models.user import Role, UserInDB
from app.services.patrimoine import get_domain_data, patch_domain_data, put_domain_data, reset_domain_data

DOMAIN = "epargne"
router = APIRouter()


def _db():
    return get_db() if is_mongo_available() else None


@router.get("/epargne", response_model=EpargneData)
async def get_epargne(user: UserInDB = Depends(get_current_user)):
    data = await get_domain_data(_db(), user.id, DOMAIN)
    if data:
        return data
    return EPARGNE


@router.put("/epargne")
async def put_epargne(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await put_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.patch("/epargne")
async def patch_epargne(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await patch_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.post("/epargne/reset")
async def reset_epargne(
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await reset_domain_data(_db(), user.id, DOMAIN)
    return {"success": True, "data": data}
