import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Award, Heart, Users, Star, CheckCircle2 } from "lucide-react";

const About = () => {
  // Fix: Use state for hydration safety to prevent layout shifts
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Performance Optimization: Prevent unnecessary re-renders of static content
  const stats = useMemo(
    () => [
      {
        value: "5+",
        label: "Years of Pedigree",
        icon: Shield,
        color: "#10b981",
      },
      {
        value: "200+",
        label: "Successful Placements",
        icon: Users,
        color: "#34d399",
      },
      {
        value: "100%",
        label: "DNA Health Cleared",
        icon: Award,
        color: "#f59e0b",
      },
      {
        value: "24/7",
        label: "Breeder Mentorship",
        icon: Heart,
        color: "#10b981",
      },
    ],
    [],
  );

  const philosophies = useMemo(
    () => [
      {
        title: "Preservation",
        icon: Star,
        description:
          "We focus on preserving the true German Shepherd: courageous, highly intelligent, and physically robust.",
      },
      {
        title: "Family First",
        icon: Heart,
        description:
          "A K9 GSD dog must be a protector in the field and a gentle soul at home with children.",
      },
      {
        title: "Unmatched Support",
        icon: Shield,
        description:
          "We offer a lifetime of guidance on nutrition, training, and health for every puppy we place.",
      },
    ],
    [],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "100px",
      }}
    >
      <div className="container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }} // Added margin for better trigger timing
          style={{ textAlign: "center", marginBottom: "100px" }}
        >
          <motion.span
            style={{
              color: "var(--primary-from)",
              fontWeight: "800",
              letterSpacing: "4px",
              fontSize: "0.9rem",
              textTransform: "uppercase",
            }}
          >
            Since 2020
          </motion.span>
          <h1
            className="gradient-text"
            style={{
              fontSize: isMobile ? "3rem" : "5rem",
              fontWeight: "900",
              lineHeight: 1.1,
              marginTop: "10px",
              marginBottom: "24px",
            }}
          >
            Legacy of the <br /> German Shepherd
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            At K9 GSD Kennel Ranchi, we don't just breed dogs; we preserve a
            lineage of excellence, health, and unmatched loyalty.
          </p>
        </motion.div>

        {/* Story Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
            gap: "60px",
            alignItems: "center",
            marginBottom: "140px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }} // Snappier duration
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  height: "2px",
                  width: "40px",
                  background: "var(--primary-from)",
                }}
              ></div>
              <span
                style={{ color: "var(--primary-from)", fontWeight: "bold" }}
              >
                OUR STORY
              </span>
            </div>
            <h2
              style={{
                fontSize: "2.8rem",
                fontWeight: "bold",
                color: "var(--text-primary)",
                marginBottom: "32px",
                lineHeight: 1.2,
              }}
            >
              Born from a Passion for{" "}
              <span style={{ color: "var(--secondary-from)" }}>
                Excellence.
              </span>
            </h2>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                lineHeight: 1.8,
              }}
            >
              <p style={{ marginBottom: "24px" }}>
                K9 GSD Kennel was founded on a simple belief: the German
                Shepherd is the ultimate companion. What started as a personal
                passion for the breed has grown into Ranchi's premier kennel for
                both working line and show line genetics.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {[
                  "KCI Registered Pedigree",
                  "Certified Hip & Elbow Scoring",
                  "Lifetime Health Support",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                      color: "var(--text-primary)",
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--primary-from)" />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Interactive Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "100%",
                height: "100%",
                border: "2px solid var(--primary-from)",
                borderRadius: "24px",
                zIndex: -1,
              }}
            ></div>
            <div
              className="glass-card"
              style={{ padding: "12px", borderRadius: "24px" }}
            >
              <img
                src="/dogs/About.jpg"
                alt="German Shepherd Puppy"
                loading="eager" // Forces browser to prioritize this image
                style={{
                  width: "100%",
                  height: isMobile ? "350px" : "450px",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Dynamic Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            marginBottom: "140px",
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }} // Faster stagger
              className="glass-card"
              style={{
                padding: "40px 24px",
                textAlign: "center",
                borderBottom: `4px solid ${stat.color}`,
              }}
            >
              <stat.icon
                size={40}
                color={stat.color}
                style={{ marginBottom: "20px", opacity: 0.8 }}
              />
              <h3
                className="gradient-text"
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "900",
                  marginBottom: "8px",
                }}
              >
                {stat.value}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2
            className="gradient-text"
            style={{ fontSize: "3.5rem", fontWeight: "bold" }}
          >
            Our Breeding Philosophy
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {philosophies.map((value, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card"
              style={{ padding: "48px 40px", position: "relative" }}
            >
              <value.icon
                size={60}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  opacity: 0.05,
                  color: "var(--primary-from)",
                }}
              />
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {value.title}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                }}
              >
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
