"""
Dog Routes
API endpoints for parent dog management (public + admin)
"""

from flask import Blueprint, request, jsonify
from models import Dog, DogImage
from database import db
from utils.jwt_helper import admin_required
from utils.validators import validate_gender, validate_date_format
from services.file_service import save_uploaded_file, delete_file
from datetime import datetime

dog_bp = Blueprint('dogs', __name__)


# ============================================
# PUBLIC ENDPOINTS
# ============================================

@dog_bp.route('/', methods=['GET'])
def get_dogs():
    """
    Get all active parent dogs (public)
    Query params:
        - role: Filter by role (Stud, Dam, Both)
        - gender: Filter by gender (Male, Female)
    """
    role_filter = request.args.get('role')
    gender_filter = request.args.get('gender')
    
    # Build query - only active dogs
    query = Dog.query.filter_by(is_active=True)
    
    # Apply filters
    if role_filter and role_filter in ['Stud', 'Dam', 'Both']:
        query = query.filter_by(role=role_filter)
    
    if gender_filter and validate_gender(gender_filter):
        query = query.filter_by(gender=gender_filter)
    
    # Order by name
    query = query.order_by(Dog.name)
    
    dogs = query.all()
    
    return jsonify({
        'dogs': [d.to_dict(include_images=True) for d in dogs],
        'count': len(dogs)
    }), 200


@dog_bp.route('/<int:dog_id>', methods=['GET'])
def get_dog(dog_id):
    """
    Get single dog details (public)
    Includes all images
    """
    dog = Dog.query.get(dog_id)
    
    if not dog:
        return jsonify({'error': 'Dog not found'}), 404
    
    if not dog.is_active:
        return jsonify({'error': 'Dog not found'}), 404  # Hide inactive dogs from public
    
    return jsonify(dog.to_dict(include_images=True)), 200


# ============================================
# ADMIN ENDPOINTS
# ============================================

@dog_bp.route('/admin', methods=['GET'])
@admin_required
def get_all_dogs_admin(current_user):
    """
    Get all dogs including inactive (admin only)
    """
    dogs = Dog.query.order_by(Dog.name).all()
    
    return jsonify({
        'dogs': [d.to_dict(include_images=True) for d in dogs],
        'count': len(dogs)
    }), 200


