import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../input/Input";

function Create() {
  const handleCreate = async (data, mode) => {
    const token = localStorage.getItem("token"); // Get JWT 
    
    // Safety check: User must be logged in 
    if (!token) {
      alert("You are not logged in!");
      return false;
    }

    const url = "http://localhost:8080/api/files"; 
    
    const headers = {
      'Authorization': `Bearer ${token}`, // Attach JWT 
      'id': '12345', // Example static ID, replace with actual logic if needed
    };

    let body;

    if (mode === "folder") {
      // JSON for creating a folder
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({ name: data, type: "folder" });
    } else {
      // FormData for uploading a file
      const formData = new FormData();
      formData.append("file", data); 
      // Note: Do NOT set Content-Type for FormData, browser does it automatically
      body = formData;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });

      if (response.ok) {
        alert(`${mode === 'folder' ? 'Folder created' : 'File uploaded'} successfully!`);
        return true; 
      } else {
        alert("Server error: Failed to create item.");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error");
      return false;
    }
  };


  return (
    <div className="create-container" style={{ padding: "20px", color: "white" }}>
      <h1>Create or Upload</h1>
      <Input handleClick={handleCreate} mode="folder" />
      <hr style={{ margin: "20px 0" }} />
    </div>
  );
}

export default Create;