import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  CreditCard,
  Truck,
  Zap,
} from "lucide-react";
import BookingForm from "../components/common/BookingForm";

const Contact = () => {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  const handleBookingSuccess = () => {
    // You could replace this with a more elegant modal later
    console.log("Booking successful");
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Direct Line",
      value: "+91 6201024665",
      link: "tel:+916201024665",
      color: "var(--primary-from)",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Elite Support",
      link: "https://wa.me/916201024665",
      color: "#25D366",
    },
    {
      icon: Mail,
      label: "Official Email",
      value: "Inquire Now",
      link: "mailto:ranbeersinghcauhan@gmail.com",
      color: "var(--secondary-from)",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Ranchi, Jharkhand",
      link: null,
      color: "var(--primary-from)",
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
        {/* --- HEADER SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
        >
          <motion.div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              background: "rgba(16, 185, 129, 0.05)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "100px",
              marginBottom: "20px",
            }}
          >
            <Zap size={14} color="var(--primary-from)" />
            <span
              style={{
                color: "var(--primary-from)",
                fontWeight: "800",
                letterSpacing: "2px",
                fontSize: "0.75rem",
                textTransform: "uppercase",
              }}
            >
              Available 24/7
            </span>
          </motion.div>
          <h1
            className="gradient-text"
            style={{
              fontSize: isMobile ? "3.5rem" : "5.5rem",
              fontWeight: "900",
              lineHeight: 1,
              marginBottom: "24px",
            }}
          >
            Get In Touch.
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Connect with Ranchi's most trusted German Shepherd kennel.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
            gap: "60px",
            alignItems: "start",
          }}
        >
          {/* --- CONTACT INFO PORTALS --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, border: `1px solid ${item.color}55` }}
                  className="glass-card"
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    cursor: item.link ? "pointer" : "default",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onClick={() => item.link && window.open(item.link, "_blank")}
                >
                  {/* Soft Background Glow */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at center, ${item.color}08 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />

                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${item.color}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      boxShadow: `0 0 20px ${item.color}15`,
                    }}
                  >
                    <item.icon size={28} color={item.color} />
                  </div>
                  <h4
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.7rem",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginBottom: "8px",
                    }}
                  >
                    {item.label}
                  </h4>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                    }}
                  >
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* --- VIP BOOKING FLOW CARD --- */}
            <motion.div
              className="glass-card"
              style={{
                padding: "40px",
                background:
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)",
                border: "1px solid rgba(16, 185, 129, 0.15)",
                borderRadius: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "32px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: "rgba(245, 158, 11, 0.1)",
                    borderRadius: "12px",
                  }}
                >
                  <CreditCard size={24} color="var(--secondary-from)" />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    margin: 0,
                  }}
                >
                  Elite Booking Flow
                </h3>
              </div>

              <div style={{ display: "grid", gap: "24px" }}>
                {[
                  "Consultation & Lineage Selection",
                  "Health & Pedigree Verification",
                  "Secure Reservation (UPI / Bank Transfer)",
                  "Handover & Lifetime Support",
                ].map((step, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "900",
                        color: "var(--primary-from)",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: "1px solid var(--primary-from)",
                        display: "flex",
                        alignItems: "center",
                        justifyCenter: "center",
                        flexShrink: 0,
                        textAlign: "center",
                        paddingLeft: "8px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "1rem",
                        fontWeight: "500",
                      }}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "32px",
                  padding: "18px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <Truck size={22} color="var(--secondary-from)" />
                <span style={{ color: "#fff", fontWeight: "700" }}>
                  Pan-India Delivery Available
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* --- CONTACT FORM SECTION --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
            style={{
              padding: isMobile ? "30px" : "60px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "40px",
            }}
          >
            <div style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  color: "#fff",
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  marginBottom: "12px",
                }}
              >
                Direct Inquiry
              </h2>
              <p style={{ color: "var(--text-muted)" }}>
                Fill out the form below for a priority response.
              </p>
            </div>
            <BookingForm onSuccess={handleBookingSuccess} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
