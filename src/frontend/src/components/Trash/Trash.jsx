import React, { useState, useEffect } from 'react';
import './Trash.css';

const Trash = () => {
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Trashed Files
  const fetchTrashedFiles = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      // FIX: Point to the specific trash endpoint
      const response = await fetch(`http://localhost:8080/api/files/trash`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'userid': userId,
            'token': token
        }
      });

      if (response.ok) {
        const trashFiles = await response.json();
        console.log("Trash Files fetched:", trashFiles);
        // Backend now handles filtering, so we just set state
        setTrashedFiles(trashFiles);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Restore File Logic
  const handleRestore = async (file) => {
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
  };

  // 3. Delete Forever Logic
  const handleDeleteForever = async (file) => {
    if (!window.confirm(`Permanently delete "${file.name}"?`)) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/files/${file.id}`, {
        method: 'DELETE',
        headers: {
          'userid': userId,
          'token': token
        }
      });

      if (response.ok || response.status === 204) {
        fetchTrashedFiles();
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  useEffect(() => {
    fetchTrashedFiles();
  }, []);

  if (isLoading) return <div className="trash-page-container">Loading...</div>;

  if (trashedFiles.length === 0) {
    return (
      <div className="trash-page-container">
        <div className="trash-empty-state">
          <h2 className="trash-heading">Trash is empty</h2>
          <p className="trash-subtext">Items moved to the trash will be permanently deleted after 30 days.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trash-page-container">
      <div className="trash-header">
        <h2 className="trash-heading">Trash ({trashedFiles.length})</h2>
        <button className="btn-empty-trash" onClick={() => alert("Implement Empty Trash All feature here!")}>Empty Trash</button>
      </div>
      
      <div className="trash-list">
        {trashedFiles.map((file) => (
          <div key={file.id} className="trash-item">
            <div className="trash-item-info">
              <span className="trash-icon">
                {file.type === 'folder' ? '📁' : '📄'} 
              </span>
              <span className="trash-name">{file.name}</span>
            </div>
            
            <div className="trash-actions">
              <button className="btn-action restore" onClick={() => handleRestore(file)} title="Restore">
                 ♻️
              </button>
              <button className="btn-action delete" onClick={() => handleDeleteForever(file)} title="Delete Forever">
                 🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trash;