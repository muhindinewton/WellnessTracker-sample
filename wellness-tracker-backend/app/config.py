from datetime import timedelta
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env file from the project root
project_root = Path(__file__).parent.parent  # adjust if needed
load_dotenv(dotenv_path=project_root / '.env', override=True)

class Config:
    """
    Configuration settings for the Flask application.
    Loads secrets from environment variables or uses default placeholders for development.
    """
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///wellness_tracker.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
