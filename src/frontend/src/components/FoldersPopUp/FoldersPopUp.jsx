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
        <FilesList files={folders} handleDoubleClick={handleDoubleClick} show={false} />
      </div>
    </div>
  );
}

export default FoldersPopUp;
