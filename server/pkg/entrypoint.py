"""main and only application entrypoint"""
import logging

import uvicorn
from fastapi import FastAPI
from fastapi_sqlalchemy import DBSessionMiddleware

from fastapi.middleware.cors import CORSMiddleware #cors
from fastapi_sqlalchemy import db

from adapters.contract import PostgresEnv, AppEnv
from adapters.db import DBFacade
from models.schema import User as SchemaUser

from controllers import auth, tree, api, user
from models.schema import Roles

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tree.router)
app.include_router(api.router)
app.include_router(user.router)

# to avoid csrftokenError
app.add_middleware(DBSessionMiddleware, db_url=PostgresEnv.get_url())


@app.on_event("startup")
async def startup_event():
    with db():
        root_user = DBFacade().get_user_by_username('root')
        if root_user and root_user.role != Roles.SUPER_ADMIN_ROLE.value:
            DBFacade().delete_user(root_user)
            root_user.role = Roles.SUPER_ADMIN_ROLE.value
            root_user.hashed_password = 'root'
            DBFacade.create_user(root_user)
        elif not root_user:
            root_user = SchemaUser(
                username='root',
                hashed_password='root',
                nickname='root',
                role=Roles.SUPER_ADMIN_ROLE.value
            )
            DBFacade().create_user(root_user)

# To run locally
if __name__ == "__main__":
    uvicorn.run(app, host=AppEnv.get_app_host(), port=AppEnv.get_app_port())
