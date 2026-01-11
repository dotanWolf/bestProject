import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Update.css';

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to ensure consistent headers across all requests
  const getHeaders = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    return {
      'Content-Type': 'application/json',
      'userid': userId, // Standardized key matching your Controller
      'token': token    // Standardized key matching your Controller
    };
  };

  useEffect(() => {
    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/files/${id}`, {
          method: 'GET',
          headers: getHeaders() // Use dynamic headers
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
             alert("Session expired. Please login.");
             navigate("/login");
             return;
          }
          alert("Could not fetch file");
          navigate(-1);
          return;
        }

        const data = await response.json();
        setFile(data);
        setContent(data.content || "");
      } catch (error) {
        console.error("Error:", error);
        alert("Error loading file");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [id, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8080/api/files/${id}`, {
        method: 'PATCH',
        headers: getHeaders(), // Use dynamic headers
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          content: content,
          // Only send necessary fields to avoid overwriting logic on backend
          isTrashed: file.isTrashed 
        })
      });

      if (response.ok) {
        alert("Saved successfully!");
        navigate(-1); // Go back to the previous page (My Drive)
      } else {
        const error = await response.json();
        alert(`Save failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="loading" style={{color: 'white', padding: '20px'}}>Loading file...</div>;
  }

  if (!file) {
    return <div className="loading" style={{color: 'white', padding: '20px'}}>File not found</div>;
  }

  return (
    <div className="update-canvas">
      <div className="update-header">
        <div className="file-info-pill">
          <h1>Editing: {file.name}</h1>
        </div>
        <div className="actions">
          <button onClick={() => navigate(-1)} disabled={isSaving} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="save-btn">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="editor-wrapper">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="editor"
          placeholder="Start writing..."
          autoFocus
          style={{
             width: '100%',
             height: 'calc(100vh - 150px)',
             padding: '20px',
             backgroundColor: '#1e1e1e', 
             color: '#d4d4d4',
             border: 'none',
             outline: 'none',
             fontSize: '16px',
             resize: 'none'
          }}
        />
      </div>
    </div>
  );
}

export default Update;