@dog_bp.route('/admin', methods=['POST'])
@admin_required
def create_dog(current_user):
    """
    Create new parent dog (admin only)
    
    Form data (multipart/form-data):
        - name: String (required)
        - gender: String (required) - Male/Female
        - role: String (required) - Stud/Dam/Both
        - date_of_birth: String (optional) - YYYY-MM-DD
        - registration_number: String (optional)
        - pedigree_info: Text (optional)
        - description: Text (optional)
        - health_clearances: Text (optional)
        - achievements: Text (optional)
        - is_active: Boolean (default: true)
        - primary_image: File (optional)
    """
    data = request.form
    
    # Validate required fields
    if not data.get('name') or not data.get('gender') or not data.get('role'):
        return jsonify({'error': 'Name, gender, and role are required'}), 400
    
    if not validate_gender(data.get('gender')):
        return jsonify({'error': 'Invalid gender. Must be Male or Female'}), 400
    
    if data.get('role') not in ['Stud', 'Dam', 'Both']:
        return jsonify({'error': 'Invalid role. Must be Stud, Dam, or Both'}), 400
    
    if data.get('date_of_birth') and not validate_date_format(data.get('date_of_birth')):
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # Handle file upload
    primary_image_path = None
    if 'primary_image' in request.files:
        file = request.files['primary_image']
        success, result = save_uploaded_file(file, 'dogs')
        if success:
            primary_image_path = result
        else:
            return jsonify({'error': f'Image upload failed: {result}'}), 400
    
    # Create dog
    try:
        dog = Dog(
            name=data.get('name'),
            gender=data.get('gender'),
            role=data.get('role'),
            date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date() if data.get('date_of_birth') else None,
            registration_number=data.get('registration_number'),
            pedigree_info=data.get('pedigree_info'),
            description=data.get('description'),
            health_clearances=data.get('health_clearances'),
            achievements=data.get('achievements'),
            primary_image=primary_image_path,
            is_active=data.get('is_active', 'true').lower() == 'true'
        )
        
        db.session.add(dog)
        db.session.commit()
        
        return jsonify({
            'message': 'Dog created successfully',
            'dog': dog.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error creating dog: {str(e)}'}), 500


@dog_bp.route('/admin/<int:dog_id>', methods=['PUT'])
@admin_required
def update_dog(current_user, dog_id):
    """
    Update existing dog (admin only)
    """
    dog = Dog.query.get(dog_id)
    
    if not dog:
        return jsonify({'error': 'Dog not found'}), 404
    
    data = request.form
    
    try:
        if data.get('name'):
            dog.name = data.get('name')
        
        if data.get('gender') and validate_gender(data.get('gender')):
            dog.gender = data.get('gender')
        
        if data.get('role') and data.get('role') in ['Stud', 'Dam', 'Both']:
            dog.role = data.get('role')
        
        if data.get('date_of_birth') and validate_date_format(data.get('date_of_birth')):
            dog.date_of_birth = datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date()
        
        if data.get('registration_number'):
            dog.registration_number = data.get('registration_number')
        
        if data.get('pedigree_info'):
            dog.pedigree_info = data.get('pedigree_info')
        
        if data.get('description'):
            dog.description = data.get('description')
        
        if data.get('health_clearances'):
            dog.health_clearances = data.get('health_clearances')
        
        if data.get('achievements'):
            dog.achievements = data.get('achievements')
        
        if 'is_active' in data:
            dog.is_active = data.get('is_active', 'true').lower() == 'true'
        
        # Handle new primary image
        if 'primary_image' in request.files:
            file = request.files['primary_image']
            success, result = save_uploaded_file(file, 'dogs')
            if success:
                # Delete old image if exists
                if dog.primary_image:
                    delete_file(dog.primary_image)
                dog.primary_image = result
        
        db.session.commit()
        
        return jsonify({
            'message': 'Dog updated successfully',
            'dog': dog.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error updating dog: {str(e)}'}), 500


@dog_bp.route('/admin/<int:dog_id>', methods=['DELETE'])
@admin_required
def delete_dog(current_user, dog_id):
    """
    Delete dog (admin only)
    Note: Puppies with this dog as parent will have parent reference set to NULL
    """
    dog = Dog.query.get(dog_id)
    
    if not dog:
        return jsonify({'error': 'Dog not found'}), 404
    
    try:
        # Delete primary image
        if dog.primary_image:
            delete_file(dog.primary_image)
        
        # Delete all dog images
        for img in dog.images:
            delete_file(img.image_path)
        
        # Delete dog (cascade will delete images from DB)
        db.session.delete(dog)
        db.session.commit()
        
        return jsonify({'message': 'Dog deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting dog: {str(e)}'}), 500


# ============================================
# DOG IMAGES MANAGEMENT
# ============================================

@dog_bp.route('/admin/<int:dog_id>/images', methods=['POST'])
@admin_required
def add_dog_images(current_user, dog_id):
    """
    Add images to dog (admin only)
    """
    dog = Dog.query.get(dog_id)
    
    if not dog:
        return jsonify({'error': 'Dog not found'}), 404
    
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    
    files = request.files.getlist('images')
    added_images = []
    
    try:
        for file in files:
            success, result = save_uploaded_file(file, 'dogs')
            if success:
                dog_image = DogImage(
                    dog_id=dog_id,
                    image_path=result,
                    display_order=len(dog.images)
                )
                db.session.add(dog_image)
                added_images.append(result)
        
        db.session.commit()
        
        return jsonify({
            'message': f'{len(added_images)} images added successfully',
            'images': added_images
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error adding images: {str(e)}'}), 500


@dog_bp.route('/admin/images/<int:image_id>', methods=['DELETE'])
@admin_required
def delete_dog_image(current_user, image_id):
    """
    Delete specific dog image (admin only)
    """
    image = DogImage.query.get(image_id)
    
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