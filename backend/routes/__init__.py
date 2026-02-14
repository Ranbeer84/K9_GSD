"""
Routes package initialization
"""

from routes.auth_routes import auth_bp
# Additional routes will be imported here

__all__ = [
    'auth_bp'
]