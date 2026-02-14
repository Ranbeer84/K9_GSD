import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Edit2, Eye, Award } from "lucide-react";
import Button from "../common/Button";
import { getImageURL } from "../../api/api";

const PuppyCard = ({ puppy, onViewDetails, onEdit, isAdmin }) => {
  const isSold = puppy.status?.toLowerCase() === "sold";
  const isReserved = puppy.status?.toLowerCase() === "reserved";

  const imageUrl = puppy.primary_image
    ? getImageURL(puppy.primary_image)
    : puppy.images && puppy.images.length > 0
      ? getImageURL(puppy.images[0].image_path)
      : "/placeholder-puppy.jpg";

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

  return (
    <motion.div
      /* FIX: Removed 'whileInView' because the parent (Puppies.js) 
         now handles the staggered entrance via 'variants'. 
         This prevents the 'double-flash' effect.
      */
      className={`glass-card ${isSold ? "sold-card" : ""}`}
      style={{
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--glass-bg)",
        border: isSold
          ? "1px solid rgba(239, 68, 68, 0.1)"
          : "1px solid var(--glass-border)",
        opacity: isSold ? 0.7 : 1,
        // Using transform instead of 'all' to prevent layout flicker
        transition:
          "transform 0.4s var(--ease-out-expo), border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "260px",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Puppy Image with smooth fade-in to prevent the 'pop' */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={imageUrl}
          alt={puppy.name || "Puppy"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: isSold ? "grayscale(1) brightness(0.6)" : "none",
          }}
          onError={(e) => {
            e.target.src = "/placeholder-puppy.jpg";
          }}
        />

        {/* Status Badge */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: "6px 16px",
              borderRadius: "100px",
              fontSize: "0.7rem",
              fontWeight: "900",
              letterSpacing: "1px",
              textTransform: "uppercase",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background: isSold
                ? "rgba(239, 68, 68, 0.25)"
                : isReserved
                  ? "rgba(245, 158, 11, 0.25)"
                  : "rgba(16, 185, 129, 0.25)",
              color: isSold ? "#f87171" : isReserved ? "#fbbf24" : "#34d399",
              border: `1px solid ${isSold ? "#ef4444" : isReserved ? "#f59e0b" : "#10b981"}55`,
            }}
          >
            {puppy.status}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              fontWeight: "900",
              color: isSold ? "var(--text-muted)" : "#fff",
              margin: 0,
            }}
          >
            {puppy.name || "Unnamed"}
          </h3>
          {isSold ? (
            <Award size={18} color="var(--text-muted)" />
          ) : (
            <ShieldCheck size={18} color="var(--primary-from)" />
          )}
        </div>

        <p
          style={{
            color: "var(--secondary-from)",
            fontWeight: "700",
            fontSize: "0.85rem",
            marginBottom: "12px",
          }}
        >
          {puppy.gender} • {puppy.color} • {calculateAge(puppy.date_of_birth)}
        </p>

        {puppy.price_inr && !isSold && (
          <p
            className="gradient-text"
            style={{
              fontSize: "1.5rem",
              fontWeight: "900",
              marginBottom: "16px",
            }}
          >
            ₹{puppy.price_inr.toLocaleString()}
          </p>
        )}

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "24px",
            flex: 1,
          }}
        >
          {puppy.description ||
            "Premium German Shepherd from champion lineage."}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Button
            variant={isSold ? "glass" : "primary"}
            size="sm"
            fullWidth
            icon={Eye}
            onClick={() => onViewDetails(puppy)}
          >
            {isSold ? "PEDIGREE" : "DETAILS"}
          </Button>

          {isAdmin && (
            <Button
              variant="glass"
              size="sm"
              icon={Edit2}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(puppy);
              }}
              style={{ width: "50px", padding: 0 }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PuppyCard;
