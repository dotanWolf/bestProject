import "./PermissionPopUp.css";
import { useState, useEffect } from "react";

function PermissionPopUp({ file, handleClose }) {
  const [permissions, setPermissions] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [currentUserRole, setCurrentUserRole] = useState("viewer");

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const fetchPermissions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/files/${file.id}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);

        const myPerm = data.find((p) => p.userId === currentUserId);
        if (myPerm) setCurrentUserRole(myPerm.role);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [file.id]);

  const isOwner = currentUserRole === "owner" || file.ownerId === currentUserId;

  const handleAddPermission = async () => {
    if (!isOwner) return alert("Security: Only the owner can invite new users");
    if (!email) return;

    try {
      const emailRes = await fetch(
        `http://localhost:8080/api/users/email/${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!emailRes.ok) return alert("User not found.");

      const userData = await emailRes.json();

      const response = await fetch(
        `http://localhost:8080/api/files/${file.id}/permissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userData.userId,
            role: selectedRole,
            email: email,
          }),
        }
      );

      if (response.ok) {
        setEmail("");
        fetchPermissions();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error("Logic error:", error);
    }
  };

  const handleUpdateRole = async (permId, newRole) => {
    if (!isOwner) return;

    const isRemove = newRole === "remove";
    const method = isRemove ? "DELETE" : "PATCH";
    const url = `http://localhost:8080/api/files/${file.id}/permissions/${permId}`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userid: currentUserId,
        },
        body: !isRemove ? JSON.stringify({ role: newRole }) : null,
      });

      if (response.ok) {
        fetchPermissions();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Server rejected: ${errData.error || response.status}`);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Share "{file.name}"</h2>
          <button className="header-close-x" onClick={handleClose}>
            &times;
          </button>
        </header>

        {isOwner ? (
          <div className="share-box">
            <div className="input-group-pill">
              <input
                type="email"
                className="modern-input"
                placeholder="Add people by email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className="role-select-minimal"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <button
              className="btn-primary-google"
              onClick={handleAddPermission}
            >
              Share
            </button>
          </div>
        ) : (
          <div className="readonly-banner">
            <span>You have <strong>{currentUserRole}</strong> access</span>
          </div>
        )}

        {isOwner && (
          <div className="access-section">
            <h3>People with access</h3>
            <div className="scroll-container">
              {permissions.map((perm) => (
                <div key={perm.id} className="user-row-modern">
                  <div className="user-avatar">
                    {perm.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <span className="user-email-text">
                      {perm.userEmail || perm.email} {perm.userId === currentUserId && "(You)"}
                    </span>
                    <span className="user-role-sub">{perm.role}</span>
                  </div>

                  <select
                    className="role-dropdown-simple"
                    value={perm.role}
                    disabled={perm.role === "owner"}
                    onChange={(e) => handleUpdateRole(perm.id, e.target.value)}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    {perm.role === "owner" && (
                      <option value="owner">Owner</option>
                    )}
                    {perm.role !== "owner" && (
                      <option value="remove" className="remove-opt">
                        Remove access
                      </option>
                    )}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isOwner && (
           <div style={{display:'flex', justifyContent:'flex-end', marginTop:'20px'}}>
              <button className="btn-primary-google" onClick={handleClose} style={{marginBottom:0}}>Done</button>
           </div>
        )}

      </div>
    </div>
  );
}

export default PermissionPopUp;