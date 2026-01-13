import "./PermissionPopUp.css";
import { useState, useEffect } from "react";
import Permission from "../Permission/Permission";
function PermissionPopUp({ file, handleClose }) {
  const [permissions, setPermissions] = useState([]);
  const [email, setEmail] = useState("");

  const handleAddPermission = async () => {
    if (!email) return;
    var userId = null;
    try {
      const emailRes = await fetch(
        `http://localhost:8080/api/users/email/${email}`
      );
      if (emailRes.ok) {
        const userData = await emailRes.json();
        userId = userData.userId; // Now userData is the actual object
        try {
          const response = await fetch(
            `http://localhost:8080/api/files/${file.id}/permissions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                userId: userId,
                role: "viewer",
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
        } catch (err) {
          console.error(err);
        }
      } else {
        const error = await emailRes.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPermissions = async () => {
    const token = localStorage.getItem("token");

    console.log(token);
    try {
      const response = await fetch(
        `http://localhost:8080/api/files/${file.id}/permissions`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
        console.log(permissions); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="modal-overlay" onDoubleClick={(e) => e.stopPropagation()}>
      <div
        className="modal-content"
        onDoubleClick={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="modal-header">Share "{file.name}"</h1>
        <div className="share-input">
          <div className="share-input-group">
            <input
              type="email"
              className="share-input"
              placeholder="Add people by email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleAddPermission} className="btn-done">
              Done
            </button>
          </div>
        </div>
        <h2>People With Access</h2>

        <div className="user-list">
          {permissions.map((p, index) => (
            <Permission key={index} permission={p} />
          ))}
        </div>

        <button onClick={handleClose} className="btn-close">
          Close
        </button>
      </div>
    </div>
  );
}

export default PermissionPopUp;
