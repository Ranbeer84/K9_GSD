import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Heart, Award, Info } from "lucide-react"; // Using icons already in your project
import { parentDogs } from "../data/parentDogs";

const OurDogs = () => {
  const [hoveredId, setHoveredId] = useState(null);

  // Responsive check
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

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
          {parentDogs.map((dog, index) => (
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
                }}
              >
                <motion.img
                  animate={{ scale: hoveredId === dog.id ? 1.1 : 1 }}
                  transition={{ duration: 0.6 }}
                  src={dog.image}
                  alt={dog.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    padding: "8px 20px",
                    background: "var(--primary-from)", // Emerald from your CSS
                    borderRadius: "50px",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    color: "#000", // High contrast
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {dog.type}
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
                    <span
                      style={{
                        color: "var(--primary-from)",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {dog.bloodline}
                    </span>
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
                      {dog.age}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "4px",
                      }}
                    >
                      <Heart size={14} color="var(--primary-from)" />
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          fontWeight: "bold",
                        }}
                      >
                        TEMPERAMENT
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {dog.temperament}
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "12px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "4px",
                      }}
                    >
                      <Award size={14} color="var(--primary-from)" />
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          fontWeight: "bold",
                        }}
                      >
                        TRAINING
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {dog.training}
                    </p>
                  </div>
                </div>

                {/* Health Footer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    background: "rgba(16, 185, 129, 0.05)",
                    borderRadius: "16px",
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                  }}
                >
                  <Shield size={20} color="var(--primary-from)" />
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.7rem",
                        color: "var(--primary-from)",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                      }}
                    >
                      HEALTH CLEARANCE
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      {dog.health}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurDogs;
