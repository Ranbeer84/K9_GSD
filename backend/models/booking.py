"""
Booking Model
Represents customer inquiries and booking requests
"""

from database import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Customer Information
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    
    # Inquiry Details
    puppy_id = db.Column(db.Integer, db.ForeignKey('puppies.id', ondelete='SET NULL'))
    puppy_gender_preference = db.Column(db.String(10))  # Male, Female, No Preference
    message = db.Column(db.Text, nullable=False)
    
    # Status Tracking
    status = db.Column(db.String(20), default='New', nullable=False)  # New, Contacted, In Progress, Completed, Cancelled
    admin_notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint(
            puppy_gender_preference.in_(['Male', 'Female', 'No Preference']) | (puppy_gender_preference == None),
            name='booking_gender_pref_check'
        ),
        db.CheckConstraint(
            status.in_(['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled']),
            name='booking_status_check'
        ),
        db.CheckConstraint(
            "customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$'",
            name='booking_email_format'
        ),
    )
    
    def to_dict(self, include_puppy=False):
        """Convert model to dictionary for JSON responses"""
        data = {
            'id': self.id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'puppy_id': self.puppy_id,
            'puppy_gender_preference': self.puppy_gender_preference,
            'message': self.message,
            'status': self.status,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_puppy and self.puppy:
            data['puppy'] = self.puppy.to_dict()
        
        return data
    
    def __repr__(self):
        return f'<Booking {self.id} from {self.customer_name} ({self.status})>'