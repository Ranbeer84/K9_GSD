"""
Dog Model
Represents parent dogs (studs and dams) in the kennel
"""

from database import db
from datetime import datetime

class Dog(db.Model):
    __tablename__ = 'dogs'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Information
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # Male, Female
    role = db.Column(db.String(20), nullable=False)  # Stud, Dam, Both
    date_of_birth = db.Column(db.Date)
    
    # Registration & Pedigree
    registration_number = db.Column(db.String(50))
    pedigree_info = db.Column(db.Text)
    
    # Detailed Information
    description = db.Column(db.Text)
    health_clearances = db.Column(db.Text)
    achievements = db.Column(db.Text)
    
    # Media
    primary_image = db.Column(db.String(255))
    
    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    images = db.relationship('DogImage', backref='dog', lazy=True, cascade='all, delete-orphan')
    puppies_as_sire = db.relationship('Puppy', foreign_keys='Puppy.sire_id', backref='sire', lazy=True)
    puppies_as_dam = db.relationship('Puppy', foreign_keys='Puppy.dam_id', backref='dam', lazy=True)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint(gender.in_(['Male', 'Female']), name='dog_gender_check'),
        db.CheckConstraint(role.in_(['Stud', 'Dam', 'Both']), name='dog_role_check'),
    )
    
    def to_dict(self, include_images=False):
        """Convert model to dictionary for JSON responses"""
        data = {
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'role': self.role,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'registration_number': self.registration_number,
            'pedigree_info': self.pedigree_info,
            'description': self.description,
            'health_clearances': self.health_clearances,
            'achievements': self.achievements,
            'primary_image': self.primary_image,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_images:
            data['images'] = [img.to_dict() for img in self.images]
        
        return data
    
    def __repr__(self):
        return f'<Dog {self.name} ({self.gender})>'


class DogImage(db.Model):
    __tablename__ = 'dog_images'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Key
    dog_id = db.Column(db.Integer, db.ForeignKey('dogs.id', ondelete='CASCADE'), nullable=False)
    
    # Image Information
    image_path = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)
    
    # Timestamp
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert model to dictionary for JSON responses"""
        return {
            'id': self.id,
            'dog_id': self.dog_id,
            'image_path': self.image_path,
            'caption': self.caption,
            'display_order': self.display_order,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }
    
    def __repr__(self):
        return f'<DogImage {self.id} for Dog {self.dog_id}>'