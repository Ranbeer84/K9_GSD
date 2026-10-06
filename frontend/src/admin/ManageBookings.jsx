import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  User,
  MessageSquare,
  Dog,
  Calendar,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Search,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Loader,
  FileText,
  Filter,
  Trash2,
  Edit3,
  Save,
  BarChart3,
} from "lucide-react";
import api from "../api/api";

// ─── STATUS CONFIG ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  New: {
    color: "#60a5fa",
    bg: "rgba(96, 165, 250, 0.12)",
    border: "rgba(96, 165, 250, 0.3)",
    icon: Clock,
    label: "New",
  },
  Contacted: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.3)",
    icon: Phone,
    label: "Contacted",
  },
  "In Progress": {
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.12)",
    border: "rgba(167, 139, 250, 0.3)",
    icon: Loader,
    label: "In Progress",
  },
  Completed: {
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.3)",
    icon: CheckCircle,
    label: "Completed",
  },
  Cancelled: {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: XCircle,
    label: "Cancelled",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["New"];
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 12px",
        borderRadius: "20px",
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontSize: "0.75rem",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      padding: "24px 28px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "20px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "80px",
        height: "80px",
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          padding: "8px",
          background: `${color}15`,
          borderRadius: "10px",
          border: `1px solid ${color}25`,
        }}
      >
        <Icon size={18} color={color} />
      </div>
    </div>
    <div
      style={{
        fontSize: "2.2rem",
        fontWeight: "900",
        color: "#fff",
        letterSpacing: "-1px",
        lineHeight: 1,
      }}
    >
      {value ?? "—"}
    </div>
    <div
      style={{
        color: "rgba(255,255,255,0.4)",
        fontSize: "0.78rem",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginTop: "6px",
      }}
    >
      {label}
    </div>
  </motion.div>
);

