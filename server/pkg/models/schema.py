""" objects schema by pydantic """
# pylint: disable=no-name-in-module,no-self-argument
# pylint: disable=missing-function-docstring,missing-class-docstring
import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class Post(BaseModel):
    header: str
    content: str

    class Config:
        orm_mode = True


class User(BaseModel):
    username: str
    hashed_password: str
    nickname: str
    role: int

    class Config:
        orm_mode = True


class UserWithId(User):
    id: int


class Like(BaseModel):
    user_id: int
    post_id: int

    class Config:
        orm_mode = True


class TreeCreate(BaseModel):
    # location
    location_lon: float
    location_lat: float

    tree_picture: None  # TODO!

    # static data on tree
    registration_number: Optional[str] = None
    core_radius: int  # millimeters
    creation_year: int
    plant_type: str

    # tree events
    should_be_cut: bool = False
    should_be_processed: bool = False
    should_be_removed: bool = False

    # technical for backend
    creator_id: int

    class Config:
        orm_mode = True


class TreeUpdate(TreeCreate):
    id: int


class TreeFull(TreeCreate):
    id: int

    creator: User

    # legacy
    likes: list[Like]

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TreeSearch(BaseModel):

    # location
    location_lat: float
    location_lon: float

    search_radius: float


class PaginatedSearch(BaseModel):
    query: str
    search_by: str = 'username'  # TODO: update to use this in search, please
    page: int = 0
    page_size: int = 10
    sort_by: str = 'id'
    asc_order: bool = True
    ignore_pagination = False


class Roles(Enum):
    BASIC_ROLE = 0
    ADMIN_ROLE = 1
    SUPER_ADMIN_ROLE = 2
