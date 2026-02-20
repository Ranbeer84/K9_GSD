"""
Dog Routes
API endpoints for parent dog management (public + admin)
"""

from flask import Blueprint, request, jsonify
from datetime import datetime

from models import Dog, DogImage
from database import db
from utils.jwt_helper import admin_required
from utils.validators import validate_gender, validate_date_format
from services.file_service import save_uploaded_file, delete_file

dog_bp = Blueprint("dogs", __name__)


# =====================================================
# PUBLIC ENDPOINTS
# =====================================================

@dog_bp.route("/", methods=["GET"])
def get_dogs():
    """
    Get all active parent dogs (public)
    Optional query params:
      - role: Stud | Dam | Both
      - gender: Male | Female
    """
    role = request.args.get("role")
    gender = request.args.get("gender")

    query = Dog.query.filter_by(is_active=True)

    if role in {"Stud", "Dam", "Both"}:
        query = query.filter_by(role=role)

    if gender and validate_gender(gender):
        query = query.filter_by(gender=gender)

    dogs = query.order_by(Dog.name).all()

    return jsonify({
        "dogs": [d.to_dict(include_images=True) for d in dogs],
        "count": len(dogs),
    }), 200


@dog_bp.route("/<int:dog_id>", methods=["GET"])
def get_dog(dog_id):
    """Get single active dog (public)"""
    dog = Dog.query.get(dog_id)

    if not dog or not dog.is_active:
        return jsonify({"error": "Dog not found"}), 404

    return jsonify(dog.to_dict(include_images=True)), 200


# =====================================================
# ADMIN ENDPOINTS
# =====================================================

@dog_bp.route("/admin", methods=["GET"])
@admin_required
def get_all_dogs_admin(current_user):
    dogs = Dog.query.order_by(Dog.name).all()
    return jsonify({
        "dogs": [d.to_dict(include_images=True) for d in dogs],
        "count": len(dogs),
    }), 200


@dog_bp.route("/admin", methods=["POST"])
@admin_required
def create_dog(current_user):
    data = request.form

    # Required fields
    if not all([data.get("name"), data.get("gender"), data.get("role")]):
        return jsonify({"error": "Name, gender, and role are required"}), 400

    if not validate_gender(data["gender"]):
        return jsonify({"error": "Invalid gender"}), 400

    if data["role"] not in {"Stud", "Dam", "Both"}:
        return jsonify({"error": "Invalid role"}), 400

    if data.get("date_of_birth") and not validate_date_format(data["date_of_birth"]):
        return jsonify({"error": "Invalid date format (YYYY-MM-DD)"}), 400

    # Upload primary image
    primary_image = None
    file = request.files.get("primary_image") or request.files.get("image")
    if file:
        success, result = save_uploaded_file(file, "dogs")
        if not success:
            return jsonify({"error": result}), 400
        primary_image = result

    try:
        dog = Dog(
            name=data["name"],
            gender=data["gender"],
            role=data["role"],
            date_of_birth=datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d"
            ).date() if data.get("date_of_birth") else None,
            registration_number=data.get("registration_number"),
            pedigree_info=data.get("pedigree_info"),
            description=data.get("description"),
            health_clearances=data.get("health_clearances"),
            achievements=data.get("achievements"),
            primary_image=primary_image,
            is_active=data.get("is_active", "true").lower() == "true",
        )

        db.session.add(dog)
        db.session.commit()

        return jsonify({
            "message": "Dog created successfully",
            "dog": dog.to_dict(),
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@dog_bp.route("/admin/<int:dog_id>", methods=["PUT"])
@admin_required
def update_dog(current_user, dog_id):
    dog = Dog.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

    data = request.form

    try:
        if data.get("name"):
            dog.name = data["name"]

        if data.get("gender") and validate_gender(data["gender"]):
            dog.gender = data["gender"]

        if data.get("role") in {"Stud", "Dam", "Both"}:
            dog.role = data["role"]

        if data.get("date_of_birth") and validate_date_format(data["date_of_birth"]):
            dog.date_of_birth = datetime.strptime(
                data["date_of_birth"], "%Y-%m-%d"
            ).date()

        for field in (
            "registration_number",
            "pedigree_info",
            "description",
            "health_clearances",
            "achievements",
        ):
            if field in data:
                setattr(dog, field, data.get(field))

        if "is_active" in data:
            dog.is_active = data.get("is_active").lower() == "true"

        # React-safe image handling
        file = request.files.get("primary_image") or request.files.get("image")
        if file:
            success, result = save_uploaded_file(file, "dogs")
            if not success:
                return jsonify({"error": result}), 400
            if dog.primary_image:
                delete_file(dog.primary_image)
            dog.primary_image = result

        db.session.commit()

        return jsonify({
            "message": "Dog updated successfully",
            "dog": dog.to_dict(),
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@dog_bp.route("/admin/<int:dog_id>", methods=["DELETE"])
@admin_required
def delete_dog(current_user, dog_id):
    dog = Dog.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

    try:
        if dog.primary_image:
            delete_file(dog.primary_image)

        for img in dog.images:
            delete_file(img.image_path)

        db.session.delete(dog)
        db.session.commit()

        return jsonify({"message": "Dog deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =====================================================
# DOG IMAGE MANAGEMENT
# =====================================================

@dog_bp.route("/admin/<int:dog_id>/images", methods=["POST"])
@admin_required
def add_dog_images(current_user, dog_id):
    dog = Dog.query.get(dog_id)
    if not dog:
        return jsonify({"error": "Dog not found"}), 404

    files = request.files.getlist("images")
    if not files:
        return jsonify({"error": "No images provided"}), 400

    try:
        added = []
        for file in files:
            success, result = save_uploaded_file(file, "dogs")
            if success:
                img = DogImage(
                    dog_id=dog_id,
                    image_path=result,
                    display_order=len(dog.images),
                )
                db.session.add(img)
                added.append(result)

        db.session.commit()

        return jsonify({
            "message": f"{len(added)} images added",
            "images": added,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@dog_bp.route("/admin/images/<int:image_id>", methods=["DELETE"])
@admin_required
def delete_dog_image(current_user, image_id):
    image = DogImage.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    try:
        delete_file(image.image_path)
        db.session.delete(image)
        db.session.commit()
        return jsonify({"message": "Image deleted"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500