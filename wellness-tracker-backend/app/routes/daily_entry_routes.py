# app/routes/daily_entry_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, datetime
from app.extensions import db
from app.models import DailyEntry

daily_entry_bp = Blueprint('daily_entry_bp', __name__, url_prefix='/')

@daily_entry_bp.route('/daily-entries', methods=['POST'])
@jwt_required()
def create_daily_entry():
    """
    Creates or updates a daily entry for the authenticated user for the current date.
    If an entry exists for today, it updates it; otherwise, it creates a new one.
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        today = date.today()
        
        # Check if entry already exists for today
        existing_entry = DailyEntry.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()
        
        if existing_entry:
            # Update existing entry
            existing_entry.sleep_hours = data.get('sleep_hours', existing_entry.sleep_hours)
            existing_entry.exercise_minutes = data.get('exercise_minutes', existing_entry.exercise_minutes)
            existing_entry.notes = data.get('notes', existing_entry.notes)
            
            db.session.commit()
            return jsonify({
                'message': 'Daily entry updated',
                'entry': existing_entry.to_dict()
            }), 200
        else:
            # Create new entry
            entry = DailyEntry(
                user_id=user_id,
                date=today,
                sleep_hours=data.get('sleep_hours', 0.0),
                exercise_minutes=data.get('exercise_minutes', 0),
                notes=data.get('notes', '')
            )
            
            db.session.add(entry)
            db.session.commit()
            
            return jsonify({
                'message': 'Daily entry created',
                'entry': entry.to_dict()
            }), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@daily_entry_bp.route('/daily-entries/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_daily_entry(entry_id):
    """
    Updates a specific daily entry by its ID for the authenticated user.
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        entry = DailyEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        # Update fields
        if 'sleep_hours' in data:
            entry.sleep_hours = data['sleep_hours']
        if 'exercise_minutes' in data:
            entry.exercise_minutes = data['exercise_minutes']
        if 'notes' in data:
            entry.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Entry updated successfully',
            'entry': entry.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@daily_entry_bp.route('/daily-entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_daily_entry(entry_id):
    """
    Deletes a specific daily entry by its ID for the authenticated user.
    """
    try:
        user_id = get_jwt_identity()
        
        entry = DailyEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Entry deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@daily_entry_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """
    Retrieves the user's daily entry history with optional pagination.
    Query parameters: 'limit' (default 30), 'offset' (default 0).
    """
    try:
        user_id = get_jwt_identity()
        
        # Get query parameters for filtering
        limit = request.args.get('limit', 30, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Get daily entries with pagination
        entries = DailyEntry.query.filter_by(user_id=user_id)\
                                 .order_by(DailyEntry.date.desc())\
                                 .limit(limit)\
                                 .offset(offset)\
                                 .all()
        
        return jsonify({
            'entries': [entry.to_dict() for entry in entries],
            'total': DailyEntry.query.filter_by(user_id=user_id).count()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

