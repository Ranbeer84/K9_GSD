import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PuppyCard from "../components/cards/PuppyCard";
import PuppyDetailModal from "../components/modals/PuppyDetailModal";
import { puppiesAPI, handleAPIError } from "../api/api";

// Animation Variants for the Grid and Cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This prevents the "flash" by showing cards one by one
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const Puppies = ({ isAdmin }) => {
  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPuppy, setSelectedPuppy] = useState(null);

  useEffect(() => {
    fetchPuppies();
  }, [filterStatus]);

  const fetchPuppies = async () => {
    try {
      setLoading(true);
      const filters = filterStatus === "all" ? {} : { status: filterStatus };
      const data = await puppiesAPI.getAll(filters);
      setPuppies(data.puppies || []);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--text-primary)", fontSize: "1.5rem" }}>
          Admin Dashboard View - Coming Soon
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "100px" }}>
      <div className="container section-padding">
        {/* Header - Using reveal-up style logic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h1
            className="gradient-text"
            style={{
              fontSize: "4rem",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            Available Puppies
          </h1>
          <p style={{ fontSize: "1.3rem", color: "var(--text-secondary)" }}>
            Find your perfect companion
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "60px",
            flexWrap: "wrap",
          }}
        >
          {["all", "Available", "Reserved", "Sold"].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "active-filter" : ""}
              style={{
                padding: "12px 28px",
                background:
                  filterStatus === status
                    ? "var(--primary-from)"
                    : "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "50px",
                color:
                  filterStatus === status ? "#050807" : "var(--text-secondary)",
                fontWeight: "800",
                fontSize: "0.9rem",
                cursor: "pointer",
                textTransform: "uppercase",
                fontFamily: "Syne, sans-serif",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {status === "all" ? "All Puppies" : status}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading/Error/Grid Logic */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "80px 20px" }}
            >
              <div className="spinner" style={{ margin: "0 auto" }}></div>
              <p
                style={{
                  marginTop: "24px",
                  color: "var(--text-secondary)",
                  fontSize: "1.2rem",
                }}
              >
                Loading puppies...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "rgba(239, 68, 68, 0.05)",
                borderRadius: "24px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <p style={{ color: "#ef4444", fontSize: "1.2rem" }}>{error}</p>
              <button
                onClick={fetchPuppies}
                className="glass-card"
                style={{
                  marginTop: "20px",
                  padding: "12px 24px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </motion.div>
          ) : puppies.length > 0 ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "32px",
              }}
            >
              {puppies.map((puppy) => (
                <motion.div key={puppy.id} variants={cardVariants}>
                  <PuppyCard
                    puppy={puppy}
                    onViewDetails={setSelectedPuppy}
                    isAdmin={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "80px 20px" }}
            >
              <p style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}>
                No puppies found.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPuppy && (
            <PuppyDetailModal
              puppy={selectedPuppy}
              onClose={() => setSelectedPuppy(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Puppies;
