import { useState, useEffect } from "react";
import { puppiesAPI } from "../api/api";
import { Link, useNavigate } from "react-router-dom"; // Use navigate for better control
import { ArrowLeft, Plus, X, Trash2, Edit3, Save } from "lucide-react";
import Button from "../components/common/Button";

const ManagePuppies = () => {
  const navigate = useNavigate();
  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPuppy, setEditingPuppy] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "Male",
    color: "",
    price_inr: "",
    status: "Available",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    try {
      setLoading(true);
      const response = await puppiesAPI.getAll();
      setPuppies(response.puppies || []);
    } catch (err) {
      setError("Failed to load puppies");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date_of_birth: "",
      gender: "Male",
      color: "",
      price_inr: "",
      status: "Available",
      description: "",
      image: null,
    });
    setImagePreview("");
    setEditingPuppy(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (puppy) => {
    setEditingPuppy(puppy);
    setFormData({
      name: puppy.name,
      date_of_birth: puppy.date_of_birth?.split("T")[0] || "",
      gender: puppy.gender,
      color: puppy.color,
      price_inr: puppy.price_inr || "",
      status: puppy.status,
      description: puppy.description || "",
      image: null,
    });
    setImagePreview(puppy.primary_image || "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData[key]) {
        data.append("image", formData[key]);
      } else if (key !== "image") {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingPuppy) {
        await puppiesAPI.update(editingPuppy.id, data);
      } else {
        await puppiesAPI.create(data);
      }
      await fetchPuppies();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save puppy");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this puppy?")) return;
    try {
      await puppiesAPI.delete(id);
      await fetchPuppies();
    } catch (err) {
      setError("Failed to delete puppy");
    }
  };

  if (loading) {
    return (
      <div
        className="loading"
        style={{ color: "#fff", textAlign: "center", paddingTop: "150px" }}
      >
        Loading puppies...
      </div>
    );
  }

  return (
    <div className="manage-puppies">
      <div className="manage-header">
        {/* UPDATED: Using Custom Elite Button for Back Action */}
        <Button
          variant="glass"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/admin")}
          style={{ marginBottom: "24px" }}
        >
          Back to Dashboard
        </Button>

        <div className="header-flex">
          <h1 className="gradient-text">Manage Puppies</h1>
          <Button
            variant={showForm ? "glass" : "primary"}
            size="md"
            icon={showForm ? X : Plus}
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
          >
            {showForm ? "Cancel" : "Add Puppy"}
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
        <div className="puppy-form-container glass-card">
          <h2 style={{ color: "#fff", marginBottom: "30px" }}>
            {editingPuppy ? "Edit Pedigree" : "New Entry"}
          </h2>
          <form onSubmit={handleSubmit} className="puppy-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
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
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price_inr"
                  value={formData.price_inr}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Availability Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Gallery Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" icon={Save}>
                {editingPuppy ? "Update Record" : "Save Puppy"}
              </Button>
              <Button type="button" variant="glass" onClick={resetForm}>
                Discard
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="puppies-grid">
        {puppies.length === 0 ? (
          <div className="empty-state">No puppies in lineage yet.</div>
        ) : (
          puppies.map((puppy) => (
            <div key={puppy.id} className="puppy-card glass-card">
              <div className="puppy-image">
                <img src={puppy.primary_image} alt={puppy.name} />
                <div
                  className={`status-badge-overlay ${puppy.status.toLowerCase()}`}
                >
                  {puppy.status}
                </div>
              </div>
              <div className="puppy-info">
                <h3>{puppy.name}</h3>
                <p className="details">
                  {puppy.color} • {puppy.gender}
                </p>
                <p className="price">
                  ₹{Number(puppy.price_inr).toLocaleString()}
                </p>
              </div>
              <div className="puppy-actions">
                <Button
                  variant="glass"
                  size="sm"
                  icon={Edit3}
                  onClick={() => handleEdit(puppy)}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDelete(puppy.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .manage-puppies {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 140px;
          background: var(--bg-primary);
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .gradient-text {
          font-size: 3rem;
          font-weight: 900;
          margin: 0;
        }

        .alert {
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .puppy-form-container {
          padding: 40px;
          margin-bottom: 60px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          outline: none;
        }

        .form-group input:focus {
          border-color: var(--primary-from);
        }

        .image-preview img {
          margin-top: 15px;
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .puppies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .puppy-card {
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .puppy-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary-from);
        }

        .puppy-image {
          height: 250px;
          position: relative;
        }

        .puppy-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge-overlay {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .status-badge-overlay.available {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }
        .status-badge-overlay.reserved {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }
        .status-badge-overlay.sold {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .puppy-info {
          padding: 25px;
        }
        .puppy-info h3 {
          margin: 0 0 8px 0;
          color: #fff;
          font-size: 1.5rem;
        }
        .details {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }
        .price {
          color: var(--primary-from);
          font-size: 1.4rem;
          font-weight: 800;
        }

        .puppy-actions {
          padding: 20px 25px;
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 768px) {
          .manage-puppies {
            padding-top: 120px;
          }
          .header-flex {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ManagePuppies;
