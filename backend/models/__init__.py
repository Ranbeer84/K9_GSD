"""
Models package initialization
Imports all models for easy access
"""

from models.admin import Admin
from models.dog import Dog, DogImage
from models.puppy import Puppy, PuppyImage
from models.gallery import Gallery
from models.booking import Booking

__all__ = [
    'Admin',
    'Dog',
    'DogImage',
    'Puppy',
    'PuppyImage',
    'Gallery',
    'Booking'
]