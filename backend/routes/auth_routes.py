"""
Authentication Routes
Admin login, logout, and authentication endpoints
"""

from flask import Blueprint, request, jsonify
from services.auth_service import authenticate_admin, change_password as change_admin_password
from utils.jwt_helper import admin_required
import logging

# Set up logging for debugging login attempts
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Admin login endpoint
    """
    try:
        data = request.get_json()
    except Exception:
        return jsonify({'error': 'Invalid JSON format'}), 400
    
    if not data:
        return jsonify({'error': 'Username and password are required'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    # Authenticate via auth_service
    success, response, status_code = authenticate_admin(username, password)
    
    # response already contains 'token' and 'admin' if successful
    return jsonify(response), status_code


@auth_bp.route('/verify', methods=['GET'])
@admin_required
def verify_token(current_user):
    """
    Verify if JWT token is still valid.
    The @admin_required decorator handles the validation logic.
    """
    return jsonify({
        'valid': True,
        'user': current_user # current_user contains decoded JWT payload
    }), 200


@auth_bp.route('/change-password', methods=['POST'])
@admin_required
def change_password_route(current_user):
    """
    Change admin password
    """
    try:
        data = request.get_json()
    except Exception:
        return jsonify({'error': 'Invalid JSON format'}), 400
    
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Both current and new passwords are required'}), 400
    
    # Use the service to handle password logic
    # current_user usually stores user_id or id depending on your jwt_helper
    user_id = current_user.get('user_id') or current_user.get('id')
    
    success, response, status_code = change_admin_password(
        user_id,
        current_password,
        new_password
    )
    
    return jsonify(response), status_code


@auth_bp.route('/logout', methods=['POST'])
@admin_required
def logout(current_user):
    """
    JWT is stateless, but we provide this endpoint for consistency
    and potential token blacklisting in the future.
    """
    return jsonify({
        'message': 'Logged out successfully'
    }), 200


@auth_bp.route('/me', methods=['GET'])
@admin_required
def get_current_admin(current_user):
    """
    Get fresh admin profile data from the database
    """
    from models.admin import Admin
    
    # Pull ID from the verified token payload
    user_id = current_user.get('user_id') or current_user.get('id')
    admin = Admin.query.get(user_id)
    
    if not admin:
        return jsonify({'error': 'Admin session invalid'}), 404
    
    return jsonify(admin.to_dict()), 200