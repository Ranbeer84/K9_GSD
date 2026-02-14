import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import Puppies from "../pages/Puppies";
import OurDogs from "../pages/OurDogs";
import About from "../pages/About";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";

// Admin Pages
import AdminLogin from "../admin/AdminLogin";
import Dashboard from "../admin/Dashboard";
import ManagePuppies from "../admin/ManagePuppies";
import ManageDogs from "../admin/ManageDogs";
import ManageGallery from "../admin/ManageGallery";

const AppRoutes = ({ isAdmin, onLogin }) => {
  console.log("AppRoutes - isAdmin:", isAdmin);

  return (
    <Routes>
      {/* ===================================
          PUBLIC ROUTES
          =================================== */}
      <Route path="/" element={<Home />} />
      <Route path="/puppies" element={<Puppies isAdmin={false} />} />
      <Route path="/our-dogs" element={<OurDogs />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />

      {/* ===================================
          ADMIN LOGIN ROUTES
          =================================== */}

      {/* Primary login route: /login */}
      <Route
        path="/login"
        element={
          isAdmin ? (
            <Navigate to="/admin" replace />
          ) : (
            <AdminLogin onLogin={onLogin} />
          )
        }
      />

      {/* Alternative login route: /admin/login (redirects to /login) */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* ===================================
          ADMIN ROUTES (Protected)
          =================================== */}

      {/* Main Dashboard */}
      <Route
        path="/admin"
        element={isAdmin ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/admin/dashboard"
        element={isAdmin ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/admin/puppies"
        element={isAdmin ? <ManagePuppies /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/admin/dogs"
        element={isAdmin ? <ManageDogs /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/admin/gallery"
        element={isAdmin ? <ManageGallery /> : <Navigate to="/login" replace />}
      />

      {/* Manage Bookings Placeholder */}
      <Route
        path="/admin/bookings"
        element={
          isAdmin ? (
            <div style={{ padding: "120px 20px", textAlign: "center" }}>
              <h1 style={{ color: "var(--text-primary)" }}>
                Bookings Management
              </h1>
              <p style={{ color: "var(--text-secondary)" }}>Coming Soon</p>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ===================================
          404 NOT FOUND
          =================================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// 404 Page Component
const NotFound = () => (
  <div
    style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
    }}
  >
    <h1 className="gradient-text" style={{ fontSize: "6rem", margin: 0 }}>
      404
    </h1>
    <p
      style={{
        fontSize: "1.5rem",
        color: "var(--text-secondary)",
        marginTop: "20px",
        marginBottom: "10px",
      }}
    >
      Page not found
    </p>
    <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
      The page you're looking for doesn't exist.
    </p>
    <a
      href="/"
      style={{
        padding: "14px 32px",
        background: "var(--primary-from)",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "12px",
        fontWeight: "bold",
      }}
    >
      Go Home
    </a>
  </div>
);

export default AppRoutes;
