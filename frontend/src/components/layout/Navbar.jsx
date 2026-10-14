import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Heart,
  Award,
  Info,
  Camera,
  Phone,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Button from "../common/Button";
import { useIsMobile } from "../../hooks/useMediaQuery";
import logoImg from "../../assets/IMG_2353.PNG";

const Navbar = ({ isAdmin, onLogout }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile(768);
  const navHeight = isMobile ? 68 : 80;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer on navigation, and when switching to desktop layout
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, isMobile]);

  // Prevent the page behind the drawer from scrolling
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const publicNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/puppies", icon: Heart, label: "Puppies" },
    { path: "/our-dogs", icon: Award, label: "Our Dogs" },
    { path: "/about", icon: Info, label: "About" },
    { path: "/gallery", icon: Camera, label: "Gallery" },
    { path: "/contact", icon: Phone, label: "Contact" },
  ];

  const adminNavItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/puppies", icon: Heart, label: "Puppies" },
    { path: "/admin/dogs", icon: Award, label: "Dogs" },
    { path: "/admin/gallery", icon: Camera, label: "Gallery" },
    { path: "/admin/bookings", icon: Phone, label: "Bookings" },
  ];

  const navItems = isAdmin ? adminNavItems : publicNavItems;
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            background:
              scrollY > 50 ? "rgba(5, 8, 7, 0.9)" : "rgba(5, 8, 7, 0.7)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: scrollY > 50 ? "0 8px 32px rgba(0, 0, 0, 0.5)" : "none",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: `${navHeight}px`,
              }}
            >
              {/* Logo Section */}
              <Link to="/" style={{ textDecoration: "none" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      position: "relative",
                      width: isMobile ? "46px" : "63px",
                      height: isMobile ? "46px" : "63px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(15, 23, 42, 0.5)",
                      padding: "4px",
                      borderRadius: "50%",
                      border: "1px solid rgba(245, 158, 11, 0.3)", // Amber/Gold border
                      boxShadow: "0 8px 32px rgba(16, 185, 129, 0.2)", // Emerald glow
                      overflow: "hidden", // Keeps the scaled image inside the circle
                    }}
                  >
                    <img
                      src={logoImg}
                      alt="K9 GSD Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Ensures the image fills the circle perfectly
                        transform: "scale(1.25)", // Your requested zoom level
                        filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.2))",
                      }}
                      onError={(e) => {
                        // Fallback if the image path is wrong
                        e.target.style.display = "none";
                        e.target.parentNode.innerText = "K9";
                      }}
                    />
                  </motion.div>

                  <div>
                    <h1
                      style={{
                        fontFamily: "var(--font-brand)",
                        fontSize: isMobile ? "1.3rem" : "1.7rem",
                        fontWeight: "900",
                        margin: 0,
                        letterSpacing: "2px",
                        background:
                          "linear-gradient(to bottom, #F3D06A 0%, #9C7045 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      K9 GSD
                    </h1>
                    <p
                      style={{
                        fontSize: isMobile ? "0.6rem" : "0.75rem",
                        color: "#94a3b8",
                        margin: 0,
                        fontWeight: "700",
                        letterSpacing: isMobile ? "1px" : "2px",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {isAdmin ? "ADMIN PANEL" : "PREMIUM KENNEL • RANCHI"}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div
                style={{
                  display: isMobile ? "none" : "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{ textDecoration: "none" }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 20px",
                        background: isActive(item.path)
                          ? "rgba(16, 185, 129, 0.15)"
                          : "transparent",
                        border: isActive(item.path)
                          ? "1px solid rgba(16, 185, 129, 0.3)"
                          : "1px solid transparent",
                        borderRadius: "12px",
                        color: isActive(item.path)
                          ? "#10b981"
                          : "var(--text-secondary)",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </motion.button>
                  </Link>
                ))}

                {isAdmin ? (
                  <Button
                    variant="glass"
                    size="sm"
                    icon={LogOut}
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="glass" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: isMobile ? "flex" : "none",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  padding: "10px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  color: "#10b981",
                  cursor: "pointer",
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              position: "fixed",
              top: navHeight,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "400px",
              background: "rgba(5, 8, 7, 0.95)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
              zIndex: 999,
              padding: "24px 16px calc(24px + env(safe-area-inset-bottom))",
              overflowY: "auto",
              overscrollBehavior: "contain",
            }}
          >
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px 20px",
                    marginBottom: "10px",
                    background: isActive(item.path)
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)"
                      : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isActive(item.path) ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.05)"}`,
                    borderRadius: "16px",
                    color: isActive(item.path)
                      ? "#10b981"
                      : "var(--text-primary)",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                  }}
                >
                  <item.icon size={24} />
                  {item.label}
                </motion.div>
              </Link>
            ))}

            {isAdmin ? (
              <Button
                variant="primary"
                fullWidth
                icon={LogOut}
                style={{ marginTop: "24px" }}
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="primary"
                  fullWidth
                  style={{ marginTop: "24px" }}
                >
                  Admin Login
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
