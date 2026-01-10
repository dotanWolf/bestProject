import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaClock, FaStar, FaTrash, FaCloud } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { MdDevices } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation(); 
  
  // Helper to check active route
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar-container">
      
      {/* New Button -> Navigates to Create Page */}
      <div className="new-button-container">
        <Link to="/create" style={{ textDecoration: 'none' }}>
          <button className="new-button">
            <FaPlus className="plus" />
            <span>New</span>
          </button>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu">
        <Link to="/my-drive" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/my-drive') || isActive('/')}`}>
            <span className="icon"><MdDevices /></span>
            <span>My Drive</span>
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
    </div>
  );
};

export default Sidebar;