import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Button from "../components/common/Button";
import { authAPI } from "../api/api";

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await authAPI.login(formData.username, formData.password);
      localStorage.setItem("admin_token", data.token);
      onLogin(data.token);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Background Decorative Element */}
      <div className="bg-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-login-box glass-card"
      >
        <div className="login-header">
          <div className="lock-icon-wrapper">
            <ShieldCheck size={36} color="var(--primary-from)" />
          </div>
          <h1>
            Admin <span className="gradient-text">Portal</span>
          </h1>
          <p>K9 GSD Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Admin ID"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            fullWidth
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </Button>

          <div className="login-footer">
            <p className="security-note">
              <Lock size={12} /> Authorized Access Only
            </p>
          </div>
        </form>
      </motion.div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary); /* Dark background matching Home */
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .bg-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(16, 185, 129, 0.15) 0%,
            transparent 70%
          );
          z-index: 0;
        }

        .admin-login-box {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          padding: 3rem 2rem;
          border-radius: 32px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .lock-icon-wrapper {
          width: 72px;
          height: 72px;
          margin: 0 auto 1.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-header h1 {
          color: #fff;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          padding: 0.875rem;
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-from);
          background: rgba(16, 185, 129, 0.05);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
        }

        .login-footer {
          margin-top: 2rem;
          text-align: center;
        }

        .security-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 480px) {
          .admin-login-box {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
