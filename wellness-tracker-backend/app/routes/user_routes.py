# app/routes/user_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import User

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """
    Retrieves the authenticated user's profile information.
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            # This should ideally not happen if jwt_required ensures a valid user_id
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    """
    Updates the authenticated user's profile information.
    Allows updating 'name' and 'email'. Checks for duplicate email.
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if 'name' in data:
            user.name = data['name'].strip()
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email'].lower().strip()).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Email already taken'}), 400
            user.email = data['email'].lower().strip()
            
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

