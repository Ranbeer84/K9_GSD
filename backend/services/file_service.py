"""
File Upload Service

Production: if CLOUDINARY_URL is set, files go to Cloudinary and the database
stores the full https URL (the models and the frontend already pass full URLs through).
Local dev: if CLOUDINARY_URL is NOT set, files are saved to backend/uploads/ as before.
"""

import os
import re
from flask import current_app
from utils.validators import allowed_file, sanitize_filename
from PIL import Image

IMAGE_EXTS = ('.png', '.jpg', '.jpeg', '.gif', '.webp')


def _cloud_enabled():
    return bool(os.getenv('CLOUDINARY_URL'))


def save_uploaded_file(file, folder='general'):
    """
    Save an uploaded file.

    Returns:
        tuple: (success: bool, value: str)
        value = full https URL (Cloudinary) or relative path (local) on success,
        or an error message on failure.
    """
    if not file:
        return False, 'No file provided'

    if file.filename == '':
        return False, 'No file selected'

    file_type = 'image' if file.filename.lower().endswith(IMAGE_EXTS) else 'video'

    if not allowed_file(file.filename, file_type):
        return False, f'File type not allowed. Allowed types: {current_app.config.get(f"ALLOWED_{file_type.upper()}_EXTENSIONS")}'

    # ---------- Cloudinary ----------
    if _cloud_enabled():
        try:
            import cloudinary.uploader
            options = {
                'folder': f'k9gsd/{folder}',
                'resource_type': 'video' if file_type == 'video' else 'image',
            }
            if file_type == 'image':
                # Replaces optimize_image(): shrink to 1920px wide, auto quality
                options['transformation'] = [{'width': 1920, 'crop': 'limit', 'quality': 'auto'}]
            result = cloudinary.uploader.upload(file.stream, **options)
            return True, result['secure_url']
        except Exception as e:
            return False, f'Error uploading file: {str(e)}'

    # ---------- Local disk (development) ----------
    safe_filename = sanitize_filename(file.filename)
    upload_folder = current_app.config['UPLOAD_FOLDER']
    folder_path = os.path.join(upload_folder, folder)
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, safe_filename)

    try:
        file.save(file_path)
        if file_type == 'image':
            optimize_image(file_path)
        return True, os.path.join(folder, safe_filename)
    except Exception as e:
        return False, f'Error saving file: {str(e)}'


def optimize_image(file_path, max_width=1920, quality=85):
    """Resize/compress a local image (development only)."""
    try:
        with Image.open(file_path) as img:
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

            if img.width > max_width:
                ratio = max_width / img.width
                img = img.resize((max_width, int(img.height * ratio)), Image.Resampling.LANCZOS)

            img.save(file_path, optimize=True, quality=quality)

    except Exception as e:
        print(f"Warning: Could not optimize image {file_path}: {str(e)}")


_CLOUDINARY_URL_RE = re.compile(r'/(image|video)/upload/(?:v\d+/)?(.+)\.[A-Za-z0-9]+$')


def delete_file(filepath):
    """
    Delete a file.
    Accepts a Cloudinary URL (production) or a relative local path (development).
    Returns True if deleted, False otherwise.
    """
    try:
        if not filepath:
            return False

        # Cloudinary URL
        if filepath.startswith('http'):
            if not _cloud_enabled():
                return False
            match = _CLOUDINARY_URL_RE.search(filepath.split('?')[0])
            if not match:
                return False
            import cloudinary.uploader
            resource_type, public_id = match.group(1), match.group(2)
            result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
            return result.get('result') == 'ok'

        # Local file
        upload_folder = current_app.config['UPLOAD_FOLDER']
        full_path = os.path.join(upload_folder, filepath)
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False

    except Exception as e:
        print(f"Error deleting file {filepath}: {str(e)}")
        return False


def save_multiple_files(files, folder='general'):
    """Save multiple uploaded files. Returns a list of (success, value) tuples."""
    return [save_uploaded_file(file, folder) for file in files]


def get_file_url(filepath):
    """Full URLs (Cloudinary) pass through; local paths get the /uploads/ prefix."""
    if filepath and filepath.startswith('http'):
        return filepath
    return f"/uploads/{filepath}"