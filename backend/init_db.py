"""
Database Initialization Script
Creates all tables and seeds initial admin user
Run this ONCE to set up your database
"""

from app import create_app
from database import db
from models.admin import Admin
from models.dog import Dog, DogImage
from models.puppy import Puppy, PuppyImage
from models.gallery import Gallery
from models.booking import Booking
from services.auth_service import hash_password
import os

def init_database():
    """Initialize database with all tables and seed data"""
    app = create_app()
    
    with app.app_context():
        print("\n" + "=" * 60)
        print("🗄️  K9 GSD Kennel - Database Initialization")
        print("=" * 60 + "\n")
        
        # Drop all existing tables with CASCADE for PostgreSQL
        print("⚠️  Dropping existing tables (with cascade)...")
        db.session.close()  # Close any active connections
        db.reflect()        # Make sure SQLAlchemy knows about existing tables
        
        # Use a raw SQL command to drop everything properly in Postgres
        db.session.execute(db.text("DROP SCHEMA public CASCADE;"))
        db.session.execute(db.text("CREATE SCHEMA public;"))
        db.session.commit()
        print("✅ Database cleared\n")
        
        # Create all tables
        print("📋 Creating database tables...")
        db.create_all()
        print("✅ All tables created successfully\n")
        
        # List created tables
        print("📊 Created tables:")
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        for table in tables:
            print(f"   • {table}")
        print()
        
        # Seed admin user
        print("👤 Creating admin user...")
        existing_admin = Admin.query.filter_by(username='admin').first()
        
        if not existing_admin:
            # Create the admin object
            admin = Admin(
                username='admin',
                email='admin@k9kennel.com',
                full_name='K9 Kennel Admin',
                # CALL THE IMPORTED SERVICE FUNCTION HERE
                password_hash = hash_password('admin123') 
            )
            
            db.session.add(admin)
            db.session.commit()
            
            print("✅ Admin user created")
            print(f"   Username: admin")
            print(f"   Password: admin123")
            print(f"   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!\n")
        else:
            print("ℹ️  Admin user already exists\n")
        
        # Create upload directories
        print("📁 Setting up upload directories...")
        upload_base = app.config['UPLOAD_FOLDER']
        directories = ['dogs', 'puppies', 'gallery']
        
        for directory in directories:
            dir_path = os.path.join(upload_base, directory)
            os.makedirs(dir_path, exist_ok=True)
            print(f"   ✅ {dir_path}")
        
        print("\n" + "=" * 60)
        print("✅ Database initialization complete!")
        print("=" * 60)
        print("\n🚀 You can now start the Flask server with: python app.py\n")

if __name__ == '__main__':
    init_database()