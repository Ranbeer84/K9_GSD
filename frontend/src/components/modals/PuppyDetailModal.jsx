import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Heart,
  MessageCircle,
  Phone,
  CheckCircle2,
  Camera,
} from "lucide-react";
import Button from "../common/Button";
import { getImageURL } from "../../api/api";

const PuppyDetailModal = ({ puppy, onClose }) => {
  if (!puppy) return null;

  // Get images from backend or use placeholders
  const galleryImages =
    puppy.images && puppy.images.length > 0
      ? puppy.images.map((img) => getImageURL(img.image_path))
      : [getImageURL(puppy.primary_image)];

  const calculateAge = (dob) => {
    if (!dob) return "Contact for age";
    const birth = new Date(dob);
    const today = new Date();
    const diffTime = Math.abs(today - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} days old`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks old`;
    return `${Math.floor(diffDays / 30)} months old`;
  };

  const handleWhatsAppBook = () => {
    const message = `Hi! I'm interested in ${puppy.name || "this puppy"} (${puppy.color} ${puppy.gender}).\n\nDetails:\n- Age: ${calculateAge(puppy.date_of_birth)}\n- Price: ₹${puppy.price_inr?.toLocaleString()}\n\nPlease provide more information.`;
    window.open(
      `https://wa.me/916201024665?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleCall = () => {
    window.location.href = "tel:+916201024665";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5, 8, 7, 0.9)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="glass-card"
          style={{
            maxWidth: "1100px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            padding: 0,
            background: "var(--bg-secondary)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "32px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(5, 8, 7, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary-from)";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            <X size={24} color="#fff" />
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: window.innerWidth > 768 ? "1fr 1fr" : "1fr",
            }}
          >
            {/* Image Section */}
            <div
              style={{
                position: "relative",
                height: window.innerWidth > 768 ? "auto" : "400px",
                background: "#000",
              }}
            >
              <img
                src={galleryImages[0]}
                alt={puppy.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Details Section */}
            <div style={{ padding: window.innerWidth > 768 ? "60px" : "32px" }}>
              <div style={{ marginBottom: "32px" }}>
                <span
                  style={{
                    color: "var(--primary-from)",
                    fontWeight: "800",
                    letterSpacing: "2px",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                  }}
                >
                  Featured Puppy
                </span>
                <h2
                  className="gradient-text"
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "900",
                    marginBottom: "12px",
                    lineHeight: 1.1,
                  }}
                >
                  {puppy.name || "Adorable Puppy"}
                </h2>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                  }}
                >
                  {puppy.color} • {puppy.gender} •{" "}
                  {calculateAge(puppy.date_of_birth)}
                </p>
              </div>

              {/* Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    background: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.15)",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <Calendar size={18} color="var(--primary-from)" />
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      Age
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {calculateAge(puppy.date_of_birth)}
                  </p>
                </div>

                <div
                  style={{
                    padding: "20px",
                    background: "rgba(245, 158, 11, 0.05)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <Heart size={18} color="var(--secondary-from)" />
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                      }}
                    >
                      Status
                    </span>
                  </div>
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {puppy.status}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                }}
              >
                {puppy.description ||
                  puppy.personality_traits ||
                  "A beautiful, healthy German Shepherd puppy raised with love and professional care in Ranchi."}
              </p>

              {/* Features List */}
              <div style={{ marginBottom: "40px" }}>
                <h4
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    fontWeight: "800",
                    marginBottom: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Included with Adoption
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "12px",
                  }}
                >
                  {[
                    {
                      text: "Health Certificate & Vaccinations",
                      color: "var(--primary-from)",
                    },
                    {
                      text: "KCI Registration Papers",
                      color: "var(--secondary-from)",
                    },
                    {
                      text: "Dewormed & Professional Vet Checked",
                      color: "var(--primary-from)",
                    },
                    {
                      text: "Lifetime Breeder Support",
                      color: "var(--secondary-from)",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <CheckCircle2 size={18} color={item.color} />
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "1rem",
                        }}
                      >
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Tag */}
              {puppy.price_inr && (
                <div
                  style={{
                    padding: "24px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    marginBottom: "40px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      marginBottom: "8px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    Price
                  </p>
                  <p
                    className="gradient-text"
                    style={{ fontSize: "3rem", fontWeight: "900", margin: 0 }}
                  >
                    ₹{puppy.price_inr.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexDirection: window.innerWidth > 768 ? "row" : "column",
                  marginBottom: "40px",
                }}
              >
                {puppy.status === "Available" ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={MessageCircle}
                      fullWidth
                      onClick={handleWhatsAppBook}
                    >
                      BOOK VIA WHATSAPP
                    </Button>
                    <Button
                      variant="glass"
                      size="lg"
                      icon={Phone}
                      fullWidth
                      onClick={handleCall}
                    >
                      CALL NOW
                    </Button>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      padding: "20px",
                      textAlign: "center",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      This puppy has already been {puppy.status.toLowerCase()}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          {galleryImages.length > 1 && (
            <div
              style={{
                padding: "40px 60px 60px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                <Camera size={24} color="var(--primary-from)" />
                <h3
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    margin: 0,
                  }}
                >
                  Photo Gallery
                </h3>
                <div
                  style={{
                    marginLeft: "auto",
                    padding: "8px 16px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    color: "var(--primary-from)",
                  }}
                >
                  {galleryImages.length} Photos
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                {galleryImages.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    style={{
                      height: "200px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      background: "rgba(255, 255, 255, 0.05)",
                      position: "relative",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${puppy.name} gallery ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PuppyDetailModal;
