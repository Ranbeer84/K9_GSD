from flask import Flask
from database import db
from models.admin import Admin
import bcrypt
import os
from dotenv import load_dotenv

# Load env to get the DB URL
load_dotenv()

def seed_admin():
    # Create a temporary app instance for the script
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)

    with app.app_context():
        # Check if admin already exists
        admin = Admin.query.filter_by(username='admin').first()
        
        if not admin:
            # Hash the password
            password = "gsd_password_2026".encode('utf-8')
            hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

            new_admin = Admin(
                username='admin',
                email='admin@k9kennel.com',
                password_hash=hashed_pw,
                # is_active=True # Uncomment if your model has this field
            )
            
            db.session.add(new_admin)
            db.session.commit()
            print("✅ Admin created: admin / gsd_password_2026")
        else:
            print("ℹ️ Admin already exists.")

if __name__ == "__main__":
    seed_admin()