import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyDrive = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // 1. Validation: Ensure user is logged in
    if (!token || !userId || userId === "undefined") {
      navigate("/login");
      return;
    }

    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/files', {
          method: 'GET',
          headers: { 
            // 2. Standardized Headers (Lowercase to match Controller)
            'userid': userId, 
            'token': token 
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFiles(Array.isArray(data) ? data : []);
        } else {
          const errorData = await response.json();
          console.error("Fetch failed:", errorData.error);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [navigate]);

  if (loading) return <div style={{color: 'white', padding: '40px'}}>Loading Drive...</div>;

  return (
    <div style={{ padding: "40px", color: 'var(--text-color)' }}>
      <h1>My Drive Content</h1>
      {files.length === 0 ? (
        <p style={{ color: '#aaa', marginTop: '20px' }}>
          No files found. Try creating a new folder or uploading a file!
        </p>
      ) : (
        <div className="files-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '15px', 
          marginTop: '20px' 
        }}>
          {files.map(file => (
            <div key={file.id} style={{ 
              padding: '15px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>
                {file.type === 'folder' ? '📁' : '📄'}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDrive;