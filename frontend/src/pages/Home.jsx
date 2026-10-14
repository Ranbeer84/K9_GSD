import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Shield,
  Award,
  Heart,
  MessageCircle,
  Star,
  CheckCircle,
  Zap,
} from "lucide-react";
import Button from "../components/common/Button";
import { testimonials } from "../data/testimonials";
import { useIsMobile } from "../hooks/useMediaQuery";
import { puppiesAPI } from "../api/api";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile(768);
  const [availableCount, setAvailableCount] = useState(null); // null = loading / unavailable
  const [portraitFailed, setPortraitFailed] = useState(false);

  // Live count for the hero badge. If the API fails the badge simply stays hidden.
  useEffect(() => {
    let cancelled = false;
    puppiesAPI
      .getAll({ status: "Available" })
      .then((data) => {
        if (!cancelled) setAvailableCount((data.puppies || []).length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const glassBadge = {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: isMobile ? "10px 14px" : "14px 20px",
    background: "rgba(8, 12, 10, 0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "18px",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.45)",
    zIndex: 3,
  };

  const badgeIcon = (color) => ({
    width: isMobile ? "34px" : "42px",
    height: isMobile ? "34px" : "42px",
    borderRadius: "12px",
    background: `${color}26`,
    border: `1px solid ${color}55`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* --- HERO SECTION --- */}
      <section
        style={{
          position: "relative",
          height: isMobile ? "auto" : "100vh",
          minHeight: isMobile ? "auto" : "800px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: isMobile ? "120px 0 80px" : "0",
        }}
      >
        {/* Background Layer */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/dogs/h3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.45) contrast(1.1)",
            zIndex: 0,
          }}
        />

        {/* Left-to-right fade: dark behind the text, photo opens up on the right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3,5,4,0.94) 0%, rgba(3,5,4,0.72) 45%, rgba(3,5,4,0.35) 100%)",
            zIndex: 1,
          }}
        />

        {/* Dynamic Glow Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
            zIndex: 1,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "minmax(0, 1fr)"
                : "minmax(0, 1.15fr) minmax(0, 0.85fr)",
              gap: isMobile ? "56px" : "64px",
              alignItems: "center",
            }}
          >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: "850px" }}
          >
            {/* Elite Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "100px",
                marginBottom: "32px",
              }}
            >
              <Zap size={16} color="var(--primary-from)" />
              <span
                style={{
                  color: "var(--primary-from)",
                  fontWeight: "800",
                  fontSize: "0.8rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Ranchi's Premier Kennel
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: isMobile
                  ? "clamp(3rem, 10vw, 6.5rem)"
                  : "clamp(3rem, 5.6vw, 6.25rem)",
                fontWeight: "900",
                lineHeight: 0.95,
                marginBottom: "32px",
                letterSpacing: "-4px",
                color: "#fff",
              }}
            >
              Unmatched <br />
              <span className="gradient-text">Lineage.</span> <br />
              Total{" "}
              <span style={{ color: "var(--secondary-from)" }}>Loyalty.</span>
            </h1>

            <p
              style={{
                fontSize: "1.25rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "48px",
                maxWidth: "600px",
              }}
            >
              Raising champion-grade German Shepherds in Ranchi since 2020.
              Certified health, professional training, and lifetime mentorship.
            </p>

            {/* CTA Group */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Button
                variant="primary"
                size="lg"
                icon={ChevronRight}
                onClick={() => navigate("/puppies")}
              >
                Explore Litters
              </Button>

              <Button
                variant="glass"
                size="lg"
                icon={MessageCircle}
                onClick={() =>
                  window.open("https://wa.me/916201024665", "_blank")
                }
              >
                Inquire via WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* --- HERO PORTRAIT --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? "320px" : "460px",
              justifySelf: isMobile ? "center" : "end",
            }}
          >
            {/* Emerald glow behind the frame */}
            <div
              style={{
                position: "absolute",
                inset: "-12%",
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.45) 0%, rgba(245,158,11,0.12) 45%, transparent 70%)",
                filter: "blur(50px)",
                zIndex: 0,
              }}
            />

            {/* Offset outline for depth */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "translate(16px, 16px)",
                borderRadius: isMobile
                  ? "160px 160px 24px 24px"
                  : "230px 230px 32px 32px",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                zIndex: 1,
              }}
            />

            {/* Arched photo frame (gently floating) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "relative",
                height: isMobile ? "400px" : "min(640px, 72vh)",
                borderRadius: isMobile
                  ? "160px 160px 24px 24px"
                  : "230px 230px 32px 32px",
                overflow: "hidden",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.18)",
                background:
                  "linear-gradient(160deg, rgba(16,185,129,0.15), rgba(8,12,10,1))",
                zIndex: 2,
              }}
            >
              {portraitFailed ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield size={72} color="rgba(16,185,129,0.5)" />
                </div>
              ) : (
                <img
                  src="/dogs/Main.jpg"
                  alt="German Shepherd from K9 GSD Kennel"
                  onError={() => setPortraitFailed(true)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
              )}
              {/* Soft fade at the bottom so the frame blends into the page */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, transparent 65%, rgba(3,5,4,0.55) 100%)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>

            {/* Floating badge: live available puppies */}
            {availableCount !== null && (
              <motion.div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/puppies")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/puppies")}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
                transition={{
                  opacity: { delay: 0.9 },
                  x: { delay: 0.9 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.04 }}
                style={{
                  ...glassBadge,
                  top: isMobile ? "10%" : "12%",
                  left: isMobile ? "-8px" : "-48px",
                  cursor: "pointer",
                }}
              >
                <div style={badgeIcon("#10b981")}>
                  <Heart size={isMobile ? 16 : 20} color="#10b981" />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: isMobile ? "0.95rem" : "1.1rem",
                      lineHeight: 1.1,
                    }}
                  >
                    {availableCount > 0
                      ? `${availableCount} ${availableCount === 1 ? "Puppy" : "Puppies"}`
                      : "New Litters"}
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#10b981",
                        display: "inline-block",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginTop: "4px",
                    }}
                  >
                    {availableCount > 0 ? "Available now" : "Coming soon"}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Floating badge: health certified */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
              transition={{
                opacity: { delay: 1.1 },
                x: { delay: 1.1 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                ...glassBadge,
                bottom: isMobile ? "8%" : "10%",
                right: isMobile ? "-8px" : "-40px",
              }}
            >
              <div style={badgeIcon("#f59e0b")}>
                <Shield size={isMobile ? 16 : 20} color="#f59e0b" />
              </div>
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: isMobile ? "0.95rem" : "1.1rem",
                    lineHeight: 1.1,
                  }}
                >
                  Health Certified
                </div>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginTop: "4px",
                  }}
                >
                  Pedigree verified
                </div>
              </div>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section
        style={{ padding: "120px 0", background: "var(--bg-secondary)" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "24px",
            }}
          >
            {[
              {
                icon: Award,
                title: "Elite Pedigree",
                desc: "KCI registered bloodlines with verified champion history.",
                color: "var(--primary-from)",
              },
              {
                icon: Shield,
                title: "Health Verified",
                desc: "Hip/Elbow scored and DNA tested parents for peace of mind.",
                color: "var(--secondary-from)",
              },
              {
                icon: Heart,
                title: "Socially Raised",
                desc: "Raised in a home environment with active early-life socialization.",
                color: "var(--primary-from)",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card"
                style={{ padding: "40px", borderTop: `4px solid ${f.color}` }}
              >
                <f.icon
                  size={40}
                  color={f.color}
                  style={{ marginBottom: "20px" }}
                />
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    fontWeight: "800",
                    marginBottom: "12px",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REASONS SECTION --- */}
      <section className="section-padding" style={{ position: "relative" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h2
              className="gradient-text"
              style={{ fontSize: "3.5rem", fontWeight: "900" }}
            >
              The K9 GSD Standard
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>
              Why serious owners choose our kennel over breeders.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))",
              gap: "32px",
            }}
          >
            {[
              {
                icon: CheckCircle,
                title: "Full Transparency",
                desc: "View pedigrees, health papers, and parents on site anytime.",
              },
              {
                icon: Star,
                title: "Show & Working Lines",
                desc: "Expertly matched genetics for both temperament and aesthetics.",
              },
              {
                icon: MessageCircle,
                title: "Lifetime Support",
                desc: "Free guidance on nutrition and training for the dog's entire life.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="glass-card"
                style={{
                  padding: "32px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <item.icon size={24} color="var(--primary-from)" />
                </div>
                <div>
                  <h4
                    style={{
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section
        style={{ padding: "100px 0", background: "rgba(16, 185, 129, 0.02)" }}
      >
        <div className="container">
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
            <div>
              <h2
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  color: "#fff",
                  margin: 0,
                }}
              >
                Happy Families
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                Verified reviews from across India.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate("/gallery")}
            >
              View Gallery
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "24px",
            }}
          >
            {testimonials.map((test, i) => (
              <motion.div
                key={test.id}
                className="glass-card"
                style={{ padding: "32px", borderRadius: "24px" }}
              >
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "20px" }}
                >
                  {[...Array(5)].map((_, starI) => (
                    <Star
                      key={starI}
                      size={16}
                      fill={
                        starI < test.rating
                          ? "var(--secondary-from)"
                          : "transparent"
                      }
                      color="var(--secondary-from)"
                    />
                  ))}
                </div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.05rem",
                    fontStyle: "italic",
                    marginBottom: "24px",
                    lineHeight: 1.7,
                  }}
                >
                  "{test.text}"
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <img
                    src={test.image}
                    alt={test.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ color: "#fff", fontWeight: "800", margin: 0 }}>
                      {test.name}
                    </p>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        margin: 0,
                      }}
                    >
                      {test.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="section-padding">
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: isMobile ? "40px" : "80px",
              textAlign: "center",
              borderRadius: "40px",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "2.5rem" : "4rem",
                fontWeight: "900",
                color: "#fff",
                marginBottom: "24px",
              }}
            >
              Begin Your Journey Today
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.2rem",
                maxWidth: "600px",
                margin: "0 auto 40px",
              }}
            >
              Contact us to discuss current litters, bloodlines, and delivery
              options to your city.
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.open("https://wa.me/916201024665")}
              >
                WhatsApp Inquiry
              </Button>
              <Button
                variant="glass"
                size="lg"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
