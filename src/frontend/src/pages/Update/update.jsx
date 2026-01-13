import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Update.css";

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [fileType, setFileType] = useState("unknown"); // 'text', 'image', 'pdf'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Helper: Detect file type by extension
  const getFileType = (filename) => {
    if (!filename) return "unknown";
    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "text"; // Default everything else to text editor
  };

  useEffect(() => {
    const fetchFile = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:8080/api/files/${id}`, {
          headers: {
            authorization: `Bearer ${token}`, // Use Capital A and standard Bearer casing
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch file");

        const data = await response.json();
        setFile(data);
        setContent(data.content || "");
        setFileType(getFileType(data.name));
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
    if (fileType !== "text") {
      alert("You can only edit text files.");
      return;
    }

    setIsSaving(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/files/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`, // Use Capital A and standard Bearer casing
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          content: content,
          isTrashed: file.isTrashed,
        }),
      });

      if (response.ok) {
        alert("Saved successfully!");
        navigate(-1);
      } else {
        const error = await response.json();
        alert(`Save failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDER HELPERS ---

  const renderContent = () => {
    // 1. IMAGE PREVIEW
    if (fileType === "image") {
      let imgSrc = content;

      // Smart Fix: If content exists but is missing the "data:" prefix, add it.
      // This happens if you saved raw base64 without the header.
      if (
        content &&
        !content.startsWith("data:") &&
        !content.startsWith("http")
      ) {
        // We guess PNG, but browsers usually auto-detect correctly from the bytes anyway
        imgSrc = `data:image/png;base64,${content}`;
      }

      return (
        <div className="preview-container">
          {content && content.length > 50 ? (
            <img
              src={imgSrc}
              alt="Preview"
              className="preview-image"
              onError={(e) => {
                // Fallback if the image data is total garbage
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : (
            // Show this if content is empty or too short to be a real image
            <div
              className="no-preview"
              style={{ color: "white", textAlign: "center", marginTop: "50px" }}
            >
              <h3 style={{ color: "#ff6b6b" }}>Image Corrupted</h3>
              <p>This file is empty or broken.</p>
              <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
                Try deleting and re-uploading it.
              </p>
            </div>
          )}
          {/* Hidden fallback div for onError */}
          <div
            className="no-preview"
            style={{
              display: "none",
              color: "white",
              textAlign: "center",
              marginTop: "50px",
            }}
          >
            <h3 style={{ color: "#ff6b6b" }}>Invalid Image Data</h3>
            <p>Browser cannot display this file.</p>
          </div>
        </div>
      );
    }

    // 2. PDF PREVIEW
    if (fileType === "pdf") {
      return (
        <div className="preview-container">
          <iframe src={content} title="PDF Preview" className="preview-frame" />
        </div>
      );
    }

    // 3. TEXT EDITOR (Default)
    return (
      <div className="editor-wrapper">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="editor"
          spellCheck="false"
          placeholder="Start typing..."
        />
      </div>
    );
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!file) return <div className="loading">File not found</div>;

  return (
    <div className="update-canvas">
      <div className="update-header">
        <div className="file-info-pill">
          <h1>
            {fileType === "image" ? "🖼️ " : fileType === "pdf" ? "📄 " : "📝 "}
            {file.name}
          </h1>
        </div>
        <div className="actions">
          <button onClick={() => navigate(-1)} className="cancel-btn">
            {fileType === "text" ? "Cancel" : "Back"}
          </button>

          {/* Only show Save button for Text files */}
          {fileType === "text" && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="save-btn"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

export default Update;
