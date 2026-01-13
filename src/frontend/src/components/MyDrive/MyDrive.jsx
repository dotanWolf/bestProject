import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import FileActionMenu from "../FileActionMenu/FileActionMenu";
import FilesList from "../FilesList/FilesList";

const MyDrive = ({ setFolderIdInMainPage }) => {
  const rootFolder = {
    name: "root",
    parentId: null,
  };
  
  // 2. Read the folder ID from the URL instead of local state
  const { parentId } = useParams(); 
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState(rootFolder);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 3. Update parent component whenever URL changes
  useEffect(() => {
    setFolderIdInMainPage(parentId || null);
  }, [parentId, setFolderIdInMainPage]);

  const fetchFiles = async () => {
    if (!token) return;
    
    // Use parentId from URL
    const url = parentId
      ? `http://localhost:8080/api/files/folders/${parentId}`
      : `http://localhost:8080/api/files`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const activeFiles = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed)
          : [];
        setFiles(activeFiles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentFolder = async () => {
    // Use parentId from URL
    if (parentId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/files/${parentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFolder(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setFolder(rootFolder);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFiles();
    fetchCurrentFolder();
  }, [parentId]); // 4. Re-run whenever the URL changes

  const handleDoubleClick = (file) => {
    if (file.type === "folder") {
      setLoading(true);
      // 5. Navigate to the URL instead of setting local state
      navigate(`/my-drive/${file.id}`);
    } else {
      navigate(`/update/${file.id}`);
    }
  };

  const handleBackClick = () => {
    // Navigate to the parent folder or root
    if (folder.parentId) {
      navigate(`/my-drive/${folder.parentId}`);
    } else {
      navigate(`/my-drive`);
    }
  };

  const onNavigate = (folder) => {
    navigate(`/my-drive/${folder.id}`);
  };

  if (loading)
    return (
      <div style={{ color: "var(--text-primary)", padding: "40px" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "var(--bg-main)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {parentId && (
          <>
            <button
              onClick={handleBackClick}
              style={{
                background: "none",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                cursor: "pointer",
                borderRadius: "4px",
                padding: "5px 10px",
              }}
            >
              ← Back
            </button>
            <h1 style={{ color: "var(--text-primary)" }}>{folder.name}</h1>
          </>
        )}
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "500",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {parentId ? "" : "My Drive Content"}
        </h1>
      </div>

      <FilesList
        files={files}
        handleDoubleClick={handleDoubleClick}
        fetchFiles={fetchFiles}
        onNavigate={onNavigate}
        show={true}
      />
    </div>
  );
};

export default MyDrive;