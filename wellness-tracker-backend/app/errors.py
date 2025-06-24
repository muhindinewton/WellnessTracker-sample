# app/errors.py
from flask import jsonify
from app.extensions import db # Import db to handle rollback for 500 errors

def bad_request(e):
    """Error handler for 400 Bad Request."""
    return jsonify({'error': 'Bad request', 'message': str(e)}), 400

def unauthorized(e):
    """Error handler for 401 Unauthorized."""
    return jsonify({'error': 'Unauthorized', 'message': str(e)}), 401

def forbidden(e):
    """Error handler for 403 Forbidden."""
    return jsonify({'error': 'Forbidden', 'message': str(e)}), 403

def not_found(e):
    """Error handler for 404 Not Found."""
    return jsonify({'error': 'Not found', 'message': str(e)}), 404

def internal_error(e):
    """
    Error handler for 500 Internal Server Error.
    Performs a database rollback to ensure consistency.
    """
    db.session.rollback() # Rollback the session on internal server errors
    return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

def register_error_handlers(app):
    """Registers all custom error handlers with the Flask application."""
    app.register_error_handler(400, bad_request)
    app.register_error_handler(401, unauthorized)
    app.register_error_handler(403, forbidden)
    app.register_error_handler(404, not_found)
    app.register_error_handler(500, internal_error)

