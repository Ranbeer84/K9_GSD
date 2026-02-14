"""
Puppy Model - FIXED VERSION
Represents available/sold puppies in the kennel
Fixed to return full image URLs
"""

from database import db
from datetime import datetime
from flask import current_app

class Puppy(db.Model):
    __tablename__ = 'puppies'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Information
    name = db.Column(db.String(100))
    gender = db.Column(db.String(10), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    color = db.Column(db.String(50))
    weight_kg = db.Column(db.Numeric(5, 2))
    microchip_number = db.Column(db.String(50), unique=True)
    
    # Parent References
    sire_id = db.Column(db.Integer, db.ForeignKey('dogs.id', ondelete='SET NULL'))
    dam_id = db.Column(db.Integer, db.ForeignKey('dogs.id', ondelete='SET NULL'))
    
    # Pricing & Availability
    price_inr = db.Column(db.Numeric(10, 2))
    status = db.Column(db.String(20), default='Available', nullable=False)
    
    # Detailed Information
    description = db.Column(db.Text)
    personality_traits = db.Column(db.Text)
    health_notes = db.Column(db.Text)
    
    # Media
    primary_image = db.Column(db.String(255))
    
    # Display Settings
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    sold_at = db.Column(db.DateTime)
    
    # Relationships
    images = db.relationship('PuppyImage', backref='puppy', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='puppy', lazy=True)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint(gender.in_(['Male', 'Female']), name='puppy_gender_check'),
        db.CheckConstraint(status.in_(['Available', 'Reserved', 'Sold']), name='puppy_status_check'),
    )
    
    def get_image_url(self, image_path):
        """
        Convert relative image path to full URL
        CRITICAL: Frontend needs full URL to display images
        """
        if not image_path:
            return None
        
        # If already a full URL, return as-is
        if image_path.startswith('http'):
            return image_path
        
        # Build full URL: http://localhost:5002/uploads/puppies/image.jpg
        # In production, use your domain
        base_url = 'http://localhost:5002'  # Change in production
        
        # Ensure path doesn't start with /
        clean_path = image_path.lstrip('/')
        
        return f"{base_url}/uploads/{clean_path}"
    
    def to_dict(self, include_images=False, include_parents=False):
        """Convert model to dictionary for JSON responses"""
        data = {
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'color': self.color,
            'weight_kg': float(self.weight_kg) if self.weight_kg else None,
            'microchip_number': self.microchip_number,
            'price_inr': float(self.price_inr) if self.price_inr else None,
            'status': self.status,
            'description': self.description,
            'personality_traits': self.personality_traits,
            'health_notes': self.health_notes,
            # CRITICAL: Return full URL for primary image
            'primary_image': self.get_image_url(self.primary_image),
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'sold_at': self.sold_at.isoformat() if self.sold_at else None
        }
        
        if include_images:
            data['images'] = [img.to_dict() for img in self.images]
        
        if include_parents:
            data['sire'] = self.sire.to_dict() if self.sire else None
            data['dam'] = self.dam.to_dict() if self.dam else None
        
        return data
    
    def mark_as_sold(self):
        """Mark puppy as sold and set timestamp"""
        self.status = 'Sold'
        self.sold_at = datetime.utcnow()
        db.session.commit()
    
    def __repr__(self):
        return f'<Puppy {self.name or "Unnamed"} ({self.gender}, {self.status})>'


class PuppyImage(db.Model):
    __tablename__ = 'puppy_images'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key
    puppy_id = db.Column(db.Integer, db.ForeignKey('puppies.id', ondelete='CASCADE'), nullable=False)
    
    # Image Information
    image_path = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)
    
    # Timestamp
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def get_image_url(self, image_path):
        """Convert relative path to full URL"""
        if not image_path:
            return None
        
        if image_path.startswith('http'):
            return image_path
        
        base_url = 'http://localhost:5002'
        clean_path = image_path.lstrip('/')
        return f"{base_url}/uploads/{clean_path}"
    
    def to_dict(self):
        """Convert model to dictionary for JSON responses"""
        return {
            'id': self.id,
            'puppy_id': self.puppy_id,
            'image_path': self.get_image_url(self.image_path),  # Return full URL
            'caption': self.caption,
            'display_order': self.display_order,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }
    
    def __repr__(self):
        return f'<PuppyImage {self.id} for Puppy {self.puppy_id}>'