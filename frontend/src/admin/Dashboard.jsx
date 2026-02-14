import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Award,
  Camera,
  Phone,
  BarChart3,
  TrendingUp,
  Settings,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Active Puppies",
      value: "12",
      icon: Heart,
      color: "var(--primary-from)",
      trend: "+2 this week",
    },
    {
      label: "Parent Lineage",
      value: "06",
      icon: Award,
      color: "var(--secondary-from)",
      trend: "Verified",
    },
    {
      label: "Media Assets",
      value: "48",
      icon: Camera,
      color: "var(--primary-from)",
      trend: "High Res",
    },
    {
      label: "New Inquiries",
      value: "05",
      icon: Phone,
      color: "var(--secondary-from)",
      trend: "Action Required",
    },
  ];

  const quickLinks = [
    {
      title: "Puppy Inventory",
      path: "/admin/puppies",
      icon: Heart,
      color: "var(--primary-from)",
      desc: "Update current litters & availability",
    },
    {
      title: "Parent Records",
      path: "/admin/dogs",
      icon: Award,
      color: "var(--secondary-from)",
      desc: "Manage studs, dams & pedigrees",
    },
    {
      title: "Gallery Studio",
      path: "/admin/gallery",
      icon: Camera,
      color: "var(--primary-from)",
      desc: "Upload high-end kennel media",
    },
    {
      title: "Booking Desk",
      path: "/admin/bookings",
      icon: Phone,
      color: "var(--secondary-from)",
      desc: "Review customer inquiries",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: "140px",
        paddingBottom: "100px",
      }}
    >
      <div className="container">
        {/* --- WELCOME HEADER --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "60px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <ShieldCheck size={18} color="var(--primary-from)" />
              <span
                style={{
                  color: "var(--primary-from)",
                  fontWeight: "800",
                  letterSpacing: "3px",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                Secure Admin Portal
              </span>
            </div>
            <h1
              className="gradient-text"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: "900",
                lineHeight: 1,
              }}
            >
              Kennel <br /> Dashboard.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              style={{
                padding: "12px 24px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <Settings size={18} /> System Config
            </button>
          </motion.div>
        </div>

        {/* --- STATS OVERVIEW --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "60px",
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
              style={{
                padding: "30px",
                border: "1px solid rgba(255,255,255,0.05)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: `radial-gradient(circle at top right, ${stat.color}15, transparent 70%)`,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </div>
                <span
                  style={{
                    color: stat.color,
                    fontSize: "0.7rem",
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.trend}
                </span>
              </div>
              <h3
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  color: "#fff",
                  margin: "0 0 4px 0",
                  letterSpacing: "-2px",
                }}
              >
                {stat.value}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              color: "#fff",
              fontSize: "1.8rem",
              fontWeight: "900",
              marginBottom: "8px",
            }}
          >
            Management Suite
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Direct access to kennel modules
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {quickLinks.map((link, i) => (
            <Link key={i} to={link.path} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{
                  y: -5,
                  background: "rgba(255,255,255,0.04)",
                  borderColor: `${link.color}44`,
                }}
                className="glass-card"
                style={{
                  padding: "32px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  height: "100%",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <link.icon size={32} color={link.color} />
                  <ArrowUpRight size={20} color="var(--text-muted)" />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.25rem",
                    fontWeight: "800",
                    marginBottom: "8px",
                  }}
                >
                  {link.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    marginBottom: "20px",
                  }}
                >
                  {link.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: link.color,
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    textTransform: "uppercase",
                  }}
                >
                  Manage Now <ChevronRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* --- FUTURE ANALYTICS PREVIEW --- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{
            marginTop: "60px",
            padding: "40px",
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            borderRadius: "32px",
            display: "flex",
            alignItems: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "24px",
            }}
          >
            <BarChart3 size={40} color="var(--primary-from)" />
          </div>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "8px",
              }}
            >
              Predictive Analytics
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              Next-gen sales forecasting, heatmaps of buyer locations, and
              automated lineage tracking are currently in development for the
              Phase 2 rollout.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
