"""
Authentication Service - FIXED VERSION
Business logic for admin authentication with proper bcrypt handling
"""

import bcrypt
import logging
from models.admin import Admin
from database import db
from utils.jwt_helper import generate_token

logger = logging.getLogger(__name__)

def hash_password(password):
    """
    Hash password using bcrypt and return as a UTF-8 string.
    
    CRITICAL: Bcrypt returns bytes in Python 3, but PostgreSQL VARCHAR 
    expects strings. We must decode to UTF-8.
    """
    if not password:
        return None
    
    # Ensure password is bytes for bcrypt
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
    else:
        password_bytes = password
    
    # Generate salt and hash password
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # CRITICAL: Decode bytes to string for database storage
    return hashed.decode('utf-8')


def verify_password(plain_password, hashed_password):
    """
    Verify password against hash.
    
    IMPORTANT: Both bcrypt.hashpw and bcrypt.checkpw require bytes,
    but our database stores hashes as strings.
    """
    try:
        if not plain_password or not hashed_password:
            logger.warning("verify_password: Missing password or hash")
            return False
        
        # Convert inputs to bytes if they're strings
        if isinstance(plain_password, str):
            plain_password_bytes = plain_password.encode('utf-8')
        else:
            plain_password_bytes = plain_password
        
        if isinstance(hashed_password, str):
            hashed_password_bytes = hashed_password.encode('utf-8')
        else:
            hashed_password_bytes = hashed_password
        
        # Verify
        result = bcrypt.checkpw(plain_password_bytes, hashed_password_bytes)
        
        if result:
            logger.info("Password verification successful")
        else:
            logger.warning("Password verification failed - incorrect password")
        
        return result
        
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def authenticate_admin(username, password):
    """
    Authenticate admin user and generate token.
    
    Returns:
        tuple: (success: bool, response: dict, status_code: int)
    """
    logger.info(f"Login attempt for username: {username}")
    
    # Find admin by username or email (case-insensitive)
    admin = Admin.query.filter(
        (Admin.username.ilike(username)) | (Admin.email.ilike(username))
    ).first()
    
    if not admin:
        logger.warning(f"Login failed - user not found: {username}")
        return False, {'error': 'Invalid username or password'}, 401
    
    logger.info(f"User found: {admin.username} (ID: {admin.id})")
    
    # Check if admin is active
    if not admin.is_active:
        logger.warning(f"Login failed - account disabled: {username}")
        return False, {'error': 'Account is disabled. Contact system administrator.'}, 403
    
    logger.info(f"Account is active, verifying password...")
    
    # Verify password
    if not verify_password(password, admin.password_hash):
        logger.warning(f"Login failed - invalid password for user: {username}")
        return False, {'error': 'Invalid username or password'}, 401
    
    logger.info(f"Password verified successfully for {username}")
    
    # Update last login
    try:
        admin.update_last_login()
        db.session.commit()
        logger.info(f"Last login updated for {username}")
    except Exception as e:
        logger.error(f"Could not update last login: {str(e)}")
        # Don't fail the login just because last_login update failed
    
    # Generate token
    token = generate_token(admin.id, admin.username)
    
    logger.info(f"✅ Login successful for {username}")
    
    return True, {
        'token': token,
        'admin': admin.to_dict()
    }, 200


def change_password(admin_id, current_password, new_password):
    """
    Change admin password
    
    Returns:
        tuple: (success: bool, message: dict, status_code: int)
    """
    admin = Admin.query.get(admin_id)
    
    if not admin:
        return False, {'error': 'Admin not found'}, 404
    
    # Verify current password
    if not verify_password(current_password, admin.password_hash):
        return False, {'error': 'Current password is incorrect'}, 401
    
    # Validate new password strength
    if len(new_password) < 8:
        return False, {'error': 'New password must be at least 8 characters'}, 400
    
    # Hash and update password
    admin.password_hash = hash_password(new_password)
    db.session.commit()
    
    logger.info(f"Password changed successfully for admin ID {admin_id}")
    
    return True, {'message': 'Password changed successfully'}, 200


def create_admin(username, email, password, full_name=None):
    """
    Create a new admin user
    
    Returns:
        tuple: (success: bool, data: dict, status_code: int)
    """
    # Check if username exists
    if Admin.query.filter_by(username=username).first():
        return False, {'error': 'Username already exists'}, 400
    
    # Check if email exists
    if Admin.query.filter_by(email=email).first():
        return False, {'error': 'Email already exists'}, 400
    
    # Validate password strength
    if len(password) < 8:
        return False, {'error': 'Password must be at least 8 characters'}, 400
    
    # Create new admin
    new_admin = Admin(
        username=username,
        email=email,
        password_hash=hash_password(password),
        full_name=full_name
    )
    
    db.session.add(new_admin)
    db.session.commit()
    
    logger.info(f"✅ New admin created: {username}")
    
    return True, {
        'message': 'Admin created successfully',
        'admin': new_admin.to_dict()
    }, 201