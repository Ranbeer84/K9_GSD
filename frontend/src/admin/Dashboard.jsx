import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Award,
  Camera,
  Phone,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../api/api";

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/dashboard/stats");
      setStatsData(response.data.stats);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Could not load stats. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Build stats array from live data, fall back to "—" while loading
  const stats = [
    {
      label: "Active Puppies",
      value: statsData
        ? String(statsData.active_puppies.count).padStart(2, "0")
        : "—",
      icon: Heart,
      color: "var(--primary-from)",
      trend: statsData?.active_puppies.trend ?? "Loading...",
    },
    {
      label: "Parent Lineage",
      value: statsData
        ? String(statsData.parent_lineage.count).padStart(2, "0")
        : "—",
      icon: Award,
      color: "var(--secondary-from)",
      trend: statsData?.parent_lineage.trend ?? "Loading...",
    },
    {
      label: "Media Assets",
      value: statsData
        ? String(statsData.media_assets.count).padStart(2, "0")
        : "—",
      icon: Camera,
      color: "var(--primary-from)",
      trend: statsData?.media_assets.trend ?? "Loading...",
    },
    {
      label: "New Inquiries",
      value: statsData
        ? String(statsData.new_inquiries.count).padStart(2, "0")
        : "—",
      icon: Phone,
      color: "var(--secondary-from)",
      trend: statsData?.new_inquiries.trend ?? "Loading...",
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
            style={{ display: "flex", gap: "12px" }}
          >
            {/* Refresh button */}
            <button
              onClick={fetchStats}
              disabled={loading}
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw
                size={16}
                style={{
                  animation: loading ? "spin 1s linear infinite" : "none",
                }}
              />
              {loading ? "Refreshing..." : "Refresh"}
            </button>

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

        {/* --- ERROR STATE --- */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: "30px",
              padding: "16px 24px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#fca5a5",
            }}
          >
            <AlertCircle size={20} />
            <span style={{ fontSize: "0.9rem" }}>{error}</span>
            <button
              onClick={fetchStats}
              style={{
                marginLeft: "auto",
                padding: "6px 14px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#fca5a5",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: "700",
              }}
            >
              Retry
            </button>
          </motion.div>
        )}

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
              {/* Glow accent */}
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
                    textAlign: "right",
                    maxWidth: "130px",
                    lineHeight: 1.4,
                  }}
                >
                  {stat.trend}
                </span>
              </div>

              {/* Value — pulse while loading */}
              <h3
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  color: loading ? "rgba(255,255,255,0.2)" : "#fff",
                  margin: "0 0 4px 0",
                  letterSpacing: "-2px",
                  transition: "color 0.3s",
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

      {/* Spin animation for refresh icon */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
