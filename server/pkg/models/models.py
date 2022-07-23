""" sql models with sqlalchemy """
# pylint: disable=missing-function-docstring,missing-class-docstring
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Float, LargeBinary, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


Base = declarative_base()


class Tree(Base):
    __tablename__ = "tree"
    id = Column(Integer, primary_key=True, index=True)

    # location
    location_lon = Column(Float)
    location_lat = Column(Float)

    tree_picture = Column(LargeBinary)

    # static data on tree
    registration_number = Column(String)
    core_radius = Column(Integer)  # millimeters
    creation_year = Column(Integer)
    plant_type = Column(String)

    # tree events
    should_be_cut = Column(Boolean)
    should_be_processed = Column(Boolean)
    should_be_removed = Column(Boolean)

    # technical for backend
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    creator_id = Column(Integer, ForeignKey("user.id"))
    creator = relationship("User", back_populates="trees_created")

    # legacy
    likes = relationship("Like", back_populates="tree")


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)

    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    description = Column(String, nullable=True)
    age = Column(Integer, nullable=False)

    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_last_activity = Column(DateTime(timezone=True), onupdate=func.now())
    time_last_login = Column(DateTime(timezone=True), onupdate=func.now())

    trees_created = relationship("Tree", back_populates="creator")

    likes = relationship("Like", back_populates="user")


class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    time_created = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="likes")

    tree_id = Column(Integer, ForeignKey("tree.id"))
    tree = relationship("Tree", back_populates="likes")
