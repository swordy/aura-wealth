from fastapi import APIRouter, Body, Depends

from app.data.mock_data import PRIVATE_EQUITY
from app.database import get_db, is_mongo_available
from app.dependencies import get_current_user, require_role
from app.models.private_equity import PrivateEquityData
from app.models.user import Role, UserInDB
from app.services.patrimoine import get_domain_data, patch_domain_data, put_domain_data, reset_domain_data

DOMAIN = "private_equity"
router = APIRouter()


def _db():
    return get_db() if is_mongo_available() else None


@router.get("/private-equity", response_model=PrivateEquityData)
async def get_private_equity(user: UserInDB = Depends(get_current_user)):
    data = await get_domain_data(_db(), user.id, DOMAIN)
    if data:
        return data
    return PRIVATE_EQUITY


@router.put("/private-equity")
async def put_private_equity(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await put_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.patch("/private-equity")
async def patch_private_equity(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await patch_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.post("/private-equity/reset")
async def reset_private_equity(
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await reset_domain_data(_db(), user.id, DOMAIN)
    return {"success": True, "data": data}
