"""
Gallery Routes
API endpoints for kennel gallery management (public + admin)
"""

from flask import Blueprint, request, jsonify
from models.gallery import Gallery
from database import db
from utils.jwt_helper import admin_required
from services.file_service import save_uploaded_file, delete_file

gallery_bp = Blueprint('gallery', __name__)


# ============================================
# PUBLIC ENDPOINTS
# ============================================

@gallery_bp.route('/', methods=['GET'])
def get_gallery_items():
    """
    Get all active gallery items (public)
    Query params:
        - category: Filter by category
        - media_type: Filter by type (Image/Video)
    """
    category_filter = request.args.get('category')
    media_type_filter = request.args.get('media_type')
    
    # Build query - only active items
    query = Gallery.query.filter_by(is_active=True)
    
    # Apply filters
    if category_filter:
        query = query.filter_by(category=category_filter)
    
    if media_type_filter and media_type_filter in ['Image', 'Video']:
        query = query.filter_by(media_type=media_type_filter)
    
    # Order by display_order, then upload date
    query = query.order_by(Gallery.display_order, Gallery.uploaded_at.desc())
    
    items = query.all()
    
    return jsonify({
        'items': [item.to_dict() for item in items],
        'count': len(items)
    }), 200


@gallery_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Get all distinct categories (public)
    """
    # Get distinct categories from active gallery items
    categories = db.session.query(Gallery.category).filter_by(is_active=True).distinct().all()
    category_list = [cat[0] for cat in categories]
    
    return jsonify({
        'categories': category_list
    }), 200


# ============================================
# ADMIN ENDPOINTS
# ============================================

@gallery_bp.route('/admin', methods=['GET'])
@admin_required
def get_all_gallery_admin(current_user):
    """
    Get all gallery items including inactive (admin only)
    """
    items = Gallery.query.order_by(Gallery.display_order, Gallery.uploaded_at.desc()).all()
    
    return jsonify({
        'items': [item.to_dict() for item in items],
        'count': len(items)
    }), 200


@gallery_bp.route('/admin', methods=['POST'])
@admin_required
def create_gallery_item(current_user):
    """
    Upload new gallery item (admin only)
    
    Form data (multipart/form-data):
        - file: File (required) - Image or Video
        - title: String (optional)
        - description: Text (optional)
        - category: String (default: General)
        - display_order: Integer (default: 0)
        - is_active: Boolean (default: true)
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    data = request.form
    
    # Determine media type based on file extension
    file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    
    if file_ext in ['png', 'jpg', 'jpeg', 'gif', 'webp']:
        media_type = 'Image'
        folder = 'gallery'
    elif file_ext in ['mp4', 'mov', 'avi', 'webm']:
        media_type = 'Video'
        folder = 'gallery'
    else:
        return jsonify({'error': 'Invalid file type. Must be image or video'}), 400
    
    # Upload file
    success, result = save_uploaded_file(file, folder)
    
    if not success:
        return jsonify({'error': f'File upload failed: {result}'}), 400
    
    # Create gallery item
    try:
        gallery_item = Gallery(
            title=data.get('title'),
            description=data.get('description'),
            media_type=media_type,
            file_path=result,
            category=data.get('category', 'General'),
            display_order=int(data.get('display_order', 0)),
            is_active=data.get('is_active', 'true').lower() == 'true'
        )
        
        db.session.add(gallery_item)
        db.session.commit()
        
        return jsonify({
            'message': 'Gallery item uploaded successfully',
            'item': gallery_item.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        # Delete uploaded file if DB insert fails
        delete_file(result)
        return jsonify({'error': f'Error creating gallery item: {str(e)}'}), 500


@gallery_bp.route('/admin/<int:item_id>', methods=['PUT'])
@admin_required
def update_gallery_item(current_user, item_id):
    """
    Update gallery item metadata (admin only)
    Cannot change file, only metadata
    """
    item = Gallery.query.get(item_id)
    
    if not item:
        return jsonify({'error': 'Gallery item not found'}), 404
    
    data = request.form
    
    try:
        if data.get('title'):
            item.title = data.get('title')
        
        if data.get('description'):
            item.description = data.get('description')
        
        if data.get('category'):
            item.category = data.get('category')
        
        if data.get('display_order'):
            item.display_order = int(data.get('display_order'))
        
        if 'is_active' in data:
            item.is_active = data.get('is_active', 'true').lower() == 'true'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Gallery item updated successfully',
            'item': item.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error updating gallery item: {str(e)}'}), 500


@gallery_bp.route('/admin/<int:item_id>', methods=['DELETE'])
@admin_required
def delete_gallery_item(current_user, item_id):
    """
    Delete gallery item (admin only)
    """
    item = Gallery.query.get(item_id)
    
    if not item:
        return jsonify({'error': 'Gallery item not found'}), 404
    
    try:
        # Delete file
        delete_file(item.file_path)
        
        # Delete DB record
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({'message': 'Gallery item deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting gallery item: {str(e)}'}), 500


@gallery_bp.route('/admin/bulk-upload', methods=['POST'])
@admin_required
def bulk_upload(current_user):
    """
    Bulk upload multiple gallery items (admin only)
    Useful for uploading multiple photos at once
    """
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    data = request.form
    
    category = data.get('category', 'General')
    uploaded_items = []
    errors = []
    
    for file in files:
        # Determine media type
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        
        if file_ext in ['png', 'jpg', 'jpeg', 'gif', 'webp']:
            media_type = 'Image'
        elif file_ext in ['mp4', 'mov', 'avi', 'webm']:
            media_type = 'Video'
        else:
            errors.append(f'Skipped {file.filename}: Invalid file type')
            continue
        
        # Upload file
        success, result = save_uploaded_file(file, 'gallery')
        
        if not success:
            errors.append(f'Failed to upload {file.filename}: {result}')
            continue
        
        try:
            gallery_item = Gallery(
                title=file.filename,
                media_type=media_type,
                file_path=result,
                category=category
            )
            
            db.session.add(gallery_item)
            uploaded_items.append(file.filename)
        
        except Exception as e:
            errors.append(f'Error creating record for {file.filename}: {str(e)}')
            delete_file(result)
    
    try:
        db.session.commit()
        
        return jsonify({
            'message': f'Uploaded {len(uploaded_items)} items',
            'uploaded': uploaded_items,
            'errors': errors
        }), 201 if len(uploaded_items) > 0 else 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error saving gallery items: {str(e)}'}), 500