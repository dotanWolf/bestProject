import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilesList from "../FilesList/FilesList";

const SharedItems = () => {
  const rootFolder = {
    name: "root",
    parentId: null,
  };
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState(null); // Track folder depth
  const [folder, setFolder] = useState(rootFolder);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    if (!token) return;
    const url = currentFolderId
      ? `http://localhost:8080/api/files/permissions/folders/${currentFolderId}`
      : `http://localhost:8080/api/files/permissions`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const activeFiles = Array.isArray(data)
          ? data.filter((f) => !f.isTrashed)
          : [];
        setFiles(activeFiles);
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentFolder = async () => {
    if (currentFolderId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/files/${currentFolderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
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
    fetchFiles();
    fetchCurrentFolder();
  }, [navigate, currentFolderId]); // Re-fetch when folder changes

  const handleDoubleClick = (file) => {
    if (file.type === "folder") {
      setLoading(true);
      setCurrentFolderId(file.id); // Go inside folder
    } else {
      navigate(`/update/${file.id}`);
    }
  };

  const handleBackClick = async () => {
    if (!folder.parentId) {
      setFolder(rootFolder)
      setCurrentFolderId(null)
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/api/files/${folder.parentId}`,
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
          setCurrentFolderId(data.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
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
        {currentFolderId && (
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
          {currentFolderId ? "Folder View" : "My Drive Content"}
        </h1>
      </div>

      <FilesList files = {files} handleDoubleClick={handleDoubleClick} fetchFiles={fetchFiles} show={true}/>
    </div>
  );
};

export default SharedItems;