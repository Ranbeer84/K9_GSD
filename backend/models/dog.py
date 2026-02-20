"""
Dog Model - FIXED VERSION
Represents parent dogs (studs and dams) in the kennel
Fixed to return full image URLs like the working Puppy model
"""

from datetime import datetime
from database import db


# =========================
# Dog Model
# =========================
class Dog(db.Model):
    __tablename__ = "dogs"

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Basic Info
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)   # Male / Female
    role = db.Column(db.String(20), nullable=False)     # Stud / Dam / Both
    date_of_birth = db.Column(db.Date)

    # Registration & Pedigree
    registration_number = db.Column(db.String(50))
    pedigree_info = db.Column(db.Text)

    # Details
    description = db.Column(db.Text)
    health_clearances = db.Column(db.Text)
    achievements = db.Column(db.Text)

    # Media
    primary_image = db.Column(db.String(255))

    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    images = db.relationship(
        "DogImage",
        backref="dog",
        lazy=True,
        cascade="all, delete-orphan",
    )

    puppies_as_sire = db.relationship(
        "Puppy",
        foreign_keys="Puppy.sire_id",
        backref="sire",
        lazy=True,
    )

    puppies_as_dam = db.relationship(
        "Puppy",
        foreign_keys="Puppy.dam_id",
        backref="dam",
        lazy=True,
    )

    # Constraints
    __table_args__ = (
        db.CheckConstraint(
            "gender IN ('Male', 'Female')",
            name="dog_gender_check",
        ),
        db.CheckConstraint(
            "role IN ('Stud', 'Dam', 'Both')",
            name="dog_role_check",
        ),
    )

    # -------------------------
    # FIXED: Image URL Helper (Instance Method)
    # -------------------------
    def get_image_url(self, image_path):
        """
        Convert relative image path to full URL
        CRITICAL: Frontend needs full URL to display images
        Matches the working Puppy model implementation
        """
        if not image_path:
            return None
        
        # If already a full URL, return as-is
        if image_path.startswith('http'):
            return image_path
        
        # Build full URL: http://localhost:5002/uploads/dogs/image.jpg
        # In production, use your domain
        base_url = 'http://localhost:5002'  # Change in production
        
        # Ensure path doesn't start with /
        clean_path = image_path.lstrip('/')
        
        return f"{base_url}/uploads/{clean_path}"

    # -------------------------
    # Serialization - FIXED
    # -------------------------
    def to_dict(self, include_images: bool = False) -> dict:
        """Convert model to dictionary for JSON responses"""
        data = {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "role": self.role,
            "date_of_birth": self.date_of_birth.isoformat()
            if self.date_of_birth
            else None,
            "registration_number": self.registration_number,
            "pedigree_info": self.pedigree_info,
            "description": self.description,
            "health_clearances": self.health_clearances,
            "achievements": self.achievements,
            # CRITICAL: Return full URL for primary image using instance method
            "primary_image": self.get_image_url(self.primary_image),
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

        if include_images:
            data["images"] = [img.to_dict() for img in self.images]

        return data

    def __repr__(self) -> str:
        return f"<Dog {self.name} ({self.gender})>"


# =========================
# DogImage Model - FIXED
# =========================
class DogImage(db.Model):
    __tablename__ = "dog_images"

    id = db.Column(db.Integer, primary_key=True)

    dog_id = db.Column(
        db.Integer,
        db.ForeignKey("dogs.id", ondelete="CASCADE"),
        nullable=False,
    )

    image_path = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    display_order = db.Column(db.Integer, default=0)

    uploaded_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    def get_image_url(self, image_path):
        """Convert relative path to full URL - matches Puppy implementation"""
        if not image_path:
            return None
        
        if image_path.startswith('http'):
            return image_path
        
        base_url = 'http://localhost:5002'
        clean_path = image_path.lstrip('/')
        return f"{base_url}/uploads/{clean_path}"

    def to_dict(self) -> dict:
        """Convert model to dictionary for JSON responses"""
        return {
            "id": self.id,
            "dog_id": self.dog_id,
            # CRITICAL: Return full URL using instance method
            "image_path": self.get_image_url(self.image_path),
            "caption": self.caption,
            "display_order": self.display_order,
            "uploaded_at": self.uploaded_at.isoformat(),
        }

    def __repr__(self) -> str:
        return f"<DogImage {self.id} for Dog {self.dog_id}>"