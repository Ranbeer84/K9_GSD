import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Trash2,
  Image as ImageIcon,
  Video,
  Loader,
  Check,
  AlertCircle,
  ArrowLeft,
  Film,
  Layers,
} from "lucide-react";
import { galleryAPI } from "../api/api";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const ManageGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState("puppies");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryAPI.getAllAdmin();
      setGalleryItems(data.items || []);
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
      setTimeout(() => setError(""), 4000);
    }

    const oversizedFiles = validFiles.filter(
      (file) => file.size > 10 * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      setError("Some files exceed 10MB limit and were skipped.");
      setTimeout(() => setError(""), 4000);
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

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to upload");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("category", category);

      await galleryAPI.bulkUpload(formData, category);

      setSelectedFiles([]);
      setPreviewUrls([]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);

      await fetchGallery();

      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.response?.data?.error || "Failed to upload files");
      setTimeout(() => setError(""), 4000);
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
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  };

  const groupedItems = galleryItems.reduce((acc, item) => {
    const cat = item.category || "general";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {});

  const getCategoryIcon = (cat) => {
    const icons = {
      puppies: "🐕",
      dogs: "🐾",
      facility: "🏠",
      activities: "⚡",
      general: "📸",
    };
    return icons[cat.toLowerCase()] || "📷";
  };

  if (loading) {
    return (
      <div className="manage-gallery-modern">
        <div className="loading-container">
          <Loader size={48} className="spinner" />
          <p>Loading gallery...</p>
        </div>

        <style jsx>{`
          .manage-gallery-modern {
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
    <div className="manage-gallery-modern">
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
              <Layers size={32} />
            </div>
            <div>
              <h1 className="gradient-text">Gallery Management</h1>
              <p className="subtitle">
                {galleryItems.length} media items across{" "}
                {Object.keys(groupedItems).length} categories
              </p>
            </div>
          </div>
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

        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-success"
          >
            <Check size={20} />
            <span>Files uploaded successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="upload-section glass-card"
      >
        <div className="section-header">
          <Upload size={24} />
          <h2>Upload Media</h2>
        </div>

        <div className="upload-controls">
          <div className="control-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={uploading}
                className="category-select"
              >
                <option value="puppies">🐕 Puppies</option>
                <option value="dogs">🐾 Dogs</option>
                <option value="facility">🏠 Facility</option>
                <option value="activities">⚡ Activities</option>
              </select>
            </div>

            <div className="form-group file-input-group">
              <label>Select Files</label>
              <label htmlFor="file-input" className="file-input-label">
                <div className="file-input-content">
                  <Upload size={20} />
                  <span>
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file(s) selected`
                      : "Choose images or videos"}
                  </span>
                </div>
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: "none" }}
              />
              <p className="help-text">
                Max 10MB per file • Multiple files allowed
              </p>
            </div>
          </div>
        </div>

        {/* File Preview */}
        <AnimatePresence>
          {previewUrls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="preview-section"
            >
              <div className="preview-header">
                <h3>
                  Selected Files ({selectedFiles.length}){" "}
                  <span className="badge">{category}</span>
                </h3>
              </div>

              <div className="preview-grid">
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="preview-card glass-card"
                  >
                    {file.type.startsWith("image/") ? (
                      <div className="preview-image">
                        <img
                          src={previewUrls[index]}
                          alt={`Preview ${index}`}
                        />
                      </div>
                    ) : (
                      <div className="preview-video">
                        <Video size={40} />
                        <span>Video</span>
                      </div>
                    )}
                    <div className="preview-info">
                      <p className="file-name" title={file.name}>
                        {file.name}
                      </p>
                      <p className="file-size">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="upload-actions">
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  icon={uploading ? Loader : Upload}
                >
                  {uploading
                    ? "Uploading..."
                    : `Upload ${selectedFiles.length} File(s)`}
                </Button>
                <Button
                  variant="glass"
                  onClick={handleCancelSelection}
                  disabled={uploading}
                  icon={X}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Gallery Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="gallery-section"
      >
        <div className="section-header">
          <Film size={24} />
          <h2>Current Gallery</h2>
        </div>

        {galleryItems.length === 0 ? (
          <div className="empty-state glass-card">
            <ImageIcon size={64} strokeWidth={1} />
            <h3>No media uploaded yet</h3>
            <p>Start by uploading your first images or videos above</p>
          </div>
        ) : (
          <div className="categories-container">
            {Object.keys(groupedItems).map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="category-section"
              >
                <div className="category-header">
                  <h3>
                    <span className="category-icon">
                      {getCategoryIcon(cat)}
                    </span>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    <span className="count-badge">
                      {groupedItems[cat].length}
                    </span>
                  </h3>
                </div>

                <div className="gallery-grid">
                  {groupedItems[cat].map((item, itemIdx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: itemIdx * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="gallery-card glass-card"
                    >
                      <div className="media-container">
                        {item.media_type === "image" ? (
                          <img
                            src={item.media_url}
                            alt={item.title || "Gallery item"}
                            loading="lazy"
                          />
                        ) : (
                          <div className="video-container">
                            <video src={item.media_url} />
                            <div className="video-overlay">
                              <Video size={32} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="card-footer">
                        <div className="card-info">
                          <span className={`media-badge ${item.media_type}`}>
                            {item.media_type === "image" ? (
                              <ImageIcon size={12} />
                            ) : (
                              <Video size={12} />
                            )}
                            {item.media_type}
                          </span>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .manage-gallery-modern {
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
          margin-top: 24px;
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
          align-items: center;
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

        /* Sections */
        .upload-section,
        .gallery-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .section-header h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0;
        }

        /* Upload Controls */
        .upload-section {
          padding: 32px;
        }

        .upload-controls {
          margin-top: 24px;
        }

        .control-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .category-select {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-select:hover {
          border-color: var(--primary-from);
        }

        .category-select:focus {
          outline: none;
          border-color: var(--primary-from);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .file-input-label {
          display: block;
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
          margin-top: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Preview Section */
        .preview-section {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .preview-header h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
          font-size: 1.3rem;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .badge {
          padding: 4px 12px;
          background: rgba(16, 185, 129, 0.2);
          color: var(--primary-from);
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .preview-card {
          overflow: hidden;
          padding: 8px;
        }

        .preview-image {
          width: 100%;
          height: 140px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-video {
          width: 100%;
          height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .preview-info {
          padding: 0 4px;
        }

        .file-name {
          margin: 0 0 4px 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .upload-actions {
          display: flex;
          gap: 12px;
        }

        /* Gallery Section */
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

        /* Categories */
        .categories-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .category-section {
          /* no extra styles needed */
        }

        .category-header {
          margin-bottom: 20px;
        }

        .category-header h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0;
        }

        .category-icon {
          font-size: 1.5rem;
        }

        .count-badge {
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        /* Gallery Grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .gallery-card {
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .media-container {
          width: 100%;
          height: 220px;
          overflow: hidden;
          border-radius: 12px;
          margin-bottom: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .media-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-card:hover .media-container img {
          transform: scale(1.05);
        }

        .video-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          color: #fff;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }

        .card-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .media-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .media-badge.image {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }

        .media-badge.video {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .manage-gallery-modern {
            padding: 1rem;
            padding-top: 120px;
          }

          h1 {
            font-size: 2.5rem;
          }

          .title-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .control-row {
            grid-template-columns: 1fr;
          }

          .preview-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .upload-actions {
            flex-direction: column;
          }
        }

        /* Spinner animation */
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

export default ManageGallery;
