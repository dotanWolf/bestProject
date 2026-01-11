import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileActions } from '../../hooks/useFileActions';

const FileActionMenu = ({ file, refreshFiles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { moveToTrash, deleteFile, toggleStar } = useFileActions(refreshFiles);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent opening the file when clicking the menu
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 3 Dots Button */}
      <button 
        onClick={toggleMenu}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0 10px'
        }}
      >
        &#8942;
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          backgroundColor: '#333',
          border: '1px solid #555',
          borderRadius: '5px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          minWidth: '120px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          {/* Edit / Update */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/update/${file.id}`); }}
            style={menuItemStyle}
          >
            ✏️ Edit
          </button>

          {/* Star */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleStar(file); setIsOpen(false); }}
            style={menuItemStyle}
          >
            ⭐ Star
          </button>

          {/* Move to Trash */}
          <button 
            onClick={(e) => { e.stopPropagation(); moveToTrash(file); setIsOpen(false); }}
            style={{ ...menuItemStyle, color: '#ff6b6b' }}
          >
            🗑️ Trash
          </button>
        </div>
      )}
      
      {/* Invisible overlay to close menu when clicking outside */}
      {isOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} 
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
        />
      )}
    </div>
  );
};

const menuItemStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  padding: '10px',
  textAlign: 'left',
  cursor: 'pointer',
  borderBottom: '1px solid #444'
};

export default FileActionMenu;