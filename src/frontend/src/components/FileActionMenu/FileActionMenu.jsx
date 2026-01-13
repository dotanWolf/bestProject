import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom"; // Import this at the top
import "./FileActionMenu.css";
import PermissionPopUp from "../PermissionPopUp/PermissionPopUp";

const FileActionMenu = ({ file, refreshFiles, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
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
          userid: userId,
          token: token,
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
          userid: userId,
          token: token,
        },
        body: JSON.stringify({ isStarred: true }),
      });
      refreshFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPermissions = () => {
    setIsOpen(false)
    setIsPermissionsOpen(true)
  }

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
        createPortal(<PermissionPopUp file= {file} handleClose = {() => setIsPermissionsOpen(false)}/>,document.body
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
