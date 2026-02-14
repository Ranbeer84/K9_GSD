import React from "react";
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

const Home = () => {
  const navigate = useNavigate();
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* --- HERO SECTION --- */}
      <section
        style={{
          position: "relative",
          height: isMobile ? "auto" : "100vh",
          minHeight: "800px",
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
            filter: "brightness(0.25) contrast(1.1)",
            zIndex: 0,
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
                fontSize: "clamp(3rem, 10vw, 6.5rem)",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
