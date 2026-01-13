import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // Import this at the top
import "./FileActionMenu.css";
import PermissionPopUp from "../PermissionPopUp/PermissionPopUp";
import FoldersPopUp from "../FoldersPopUp/FoldersPopUp";
const FileActionMenu = ({ file, refreshFiles, onNavigate, show }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle the primary action (Open or Edit)
  const handleOpen = () => {
    if (file.type === "folder") {
      onNavigate(file); // Call the function passed from MainPage
    } else {
      navigate(`/update/${file.id}`); // Navigate to Edit page
    }
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Move to trash?")) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:8080/api/files/${file.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isTrashed: true }),
      });
      refreshFiles(); // Refresh list after delete
    } catch (err) {
      console.error(err);
    }
  };
  const handleStarred = async () => {
    if (!window.confirm("Move to Starred?")) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:8080/api/files/${file.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isStarred: true }),
      });
      refreshFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPermissions = () => {
    setIsOpen(false);
    setIsPermissionsOpen(true);
  };

  const handleOpenFolders = () => {
    setIsOpen(false);
    setIsFoldersOpen(true);
  };

  const handleMove = async (folder) => {
    const token = localStorage.getItem("token");
    const parentId = folder ? folder.id : null
    try {
      const response = await fetch(
        `http://localhost:8080/api/files/${file.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ parentId: parentId }),
        }
      );

      if (response.ok) {
        refreshFiles();
      } else {
        const error = response.json();
        console.error(error.error);
      }
    } catch (error) {}
  };

  if (!show) return;
  return (
    <div className="menu-container">
      <button onClick={toggleMenu} className="menu-trigger">
        ⋮
      </button>

      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={handleOpen} className="menu-item-action">
            {file.type === "folder" ? "📂 Open" : "✏️ Edit"}
          </button>
          <button onClick={handleStarred} className="menu-item-action">
            ⭐ Star
          </button>
          <button onClick={handleOpenPermissions} className="menu-item-action">
            👥 Permissions
          </button>
          <button onClick={handleOpenFolders} className="menu-item-action">
            Move
          </button>
          <button
            onClick={handleDelete}
            className="menu-item-action"
            style={{ color: "#d93025" }}
          >
            🗑️ Trash
          </button>
        </div>
      )}

      {isPermissionsOpen &&
        createPortal(
          <PermissionPopUp
            file={file}
            handleClose={() => setIsPermissionsOpen(false)}
          />,
          document.body
        )}

      {isFoldersOpen &&
        createPortal(
          <FoldersPopUp
            handleDoubleClick={handleMove}
            handleClose={() => setIsFoldersOpen(false)}
          />,
          document.body
        )}
    </div>
  );
};

// Simple inline style helper for menu items
const menuItemStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 12px",
  background: "none",
  border: "none",
  color: "var(--text-primary)",
  cursor: "pointer",
  fontSize: "14px",
};

export default FileActionMenu;
