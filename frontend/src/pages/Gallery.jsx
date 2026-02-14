import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { galleryImages } from "../data/galleryImages";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        background: "var(--bg-primary)",
      }}
    >
      <div className="container section-padding">
        {/* Header - Simple Animation */}
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

        {/* Gallery Collections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "80px" }}>
          {galleryImages.map((dog, index) => (
            <div key={dog.id}>
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
                <span className="gradient-text">{dog.caption}</span>
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
                {/* Main Thumbnail - Optimized */}
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
                  onClick={() => setSelectedImage(dog.thumbnail)}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "100%",
                      borderRadius: "16px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={dog.thumbnail}
                      alt={dog.caption}
                      loading="lazy" // Crucial for performance
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
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
                  {dog.collection.map((imgUrl, imgIndex) => (
                    <motion.div
                      key={imgIndex}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "50px" }}
                      transition={{ delay: (imgIndex % 4) * 0.05 }} // Staggered but limited
                      whileHover={{ y: -6 }}
                      className="glass-card"
                      style={{
                        height: "180px",
                        overflow: "hidden",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "16px",
                      }}
                      onClick={() => setSelectedImage(imgUrl)}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`${dog.caption} ${imgIndex}`}
                          loading="lazy" // Browsers will only load this when user scrolls near
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
