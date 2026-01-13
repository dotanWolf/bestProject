import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
// Added FaHome to imports
import { FaPlus, FaClock, FaStar, FaTrash, FaHome } from "react-icons/fa"; 
import { IoMdPeople } from "react-icons/io";
import { MdDevices } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation(); 
  
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar-container">
      
      <div className="new-button-container">
        <Link to="/create" style={{ textDecoration: 'none' }}>
          <button className="new-button">
            <FaPlus className="plus" />
            <span>New</span>
          </button>
        </Link>
      </div>

      <div className="sidebar-menu">
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/home') || isActive('/')}`}>
            <span className="icon"><FaHome /></span>
            <span>Home</span>
          </div>
        </Link>

        <Link to="/my-drive" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/my-drive')}`}>
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
        <Link to="/shared-with-me" style={{ textDecoration: 'none' }}>
          <div className={`menu-item ${isActive('/shared-with-me')}`}>
            <span className="icon"><IoMdPeople /></span>
            <span>Shared with me</span>
          </div>
        </Link>
        
      </div>
    </div>
  );
};

export default Sidebar;