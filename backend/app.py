"""
K9 GSD Kennel Management System - Main Flask Application
FIXED VERSION with proper CORS and file handling
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from database import db, init_db
import os
import logging

# Reduce SQLAlchemy logging noise
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # ============================================
    # CORS Configuration - FIXED
    # ============================================
    CORS(app, 
         resources={r"/api/*": {"origins": "*"}},
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True
    )
    
    # Initialize database
    db.init_app(app)
    
    # ============================================
    # Create upload directories
    # ============================================
    upload_folders = ['dogs', 'puppies', 'gallery']
    for folder in upload_folders:
        folder_path = os.path.join(app.config['UPLOAD_FOLDER'], folder)
        os.makedirs(folder_path, exist_ok=True)
        print(f"✅ Upload folder ready: {folder_path}")
    
    # ============================================
    # SERVE UPLOADED FILES - CRITICAL
    # ============================================
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        """Serve uploaded images/videos"""
        upload_folder = app.config['UPLOAD_FOLDER']
        return send_from_directory(upload_folder, filename)
    
    # ============================================
    # Register blueprints
    # ============================================
    from routes.auth_routes import auth_bp
    from routes.dog_routes import dog_bp
    from routes.puppy_routes import puppy_bp
    from routes.gallery_routes import gallery_bp
    from routes.booking_routes import booking_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dog_bp, url_prefix='/api/dogs')
    app.register_blueprint(puppy_bp, url_prefix='/api/puppies')
    app.register_blueprint(gallery_bp, url_prefix='/api/gallery')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    
    # ============================================
    # Health check endpoint
    # ============================================
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'K9 GSD Kennel API is running',
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'K9 GSD Kennel API',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth',
                'dogs': '/api/dogs',
                'puppies': '/api/puppies',
                'gallery': '/api/gallery',
                'bookings': '/api/bookings'
            }
        }), 200
    
    # ============================================
    # Error handlers
    # ============================================
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({'error': 'File too large. Maximum size is 16MB'}), 413
    
    return app


if __name__ == '__main__':
    app = create_app()
    
    # Initialize the database and seed the admin user
    init_db(app)
    
    print("\n" + "=" * 60)
    print("🚀 K9 GSD Kennel API Server Starting...")
    print("=" * 60)
    print(f"📍 Running on: http://localhost:5002")
    print(f"📁 Upload folder: {app.config['UPLOAD_FOLDER']}")
    print(f"🔐 CORS enabled for: {app.config['CORS_ORIGINS']}")
    print("=" * 60 + "\n")
    
    # Run with use_reloader=False to prevent double initialization
    app.run(
        host='0.0.0.0', 
        port=5002, 
        debug=True, 
        use_reloader=False
    )