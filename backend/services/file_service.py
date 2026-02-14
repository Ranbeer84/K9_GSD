"""
File Upload Service
Handles image and video uploads with validation and storage
"""

import os
from werkzeug.utils import secure_filename
from flask import current_app
from utils.validators import allowed_file, sanitize_filename
from PIL import Image


def save_uploaded_file(file, folder='general'):
    """
    Save uploaded file to designated folder
    
    Args:
        file: FileStorage object from request.files
        folder: Subfolder name ('dogs', 'puppies', 'gallery')
        
    Returns:
        tuple: (success: bool, filepath or error: str)
    """
    if not file:
        return False, 'No file provided'
    
    if file.filename == '':
        return False, 'No file selected'
    
    # Determine file type
    file_type = 'image' if any(file.filename.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.webp']) else 'video'
    
    # Validate file type
    if not allowed_file(file.filename, file_type):
        return False, f'File type not allowed. Allowed types: {current_app.config.get(f"ALLOWED_{file_type.upper()}_EXTENSIONS")}'
    
    # Sanitize filename
    safe_filename = sanitize_filename(file.filename)
    
    # Construct full path
    upload_folder = current_app.config['UPLOAD_FOLDER']
    folder_path = os.path.join(upload_folder, folder)
    
    # Ensure directory exists
    os.makedirs(folder_path, exist_ok=True)
    
    # Full file path
    file_path = os.path.join(folder_path, safe_filename)
    
    try:
        # Save file
        file.save(file_path)
        
        # If image, create thumbnail (optional optimization)
        if file_type == 'image':
            optimize_image(file_path)
        
        # Return relative path for database storage
        relative_path = os.path.join(folder, safe_filename)
        return True, relative_path
    
    except Exception as e:
        return False, f'Error saving file: {str(e)}'


def optimize_image(file_path, max_width=1920, quality=85):
    """
    Optimize uploaded image (resize if too large, compress)
    
    Args:
        file_path: Full path to image file
        max_width: Maximum width in pixels
        quality: JPEG quality (1-100)
    """
    try:
        with Image.open(file_path) as img:
            # Convert RGBA to RGB if needed (for JPEG)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized version
            img.save(file_path, optimize=True, quality=quality)
    
    except Exception as e:
        # If optimization fails, keep original file
        print(f"Warning: Could not optimize image {file_path}: {str(e)}")


def delete_file(filepath):
    """
    Delete file from filesystem
    
    Args:
        filepath: Relative path to file (e.g., 'puppies/image.jpg')
        
    Returns:
        bool: True if deleted, False if error
    """
    try:
        upload_folder = current_app.config['UPLOAD_FOLDER']
        full_path = os.path.join(upload_folder, filepath)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        else:
            return False
    
    except Exception as e:
        print(f"Error deleting file {filepath}: {str(e)}")
        return False


def save_multiple_files(files, folder='general'):
    """
    Save multiple uploaded files
    
    Args:
        files: List of FileStorage objects
        folder: Subfolder name
        
    Returns:
        list: List of (success, filepath_or_error) tuples
    """
    results = []
    
    for file in files:
        result = save_uploaded_file(file, folder)
        results.append(result)
    
    return results


def get_file_url(filepath):
    """
    Generate URL for accessing uploaded file
    
    Args:
        filepath: Relative path to file
        
    Returns:
        str: URL to access file
    """
    # In production, this would return CDN or cloud storage URL
    # For now, return local development URL
    return f"/uploads/{filepath}"