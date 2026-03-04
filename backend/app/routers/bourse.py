from fastapi import APIRouter, Body, Depends

from app.data.mock_data import BOURSE
from app.database import get_db, is_mongo_available
from app.dependencies import get_current_user, require_role
from app.models.bourse import BourseData
from app.models.user import Role, UserInDB
from app.services.patrimoine import get_domain_data, patch_domain_data, put_domain_data, reset_domain_data

DOMAIN = "bourse"
router = APIRouter()


def _db():
    return get_db() if is_mongo_available() else None


@router.get("/bourse", response_model=BourseData)
async def get_bourse(user: UserInDB = Depends(get_current_user)):
    data = await get_domain_data(_db(), user.id, DOMAIN)
    if data:
        return data
    return BOURSE


@router.put("/bourse")
async def put_bourse(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await put_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.patch("/bourse")
async def patch_bourse(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await patch_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.post("/bourse/reset")
async def reset_bourse(
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await reset_domain_data(_db(), user.id, DOMAIN)
    return {"success": True, "data": data}
