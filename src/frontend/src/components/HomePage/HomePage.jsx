import React, { useEffect, useState } from "react";
import FilesList from "../FilesList/FilesList"; 
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const refreshFiles = async () => {
    try {
      const [ownedResponse, sharedResponse] = await Promise.all([
        fetch("http://localhost:8080/api/files", { 
          headers: { authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:8080/api/files/permissions", { 
          headers: { authorization: `Bearer ${token}` }
        })
      ]);

      if (ownedResponse.ok && sharedResponse.ok) {
        const ownedData = await ownedResponse.json();
        const sharedData = await sharedResponse.json();

        const allFiles = [...ownedData, ...sharedData].filter(f => !f.isTrashed);

        allFiles.sort((a, b) => {
           if (a.type === b.type) return a.name.localeCompare(b.name);
           return a.type === 'folder' ? -1 : 1;
        });

        setFiles(allFiles);
      }
    } catch (error) {
      console.error("Error fetching home files:", error);
    }
  };

  useEffect(() => {
    refreshFiles();
  }, []);

  const handleNavigate = (file) => {
    
    if (file.type !== 'folder') {
      navigate(`/update/${file.id}`);
      return;
    }

    const isOwner = file.ownerId === currentUserId || file.role === "owner";

    if (isOwner) {
      navigate(`/my-drive/${file.id}`);
    } else {
      navigate(`/shared-with-me/${file.id}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "var(--text-primary)", marginBottom: "20px" }}>Home</h2>
      <FilesList
        files={files}
        handleDoubleClick={handleNavigate} 
        fetchFiles={refreshFiles}
        onNavigate={handleNavigate}      
        show={true}
      />
    </div>
  );
};

export default HomePage;