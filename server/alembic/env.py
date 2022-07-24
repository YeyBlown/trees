from logging.config import fileConfig

from sqlalchemy import engine_from_config, create_engine
from sqlalchemy import pool

from alembic import context

# My code
import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, "pkg/alembic.env"))
sys.path.append(BASE_DIR)

print(f'base dir: {BASE_DIR}')

from pkg.adapters.contract import PostgresEnv
from pkg.models.models import Base


# This is the Alembic Config object, which provides
# Access to the values within the .ini file in use.
config = context.config

#  Making a connection
config.set_main_option("sqlalchemy.url", PostgresEnv.get_url())

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata

postgres_uri = PostgresEnv.get_url()
postgres_uri = '/'.join(postgres_uri.split('/')[:-1])
print(f'clean_uri: {postgres_uri}')
engine = create_engine(postgres_uri)
conn = engine.connect()
try:
    conn.execute(f"SELECT 'CREATE DATABASE {PostgresEnv.get_database()}'"
                 f"WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '{PostgresEnv.get_database()}')\gexec")
except Exception as e:
    print('wtf creatin db exception')
    print(e, end='\n________-\n')
finally:
    conn.close()
try:
    print('is there success')
    postgres_uri = PostgresEnv.get_url()
    engine = create_engine(postgres_uri)
    conn = engine.connect()
    print('maybe')
    conn.execute("""
DROP FUNCTION IF EXISTS getTreesGeo;
CREATE FUNCTION getTreesGeo(Lat float, Lng float, Range float)
RETURNS TABLE (
    id int,
    location_lon float,
    location_lat float
)
language plpgsql
AS
$$
-- Returns the trees in range.
BEGIN
    RETURN query (
        SELECT 
            tree.id,
            tree.location_lat,
            tree.location_lon
        FROM tree
        GROUP BY tree.id
        HAVING (
           111.111 *
           DEGREES(
               acos(cos(radians(Lat)) * 
               cos(radians(tree.location_lat)) * 
               cos(radians(Lng - tree.location_lon)) + 
               sin(radians(Lat)) * 
               sin(radians(tree.location_lat )))
           )
        ) < Range 
        ORDER BY (
           111.111 *
           DEGREES(
               acos(cos(radians(Lat)) * 
               cos(radians(tree.location_lat)) * 
               cos(radians(Lng - tree.location_lon)) + 
               sin(radians(Lat)) * 
               sin(radians(tree.location_lat )))
           )
        )
    );
END;
$$;
    """)
    print('fucking success')
except BaseException as e:
    print('omg')
    print(e)
finally:
    conn.close()


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
