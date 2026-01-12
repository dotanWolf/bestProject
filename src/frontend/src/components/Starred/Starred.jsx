import React, { useState, useEffect } from 'react';

const Starred = () => {
  const [starredFiles, setStarredFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // 1. Fetch Starred Files
  const fetchStarredFiles = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log("Fetching starred files for user:", userId);
    try {
      // FIX: Point to the specific starred endpoint
      const response = await fetch(`http://localhost:8080/api/files/starred`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'userid': userId,
            'token': token
        }
      });

      if (response.ok) {
        const starredFiles = await response.json();
        //console.log("Starred Files fetched:", starredFiles);
        // Backend now handles filtering, so we just set state
        setStarredFiles(starredFiles);
        
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Unstar File Logic
  /*const unStarred = async (file) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/files/${file.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId,
          'token': token
        },
        body: JSON.stringify({ isTrashed: false }) 
      });

      if (response.ok) {
        fetchTrashedFiles(); // Refresh list
      } else {
        alert("Failed to restore file");
      }
    } catch (error) {
      console.error("Error restoring file:", error);
    }
  };*/

  useEffect(() => {
    fetchStarredFiles();
  }, []);

  if (isLoading) return <div className="trash-page-container">Loading...</div>;

  if (starredFiles.length === 0) {
    return (
      <div className="trash-page-container">
        <div className="trash-empty-wrapper"> 
          <div className="trash-empty-state">
            <h2 className="trash-heading">Starred is empty</h2>
            <p className="trash-subtext"> No starred files yet.⭐</p>
          </div>
        </div>
      </div>
    );
  }

 return (
    <div className="trash-page-container" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="trash-header">
        <h2 className="trash-heading" style={{ color: "var(--text-primary)" }}>
            Starred ({starredFiles.length})
        </h2>
      </div>
      
      <div className="trash-list">
        {starredFiles.map((file) => (
          <div key={file.id} className="trash-item" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <div className="trash-item-info" style={{ color: "var(--text-primary)" }}>
              <span className="trash-icon">{file.type === 'folder' ? '📁' : '📄'}</span>
              <span className="trash-name">{file.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Starred;