"""
Gallery Model - FINAL FIXED VERSION
Represents photos and videos in the kennel gallery
Properly returns full URLs matching Flask's /uploads/<path:filename> route
"""
from database import db
from datetime import datetime


class Gallery(db.Model):
    __tablename__ = 'gallery'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Media Information
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    media_type = db.Column(db.String(20), nullable=False)  # Image, Video
    file_path = db.Column(db.String(255), nullable=False)
    
    # Organization
    category = db.Column(db.String(50), default='General')
    display_order = db.Column(db.Integer, default=0)
    
    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamp
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint(media_type.in_(['Image', 'Video']), name='gallery_media_type_check'),
    )
    
    def get_media_url(self, file_path):
        """
        Convert relative file path to full URL
        CRITICAL: Must match Flask's route: /uploads/<path:filename>
        
        Examples of what's stored in DB and what should be returned:
        - DB stores: "gallery/image_123.jpg"
        - Method returns: "http://localhost:5002/uploads/gallery/image_123.jpg"
        
        This matches the Dog and Puppy models exactly.
        """
        if not file_path:
            return None
        
        # If already a full URL, return as-is
        if file_path.startswith('http'):
            return file_path
        
        # Build full URL to match Flask's /uploads/<path:filename> route
        base_url = 'http://localhost:5002'  # Change in production
        
        # Clean path: remove leading slash if present
        clean_path = file_path.lstrip('/')
        
        # Construct URL: base + /uploads/ + path
        return f"{base_url}/uploads/{clean_path}"
    
    def to_dict(self):
        """
        Convert model to dictionary for JSON responses
        Returns full URL for media_url field
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            # Normalize to lowercase for frontend consistency
            'media_type': self.media_type.lower() if self.media_type else 'image',
            # CRITICAL: Return full URL for frontend to display
            'media_url': self.get_media_url(self.file_path),
            # Keep relative path for admin/backend use
            'file_path': self.file_path,
            'category': self.category,
            'display_order': self.display_order,
            'is_active': self.is_active,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }
    
    def __repr__(self):
        return f'<Gallery {self.id} - {self.title or "Untitled"} ({self.media_type})>'