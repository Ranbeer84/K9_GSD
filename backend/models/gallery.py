"""
Gallery Model
Represents photos and videos in the kennel gallery
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
    
    def to_dict(self):
        """Convert model to dictionary for JSON responses"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'media_type': self.media_type,
            'file_path': self.file_path,
            'category': self.category,
            'display_order': self.display_order,
            'is_active': self.is_active,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }
    
    def __repr__(self):
        return f'<Gallery {self.id} - {self.title or "Untitled"} ({self.media_type})>'