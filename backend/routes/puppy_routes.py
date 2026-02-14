"""
Puppy Routes - UPDATED
Fixed public filtering to show ALL puppies by default
Handles React FormData 'image' fields
"""

from flask import Blueprint, request, jsonify
from models.puppy import Puppy, PuppyImage
from database import db
from utils.jwt_helper import admin_required
from utils.validators import validate_gender, validate_status, validate_date_format
from services.file_service import save_uploaded_file, delete_file
from datetime import datetime

puppy_bp = Blueprint('puppies', __name__)

# ============================================
# PUBLIC ENDPOINTS
# ============================================

@puppy_bp.route('', methods=['GET'])
@puppy_bp.route('/', methods=['GET'])
def get_puppies():
    """
    Get puppies (public)
    FIXED: Default status changed to None to show ALL puppies by default.
    """
    # Get query parameters - Defaulting to None shows everything
    status_filter = request.args.get('status') 
    gender_filter = request.args.get('gender')
    featured_filter = request.args.get('featured')
    
    query = Puppy.query
    
    # Apply filters only if they are explicitly provided and not "all"
    if status_filter and status_filter.lower() != 'all':
        query = query.filter_by(status=status_filter)
    
    if gender_filter and validate_gender(gender_filter):
        query = query.filter_by(gender=gender_filter)
    
    if featured_filter and featured_filter.lower() == 'true':
        query = query.filter_by(is_featured=True)
    
    # Sort by creation date so newest arrivals appear first
    query = query.order_by(Puppy.created_at.desc())
    
    puppies = query.all()
    
    return jsonify({
        'puppies': [p.to_dict(include_parents=True) for p in puppies],
        'count': len(puppies)
    }), 200

# ============================================
# ADMIN ENDPOINTS (CREATE/UPDATE)
# ============================================

