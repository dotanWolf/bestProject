import { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ toggleTheme, isDarkMode }) => { 
  
  const menuItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'My Drive', icon: '💿' },
    { name: 'Shared with me', icon: '👥' },
    { name: 'Recent', icon: '🕒' },
    { name: 'Starred', icon: '⭐' },
    { name: 'Trash', icon: '🗑️' },
    { name: 'Storage', icon: '☁️' },
  ];

  const [activeItem, setActiveItem] = useState('My Drive');

  return (
    <div className="sidebar-container">
      
      {/* 1. The Drive Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">📐</span>
        <span className="logo-text">TheDrive</span>
      </div>

      {/* 2. The Big "New" Button */}
      <div className="new-button-container">
        <button className="new-button">
          <span className="plus">+</span>
          <span>New</span>
        </button>
      </div>

      {/* 3. The Menu List */}
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => setActiveItem(item.name)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </div>
        ))}
      </div>

      {/* 4. The Theme Toggle Button */}
      <div style={{ marginTop: "auto", padding: "20px" }}>
        <button 
          onClick={toggleTheme} 
          style={{ 
            background: "none", 
            border: "1px solid var(--text-color)", 
            color: "var(--text-color)", 
            padding: "5px 10px", 
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;