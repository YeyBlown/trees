""" cold storage related functionality module """
import datetime
import threading
from typing import Optional

from fastapi_sqlalchemy import db
from sqlalchemy import and_, func, desc, asc

from adapters.hash_utils import HashUtils
from entities.exceptions import (
    TreeAlreadyLikedException,
    TreeIsNotLikedException,
    ObjectDoesNotExistException,
    UsernameBusyException,
)
from models.models import User as ModelUser
from models.models import Tree as ModelTree
from models.models import Like as ModelLike

from models.schema import TreeFull as SchemaTreeFull
from models.schema import TreeCreate as SchemaTreeCreate
from models.schema import TreeUpdate as SchemaTreeUpdate
from models.schema import User as SchemaUser
from services.datetimeservice import DateTimeService


class DBFacade:
    """main and only facade for interacting with database"""

    _instance = None
    _lock_instance = threading.Lock()
    _lock = threading.Lock()

    # pylint: disable=unused-argument
    def __new__(cls, *args, **kwargs):
        """ensuring our Facade is singleton to apply lock on thread unsafe session operations"""
        if not cls._instance:
            with cls._lock_instance:
                if not cls._instance:
                    cls._instance = super(DBFacade, cls).__new__(cls)
        return cls._instance

    @staticmethod
    def lock_decorator(lock):
        """generic decorator to lock thread unsafe db.session"""

        def decorator(function):
            def wrapper(*args, **kwargs):
                with lock:
                    result = function(*args, **kwargs)
                return result

            return wrapper

        return decorator

    @lock_decorator(_lock)
    def get_user_by_username(self, username: str):
        """returns user model by username"""
        user = db.session.query(ModelUser).filter_by(username=username).first()
        return user

    @lock_decorator(_lock)
    def get_user_by_id(self, user_id: int):
        """returns user model by id"""
        user = db.session.query(ModelUser).filter_by(id=user_id).first()
        return user

    @lock_decorator(_lock)
    def get_all_users(self):
        """returns all user models"""
        users = db.session.query(ModelUser).all()
        return users

    @lock_decorator(_lock)
    def get_paginated_users(self, page, page_size, sort_by, asc_order):
        """returns all user models"""
        users = _UserDBAdapter.query_paginated_users(page, page_size, sort_by, asc_order)
        return users

    @lock_decorator(_lock)
    def search_users(self, query, search_by, page, page_size, sort_by, asc_order):
        """returns all user models"""
        users = _UserDBAdapter.search_paginated_users(query, search_by, page, page_size, sort_by, asc_order)
        return users

    @lock_decorator(_lock)
    def create_user(self, user: SchemaUser):
        """creates new user model by schema and stores it"""
        user_db = _UserDBAdapter.create_user(user)
        return user_db

    @lock_decorator(_lock)
    def delete_user(self, user: ModelUser):
        """deletes given user"""
        db.session.delete(user)
        db.session.commit()

    @staticmethod
    def update_last_login(user: ModelUser):
        """updates user's last_login field by time now"""
        _UserDBAdapter.update_last_login(user)

    @lock_decorator(_lock)
    def create_tree(self, user: SchemaUser, tree: SchemaTreeCreate, author_id):
        """creates new tree model by schema and stores it"""
        tree_db = _TreeDBAdapter.create_tree(tree, author_id)
        _UserDBAdapter.add_tree_created(user, tree_db)
        _UserDBAdapter.update_last_activity(user)
        return tree_db

    @lock_decorator(_lock)
    def get_all_trees(self):
        """returns all user models"""
        trees = _TreeDBAdapter.get_all_trees()
        return trees

    @lock_decorator(_lock)
    def get_trees_by_user(self, user_id: int):
        """returns all tree models with matching author_id"""
        trees_by_user = _TreeDBAdapter.get_trees_by_user(user_id)
        return trees_by_user

    @lock_decorator(_lock)
    def get_likes_by_user_date(
        self,
        date_from: datetime.datetime,
        date_to: datetime.datetime,
        user_id: Optional[int] = None,
    ):
        """returns likes made by user between given dates"""
        likes = _LikeDBAdapter.get_likes_by_user_date(date_from, date_to, user_id)
        return likes

    @lock_decorator(_lock)
    def like(self, user: ModelUser, tree_id: int):
        """likes tree for user"""
        tree = _TreeDBAdapter.get_tree_by_id(tree_id)
        if not tree:
            raise ObjectDoesNotExistException()
        like_db = _LikeDBAdapter.create(user, tree)
        _UserDBAdapter.add_like(user, like_db)
        _TreeDBAdapter.add_like(tree, like_db)
        _UserDBAdapter.update_last_activity(user)
        return like_db

    @lock_decorator(_lock)
    def unlike(self, user: ModelUser, tree_id: int):
        """removes like made by user from tree by tree_id"""
        tree = _TreeDBAdapter.get_tree_by_id(tree_id)
        like = _LikeDBAdapter.get_like(user.id, tree.id)
        if not like:
            raise TreeIsNotLikedException()
        _UserDBAdapter.remove_like(user, like)
        _TreeDBAdapter.remove_like(tree, like)
        db.session.query(ModelLike).filter(and_(ModelLike.id == like.id)).delete()
        _UserDBAdapter.update_last_activity(user)

    @staticmethod
    def get_all_likes():
        """returns all like models"""
        return db.session.query(ModelLike).all()