// ─── BOOKING DETAIL MODAL ─────────────────────────────────────────────────────
const BookingModal = ({ booking, onClose, onUpdate }) => {
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes] = useState(booking.admin_notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/bookings/admin/${booking.id}`, {
        status,
        admin_notes: notes,
      });
      setSaved(true);
      onUpdate({ ...booking, status, admin_notes: notes });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  const fmt = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "28px",
          padding: "36px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "28px",
          }}
        >
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.72rem",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Inquiry #{booking.id}
            </div>
            <h2
              style={{
                color: "#fff",
                fontSize: "1.6rem",
                fontWeight: "900",
                margin: 0,
              }}
            >
              {booking.customer_name}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <StatusBadge status={booking.status} />
            <button
              onClick={onClose}
              style={{
                padding: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Customer Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          {[
            { icon: Mail, label: "Email", value: booking.customer_email },
            { icon: Phone, label: "Phone", value: booking.customer_phone },
            {
              icon: Dog,
              label: "Gender Preference",
              value: booking.puppy_gender_preference || "No Preference",
            },
            {
              icon: Calendar,
              label: "Submitted",
              value: fmt(booking.created_at),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              style={{
                padding: "16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                <Icon size={12} /> {label}
              </div>
              <div
                style={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  wordBreak: "break-all",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Message */}
        <div
          style={{
            padding: "20px",
            background: "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.12)",
            borderRadius: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.72rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            <MessageSquare size={12} /> Customer Message
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {booking.message}
          </p>
        </div>

        {/* Admin Controls */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.72rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Update Status
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ALL_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = status === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: `1px solid ${active ? cfg.color : "rgba(255,255,255,0.1)"}`,
                    background: active ? cfg.bg : "transparent",
                    color: active ? cfg.color : "rgba(255,255,255,0.4)",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.72rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Admin Notes
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add private notes about this inquiry..."
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "0.9rem",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "16px",
            background: saved
              ? "linear-gradient(135deg, #059669, #064e3b)"
              : "linear-gradient(135deg, #10b981, #059669)",
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            fontWeight: "800",
            fontSize: "1rem",
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.3s",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? (
            <Loader
              size={18}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : saved ? (
            <CheckCircle size={18} />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>
    </motion.div>
  );
};

// ─── BOOKING ROW ──────────────────────────────────────────────────────────────
const BookingRow = ({ booking, onSelect, onDelete }) => {
  const fmt = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ background: "rgba(255,255,255,0.025)" }}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer",
      }}
    >
      <td style={tdStyle} onClick={() => onSelect(booking)}>
        <div style={{ fontWeight: "700", color: "#fff", fontSize: "0.9rem" }}>
          {booking.customer_name}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.78rem",
            marginTop: "2px",
          }}
        >
          {booking.customer_email}
        </div>
      </td>
      <td style={tdStyle} onClick={() => onSelect(booking)}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
          {booking.customer_phone}
        </span>
      </td>
      <td style={tdStyle} onClick={() => onSelect(booking)}>
        <span
          style={{
            padding: "4px 10px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.78rem",
          }}
        >
          {booking.puppy_gender_preference || "No Preference"}
        </span>
      </td>
      <td style={tdStyle} onClick={() => onSelect(booking)}>
        <StatusBadge status={booking.status} />
      </td>
      <td style={tdStyle} onClick={() => onSelect(booking)}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
          {fmt(booking.created_at)}
        </span>
      </td>
      <td style={{ ...tdStyle, width: "80px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => onSelect(booking)}
            style={actionBtn("#60a5fa")}
            title="View / Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(booking.id)}
            style={actionBtn("#ef4444")}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const tdStyle = {
  padding: "16px 20px",
  verticalAlign: "middle",
};

const actionBtn = (color) => ({
  padding: "7px",
  background: `${color}12`,
  border: `1px solid ${color}25`,
  borderRadius: "8px",
  color: color,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s",
});

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookRes, statsRes] = await Promise.all([
        api.get("/bookings/admin"),
        api.get("/bookings/admin/stats"),
      ]);
      setBookings(bookRes.data.bookings || []);
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to load bookings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = (updated) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    if (selected?.id === updated.id) setSelected(updated);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.delete(`/bookings/admin/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      alert("Failed to delete booking.");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_phone.includes(search);
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
        {/* ── PAGE HEADER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "48px",
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
                marginBottom: "10px",
              }}
            >
              <Phone size={16} color="var(--primary-from)" />
              <span
                style={{
                  color: "var(--primary-from)",
                  fontWeight: "800",
                  letterSpacing: "3px",
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                }}
              >
                Admin · Booking Desk
              </span>
            </div>
            <h1
              className="gradient-text"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: "900",
                lineHeight: 1,
                margin: 0,
              }}
            >
              Inquiries &amp; <br />
              Bookings.
            </h1>
          </motion.div>

          <motion.button
            onClick={fetchData}
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "12px 22px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            <RefreshCw
              size={15}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
            {loading ? "Refreshing…" : "Refresh"}
          </motion.button>
        </div>

        {/* ── ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: "30px",
                padding: "16px 24px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#fca5a5",
              }}
            >
              <AlertCircle size={18} />
              <span style={{ fontSize: "0.9rem", flex: 1 }}>{error}</span>
              <button
                onClick={fetchData}
                style={{
                  padding: "6px 14px",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
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
        </AnimatePresence>

        {/* ── STATS ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <StatCard
            label="Total Inquiries"
            value={stats?.total}
            color="#60a5fa"
            icon={BarChart3}
          />
          <StatCard
            label="New"
            value={stats?.new}
            color={STATUS_CONFIG.New.color}
            icon={Clock}
          />
          <StatCard
            label="In Progress"
            value={stats?.in_progress}
            color={STATUS_CONFIG["In Progress"].color}
            icon={Loader}
          />
          <StatCard
            label="Completed"
            value={stats?.completed}
            color={STATUS_CONFIG.Completed.color}
            icon={CheckCircle}
          />
        </div>

        {/* ── FILTERS ── */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            marginBottom: "28px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div
            style={{
              flex: 1,
              minWidth: "220px",
              position: "relative",
            }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.3)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone…"
              style={{
                width: "100%",
                padding: "12px 16px 12px 40px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Filter size={14} color="rgba(255,255,255,0.3)" />
            {["All", ...ALL_STATUSES].map((s) => {
              const cfg = s !== "All" ? STATUS_CONFIG[s] : null;
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "20px",
                    border: `1px solid ${active ? cfg?.color || "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)"}`,
                    background: active
                      ? cfg
                        ? cfg.bg
                        : "rgba(255,255,255,0.08)"
                      : "transparent",
                    color: active
                      ? cfg?.color || "#fff"
                      : "rgba(255,255,255,0.4)",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <Loader
              size={32}
              style={{
                animation: "spin 1s linear infinite",
                marginBottom: "16px",
              }}
            />
            <p style={{ margin: 0, fontSize: "0.9rem" }}>Loading bookings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "80px 40px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "24px",
            }}
          >
            <FileText
              size={40}
              color="rgba(255,255,255,0.15)"
              style={{ marginBottom: "16px" }}
            />
            <h3
              style={{
                color: "rgba(255,255,255,0.4)",
                fontWeight: "700",
                marginBottom: "8px",
                fontSize: "1.1rem",
              }}
            >
              No bookings found
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.85rem",
                margin: 0,
              }}
            >
              {search || statusFilter !== "All"
                ? "Try adjusting your filters"
                : "Booking inquiries will appear here once submitted"}
            </p>
          </motion.div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[
                      "Customer",
                      "Phone",
                      "Preference",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          color: "rgba(255,255,255,0.3)",
                          fontSize: "0.72rem",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          letterSpacing: "1.5px",
                          background: "rgba(255,255,255,0.01)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        onSelect={setSelected}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.8rem",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span>
                Showing{" "}
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>
                  {filtered.length}
                </strong>{" "}
                of{" "}
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>
                  {bookings.length}
                </strong>{" "}
                inquiries
              </span>
              {statusFilter !== "All" && (
                <button
                  onClick={() => setStatusFilter("All")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary-from)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                  }}
                >
                  Clear filter ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {selected && (
          <BookingModal
            booking={selected}
            onClose={() => setSelected(null)}
            onUpdate={handleUpdate}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default ManageBookings;
