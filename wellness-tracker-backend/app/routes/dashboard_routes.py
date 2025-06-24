# app/routes/dashboard_routes.py
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from app.models import DailyEntry, Medication, MedicationLog

dashboard_bp = Blueprint('dashboard_bp', __name__, url_prefix='/')

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """
    Retrieves the user's dashboard summary for today.
    Includes today's daily entry, active medications, and their corresponding logs.
    """
    try:
        user_id = get_jwt_identity()
        today = date.today()
        
        # Get today's daily entry
        daily_entry = DailyEntry.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()
        
        # Get user's active medications
        medications = Medication.query.filter_by(
            user_id=user_id, 
            is_active=True
        ).all()
        
        # Get today's medication logs
        medication_logs = MedicationLog.query.filter_by(
            user_id=user_id, 
            date=today
        ).all()
        
        return jsonify({
            'daily_entry': daily_entry.to_dict() if daily_entry else None,
            'medications': [med.to_dict() for med in medications],
            'medication_logs': [log.to_dict() for log in medication_logs]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

