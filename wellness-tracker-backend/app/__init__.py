# app/__init__.py
from flask import Flask
from .config import Config
from .extensions import db, jwt, cors
from .routes import auth_bp, daily_entry_bp, medication_bp, user_bp, dashboard_bp
from .errors import register_error_handlers # Import the function to register error handlers
from .models import User, DailyEntry, Medication, MedicationLog

def create_app():
    """
    Flask application factory function.
    Initializes and configures the Flask app, extensions, blueprints, and error handlers.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    from .extensions import migrate
    migrate.init_app(app, db, directory='app/migrations')
    jwt.init_app(app)
    cors.init_app(app)

    # Register blueprints (routes)
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(daily_entry_bp)
    app.register_blueprint(medication_bp)
    app.register_blueprint(user_bp)

    # Register error handlers
    with app.app_context(): # Ensure app context is active for error handlers
        register_error_handlers(app)

    return app
