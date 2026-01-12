import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileActionMenu from "../FileActionMenu/FileActionMenu";

const MyDrive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState(null); // Track folder depth
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchFiles = async () => {
    if (!token || !userId) return;
    try {
      // Logic: If in a folder, fetch sub-files, otherwise fetch root
      const url = currentFolderId 
        ? `http://localhost:8080/api/files/folder/${currentFolderId}`
        : 'http://localhost:8080/api/files';
        
      const response = await fetch(url, {
        headers: { 'userid': userId, 'token': token }
      });
      if (response.ok) {
        const data = await response.json();
        const activeFiles = Array.isArray(data) ? data.filter(f => !f.isTrashed) : [];
        setFiles(activeFiles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !userId) { navigate("/login"); return; }
    fetchFiles();
  }, [navigate, currentFolderId]); // Re-fetch when folder changes

  const handleDoubleClick = (file) => {
    if (file.type === 'folder') {
      setLoading(true);
      setCurrentFolderId(file.id); // Go inside folder
    } else {
      navigate(`/update/${file.id}`);
    }
  };

  if (loading) return <div style={{color:'var(--text-primary)', padding:'40px'}}>Loading...</div>;

  return (
    <div style={{ padding: "40px", backgroundColor: "var(--bg-main)", minHeight: "100vh" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         {currentFolderId && (
           <button 
             onClick={() => setCurrentFolderId(null)} 
             style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '4px', padding: '5px 10px' }}
           >
             ← Back
           </button>
         )}
         <h1 style={{ fontSize: '1.8rem', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>
           {currentFolderId ? "Folder View" : "My Drive Content"}
         </h1>
      </div>

      <div className="files-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {files.map(file => (
          <div 
            key={file.id} 
            onDoubleClick={() => handleDoubleClick(file)}
            style={{ 
              padding: '12px 20px', 
              backgroundColor: 'var(--bg-card)', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
              transition: 'background 0.2s',
              userSelect: 'none',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '1.2rem' }}>
                {file.type === 'folder' ? '📁' : '📄'}
              </span>
              <span style={{ fontSize: '1rem' }}>{file.name}</span>
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <FileActionMenu file={file} refreshFiles={fetchFiles} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDrive;