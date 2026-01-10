import { useState } from 'react';
import './Sidebar.css';
// 1. Import real Google icons
import { 
  MdHomeFilled, 
  MdStorage, 
  MdPeople, 
  MdAccessTime, 
  MdStarBorder, 
  MdDeleteOutline, 
  MdCloudQueue,
  MdAdd 
} from "react-icons/md";
import { FaGoogleDrive } from "react-icons/fa"; // Drive Logo

const Sidebar = ({ toggleTheme, isDarkMode }) => {
  
  const menuItems = [
    { name: 'Home', icon: <MdHomeFilled /> },
    { name: 'My Drive', icon: <MdStorage /> }, 
    { name: 'Shared with me', icon: <MdPeople /> },
    { name: 'Recent', icon: <MdAccessTime /> },
    { name: 'Starred', icon: <MdStarBorder /> },
    { name: 'Trash', icon: <MdDeleteOutline /> },

  ];

  const [activeItem, setActiveItem] = useState('My Drive');

  return (
    <div className="sidebar-container">
      
      {/* Logo Section */}
      <div className="sidebar-logo">
        <span className="logo-icon" style={{ fontSize: '28px', marginTop: '5px' }}>
          <FaGoogleDrive />
        </span>
        <span className="logo-text" style={{ marginTop: '10px' }}>TheDrive</span>
      </div>

      <div className="new-button-container">
        <button className="new-button">
          <MdAdd className="plus-icon" />
          <span>New</span>
        </button>
      </div>

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

      {/* Theme Toggle */}
      <div style={{ marginTop: "auto", padding: "20px" }}>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle"
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;