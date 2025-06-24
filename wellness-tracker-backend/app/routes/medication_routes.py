# app/routes/medication_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, datetime
from app.extensions import db
from app.models import Medication, MedicationLog

medication_bp = Blueprint('medication_bp', __name__, url_prefix='/')

@medication_bp.route('/medications', methods=['POST'])
@jwt_required()
def add_medication():
    """
    Adds a new medication for the authenticated user.
    Requires 'name', 'dosage', and 'frequency'.
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('name') or not data.get('dosage') or not data.get('frequency'):
            return jsonify({'error': 'Name, dosage, and frequency are required'}), 400
        
        medication = Medication(
            user_id=user_id,
            name=data['name'].strip(),
            dosage=data['dosage'].strip(),
            frequency=data['frequency'].strip(),
            is_active=True
        )
        
        db.session.add(medication)
        db.session.commit()
        
        return jsonify({
            'message': 'Medication added successfully',
            'medication': medication.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@medication_bp.route('/medication-logs', methods=['PATCH'])
@jwt_required()
def log_medication():
    """
    Toggles the 'taken' status of a medication for the current date.
    Creates a new log if one doesn't exist for today for the given medication.
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('medication_id'):
            return jsonify({'error': 'Medication ID is required'}), 400
        
        medication_id = data['medication_id']
        today = date.today()
        
        # Check if medication belongs to user
        medication = Medication.query.filter_by(id=medication_id, user_id=user_id).first()
        if not medication:
            return jsonify({'error': 'Medication not found'}), 404
        
        # Get or create medication log for today
        log = MedicationLog.query.filter_by(
            user_id=user_id,
            medication_id=medication_id,
            date=today
        ).first()
        
        if log:
            # Toggle taken status
            log.taken = not log.taken
            log.logged_at = datetime.utcnow()
        else:
            # Create new log, marking it as taken
            log = MedicationLog(
                user_id=user_id,
                medication_id=medication_id,
                date=today,
                taken=True
            )
            db.session.add(log)
            
        db.session.commit()
        
        return jsonify({
            'message': 'Medication log updated',
            'log': log.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

