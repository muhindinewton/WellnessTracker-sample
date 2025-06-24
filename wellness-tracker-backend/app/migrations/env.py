from logging.config import fileConfig
import os
import sys
from dotenv import load_dotenv

from sqlalchemy import engine_from_config, pool
from alembic import context

# Load .env file
load_dotenv()

# Add the project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))


from flask import current_app
from app.extensions import db

# Alembic Config object
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
# if config.config_file_name is not None:
#     fileConfig(config.config_file_name)

# Use the app context provided by Flask-Migrate
config.set_main_option('sqlalchemy.url',
                       current_app.config['SQLALCHEMY_DATABASE_URI'])

# For 'autogenerate' support
target_metadata = db.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True  # Required for SQLite migrations
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Get the engine from the Flask-SQLAlchemy extension
    connectable = db.get_engine()

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True  # Required for SQLite migrations
        )

        with context.begin_transaction():
            context.run_migrations()


# Choose offline or online migration mode
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
