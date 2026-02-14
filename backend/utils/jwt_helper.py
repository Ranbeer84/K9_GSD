"""
JWT Helper Functions
Token generation and validation utilities
"""

import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app

def generate_token(user_id, username):
    """
    Generate JWT access token
    
    Args:
        user_id: Admin user ID
        username: Admin username
        
    Returns:
        str: JWT token
    """
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )
    
    return token


def decode_token(token):
    """
    Decode and validate JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def token_required(f):
    """
    Decorator to protect routes that require authentication
    
    Usage:
        @app.route('/api/protected')
        @token_required
        def protected_route(current_user):
            return jsonify({'message': 'Access granted'})
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # Expected format: "Bearer <token>"
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid authorization header format'}), 401
        
        if not token:
            return jsonify({'error': 'Authentication token is missing'}), 401
        
        # Decode token
        payload = decode_token(token)
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Pass user info to the route
        return f(current_user=payload, *args, **kwargs)
    
    return decorated


def admin_required(f):
    """
    Decorator combining token_required with admin verification
    Also checks if admin account is active
    """
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        from models.admin import Admin
        
        # Verify admin exists and is active
        admin = Admin.query.get(current_user['user_id'])
        
        if not admin:
            return jsonify({'error': 'Admin user not found'}), 404
        
        if not admin.is_active:
            return jsonify({'error': 'Admin account is disabled'}), 403
        
        return f(current_user=current_user, *args, **kwargs)
    
    return decorated