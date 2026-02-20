"""
Database initialization and configuration - FIXED VERSION
SQLAlchemy setup for PostgreSQL
"""
import logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    """Base class for all models"""
    pass

# Initialize SQLAlchemy with custom base
db = SQLAlchemy(model_class=Base)

def init_db(app):
    """
    Initialize database tables and create default admin
    Call this once when starting the application
    """
    with app.app_context():
        # Import all models to ensure they're registered
        from models.admin import Admin
        from models.dog import Dog, DogImage  # FIXED: Was 'from models import Dog'
        from models.puppy import Puppy, PuppyImage
        from models.gallery import Gallery
        from models.booking import Booking
        
        try:
            # Create all tables if they don't exist
            db.create_all()
            logger.info("✅ Database tables checked/created successfully")
            
            # List all tables created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            logger.info(f"📊 Tables in database: {', '.join(tables)}")
            
            # Check if default admin exists
            admin = Admin.query.filter_by(username='admin').first()
            
            if not admin:
                logger.info("Creating default admin account...")
                
                # Create default admin using set_password method
                default_admin = Admin(
                    username='admin',
                    email='admin@k9kennel.com',
                    full_name='System Administrator',
                    is_active=True
                )
                default_admin.set_password('admin123')
                
                db.session.add(default_admin)
                db.session.commit()
                
                logger.info("=" * 60)
                logger.info("✅ DEFAULT ADMIN CREATED SUCCESSFULLY")
                logger.info("=" * 60)
                logger.info("   Username: admin")
                logger.info("   Password: admin123")
                logger.info("   Email: admin@k9kennel.com")
                logger.info("=" * 60)
                logger.info("⚠️  IMPORTANT: Change this password after first login!")
                logger.info("=" * 60)
            else:
                logger.info(f"ℹ️  Admin user '{admin.username}' already exists")
                logger.info(f"   Email: {admin.email}")
                logger.info(f"   Active: {admin.is_active}")
                
        except Exception as e:
            db.session.rollback()
            logger.error("=" * 60)
            logger.error("❌ DATABASE INITIALIZATION FAILED")
            logger.error("=" * 60)
            logger.error(f"Error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e

def get_db_session():
    """Get database session for manual operations"""
    return db.session