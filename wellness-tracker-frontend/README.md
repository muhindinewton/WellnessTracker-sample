# Wellness Tracker

The **Wellness Tracker** is a full-stack application designed to help users develop and maintain consistent wellness routines. It provides a simple and secure platform to track daily activities such as sleep, exercise, medications, and general notes, all in one place.

---

## Features

- **User Authentication**: Secure registration, login, and password reset (simulated).
- **Dashboard**: Overview of today's wellness metrics (sleep, exercise, medication status).
- **Daily Tracking**: Log sleep hours, exercise minutes, and general notes for each day.
- **Medication Management**: Add new medications, track dosage and frequency, and log daily intake.
- **Health History**: View a chronological history of past daily entries.
- **Profile Management**: Update personal information like name and email.

---

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for rapid styling.
- **Lucide React**: Icon library for consistent UI elements.

### Backend
- **Flask**: A lightweight Python web framework.
- **Flask-SQLAlchemy**: ORM for interacting with SQLite database.
- **Flask-JWT-Extended**: JSON Web Token (JWT) authentication.
- **Flask-CORS**: Enables Cross-Origin Resource Sharing.
- **Alembic**: Database migration tool for SQLAlchemy.
- **SQLite**: Lightweight, file-based relational database (PostgreSQL recommended for production).
- **Gunicorn**: Python WSGI HTTP server for UNIX.
- **python-dotenv**: For loading environment variables.

---

## Setup Instructions

### 1. Backend Setup

**Clone the repository:**
```bash
git clone <your-backend-repo-url>
cd wellness-tracker-backend
Create and activate a virtual environment:

bash
Copy
Edit
python3 -m venv venv

# macOS/Linux:
source venv/bin/activate

# Windows (CMD):
.\venv\Scripts\activate

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Create .env file:

env
Copy
Edit
SECRET_KEY=your_super_secret_flask_key
JWT_SECRET_KEY=your_super_secret_jwt_key
DATABASE_URL=sqlite:///wellness_tracker.db
FLASK_ENV=development
Initialize Alembic:

bash
Copy
Edit
alembic init migrations
Configure migrations/env.py:

Import:

python
Copy
Edit
from app import create_app
from app.extensions import db
Set metadata:

python
Copy
Edit
target_metadata = db.metadata
Update run_migrations_online():

python
Copy
Edit
from flask import current_app
with current_app.app_context():
    context.configure(
        connection=connectable,
        target_metadata=db.metadata,
        render_as_batch=True
    )
    with context.begin_transaction():
        context.run_migrations()
Generate initial migration:

bash
Copy
Edit
FLASK_APP=run.py alembic revision --autogenerate -m "create_initial_tables"
Apply the migration:

bash
Copy
Edit
FLASK_APP=run.py alembic upgrade head
2. Frontend Setup
Navigate to frontend:

bash
Copy
Edit
cd ../wellness-tracker-frontend
Install dependencies:

bash
Copy
Edit
npm install
Install Lucide React and Tailwind CSS:

bash
Copy
Edit
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
Initialize Tailwind:

bash
Copy
Edit
npx tailwindcss init -p
Configure tailwind.config.js:

javascript
Copy
Edit
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
Update src/index.css:

css
Copy
Edit
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
Set API Base URL (src/api/index.jsx):

javascript
Copy
Edit
const API_BASE_URL = 'http://localhost:5000';
Running the Application Locally
Start Backend
bash
Copy
Edit
cd wellness-tracker-backend
source venv/bin/activate  # or .\venv\Scripts\activate
FLASK_APP=run.py python run.py
Start Frontend
bash
Copy
Edit
cd wellness-tracker-frontend
npm run dev
Backend: http://localhost:5000

Frontend: http://localhost:5173

