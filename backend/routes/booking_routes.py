"""
Booking Routes
API endpoints for customer inquiries and booking management
Full email integration will be added in Phase 5
"""

from flask import Blueprint, request, jsonify
from models.booking import Booking
from database import db
from utils.jwt_helper import admin_required
from utils.validators import validate_email, validate_phone, validate_status

booking_bp = Blueprint('bookings', __name__)


# ============================================
# PUBLIC ENDPOINTS
# ============================================

@booking_bp.route('/', methods=['POST'])
def create_booking():
    """
    Submit booking inquiry (public)
    
    Request Body (JSON):
        {
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "customer_phone": "+91-9876543210",
            "puppy_id": 1 (optional),
            "puppy_gender_preference": "Male" (optional),
            "message": "I'm interested in..."
        }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    
    # Validate required fields
    required_fields = ['customer_name', 'customer_email', 'customer_phone', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    # Validate email
    if not validate_email(data.get('customer_email')):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate phone
    if not validate_phone(data.get('customer_phone')):
        return jsonify({'error': 'Invalid phone number format'}), 400
    
    # Create booking
    try:
        booking = Booking(
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone'),
            puppy_id=data.get('puppy_id'),
            puppy_gender_preference=data.get('puppy_gender_preference'),
            message=data.get('message'),
            status='New'
        )
        
        db.session.add(booking)
        db.session.commit()
        
        # Send email notifications
        from services.email_service import send_booking_notification, send_booking_confirmation
        
        # Send to admin (non-blocking)
        try:
            send_booking_notification(booking)
        except Exception as email_error:
            print(f"Failed to send admin notification: {str(email_error)}")
        
        # Send confirmation to customer (non-blocking)
        try:
            send_booking_confirmation(booking)
        except Exception as email_error:
            print(f"Failed to send customer confirmation: {str(email_error)}")
        
        return jsonify({
            'message': 'Booking inquiry submitted successfully',
            'booking_id': booking.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error submitting booking: {str(e)}'}), 500


# ============================================
# ADMIN ENDPOINTS
# ============================================

@booking_bp.route('/admin', methods=['GET'])
@admin_required
def get_bookings(current_user):
    """
    Get all bookings (admin only)
    Query params:
        - status: Filter by status
    """
    status_filter = request.args.get('status')
    
    query = Booking.query
    
    if status_filter and validate_status(status_filter, 'booking'):
        query = query.filter_by(status=status_filter)
    
    # Order by newest first
    query = query.order_by(Booking.created_at.desc())
    
    bookings = query.all()
    
    return jsonify({
        'bookings': [b.to_dict(include_puppy=True) for b in bookings],
        'count': len(bookings)
    }), 200


@booking_bp.route('/admin/<int:booking_id>', methods=['GET'])
@admin_required
def get_booking(current_user, booking_id):
    """
    Get single booking details (admin only)
    """
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    return jsonify(booking.to_dict(include_puppy=True)), 200


@booking_bp.route('/admin/<int:booking_id>', methods=['PUT'])
@admin_required
def update_booking(current_user, booking_id):
    """
    Update booking status and notes (admin only)
    
    Request Body:
        {
            "status": "Contacted",
            "admin_notes": "Called customer, scheduled visit"
        }
    """
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    data = request.get_json()
    
    try:
        if data.get('status') and validate_status(data.get('status'), 'booking'):
            booking.status = data.get('status')
        
        if data.get('admin_notes'):
            booking.admin_notes = data.get('admin_notes')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Booking updated successfully',
            'booking': booking.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error updating booking: {str(e)}'}), 500


@booking_bp.route('/admin/<int:booking_id>', methods=['DELETE'])
@admin_required
def delete_booking(current_user, booking_id):
    """
    Delete booking (admin only)
    Use sparingly - prefer marking as Cancelled
    """
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    try:
        db.session.delete(booking)
        db.session.commit()
        
        return jsonify({'message': 'Booking deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting booking: {str(e)}'}), 500


@booking_bp.route('/admin/stats', methods=['GET'])
@admin_required
def get_booking_stats(current_user):
    """
    Get booking statistics (admin only)
    """
    total = Booking.query.count()
    new = Booking.query.filter_by(status='New').count()
    in_progress = Booking.query.filter_by(status='In Progress').count()
    completed = Booking.query.filter_by(status='Completed').count()
    
    return jsonify({
        'total': total,
        'new': new,
        'in_progress': in_progress,
        'completed': completed
    }), 200


@booking_bp.route('/admin/test-email', methods=['POST'])
@admin_required
def test_email(current_user):
    """
    Test email configuration (admin only)
    """
    from services.email_service import send_test_email
    
    success, message = send_test_email()
    
    if success:
        return jsonify({'message': 'Test email sent successfully'}), 200
    else:
        return jsonify({'error': message}), 500