# app/models.py
from .extensions import db
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import UniqueConstraint

class User(db.Model):
    """
    User model representing registered users.
    Stores user credentials and profile information.
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    daily_entries = db.relationship('DailyEntry', backref='user', lazy=True, cascade='all, delete-orphan')
    medications = db.relationship('Medication', backref='user', lazy=True, cascade='all, delete-orphan')
    medication_logs = db.relationship('MedicationLog', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hashes the given password and stores it."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Checks if the given password matches the stored hash."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Converts user object to a dictionary for API responses."""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat()
        }

class DailyEntry(db.Model):
    """
    DailyEntry model for tracking daily wellness metrics.
    Ensures only one entry per user per day.
    """
    __tablename__ = 'daily_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    sleep_hours = db.Column(db.Float, default=0.0)
    exercise_minutes = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure one entry per user per day
    __table_args__ = (UniqueConstraint('user_id', 'date', name='unique_user_date'),)
    
    def to_dict(self):
        """Converts daily entry object to a dictionary for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat(),
            'sleep_hours': self.sleep_hours,
            'exercise_minutes': self.exercise_minutes,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class Medication(db.Model):
    """
    Medication model for managing user's medications.
    """
    __tablename__ = 'medications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50), nullable=False)
    frequency = db.Column(db.String(50), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    medication_logs = db.relationship('MedicationLog', backref='medication', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Converts medication object to a dictionary for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'dosage': self.dosage,
            'frequency': self.frequency,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class MedicationLog(db.Model):
    """
    MedicationLog model for tracking when medications are taken by a user on a specific date.
    Ensures only one log per medication per user per day.
    """
    __tablename__ = 'medication_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    taken = db.Column(db.Boolean, default=False)
    logged_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure one log per medication per user per day
    __table_args__ = (UniqueConstraint('user_id', 'medication_id', 'date', name='unique_medication_log'),)
    
    def to_dict(self):
        """Converts medication log object to a dictionary for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'medication_id': self.medication_id,
            'date': self.date.isoformat(),
            'taken': self.taken,
            'logged_at': self.logged_at.isoformat()
        }

