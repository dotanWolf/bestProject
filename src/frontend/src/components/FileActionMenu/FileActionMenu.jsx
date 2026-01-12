import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileActionMenu = ({ file, refreshFiles, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle the primary action (Open or Edit)
  const handleOpen = () => {
    if (file.type === 'folder') {
       onNavigate(file); // Call the function passed from MainPage
    } else {
       navigate(`/update/${file.id}`); // Navigate to Edit page
    }
    setIsOpen(false);
  };

  const handleDelete = async () => {
     if(!window.confirm("Move to trash?")) return;
     
     const userId = localStorage.getItem("userId");
     const token = localStorage.getItem("token");

     try {
       await fetch(`http://localhost:8080/api/files/${file.id}`, {
         method: 'PATCH',
         headers: { 
            'Content-Type': 'application/json',
            'userid': userId, 
            'token': token 
         },
         body: JSON.stringify({ isTrashed: true })
       });
       refreshFiles(); // Refresh list after delete
     } catch(err) {
       console.error(err);
     }
  };

  return (
    <div className="menu-container" style={{ position: 'relative' }}>
      <button 
        onClick={toggleMenu} 
        className="menu-trigger"
        style={{ 
           background: 'transparent', 
           border: 'none', 
           color: 'var(--text-secondary)', 
           fontSize: '1.2rem', 
           cursor: 'pointer' 
        }}
      >
        ⋮
      </button>
      
      {isOpen && (
        <div className="menu-dropdown" style={{
           position: 'absolute',
           right: 0,
           top: '30px',
           backgroundColor: 'var(--bg-card)',
           border: '1px solid var(--border-color)',
           borderRadius: '8px',
           padding: '5px',
           zIndex: 100,
           minWidth: '150px',
           boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          
          {/* 1. DYNAMIC OPEN BUTTON */}
          <button 
             onClick={handleOpen} 
             className="menu-item"
             style={menuItemStyle}
          >
             {file.type === 'folder' ? '📂 Open' : '✏️ Edit'}
          </button>

          {/* 2. STAR BUTTON (Placeholder) */}
          <button className="menu-item" style={menuItemStyle}>
             ⭐ Star
          </button>

          {/* 3. TRASH BUTTON */}
          <button 
             onClick={handleDelete} 
             className="menu-item" 
             style={{ ...menuItemStyle, color: '#d93025' }}
          >
             🗑️ Trash
          </button>
        </div>
      )}
    </div>
  );
};

// Simple inline style helper for menu items
const menuItemStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '8px 12px',
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontSize: '14px'
};

export default FileActionMenu;