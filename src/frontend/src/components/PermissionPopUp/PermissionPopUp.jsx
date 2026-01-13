import "./PermissionPopUp.css";
import { useState, useEffect } from "react";

function PermissionPopUp({ file, handleClose }) {
  const [permissions, setPermissions] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [currentUserRole, setCurrentUserRole] = useState("viewer");

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  /**
   * Fetch all permissions for the current file
   */
  const fetchPermissions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/files/${file.id}/permissions`, {
        headers: { 
          // Standardized header to avoid 403 Forbidden errors
          "Authorization": `Bearer ${token}` 
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);

        // Identify the role of the logged-in user to enable/disable UI features
        const myPerm = data.find(p => p.userId === currentUserId);
        if (myPerm) setCurrentUserRole(myPerm.role);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [file.id]);

  // Check if current user has 'owner' status
  const isOwner = currentUserRole === "owner" || file.ownerId === currentUserId;

  /**
   * Invite a new user to the file
   */
  const handleAddPermission = async () => {
    if (!isOwner) return alert("Security: Only the owner can invite new users");
    if (!email) return;

    try {
      // 1. Verify if the target user exists in the system
      const emailRes = await fetch(`http://localhost:8080/api/users/email/${email}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!emailRes.ok) return alert("User not found in database.");
      
      const userData = await emailRes.json();
      
      // 2. Create the permission record
      const response = await fetch(`http://localhost:8080/api/files/${file.id}/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData.userId,
          role: selectedRole, // Uses the value from the top dropdown
          email: email,
        }),
      });

      if (response.ok) {
        setEmail(""); // Reset input on success
        fetchPermissions(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error("Add permission logic error:", error);
    }
  };

  /**
   * Update an existing user's role or remove them
   */
  const handleUpdateRole = async (permId, newRole) => {
    if (!isOwner) return;
    
    // Determine the API method based on selection
    const method = newRole === "remove" ? "DELETE" : "PUT";
    const url = `http://localhost:8080/api/files/${file.id}/permissions/${permId}`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: method === "PUT" ? JSON.stringify({ role: newRole }) : null,
      });

      if (response.ok) {
        fetchPermissions();
      } else {
        alert("Server rejected the update. Check owner status.");
      }
    } catch (err) {
      console.error("Update/Delete error:", err);
    }
  };

 return (
    <div className="modal-overlay" onClick={handleClose}>
      {/* stopPropagation prevents closing the modal when clicking inside the content */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          Share "{file.name}"
        </header>

        {/* Top Section: Only shows interaction if user is Owner */}
        {isOwner ? (
          <div className="share-input-group">
            <input
              type="email"
              className="share-input"
              placeholder="Add people by email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select 
              className="role-select-inline" 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <button className="btn-done" onClick={handleAddPermission}>Share</button>
          </div>
        ) : (
          <p className="status-msg">View-only access to people list.</p>
        )}

        <h3 className="user-list-label">People with access</h3>

        <div className="user-list">
          {permissions.length > 0 ? (
            permissions.map((perm) => (
              <div key={perm.id} className="user-permission-row">
                <div className="user-info">
                  <span className="user-email">{perm.userEmail || perm.email}</span>
                  <span className="user-role-status">{perm.role}</span>
                </div>
                
                {/* Role dropdown: Disabled if viewer or if trying to modify the file owner */}
                <select 
                  className="role-select"
                  value={perm.role}
                  disabled={!isOwner || perm.role === 'owner'}
                  onChange={(e) => handleUpdateRole(perm.id, e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="owner">Owner</option>
                  {perm.role !== 'owner' && (
                    <option value="remove" style={{color: '#ea4335'}}>Remove access</option>
                  )}
                </select>
              </div>
            ))
          ) : (
            <p className="status-msg">Loading access list...</p>
          )}
        </div>

        <button className="btn-close" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

export default PermissionPopUp;