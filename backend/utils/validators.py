"""
Validation Utilities
Input validation and sanitization functions
"""

import re
import os
from werkzeug.utils import secure_filename
from flask import current_app

def validate_email(email):
    """
    Validate email format using regex
    
    Args:
        email: Email string to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    return re.match(pattern, email) is not None


def validate_phone(phone):
    """
    Validate phone number (basic validation)
    Accepts various formats: +91-XXXXXXXXXX, XXXXXXXXXX, etc.
    
    Args:
        phone: Phone number string
        
    Returns:
        bool: True if valid, False otherwise
    """
    # Remove common separators
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it's all digits (with optional + at start)
    pattern = r'^\+?[0-9]{10,15}$'
    return re.match(pattern, cleaned) is not None


def allowed_file(filename, file_type='image'):
    """
    Check if file extension is allowed
    
    Args:
        filename: Name of the file
        file_type: 'image' or 'video'
        
    Returns:
        bool: True if allowed, False otherwise
    """
    if not filename or '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if file_type == 'image':
        allowed_extensions = current_app.config.get('ALLOWED_IMAGE_EXTENSIONS', {'png', 'jpg', 'jpeg', 'gif', 'webp'})
    elif file_type == 'video':
        allowed_extensions = current_app.config.get('ALLOWED_VIDEO_EXTENSIONS', {'mp4', 'mov', 'avi', 'webm'})
    else:
        return False
    
    return extension in allowed_extensions


def sanitize_filename(filename):
    """
    Sanitize filename and add timestamp to prevent duplicates
    
    Args:
        filename: Original filename
        
    Returns:
        str: Sanitized filename with timestamp
    """
    from datetime import datetime
    
    # Use werkzeug's secure_filename for basic sanitization
    safe_name = secure_filename(filename)
    
    # Split into name and extension
    if '.' in safe_name:
        name, ext = safe_name.rsplit('.', 1)
    else:
        name = safe_name
        ext = ''
    
    # Add timestamp to prevent duplicates
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Reconstruct filename
    if ext:
        return f"{name}_{timestamp}.{ext}"
    else:
        return f"{name}_{timestamp}"


def validate_date_format(date_string):
    """
    Validate date string in YYYY-MM-DD format
    
    Args:
        date_string: Date string to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    from datetime import datetime
    
    try:
        datetime.strptime(date_string, '%Y-%m-%d')
        return True
    except ValueError:
        return False


def validate_gender(gender):
    """
    Validate gender value
    
    Args:
        gender: Gender string
        
    Returns:
        bool: True if valid, False otherwise
    """
    return gender in ['Male', 'Female']


def validate_status(status, entity_type='puppy'):
    """
    Validate status based on entity type
    
    Args:
        status: Status string
        entity_type: 'puppy' or 'booking'
        
    Returns:
        bool: True if valid, False otherwise
    """
    if entity_type == 'puppy':
        valid_statuses = ['Available', 'Reserved', 'Sold']
    elif entity_type == 'booking':
        valid_statuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled']
    else:
        return False
    
    return status in valid_statuses