import React, { useState, useEffect } from "react";

const Recents = () => {
  const [RecentsFiles, setRecentsFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // 1. Fetch Recents Files
  const fetchRecentsFiles = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log("Fetching recents files for user:", userId);
    try {
      // FIX: Point to the specific recents endpoint
      const response = await fetch(`http://localhost:8080/api/files/recent`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const recentsFiles = await response.json();
        //console.log("Recents Files fetched:", recentsFiles);
        // Backend now handles filtering, so we just set state
        setRecentsFiles(recentsFiles);
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentsFiles();
  }, []);

  if (isLoading) return <div className="trash-page-container">Loading...</div>;

  if (RecentsFiles.length === 0) {
    return (
      <div className="trash-page-container">
        <div className="trash-empty-wrapper">
          <div className="trash-empty-state">
            <h2 className="trash-heading">Recents is empty</h2>
            <p className="trash-subtext"> No files yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="trash-page-container"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      <div className="trash-header">
        <h2 className="trash-heading" style={{ color: "var(--text-primary)" }}>
          Recents ({RecentsFiles.length})
        </h2>
      </div>

      <div className="trash-list">
        {RecentsFiles.map((file) => (
          <div
            key={file.id}
            className="trash-item"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="trash-item-info"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="trash-icon">
                {file.type === "folder" ? "📁" : "📄"}
              </span>
              <span className="trash-name">{file.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;
