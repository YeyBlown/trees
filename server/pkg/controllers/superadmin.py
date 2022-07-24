from fastapi import APIRouter, Depends

from adapters.db import DBFacade
from services.token import TokenService
from models.schema import Roles
from models.schema import User as SchemaUser
from models.models import User as ModelUser
from services.token import TokenService

router = APIRouter(
    prefix="/superadmin",
    tags=["superadmin"],
    responses={404: {"description": "Not found"}},
)


@router.delete("/user")
def delete_user(
        user_id: int,
        current_user: ModelUser = Depends(TokenService.get_current_user),

):
    """deletes user by id"""
    if TokenService.check_access_by_roles(current_user, [Roles.SUPER_ADMIN_ROLE]):
        DBFacade().delete_user(DBFacade.get_user_by_id(user_id))
        return {
            "status": "success"
        }


@router.post("/user")
def create_user(
        user: SchemaUser,
        current_user: ModelUser = Depends(TokenService.get_current_user),
):
    """creates new user by schema"""
    if TokenService.check_access_by_roles(current_user, [Roles.SUPER_ADMIN_ROLE]):
        db_user = DBFacade().create_user(user)
        return db_user
