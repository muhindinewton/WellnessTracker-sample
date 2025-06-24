# run.py
from app import create_app
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create the Flask app instance using the factory function
app = create_app()

if __name__ == '__main__':
    # Run the application
    app.run(debug=os.environ.get('FLASK_ENV') == 'development', host='0.0.0.0', port=5000)

