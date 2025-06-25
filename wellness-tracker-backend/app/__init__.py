import os
from flask import Flask, send_from_directory
from .config import Config
from .extensions import db, jwt, cors
from .routes import auth_bp, daily_entry_bp, medication_bp, user_bp, dashboard_bp
from .errors import register_error_handlers
from .models import User, DailyEntry, Medication, MedicationLog

def create_app():
    """
    Flask application factory function.
    Initializes and configures the Flask app, extensions, blueprints, error handlers,
    and static frontend serving.
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
    with app.app_context():
        register_error_handlers(app)

    # Serve Vite-built frontend from dist/
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        dist_dir = os.path.join(root_dir, 'wellness-tracker-frontend', 'dist')

        file_path = os.path.join(dist_dir, path)
        if path != "" and os.path.exists(file_path):
            return send_from_directory(dist_dir, path)
        else:
            return send_from_directory(dist_dir, 'index.html')

    return app
