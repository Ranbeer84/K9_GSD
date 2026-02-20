import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Heart, Award, Loader } from "lucide-react";
import { dogsAPI, getImageURL } from "../api/api";

const OurDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  // Responsive check
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  // Fetch dogs from backend on component mount
  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await dogsAPI.getAll(); // Calls /api/dogs
      console.log("Dogs API Response:", response); // Debug log
      setDogs(response.dogs || []); // Backend returns { dogs: [...], count: N }
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError("Failed to load our dogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date_of_birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "Age not available";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? "year" : "years"}`;
    } else {
      return `${years}y ${months}m`;
    }
  };

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
            Loading our champion dogs...
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
          <p
            style={{
              color: "#ef4444",
              fontSize: "1.2rem",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchDogs}
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
  if (dogs.length === 0) {
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
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "2rem",
              marginBottom: "10px",
            }}
          >
            No Dogs Available
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            We haven't added any parent dogs yet. Check back soon!
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
        paddingBottom: "100px",
      }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <h1
            className="gradient-text"
            style={{
              fontSize: isMobile ? "3rem" : "4.5rem",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            Our Champion Dogs
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            The foundation of our kennel. Selected for health, temperament, and
            superior German bloodlines.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 450px), 1fr))",
            gap: "40px",
          }}
        >
          {dogs.map((dog, index) => (
            <motion.div
              key={dog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(dog.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-card"
              style={{
                overflow: "hidden",
                borderRadius: "32px",
                border:
                  hoveredId === dog.id
                    ? "1px solid var(--primary-from)"
                    : "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.4s ease",
              }}
            >
              {/* Image Header */}
              <div
                style={{
                  position: "relative",
                  height: "400px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {dog.primary_image ? (
                  <motion.img
                    animate={{ scale: hoveredId === dog.id ? 1.1 : 1 }}
                    transition={{ duration: 0.6 }}
                    src={getImageURL(dog.primary_image)}
                    alt={dog.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    No Image
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    padding: "8px 20px",
                    background: "var(--primary-from)",
                    borderRadius: "50px",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    color: "#000",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {dog.role}
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "2.2rem",
                        fontWeight: "800",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {dog.name}
                    </h3>
                    {dog.registration_number && (
                      <span
                        style={{
                          color: "var(--primary-from)",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {dog.registration_number}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        margin: 0,
                        fontWeight: "bold",
                      }}
                    >
                      AGE
                    </p>
                    <p
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        margin: 0,
                      }}
                    >
                      {calculateAge(dog.date_of_birth)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {dog.description && (
                  <div
                    style={{
                      marginBottom: "24px",
                      padding: "16px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        color: "var(--text-secondary)",
                        lineHeight: "1.6",
                      }}
                    >
                      {dog.description}
                    </p>
                  </div>
                )}

                {/* Pedigree Info */}
                {dog.pedigree_info && (
                  <div
                    style={{
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      <Award size={16} color="var(--primary-from)" />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          fontWeight: "bold",
                          letterSpacing: "1px",
                        }}
                      >
                        PEDIGREE
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {dog.pedigree_info}
                    </p>
                  </div>
                )}

                {/* Achievements */}
                {dog.achievements && (
                  <div
                    style={{
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "8px",
                      }}
                    >
                      <Award size={16} color="var(--primary-from)" />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          fontWeight: "bold",
                          letterSpacing: "1px",
                        }}
                      >
                        ACHIEVEMENTS
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {dog.achievements}
                    </p>
                  </div>
                )}

                {/* Health Clearances */}
                {dog.health_clearances && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "16px",
                      background: "rgba(16, 185, 129, 0.05)",
                      borderRadius: "16px",
                      border: "1px solid rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <Shield
                      size={20}
                      color="var(--primary-from)"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.7rem",
                          color: "var(--primary-from)",
                          fontWeight: "bold",
                          letterSpacing: "1px",
                          marginBottom: "4px",
                        }}
                      >
                        HEALTH CLEARANCE
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "var(--text-primary)",
                          lineHeight: "1.5",
                        }}
                      >
                        {dog.health_clearances}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add spinner animation */}
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

export default OurDogs;
