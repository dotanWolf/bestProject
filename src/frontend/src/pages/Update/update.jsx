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

  useEffect(() => {
    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/files/${id}`, {
          method: 'GET',
          headers: {
            'id': '1',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
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
        headers: {
          'Content-Type': 'application/json',
          'id': '1'
        },
        body: JSON.stringify({
          name: file.name,
          location: file.location,
          type: file.type,
          content: content
        })
      });

      if (response.ok) {
        alert("Saved successfully!");
        navigate(-1);
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
    return <div className="loading">Loading file...</div>;
  }

  if (!file) {
    return <div className="loading">File not found</div>;
  }

 return (
  <div className="update-canvas">
    <div className="update-header">
      <div className="file-info-pill">
        <h1>{file.name}</h1>
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
        />
        </div>
    </div>
    );
}
export default Update;