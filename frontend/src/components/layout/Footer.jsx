import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Heart } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile(768);

  return (
    <footer
      style={{
        background:
          "linear-gradient(180deg, rgba(5, 8, 7, 0.8) 0%, rgba(5, 8, 7, 0.95) 100%)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: isMobile ? "36px 0 24px" : "80px 0 40px",
        marginTop: isMobile ? "48px" : "100px",
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: isMobile ? "28px 20px" : "48px",
            marginBottom: isMobile ? "28px" : "60px",
          }}
        >
          {/* About Column */}
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <h3
              className="gradient-text"
              style={{
                fontSize: isMobile ? "1.35rem" : "1.75rem",
                fontWeight: "bold",
                marginBottom: isMobile ? "12px" : "20px",
              }}
            >
              K9 GSD KENNEL
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: isMobile ? "16px" : "24px",
                fontSize: isMobile ? "0.9rem" : "0.95rem",
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
                fontSize: isMobile ? "1.05rem" : "1.2rem",
                fontWeight: "bold",
                marginBottom: isMobile ? "14px" : "24px",
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
                    marginBottom: isMobile ? "8px" : "12px",
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
                fontSize: isMobile ? "1.05rem" : "1.2rem",
                fontWeight: "bold",
                marginBottom: isMobile ? "14px" : "24px",
              }}
            >
              Contact Us
            </h4>
            <div style={{ color: "var(--text-muted)", fontSize: isMobile ? "0.9rem" : "0.95rem", minWidth: 0 }}>
              <p style={{ marginBottom: isMobile ? "8px" : "12px", overflowWrap: "anywhere" }}>Ranchi, Jharkhand</p>
              <p style={{ marginBottom: isMobile ? "8px" : "12px", overflowWrap: "anywhere" }}>
                <a
                  href="tel:+916201024665"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  +91 6201024665
                </a>
              </p>
              <p style={{ marginBottom: isMobile ? "8px" : "12px", overflowWrap: "anywhere" }}>
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
            paddingTop: isMobile ? "20px" : "32px",
            display: "flex",
            justifyContent: isMobile ? "center" : "space-between",
            textAlign: isMobile ? "center" : "left",
            alignItems: "center",
            flexWrap: "wrap",
            gap: isMobile ? "8px" : "16px",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              margin: 0,
            }}
          >
            © {currentYear} K9 GSD Kennel Ranchi. All Rights Reserved.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: isMobile ? "0.8rem" : "0.9rem",
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
