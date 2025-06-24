# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db
from app.models import User

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Handles new user registration.
    Requires 'email', 'password', and 'name'.
    Returns a JWT access token upon successful registration.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email'].lower().strip()).first():
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user with hashed password
        hashed_password = generate_password_hash(data['password'])
        user = User(
            email=data['email'].lower().strip(),
            name=data['name'].strip(),
            password_hash=hashed_password
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Handles user login.
    Requires 'email' and 'password'.
    Returns a JWT access token upon successful authentication.
    """
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email'].lower().strip()).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Simulates a forgot password request.
    Always returns a success message for security reasons (to avoid email enumeration).
    """
    try:
        data = request.get_json()
        
        if not data or not data.get('email'):
            return jsonify({'error': 'Email is required'}), 400
        
        # In a real application, you would generate a reset token and email it to the user.
        # For security, we respond generically whether the email exists or not.
        return jsonify({
            'message': 'If this email exists, a password reset link has been sent'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

