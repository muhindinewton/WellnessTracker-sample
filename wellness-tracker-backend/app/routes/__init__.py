# app/routes/__init__.py
# This file imports and exposes the blueprints from other route files,
# making them easily accessible in the main app factory.

from .auth_routes import auth_bp
from .dashboard_routes import dashboard_bp
from .daily_entry_routes import daily_entry_bp
from .medication_routes import medication_bp
from .user_routes import user_bp

