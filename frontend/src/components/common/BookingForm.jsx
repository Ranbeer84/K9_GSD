import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
  Dog,
} from "lucide-react";
import { bookingsAPI } from "../../api/api";
import Button from "./Button";

const BookingForm = ({ puppyId = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    puppy_gender_preference: "No Preference",
    message: "",
    puppy_id: puppyId,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookingsAPI.create(formData);
      setStatus({
        type: "success",
        message: "Inquiry sent successfully! We will contact you shortly.",
      });
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        puppy_gender_preference: "No Preference",
        message: "",
        puppy_id: puppyId,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err.response?.data?.error ||
          "Failed to send inquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="elite-booking-form">
      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`status-alert ${status.type}`}
          >
            {status.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="form-grid">
        <div className="input-group">
          <label>
            <User size={16} /> Full Name
          </label>
          <input
            type="text"
            name="customer_name"
            placeholder="John Doe"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>
            <Mail size={16} /> Email Address
          </label>
          <input
            type="email"
            name="customer_email"
            placeholder="john@example.com"
            value={formData.customer_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>
            <Phone size={16} /> Phone Number
          </label>
          <input
            type="tel"
            name="customer_phone"
            placeholder="+91 XXXXX XXXXX"
            value={formData.customer_phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>
            <Dog size={16} /> Gender Preference
          </label>
          <select
            name="puppy_gender_preference"
            value={formData.puppy_gender_preference}
            onChange={handleChange}
          >
            <option value="No Preference">No Preference</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="input-group full-width">
        <label>
          <MessageSquare size={16} /> Your Message
        </label>
        <textarea
          name="message"
          rows="4"
          placeholder="Tell us about the home you'll provide..."
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={loading}
        icon={Send}
      >
        {loading ? "Processing..." : "Submit Inquiry"}
      </Button>

      <style jsx>{`
        .elite-booking-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          border-color: var(--primary-from);
          background: rgba(16, 185, 129, 0.05);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .input-group select option {
          background: #111;
          color: #fff;
        }

        .status-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .status-alert.success {
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
};

export default BookingForm;
