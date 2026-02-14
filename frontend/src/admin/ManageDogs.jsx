// FILE: frontend/src/admin/ManageDogs.jsx
import { useState, useEffect } from "react";
import { dogsAPI, getImageURL } from "../api/api";
import Button from "../components/common/Button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ManageDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
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
      setDogs(data.dogs || []); // FIXED: Use data.dogs not data
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
      } else {
        await dogsAPI.create(data);
      }

      await fetchDogs();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save dog");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dog?")) {
      return;
    }

    try {
      await dogsAPI.delete(id);
      await fetchDogs();
    } catch (err) {
      setError("Failed to delete dog");
    }
  };

  if (loading) {
    return <div className="loading">Loading dogs...</div>;
  }

  return (
    <div className="manage-dogs">
      <div className="manage-header">
        <Link to="/admin">
          <Button
            variant="glass"
            size="sm"
            icon={ArrowLeft}
            style={{ marginBottom: "16px" }}
          >
            Back to Dashboard
          </Button>
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Manage Parent Dogs</h1>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Dog"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {showForm && (
        <div className="dog-form-container">
          <h2>{editingDog ? "Edit Dog" : "Add New Dog"}</h2>
          <form onSubmit={handleSubmit} className="dog-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bruno"
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Stud">Stud</option>
                  <option value="Dam">Dam</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
                placeholder="e.g., KCI/XXX/XXXX"
              />
            </div>

            <div className="form-group">
              <label>Pedigree Information</label>
              <textarea
                name="pedigree_info"
                value={formData.pedigree_info}
                onChange={handleInputChange}
                rows="3"
                placeholder="Bloodline details, parents, etc."
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                placeholder="Tell about this dog's personality, achievements, etc."
              />
            </div>

            <div className="form-group">
              <label>Health Clearances</label>
              <textarea
                name="health_clearances"
                value={formData.health_clearances}
                onChange={handleInputChange}
                rows="3"
                placeholder="HD/ED scores, health tests, etc."
              />
            </div>

            <div className="form-group">
              <label>Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                rows="3"
                placeholder="Show titles, working titles, etc."
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  style={{ marginRight: "8px" }}
                />
                Active (visible on public site)
              </label>
            </div>

            <div className="form-group">
              <label>Primary Image {!editingDog && "*"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingDog}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary">
                {editingDog ? "Update Dog" : "Add Dog"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="dogs-grid">
        {dogs.length === 0 ? (
          <div className="empty-state">
            <p>No dogs added yet. Click "Add Dog" to get started.</p>
          </div>
        ) : (
          dogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              {dog.primary_image && (
                <div className="dog-image">
                  <img src={getImageURL(dog.primary_image)} alt={dog.name} />
                </div>
              )}
              <div className="dog-info">
                <h3>{dog.name}</h3>
                <p className="role">
                  {dog.role} • {dog.gender}
                </p>
                <p className="gender">
                  <span className={`gender-badge ${dog.gender.toLowerCase()}`}>
                    {dog.gender}
                  </span>
                </p>
                {dog.description && (
                  <p className="description">{dog.description}</p>
                )}
                {!dog.is_active && (
                  <p className="inactive-badge">⚠️ Inactive</p>
                )}
              </div>
              <div className="dog-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(dog)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(dog.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Keep existing styles */}
      <style jsx>{`
        .manage-dogs {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 120px;
          min-height: 100vh;
        }

        .manage-header {
          margin-bottom: 2rem;
        }

        .manage-header h1 {
          margin: 16px 0;
          font-size: 2rem;
          color: #fff;
        }

        .alert {
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #ef4444;
        }

        .alert button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .dog-form-container {
          background: rgba(255, 255, 255, 0.03);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .dog-form-container h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .dog-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .image-preview {
          margin-top: 1rem;
          max-width: 300px;
        }

        .image-preview img {
          width: 100%;
          height: auto;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .dogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        .dog-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 0.2s;
        }

        .dog-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .dog-image {
          width: 100%;
          height: 240px;
          overflow: hidden;
        }

        .dog-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dog-info {
          padding: 1.5rem;
        }

        .dog-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #fff;
        }

        .role {
          color: var(--text-muted);
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .gender {
          margin: 0.5rem 0;
        }

        .gender-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .gender-badge.male {
          background: #dbeafe;
          color: #1e40af;
        }

        .gender-badge.female {
          background: #fce7f3;
          color: #9f1239;
        }

        .inactive-badge {
          color: #f59e0b;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-top: 1rem;
        }

        .dog-actions {
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          gap: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .manage-dogs {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .dogs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageDogs;