class _UserDBAdapter:
    @staticmethod
    def add_tree_created(user: ModelUser, tree: ModelTree):
        """add given tree to created by given user"""
        user.trees_created.append(tree)
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def create_user(user: SchemaUser):
        """creates and stores new user model by tree schema"""
        identical_user = (
            db.session.query(ModelUser).filter_by(username=user.username).first()
        )
        if identical_user:
            raise UsernameBusyException()
        password = user.hashed_password
        hashed_password = HashUtils.get_password_hash(password)
        user_db = ModelUser(
            username=user.username,
            hashed_password=hashed_password,
            name=user.name,  # TODO: fill properly
            surname=user.surname,
            description=user.description,
            age=user.age,
            trees_created=[],
            likes=[],
        )
        db.session.add(user_db)
        db.session.commit()
        return user_db

    @staticmethod
    def update_last_login(user: ModelUser):
        """updates last user login by datetime.now()"""
        time_now = datetime.datetime.now()
        user.time_last_login = time_now
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def update_last_activity(user: ModelUser):
        """updates last user activity by datetime.now()"""
        time_now = datetime.datetime.now()
        user.time_last_activity = time_now
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def add_like(user: ModelUser, like: ModelLike):
        """adds like to given user model"""
        user.likes.append(like)
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def remove_like(user: ModelUser, like: ModelLike):
        """removes like from given user model"""
        user.likes.remove(like)
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def query_paginated_users(page, page_size, sort_by, asc_order):
        users = db.session.query(ModelUser).order_by(asc(sort_by) if asc_order else desc(sort_by)).\
            limit(page_size).offset(page * page_size).all()
        return users

    @staticmethod
    def search_paginated_users(query, search_by, page, page_size, sort_by, asc_order):
        users = db.session.query(ModelUser).filter(ModelUser.username.regexp_match(query)).\
            order_by(asc(sort_by) if asc_order else desc(sort_by)).\
            limit(page_size).offset(page * page_size).all()
        return users


class _TreeDBAdapter:
    @staticmethod
    def create_tree(tree: SchemaTreeCreate, author_id):
        """creates and stores new tree model by tree schema"""
        tree_db = ModelTree(
            header=tree.header,  # TODO: fill properly
            content=tree.content,
            author_id=author_id
        )
        db.session.add(tree_db)
        db.session.commit()
        return tree_db

    @staticmethod
    def get_tree_by_id(tree_id: int):
        """returns tree by tree_id"""
        tree = db.session.query(ModelTree).filter_by(id=tree_id).first()
        if not tree:
            raise ObjectDoesNotExistException()
        return tree

    @staticmethod
    def get_all_trees():
        """returns all trees"""
        trees = db.session.query(ModelTree).all()
        return trees

    @staticmethod
    def get_trees_by_user(user_id: int):
        """returns all trees created by user"""
        trees = db.session.query(ModelTree).filter_by(author_id=user_id)
        return trees

    @staticmethod
    def add_like(tree: ModelTree, like: ModelLike):
        """adds given like to tree"""
        tree.likes.append(like)
        db.session.add(like)
        db.session.commit()

    @staticmethod
    def remove_like(tree: ModelTree, like: ModelLike):
        """remove given like from tree"""
        tree.likes.remove(like)
        db.session.add(tree)
        db.session.commit()


class _LikeDBAdapter:
    @staticmethod
    def create(user: ModelUser, tree: ModelTree):
        """creates new like from user to tree"""
        if _LikeDBAdapter.is_like_exists(user.id, tree.id):
            raise TreeAlreadyLikedException()
        time_created = DateTimeService.get_today_datetime()
        like_db = ModelLike(
            user_id=user.id,
            tree_id=tree.id,
            user=user,
            tree=tree,
            time_created=time_created,
        )
        db.session.add(like_db)
        db.session.commit()
        return like_db

    @staticmethod
    def is_like_exists(user_id: id, tree_id: id):
        """return True if like exists else False"""
        try:
            _LikeDBAdapter.get_like(user_id, tree_id)
            return True
        except ObjectDoesNotExistException:
            return False

    @staticmethod
    def get_like(user_id: id, tree_id: id):
        """returns like by user_id and tree_id"""
        like = (
            db.session.query(ModelLike)
            .filter(and_(ModelLike.user_id == user_id, ModelLike.tree_id == tree_id))
            .first()
        )
        if not like:
            raise ObjectDoesNotExistException()
        return like

    @staticmethod
    def get_likes_by_user_date(
        date_from: datetime.datetime,
        date_to: datetime.datetime,
        user_id: Optional[int] = None,
    ):
        """returns likes grouped by date and user"""
        condition = (
            and_(
                func.date(ModelLike.time_created) >= date_from,
                func.date(ModelLike.time_created) <= date_to,
            )
            if user_id is None
            else and_(
                func.date(ModelLike.time_created) >= date_from,
                func.date(ModelLike.time_created) <= date_to,
                ModelLike.user_id == user_id,
            )
        )
        query = (
            db.session.query(ModelLike.time_created, func.count(ModelLike.time_created))
            .filter(condition)
            .group_by(ModelLike.time_created)
        )
        return query.all()
