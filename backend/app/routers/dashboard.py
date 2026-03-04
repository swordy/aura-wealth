from fastapi import APIRouter, Body, Depends

from app.data.mock_data import DASHBOARD
from app.database import get_db, is_mongo_available
from app.dependencies import get_current_user, require_role
from app.models.dashboard import DashboardData
from app.models.user import Role, UserInDB
from app.services.patrimoine import get_domain_data, patch_domain_data, put_domain_data, reset_domain_data

DOMAIN = "dashboard"
router = APIRouter()


def _db():
    return get_db() if is_mongo_available() else None


@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(user: UserInDB = Depends(get_current_user)):
    data = await get_domain_data(_db(), user.id, DOMAIN)
    if data:
        return data
    return DASHBOARD


@router.put("/dashboard")
async def put_dashboard(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await put_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.patch("/dashboard")
async def patch_dashboard(
    body: dict = Body(...),
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await patch_domain_data(_db(), user.id, DOMAIN, body)
    return {"success": True, "data": data}


@router.post("/dashboard/reset")
async def reset_dashboard(
    user: UserInDB = Depends(require_role(Role.abonne, Role.super_admin)),
):
    data = await reset_domain_data(_db(), user.id, DOMAIN)
    return {"success": True, "data": data}
