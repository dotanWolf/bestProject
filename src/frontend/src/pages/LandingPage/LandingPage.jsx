import React from "react";
import { Link } from "react-router-dom";
import { FaGoogleDrive } from "react-icons/fa";

function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#181818", // Dark background
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Logo Section */}
      <div style={{ marginBottom: "40px" }}>
        <FaGoogleDrive size={80} color="#FFC107" />
        <h1 style={{ fontSize: "3rem", margin: "20px 0", fontWeight: "bold" }}>
          Google Drive Clone
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#aaa", maxWidth: "500px" }}>
          Store, access, and share your files in one secure place.
        </p>
      </div>

      {/* Buttons Section */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              borderRadius: "30px",
              border: "2px solid #4285F4",
              backgroundColor: "transparent",
              color: "#4285F4",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(66, 133, 244, 0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Login
          </button>
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#4285F4",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;