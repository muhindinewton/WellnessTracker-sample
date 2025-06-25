from app import create_app, db

app = create_app()

with app.app_context():
    # Get table information
    inspector = db.inspect(db.engine)
    tables = inspector.get_table_names()
    print("Database tables:")
    for table in tables:
        print(f"- {table}")
        
    # Check if users table exists
    if 'users' in tables:
        print("\nUsers table exists!")
    else:
        print("\nUsers table does NOT exist. Creating tables...")
        db.create_all()
        print("Tables created successfully.")
