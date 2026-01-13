import FilesList from "../FilesList/FilesList";
import "./FoldersPopUp.css";
import { useState, useEffect } from "react";

function FoldersPopUp({ handleClose, handleDoubleClick }) {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const fetchFolders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/files/folders`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure standard "Authorization" key
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const activeFiles = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed)
          : [];
        setFolders(activeFiles);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          onDoubleClick={() => handleDoubleClick(null)}
          style={{
            padding: "12px 20px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "6px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            transition: "background 0.2s",
            userSelect: "none",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-card)")
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "1.2rem" }}>
              { "📁" }
            </span>
            <span style={{ fontSize: "1rem" }}>root</span>
          </div>
        </div>
        <FilesList
          files={folders}
          handleDoubleClick={handleDoubleClick}
          show={false}
        />
      </div>
    </div>
  );
}

export default FoldersPopUp;
