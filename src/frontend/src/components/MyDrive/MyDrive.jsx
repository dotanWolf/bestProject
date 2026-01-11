import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileActionMenu from "../FileActionMenu/FileActionMenu"; // Adjust path as needed

const MyDrive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchFiles = async () => {
    if (!token || !userId) return;
    try {
      const response = await fetch('http://localhost:8080/api/files', {
        headers: { 'userid': userId, 'token': token } // Correct headers
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(Array.isArray(data) ? data : []);
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
  }, [navigate]);

  if (loading) return <div style={{color:'white', padding:'40px'}}>Loading...</div>;

  return (
    <div style={{ padding: "40px", color: 'var(--text-color)' }}>
      <h1>My Drive Content</h1>
      <div className="files-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
        {files.map(file => (
          <div key={file.id} style={{ 
            padding: '15px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between', // Pushes menu to the right
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{file.type === 'folder' ? '📁' : '📄'}</span>
              <span>{file.name}</span>
            </div>

            {/* THE 3 DOTS MENU */}
            <FileActionMenu file={file} refreshFiles={fetchFiles} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDrive;