"""
Admin Model
Represents administrative users who can manage the kennel system
"""

from database import db
from datetime import datetime
from sqlalchemy import CheckConstraint

class Admin(db.Model):
    __tablename__ = 'admins'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Credentials
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile
    full_name = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime)
    
    # Constraints
    __table_args__ = (
        CheckConstraint(
            "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'",
            name='email_format'
        ),
    )
    
    def to_dict(self, include_sensitive=False):
        """Convert model to dictionary for JSON responses"""
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        
        # Only include password hash if explicitly requested (for auth purposes)
        if include_sensitive:
            data['password_hash'] = self.password_hash
        
        return data
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def __repr__(self):
        return f'<Admin {self.username}>'