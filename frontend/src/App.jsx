import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import "./index.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App component mounted"); // Debug log
    checkAdminAuth();
  }, []);

  // Log whenever isAdmin changes
  useEffect(() => {
    console.log("isAdmin state changed:", isAdmin);
  }, [isAdmin]);

  const checkAdminAuth = () => {
    console.log("Checking admin authentication..."); // Debug log

    // Check if admin token exists in localStorage
    const token = localStorage.getItem("admin_token");
    console.log("Token from localStorage:", token); // Debug log

    if (token) {
      console.log("Valid token found, setting isAdmin to true"); // Debug log
      setIsAdmin(true);
    } else {
      console.log("No token found, user is not admin"); // Debug log
    }

    setLoading(false);
  };

  const handleLogin = (token) => {
    console.log("handleLogin called with token:", token); // Debug log

    // Store token in localStorage
    localStorage.setItem("admin_token", token);
    console.log("Token stored in localStorage"); // Debug log

    // Update admin state
    setIsAdmin(true);
    console.log("isAdmin set to true"); // Debug log
  };

  const handleLogout = () => {
    console.log("handleLogout called"); // Debug log

    // Clear token from localStorage
    localStorage.removeItem("admin_token");
    console.log("Token removed from localStorage"); // Debug log

    // Update admin state
    setIsAdmin(false);
    console.log("isAdmin set to false"); // Debug log
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  console.log("Rendering App with isAdmin:", isAdmin); // Debug log

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-primary)",
        }}
      >
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <main style={{ flex: 1 }}>
          <AppRoutes isAdmin={isAdmin} onLogin={handleLogin} />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
