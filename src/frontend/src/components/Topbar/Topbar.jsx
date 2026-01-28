import "./Topbar.css";
import { Link, useNavigate } from "react-router-dom";
import {
  IoSearch,
  IoOptionsOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoApps,
  IoMoon,
  IoSunny,
} from "react-icons/io5";
import { FaGoogleDrive } from "react-icons/fa";
import { useState } from "react";

function TopBar({ isDarkMode, toggleTheme, user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      navigate("/search");
    } else {
      navigate(`/search/${value}`);
    }
  };

  return (
    <div className="topbar">
      {/* Left: Logo (Clicking goes Home) */}
      <Link
        to="/my-drive"
        className="topbar-left"
        style={{ textDecoration: "none" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--text-color)",
            fontSize: "22px",
          }}
        >
          <span style={{ fontSize: "28px", display: "flex", color: "#FFC107" }}>
            <FaGoogleDrive />
          </span>
          <span style={{ fontFamily: "sans-serif", paddingTop: "4px" }}>
            Drive
          </span>
        </div>
      </Link>

      {/* Center: Search Bar */}
      <div className="topbar-center">
        <div className="search-container">
          <IoSearch size={20} className="icon-btn" style={{ padding: 0 }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search in Drive"
            value={query}
            onChange={handleSearch}
          />
          <IoOptionsOutline
            size={20}
            className="icon-btn"
            style={{ padding: 0 }}
          />
        </div>
      </div>

      {/* Right: Icons & User Profile */}
      <div className="topbar-right">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <IoSunny size={24} /> : <IoMoon size={24} />}
        </button>
        <button className="icon-btn" title="Support">
          <IoHelpCircleOutline size={24} />
        </button>
        <button className="icon-btn" title="Settings">
          <IoSettingsOutline size={24} />
        </button>
        <button className="icon-btn" title="Google Apps">
          <IoApps size={24} />
        </button>

        {/* User Profile Logic */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "10px",
            gap: "15px",
          }}
        >
          {user ? (
            <div className="profile-container" style={{ position: "relative" }}>
              <img
                src={`data:image/jpeg;base64,${user.profileImage}`}
                alt="Profile"
                onClick={() => setShowMenu(!showMenu)} // Toggle the menu
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border: "2px solid var(--border-color)",
                }}
              />

              {/* The Popup Window */}
              {showMenu && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <img
                      src={`data:image/jpeg;base64,${user.profileImage}`}
                      alt="Large Profile"
                      className="large-avatar"
                    />
                    <div className="user-info">
                      <p className="user-name">{user.username}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", fontSize: "14px" }}>
              <Link
                to="/signup"
                title="Sign Up"
                style={{
                  color: "var(--text-color)",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                title="Login"
                style={{
                  color: "var(--text-color)",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
