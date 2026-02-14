import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, rgba(5, 8, 7, 0.8) 0%, rgba(5, 8, 7, 0.95) 100%)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "80px 0 40px",
        marginTop: "100px",
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "48px",
            marginBottom: "60px",
          }}
        >
          {/* About Column */}
          <div>
            <h3
              className="gradient-text"
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              K9 GSD KENNEL
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: "24px",
                fontSize: "0.95rem",
              }}
            >
              Providing Ranchi with the finest German Shepherd bloodlines since
              2020. Our dogs are our family.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -4 }}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={20} color="#10b981" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              Quick Links
            </h4>
            {["Home", "Puppies", "Our Dogs", "About", "Gallery", "Contact"].map(
              (link, i) => (
                <Link
                  key={i}
                  to={`/${link.toLowerCase().replace(" ", "-")}`}
                  style={{
                    display: "block",
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    fontSize: "0.95rem",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#10b981";
                    e.target.style.paddingLeft = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--text-muted)";
                    e.target.style.paddingLeft = "0";
                  }}
                >
                  {link}
                </Link>
              ),
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              Contact Us
            </h4>
            <div style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              <p style={{ marginBottom: "12px" }}>Ranchi, Jharkhand</p>
              <p style={{ marginBottom: "12px" }}>
                <a
                  href="tel:+916201024665"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  +91 6201024665
                </a>
              </p>
              <p style={{ marginBottom: "12px" }}>
                <a
                  href="mailto:ranbeersinghcauhan@gmail.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  ranbeersinghcauhan@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            © {currentYear} K9 GSD Kennel Ranchi. All Rights Reserved.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Made with <Heart size={16} fill="#10b981" color="#10b981" /> for
            German Shepherd lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
