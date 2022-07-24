""" posts related controllers here"""
from fastapi import APIRouter, Depends

from adapters.db import DBFacade
from services.token import TokenService
from entities.exceptions import (
    TreeAlreadyLikedException,
    TreeIsNotLikedException,
    ObjectDoesNotExistException,
)
from models.schema import TreeCreate as SchemaTree
from models.models import User as ModelUser

from pkg.models.schema import PaginatedSearch, TreeSearch

router = APIRouter(
    prefix="/tree",
    tags=["tree"],
    responses={404: {"description": "Not found"}},
)


@router.post("/create", response_model=SchemaTree)
async def create(
    tree: SchemaTree, current_user: ModelUser = Depends(TokenService.get_current_user)
):
    """creates new post by schema"""
    db_post = DBFacade().create_post(current_user, tree, current_user.id)
    return db_post


@router.post("/like")
async def like(
    tree_id: int, current_user: ModelUser = Depends(TokenService.get_current_user)
):
    """likes post as current_user by post_id"""
    try:
        like_db = DBFacade().like(current_user, tree_id)
    except TreeAlreadyLikedException:
        return {"error": "already liked"}
    except ObjectDoesNotExistException:
        return {"error": "post does not exist"}
    return like_db


@router.post("/unlike")
async def unlike(
    tree_id: int, current_user: ModelUser = Depends(TokenService.get_current_user)
):
    """removes like as current_user by post_id"""
    try:
        DBFacade().unlike(current_user, tree_id)
    except TreeIsNotLikedException:
        return {"error": "tree not yet liked"}
    except ObjectDoesNotExistException:
        return {"error": "tree does not exist"}


@router.get("/get_all")
def view():
    """returns all posts to see"""
    posts = DBFacade().get_all_trees()
    return posts


# TODO
@router.get("/search")
def search(paginated_search: PaginatedSearch, tree_search: TreeSearch):
    """returns paginated user models"""
    users = DBFacade().search_trees(paginated_search, tree_search)
    return users
