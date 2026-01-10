import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaClock, FaStar, FaTrash, FaCloud, FaGoogleDrive } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { MdDevices } from "react-icons/md";


const Sidebar = ({ toggleTheme, isDarkMode }) => {
  const location = useLocation(); 

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar-container">
      
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="sidebar-logo">
          <span className="logo-icon">
            <FaGoogleDrive />
          </span>
          <span className="logo-text">Drive</span>
        </div>
      </Link>

      <div className="new-button-container">
        <button className="new-button">
          <FaPlus className="plus" />
          <span>New</span>
        </button>
      </div>

      <div className="sidebar-menu">
        
        <Link to="/my-drive" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/my-drive') || isActive('/')}`}>
            <span className="icon"><MdDevices /></span>
            <span>My Drive</span>
          </div>
        </Link>

        <Link to="/shared" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/shared')}`}>
            <span className="icon"><IoMdPeople /></span>
            <span>Shared with me</span>
          </div>
        </Link>

        <Link to="/recent" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/recent')}`}>
            <span className="icon"><FaClock /></span>
            <span>Recent</span>
          </div>
        </Link>

        <Link to="/starred" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/starred')}`}>
            <span className="icon"><FaStar /></span>
            <span>Starred</span>
          </div>
        </Link>

        <Link to="/trash" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/trash')}`}>
            <span className="icon"><FaTrash /></span>
            <span>Trash</span>
          </div>
        </Link>

        <Link to="/storage" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/storage')}`}>
            <span className="icon"><FaCloud /></span>
            <span>Storage</span>
          </div>
        </Link>

      </div>

      <div className="bottom-container">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

    </div>
  );
};

export default Sidebar;