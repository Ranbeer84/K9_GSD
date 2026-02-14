import { useState, useEffect } from "react";
import { galleryAPI } from "../api/api";
import Button from "../components/common/Button";

const ManageGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState("puppies");
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  // UPDATED: Now uses getAllAdmin and accesses data.items
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryAPI.getAllAdmin();
      setGalleryItems(data.items || []); // FIXED: Use data.items
    } catch (err) {
      setError("Failed to load gallery");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      return isImage || isVideo;
    });

    if (validFiles.length !== files.length) {
      setError("Some files were skipped. Only images and videos are allowed.");
    }

    const oversizedFiles = validFiles.filter(
      (file) => file.size > 10 * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      setError("Some files exceed 10MB limit and were skipped.");
      return;
    }

    setSelectedFiles(validFiles);

    const urls = validFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return null;
    });
    setPreviewUrls(urls);
  };

  // UPDATED: Uses 'files' field and bulkUpload method
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file); // FIXED: Backend expects 'files'
      });
      formData.append("category", category);

      await galleryAPI.bulkUpload(formData, category); // FIXED: Use bulkUpload

      setSelectedFiles([]);
      setPreviewUrls([]);
      await fetchGallery();

      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await galleryAPI.delete(id);
      await fetchGallery();
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const handleCancelSelection = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  };

  const groupedItems = galleryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <div className="manage-gallery">
      <div className="manage-header">
        <h1>Manage Gallery</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      <div className="upload-section">
        <h2>Upload Media</h2>

        <div className="upload-controls">
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={uploading}
            >
              <option value="puppies">Puppies</option>
              <option value="dogs">Dogs</option>
              <option value="facility">Facility</option>
              <option value="activities">Activities</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Files (Images or Videos)</label>
            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <p className="help-text">
              Max 10MB per file. Multiple files allowed.
            </p>
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="preview-section">
            <h3>Selected Files ({selectedFiles.length})</h3>
            <div className="preview-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="preview-item">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={previewUrls[index]}
                      alt={`Preview ${index + 1}`}
                    />
                  ) : (
                    <div className="video-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Video</span>
                    </div>
                  )}
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
            <div className="upload-actions">
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : `Upload ${selectedFiles.length} File(s)`}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancelSelection}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="gallery-section">
        <h2>Current Gallery ({galleryItems.length} items)</h2>

        {galleryItems.length === 0 ? (
          <div className="empty-state">
            <p>No media uploaded yet.</p>
          </div>
        ) : (
          Object.keys(groupedItems).map((cat) => (
            <div key={cat} className="category-section">
              <h3 className="category-title">
                {cat.charAt(0).toUpperCase() + cat.slice(1)} (
                {groupedItems[cat].length})
              </h3>
              <div className="gallery-grid">
                {groupedItems[cat].map((item) => (
                  <div key={item.id} className="gallery-card">
                    <div className="media-container">
                      {item.media_type === "image" ? (
                        <img src={item.media_url} alt="Gallery item" />
                      ) : (
                        <video src={item.media_url} controls />
                      )}
                    </div>
                    <div className="card-footer">
                      <span className="media-type-badge">
                        {item.media_type}
                      </span>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        /* ... existing styles remain unchanged ... */
        .manage-gallery {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .manage-header h1 {
          margin: 0 0 2rem 0;
          font-size: 2rem;
          color: #1f2937;
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
        .upload-section,
        .gallery-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        .upload-controls {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
        .form-group select,
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }
        .help-text {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #6b7280;
        }
        .preview-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #e5e7eb;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .preview-item img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 6px;
          border: 2px solid #e5e7eb;
        }
        .video-placeholder {
          width: 100%;
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 6px;
          border: 2px solid #e5e7eb;
          color: #6b7280;
        }
        .video-placeholder svg {
          width: 48px;
          height: 48px;
          margin-bottom: 0.5rem;
        }
        .file-name {
          margin: 0.5rem 0 0.25rem 0;
          font-size: 0.85rem;
          color: #374151;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .file-size {
          margin: 0;
          font-size: 0.75rem;
          color: #6b7280;
        }
        .upload-actions {
          display: flex;
          gap: 1rem;
        }
        .category-section {
          margin-bottom: 2.5rem;
        }
        .category-title {
          margin-bottom: 1rem;
          color: #1f2937;
          font-size: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }
        .gallery-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }
        .gallery-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .media-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }
        .media-container img,
        .media-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-footer {
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }
        .media-type-badge {
          padding: 0.25rem 0.75rem;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .loading {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }
        @media (max-width: 768px) {
          .manage-gallery {
            padding: 1rem;
          }
          .upload-controls {
            grid-template-columns: 1fr;
          }
          .preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }
          .gallery-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageGallery;
