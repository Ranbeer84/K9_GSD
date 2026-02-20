import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader, AlertCircle } from "lucide-react";
import { galleryAPI, handleAPIError } from "../api/api";

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch gallery items from backend
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryAPI.getAll(); // Calls /api/gallery
      console.log("Gallery API Response:", data);
      setGalleryItems(data.items || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  // Group items by category
  const groupedItems = galleryItems.reduce((acc, item) => {
    const category = item.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Get first image from each category for thumbnail
  const categoryThumbnails = Object.keys(groupedItems).map((category) => ({
    category,
    thumbnail: groupedItems[category][0],
    items: groupedItems[category],
  }));

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader
            size={48}
            style={{
              animation: "spin 1s linear infinite",
              color: "var(--primary-from)",
            }}
          />
          <p
            style={{
              marginTop: "20px",
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
            }}
          >
            Loading gallery...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            maxWidth: "500px",
          }}
        >
          <AlertCircle size={48} color="#ef4444" style={{ margin: "0 auto" }} />
          <p
            style={{
              color: "#ef4444",
              fontSize: "1.2rem",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchGallery}
            style={{
              padding: "12px 24px",
              background: "var(--primary-from)",
              color: "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (galleryItems.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Camera
            size={64}
            color="var(--text-muted)"
            style={{ margin: "0 auto" }}
          />
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "2rem",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            No Gallery Items Yet
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Check back soon for photos and videos from our kennel!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        background: "var(--bg-primary)",
      }}
    >
      <div className="container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "50px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              marginBottom: "20px",
            }}
          >
            <Camera size={16} color="var(--primary-from)" />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "800",
                color: "var(--primary-from)",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Visual Journey
            </span>
          </div>
          <h1
            className="gradient-text"
            style={{
              fontSize: isMobile ? "3rem" : "4.5rem",
              fontWeight: "900",
              marginBottom: "20px",
              lineHeight: 1.1,
            }}
          >
            Kennel Gallery
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Explore the life, training, and champion spirit of our German
            Shepherds.
          </p>
        </motion.div>

        {/* Gallery Collections by Category */}
        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {categoryThumbnails.map((categoryData, index) => (
            <div key={categoryData.category}>
              {/* Category Title */}
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  color: "#fff",
                  marginBottom: "30px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <span className="gradient-text">
                  {categoryData.category.charAt(0).toUpperCase() +
                    categoryData.category.slice(1)}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    background:
                      "linear-gradient(to right, var(--secondary-from), transparent)",
                  }}
                />
              </motion.h2>

              {/* Main Thumbnail + Sub Images Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "400px 1fr",
                  gap: "30px",
                  alignItems: "start",
                }}
              >
                {/* Main Thumbnail */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{
                    height: isMobile ? "300px" : "400px",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: "12px",
                    borderRadius: "24px",
                    border: "2px solid rgba(16, 185, 129, 0.3)",
                  }}
                  onClick={() =>
                    setSelectedImage(categoryData.thumbnail.media_url)
                  }
                >
                  <div
                    style={{
                      position: "relative",
                      height: "100%",
                      borderRadius: "16px",
                      overflow: "hidden",
                    }}
                  >
                    {categoryData.thumbnail.media_type === "image" ? (
                      <img
                        src={categoryData.thumbnail.media_url}
                        alt={
                          categoryData.thumbnail.title || categoryData.category
                        }
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          console.error(
                            "Failed to load image:",
                            categoryData.thumbnail.media_url,
                          );
                        }}
                      />
                    ) : (
                      <video
                        src={categoryData.thumbnail.media_url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        muted
                        loop
                        playsInline
                      />
                    )}
                  </div>
                </motion.div>

                {/* Sub Images Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {categoryData.items.map((item, imgIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "50px" }}
                      transition={{ delay: (imgIndex % 4) * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="glass-card"
                      style={{
                        height: "180px",
                        overflow: "hidden",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "16px",
                      }}
                      onClick={() =>
                        item.media_type === "image" &&
                        setSelectedImage(item.media_url)
                      }
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "12px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {item.media_type === "image" ? (
                          <img
                            src={item.media_url}
                            alt={
                              item.title ||
                              `${categoryData.category} ${imgIndex}`
                            }
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              console.error(
                                "Failed to load image:",
                                item.media_url,
                              );
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "relative",
                              background: "rgba(0,0,0,0.3)",
                            }}
                          >
                            <video
                              src={item.media_url}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              muted
                              loop
                              playsInline
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "40px",
                                height: "40px",
                                background: "rgba(255,255,255,0.9)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(5, 8, 7, 0.95)",
              backdropFilter: "blur(15px)",
              zIndex: 3000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={32} />
            </motion.button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              style={{
                maxWidth: "90%",
                maxHeight: "80vh",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onError={(e) => {
                console.error("Failed to load full-size image:", selectedImage);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinner animation */}
      <style>{`
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
};

export default Gallery;
