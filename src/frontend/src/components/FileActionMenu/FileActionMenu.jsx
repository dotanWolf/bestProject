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

  const token = localStorage.getItem("token");
  const userRole = file.role ? file.role.toLowerCase() : "";
  const currentUserId = localStorage.getItem("userId");
  const isOwner = file.ownerId === currentUserId || userRole === "owner";
  const isEditor = userRole === "editor";
  const canEdit = isOwner || isEditor;
  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle the primary action (Open or Edit)
  const handleOpen = () => {
    if (file.type === "folder") {
      onNavigate(file); // Call the function passed from MainPage
    } else {
      navigate(`/update/${file._id}`); // Navigate to Edit page
    }
    setIsOpen(false);
  };

  const handleDelete = async () => {
    const actionName = isOwner ? "Move to Trash" : "Remove Access";
    if (!window.confirm(`Are you sure you want to ${actionName}?`)) return;

    const trashFolderRecursively = async (folderId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/files/folders/${folderId}`, {
          headers: { authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const children = await response.json();
          
          for (const child of children) {
            if (child.type === 'folder') {
              // CHANGE: child.id -> child._id
              await trashFolderRecursively(child._id);
            }
            
            // CHANGE: child.id -> child._id
            await fetch(`http://localhost:8080/api/files/${child._id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
                "userid": currentUserId
              },
              body: JSON.stringify({ isTrashed: true }) 
            });
          }
        }
      } catch (err) {
        console.error("Error cleaning up folder contents:", err);
      }
    };

    try {
      if (file.type === 'folder' && isOwner) {
         await trashFolderRecursively(file._id);
      }

      const url = isOwner 
        ? `http://localhost:8080/api/files/${file._id}` 
        : `http://localhost:8080/api/files/${file._id}/permissions/${file.permissionId}`;

      await fetch(url, {
        method: isOwner ? "PATCH" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
          "userid": currentUserId 
        },
        body: isOwner ? JSON.stringify({ isTrashed: true }) : null
      });

      refreshFiles(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleStarred = async () => {
    const isOwnerAction = file.ownerId === currentUserId;
    
    // If owner, update the file. If shared user, update THEIR permission record.
    const url = isOwnerAction 
      ? `http://localhost:8080/api/files/${file._id}` 
      : `http://localhost:8080/api/files/${file._id}/permissions/${file.permissionId}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
          "userid": currentUserId // Required by your controllers
        },
        body: JSON.stringify({ isStarred: !file.isStarred }),
      });

      if (response.ok) {
        refreshFiles();
      } else {
        const err = await response.json();
        console.error("Star failed:", err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async () => {
    if (!canEdit) return alert("You don't have permission to rename this file.");
    
    const newName = window.prompt("Enter new name:", file.name);
    if (!newName || newName === file.name) return;

    try {
      // CHANGE: file._id -> file._id
      await fetch(`http://localhost:8080/api/files/${file._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          "userid": currentUserId 
        },
        body: JSON.stringify({ name: newName }),
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
    // CHANGE: folder.id -> folder._id
    const parentId = folder ? folder._id : null 
    try {
      const response = await fetch(
        `http://localhost:8080/api/files/${file._id}`,
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
            {file.type === "folder" 
                ? "📂 Open" 
                : canEdit 
                  ? "✏️ Edit" 
                  : "👁️ View"}
          </button>
          <button onClick={handleRename} className="menu-item-action" disabled={!canEdit}>
            📛 Rename {!canEdit && "(Locked)"}
          </button>
          <button onClick={handleStarred} className="menu-item-action">
            {file.isStarred ? "❌ Unstar" : "⭐ Star"}
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
            {/* If owner, say Trash. If shared user, say Remove Access */}
            {isOwner ? "🗑️ Trash" : "🚫 Remove Access"}
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
            fileToMove={file}
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