"""
Dashboard Routes
Provides aggregated stats for the admin dashboard
"""

from flask import Blueprint, jsonify
from database import db
from models.puppy import Puppy
from models.dog import Dog
from models.gallery import Gallery
from models.booking import Booking
from datetime import datetime, timedelta
# Import your token decorator
from utils.jwt_helper import token_required 

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user): # <--- FIXED: Added current_user to accept decorator argument
    """
    Returns live stats for the admin dashboard.
    Protected by @token_required to ensure only logged-in admins see metrics.
    """
    try:
        # --- Active Puppies ---
        active_puppies = Puppy.query.filter_by(status='Available').count()

        one_week_ago = datetime.utcnow() - timedelta(days=7)
        new_puppies_this_week = Puppy.query.filter(
            Puppy.status == 'Available',
            Puppy.created_at >= one_week_ago
        ).count()

        # --- Parent Lineage (active dogs) ---
        parent_count = Dog.query.filter_by(is_active=True).count()

        # --- Media Assets (active gallery items) ---
        # Note: Ensure these strings ('image', 'video') match your DB exactly.
        media_count = Gallery.query.filter_by(is_active=True).count()
        image_count = Gallery.query.filter_by(is_active=True, media_type='image').count()
        video_count = Gallery.query.filter_by(is_active=True, media_type='video').count()

        # --- New Inquiries ---
        new_inquiries = Booking.query.filter_by(status='New').count()

        return jsonify({
            'success': True,
            'stats': {
                'active_puppies': {
                    'count': active_puppies,
                    'trend': f'+{new_puppies_this_week} this week' if new_puppies_this_week > 0 else 'No change'
                },
                'parent_lineage': {
                    'count': parent_count,
                    'trend': 'Verified'
                },
                'media_assets': {
                    'count': media_count,
                    'trend': f'{image_count} Photos · {video_count} Videos'
                },
                'new_inquiries': {
                    'count': new_inquiries,
                    'trend': 'Action Required' if new_inquiries > 0 else 'All Clear'
                }
            }
        }), 200

    except Exception as e:
        # Useful for debugging 500 errors in the terminal
        print(f"Dashboard Error: {str(e)}") 
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500