@puppy_bp.route('/admin', methods=['POST'])
@admin_required
def create_puppy(current_user):
    """
    Create new puppy (admin)
    Checks both 'image' and 'primary_image' for React compatibility.
    """
    data = request.form
    
    # Validate required fields
    if not data.get('gender') or not data.get('date_of_birth'):
        return jsonify({'error': 'Gender and date of birth are required'}), 400

    # Process Primary Image
    primary_image_path = None
    # Support 'image' (React) or 'primary_image' (API standard)
    file = request.files.get('image') or request.files.get('primary_image')
    
    if file:
        success, result = save_uploaded_file(file, 'puppies')
        if success:
            primary_image_path = result
        else:
            return jsonify({'error': f'Image upload failed: {result}'}), 400
    
    try:
        new_puppy = Puppy(
            name=data.get('name'),
            gender=data.get('gender'),
            date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date(),
            color=data.get('color'),
            weight_kg=float(data.get('weight_kg')) if data.get('weight_kg') else None,
            sire_id=int(data.get('sire_id')) if data.get('sire_id') else None,
            dam_id=int(data.get('dam_id')) if data.get('dam_id') else None,
            price_inr=float(data.get('price_inr')) if data.get('price_inr') else None,
            status=data.get('status', 'Available'),
            description=data.get('description'),
            is_featured=data.get('is_featured', 'false').lower() == 'true'
        )
        new_puppy.primary_image = primary_image_path
        
        db.session.add(new_puppy)
        db.session.commit()
        
        return jsonify({
            'message': 'Puppy created successfully',
            'puppy': new_puppy.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@puppy_bp.route('/admin/<int:puppy_id>', methods=['PUT'])
@admin_required
def update_puppy(current_user, puppy_id):
    """Update existing puppy (admin only)"""
    puppy = Puppy.query.get(puppy_id)
    
    if not puppy:
        return jsonify({'error': 'Puppy not found'}), 404
    
    data = request.form
    
    print(f"\n📝 Updating puppy ID {puppy_id}...")
    print(f"Form data: {dict(data)}")
    print(f"Files: {list(request.files.keys())}")
    
    try:
        # Update fields if provided
        if data.get('name'):
            puppy.name = data.get('name')
        
        if data.get('gender') and validate_gender(data.get('gender')):
            puppy.gender = data.get('gender')
        
        if data.get('date_of_birth') and validate_date_format(data.get('date_of_birth')):
            puppy.date_of_birth = datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date()
        
        if data.get('color'):
            puppy.color = data.get('color')
        
        if data.get('weight_kg'):
            puppy.weight_kg = float(data.get('weight_kg'))
        
        if data.get('sire_id'):
            puppy.sire_id = int(data.get('sire_id'))
        
        if data.get('dam_id'):
            puppy.dam_id = int(data.get('dam_id'))
        
        if data.get('price_inr'):
            puppy.price_inr = float(data.get('price_inr'))
        
        if data.get('status') and validate_status(data.get('status'), 'puppy'):
            puppy.status = data.get('status')
            if data.get('status') == 'Sold' and not puppy.sold_at:
                puppy.sold_at = datetime.utcnow()
        
        if data.get('description'):
            puppy.description = data.get('description')
        
        if data.get('personality_traits'):
            puppy.personality_traits = data.get('personality_traits')
        
        if data.get('health_notes'):
            puppy.health_notes = data.get('health_notes')
        
        if 'is_featured' in data:
            puppy.is_featured = data.get('is_featured', 'false').lower() == 'true'
        
        # Handle new primary image - CHECK BOTH field names
        file = request.files.get('image') or request.files.get('primary_image')
        
        if file:
            print(f"📸 Processing new image: {file.filename}")
            success, result = save_uploaded_file(file, 'puppies')
            if success:
                # Delete old image if exists
                if puppy.primary_image:
                    delete_file(puppy.primary_image)
                puppy.primary_image = result
                print(f"✅ Image updated: {result}")
        
        db.session.commit()
        
        print(f"✅ Puppy updated successfully: ID {puppy_id}")
        
        return jsonify({
            'message': 'Puppy updated successfully',
            'puppy': puppy.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error updating puppy: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Error updating puppy: {str(e)}'}), 500


@puppy_bp.route('/admin/<int:puppy_id>', methods=['DELETE'])
@admin_required
def delete_puppy(current_user, puppy_id):
    """Delete puppy (admin only)"""
    puppy = Puppy.query.get(puppy_id)
    
    if not puppy:
        return jsonify({'error': 'Puppy not found'}), 404
    
    try:
        # Delete primary image
        if puppy.primary_image:
            delete_file(puppy.primary_image)
        
        # Delete all puppy images
        for img in puppy.images:
            delete_file(img.image_path)
        
        # Delete puppy (cascade will delete images from DB)
        db.session.delete(puppy)
        db.session.commit()
        
        print(f"✅ Puppy deleted: ID {puppy_id}")
        
        return jsonify({'message': 'Puppy deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error deleting puppy: {str(e)}")
        return jsonify({'error': f'Error deleting puppy: {str(e)}'}), 500


# ============================================
# PUPPY IMAGES MANAGEMENT
# ============================================

@puppy_bp.route('/admin/<int:puppy_id>/images', methods=['POST'])
@admin_required
def add_puppy_images(current_user, puppy_id):
    """Add images to puppy (admin only)"""
    puppy = Puppy.query.get(puppy_id)
    
    if not puppy:
        return jsonify({'error': 'Puppy not found'}), 404
    
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images')
    added_images = []
    
    try:
        for file in files:
            success, result = save_uploaded_file(file, 'puppies')
            if success:
                puppy_image = PuppyImage(
                    puppy_id=puppy_id,
                    image_path=result,
                    display_order=len(puppy.images)
                )
                db.session.add(puppy_image)
                added_images.append(result)
        
        db.session.commit()
        
        return jsonify({
            'message': f'{len(added_images)} images added successfully',
            'images': added_images
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error adding images: {str(e)}'}), 500


@puppy_bp.route('/admin/images/<int:image_id>', methods=['DELETE'])
@admin_required
def delete_puppy_image(current_user, image_id):
    """Delete specific puppy image (admin only)"""
    image = PuppyImage.query.get(image_id)
    
    if not image:
        return jsonify({'error': 'Image not found'}), 404
    
    try:
        delete_file(image.image_path)
        db.session.delete(image)
        db.session.commit()
        
        return jsonify({'message': 'Image deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting image: {str(e)}'}), 500