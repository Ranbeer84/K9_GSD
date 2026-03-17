import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Edit3,
  Trash2,
  Save,
  Loader,
  CheckCircle,
  AlertCircle,
  Upload,
  Award,
  Shield,
  Calendar,
  Hash,
} from "lucide-react";
import { dogsAPI, getImageURL } from "../api/api";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const ManageDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    role: "Stud",
    date_of_birth: "",
    registration_number: "",
    pedigree_info: "",
    description: "",
    health_clearances: "",
    achievements: "",
    is_active: true,
    primary_image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const data = await dogsAPI.getAllAdmin();
      setDogs(data.dogs || []);
    } catch (err) {
      setError("Failed to load dogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        setTimeout(() => setError(""), 3000);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        primary_image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      gender: "Male",
      role: "Stud",
      date_of_birth: "",
      registration_number: "",
      pedigree_info: "",
      description: "",
      health_clearances: "",
      achievements: "",
      is_active: true,
      primary_image: null,
    });
    setImagePreview("");
    setEditingDog(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (dog) => {
    setEditingDog(dog);
    setFormData({
      name: dog.name,
      gender: dog.gender,
      role: dog.role,
      date_of_birth: dog.date_of_birth?.split("T")[0] || "",
      registration_number: dog.registration_number || "",
      pedigree_info: dog.pedigree_info || "",
      description: dog.description || "",
      health_clearances: dog.health_clearances || "",
      achievements: dog.achievements || "",
      is_active: dog.is_active !== false,
      primary_image: null,
    });
    setImagePreview(dog.primary_image ? getImageURL(dog.primary_image) : "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("role", formData.role);
    if (formData.date_of_birth)
      data.append("date_of_birth", formData.date_of_birth);
    if (formData.registration_number)
      data.append("registration_number", formData.registration_number);
    if (formData.pedigree_info)
      data.append("pedigree_info", formData.pedigree_info);
    if (formData.description) data.append("description", formData.description);
    if (formData.health_clearances)
      data.append("health_clearances", formData.health_clearances);
    if (formData.achievements)
      data.append("achievements", formData.achievements);
    data.append("is_active", formData.is_active ? "true" : "false");

    if (formData.primary_image) {
      data.append("primary_image", formData.primary_image);
    }

    try {
      if (editingDog) {
        await dogsAPI.update(editingDog.id, data);
        setSuccess("Dog updated successfully!");
      } else {
        await dogsAPI.create(data);
        setSuccess("Dog added successfully!");
      }

      setTimeout(() => setSuccess(""), 3000);
      await fetchDogs();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save dog");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dog?")) {
      return;
    }

    try {
      await dogsAPI.delete(id);
      setSuccess("Dog deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      await fetchDogs();
    } catch (err) {
      setError("Failed to delete dog");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="manage-dogs-modern">
        <div className="loading-container">
          <Loader size={48} className="spinner" />
          <p>Loading champion dogs...</p>
        </div>
        <style jsx>{`
          .manage-dogs-modern {
            min-height: 100vh;
            padding: 2rem;
            padding-top: 140px;
            background: var(--bg-primary);
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            min-height: 60vh;
            color: var(--text-secondary);
          }
          .spinner {
            animation: spin 1s linear infinite;
            color: var(--primary-from);
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="manage-dogs-modern">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <Link to="/admin">
          <Button variant="glass" size="sm" icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </Link>

        <div className="header-content">
          <div className="title-section">
            <div className="icon-wrapper">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="gradient-text">Parent Dogs Management</h1>
              <p className="subtitle">
                {dogs.length} champion {dogs.length === 1 ? "dog" : "dogs"} in
                breeding program
              </p>
            </div>
          </div>

          <Button
            variant={showForm ? "glass" : "primary"}
            size="md"
            icon={showForm ? X : Plus}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
          >
            {showForm ? "Cancel" : "Add Dog"}
          </Button>
        </div>
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-error"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={20} />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-success"
          >
            <CheckCircle size={20} />
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="form-section glass-card"
          >
            <div className="form-header">
              <h2>{editingDog ? "Edit Champion Dog" : "Add New Dog"}</h2>
            </div>

            <form onSubmit={handleSubmit} className="dog-form">
              {/* Basic Info */}
              <div className="form-section-title">
                <div className="title-icon">
                  <Shield size={20} />
                </div>
                <h3>Basic Information</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Bruno vom Haus"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Gender <span className="required">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Male">♂ Male</option>
                    <option value="Female">♀ Female</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Role <span className="required">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Stud">🐕 Stud</option>
                    <option value="Dam">🐾 Dam</option>
                    <option value="Both">⚡ Both</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} style={{ marginRight: "6px" }} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Hash size={16} style={{ marginRight: "6px" }} />
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleInputChange}
                  placeholder="e.g., KCI/XXX/XXXX"
                />
              </div>

              {/* Pedigree & Details */}
              <div className="form-section-title">
                <div className="title-icon">
                  <Award size={20} />
                </div>
                <h3>Pedigree & Details</h3>
              </div>

              <div className="form-group">
                <label>Pedigree Information</label>
                <textarea
                  name="pedigree_info"
                  value={formData.pedigree_info}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Bloodline details, parents, lineage..."
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Personality, temperament, special qualities..."
                />
              </div>

              <div className="form-group">
                <label>
                  <Shield size={16} style={{ marginRight: "6px" }} />
                  Health Clearances
                </label>
                <textarea
                  name="health_clearances"
                  value={formData.health_clearances}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="HD/ED scores, health tests, certifications..."
                />
              </div>

              <div className="form-group">
                <label>
                  <Award size={16} style={{ marginRight: "6px" }} />
                  Achievements
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Show titles, working titles, awards..."
                />
              </div>

              {/* Image Upload */}
              <div className="form-section-title">
                <div className="title-icon">
                  <Upload size={20} />
                </div>
                <h3>Primary Image</h3>
              </div>

              <div className="form-group">
                <label htmlFor="dog-image" className="file-input-label">
                  <div className="file-input-content">
                    <Upload size={20} />
                    <span>
                      {imagePreview
                        ? "Change Image"
                        : `Choose Image ${!editingDog ? "*" : ""}`}
                    </span>
                  </div>
                </label>
                <input
                  id="dog-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingDog}
                  style={{ display: "none" }}
                />
                <p className="help-text">Max 5MB • JPG, PNG, WebP</p>

                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="image-preview"
                  >
                    <img src={imagePreview} alt="Preview" />
                  </motion.div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  <span className="checkbox-text">
                    <CheckCircle size={16} />
                    Active (visible on public site)
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <Button type="submit" variant="primary" icon={Save}>
                  {editingDog ? "Update Dog" : "Add Dog"}
                </Button>
                <Button
                  type="button"
                  variant="glass"
                  icon={X}
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dogs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dogs-section"
      >
        {dogs.length === 0 ? (
          <div className="empty-state glass-card">
            <Shield size={64} strokeWidth={1} />
            <h3>No Dogs Added Yet</h3>
            <p>Add your first champion dog to get started</p>
          </div>
        ) : (
          <div className="dogs-grid">
            {dogs.map((dog, index) => (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="dog-card glass-card"
              >
                {/* Image */}
                {dog.primary_image && (
                  <div className="dog-image">
                    <img
                      src={getImageURL(dog.primary_image)}
                      alt={dog.name}
                      loading="lazy"
                    />
                    {!dog.is_active && (
                      <div className="inactive-overlay">
                        <span>⚠️ Inactive</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="dog-info">
                  <div className="dog-header">
                    <h3>{dog.name}</h3>
                    <span className={`role-badge ${dog.role.toLowerCase()}`}>
                      {dog.role}
                    </span>
                  </div>

                  <div className="dog-meta">
                    <span
                      className={`gender-badge ${dog.gender.toLowerCase()}`}
                    >
                      {dog.gender === "Male" ? "♂" : "♀"} {dog.gender}
                    </span>
                    {dog.registration_number && (
                      <span className="reg-number">
                        <Hash size={14} />
                        {dog.registration_number}
                      </span>
                    )}
                  </div>

                  {dog.description && (
                    <p className="description">
                      {dog.description.length > 120
                        ? `${dog.description.substring(0, 120)}...`
                        : dog.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="dog-tags">
                    {dog.pedigree_info && (
                      <span className="tag">
                        <Award size={12} />
                        Pedigree
                      </span>
                    )}
                    {dog.health_clearances && (
                      <span className="tag">
                        <Shield size={12} />
                        Health Tested
                      </span>
                    )}
                    {dog.achievements && (
                      <span className="tag">
                        <Award size={12} />
                        Titled
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="dog-actions">
                  <Button
                    variant="glass"
                    size="sm"
                    icon={Edit3}
                    onClick={() => handleEdit(dog)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(dog.id)}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .manage-dogs-modern {
          min-height: 100vh;
          padding: 2rem;
          padding-top: 140px;
          max-width: 1600px;
          margin: 0 auto;
          background: var(--bg-primary);
        }

        /* Header */
        .page-header {
          margin-bottom: 40px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          gap: 20px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            var(--primary-from),
            var(--primary-to)
          );
          border-radius: 20px;
          color: #000;
        }

        h1 {
          font-size: 3rem;
          font-weight: 900;
          margin: 0;
          line-height: 1.1;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin: 8px 0 0 0;
        }

        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 24px;
          font-weight: 600;
        }

        .alert button {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          display: flex;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .alert button:hover {
          opacity: 1;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary-from);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        /* Form Section */
        .form-section {
          padding: 32px;
          margin-bottom: 40px;
        }

        .form-header h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 24px 0;
          color: var(--text-primary);
        }

        .dog-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-section-title:first-of-type {
          margin-top: 0;
        }

        .title-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 10px;
          color: var(--primary-from);
        }

        .form-section-title h3 {
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .required {
          color: #f87171;
          margin-left: 4px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-from);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .file-input-label {
          cursor: pointer;
        }

        .file-input-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          transition: all 0.3s;
        }

        .file-input-content:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary-from);
          color: var(--primary-from);
        }

        .help-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .image-preview {
          margin-top: 16px;
          max-width: 300px;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s;
        }

        .checkbox-label:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary-from);
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .checkbox-text {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Dogs Section */
        .dogs-section {
          margin-top: 40px;
        }

        .empty-state {
          padding: 80px 40px;
          text-align: center;
          color: var(--text-muted);
        }

        .empty-state svg {
          margin-bottom: 24px;
          opacity: 0.3;
        }

        .empty-state h3 {
          color: var(--text-primary);
          font-size: 1.5rem;
          margin: 0 0 12px 0;
        }

        .empty-state p {
          margin: 0;
          font-size: 1rem;
        }

        /* Dogs Grid */
        .dogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
        }

        .dog-card {
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .dog-image {
          width: 100%;
          height: 260px;
          overflow: hidden;
          border-radius: 16px;
          margin-bottom: 16px;
          position: relative;
        }

        .dog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .dog-card:hover .dog-image img {
          transform: scale(1.05);
        }

        .inactive-overlay {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 8px 16px;
          background: rgba(245, 158, 11, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          color: #000;
        }

        .dog-info {
          padding: 0 16px 16px 16px;
        }

        .dog-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .dog-header h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
          flex: 1;
        }

        .role-badge {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .role-badge.stud {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }

        .role-badge.dam {
          background: rgba(236, 72, 153, 0.15);
          color: #f472b6;
        }

        .role-badge.both {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        .dog-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .gender-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .gender-badge.male {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }

        .gender-badge.female {
          background: rgba(236, 72, 153, 0.15);
          color: #f472b6;
        }

        .reg-number {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 12px 0;
        }

        .dog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary-from);
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .dog-actions {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .manage-dogs-modern {
            padding: 1rem;
            padding-top: 120px;
          }

          h1 {
            font-size: 2.5rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .title-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .dogs-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ManageDogs;
