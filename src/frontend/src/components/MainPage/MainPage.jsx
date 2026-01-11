import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../Sidebar/Sidebar"; 
import TopBar from "../Topbar/Topbar"; 
import SearchResults from "../../pages/search/SearchResults";
import Input from "../input/Input"

const MyDrive = () => (
  <div style={{ padding: "40px", color: 'var(--text-color)' }}>
    <h1>My Drive Content</h1>
  </div>
);

const Recent = () => (
  <div style={{ padding: "40px", color: 'var(--text-color)' }}>
    <h1>Recent Files</h1>
  </div>
);

const Starred = () => (
  <div style={{ padding: "40px", color: 'var(--text-color)' }}>
    <h1>Starred Files</h1>
  </div>
);

function MainPage() {
  // State for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Server Logic for Creating Folder or Uploading File [cite: 50, 63]
  const handleCreate = async (data, mode) => {
    const token = localStorage.getItem("token"); // Get JWT [cite: 56]
    
    // Safety check: User must be logged in [cite: 59]
    if (!token) {
      alert("You are not logged in!");
      return false;
    }

    const url = "http://localhost:5000/api/files"; 
    
    const headers = {
      'Authorization': `Bearer ${token}` // Attach JWT [cite: 57]
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
    <div 
      id="app-container" 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}
    >
      {/* Pass theme props to TopBar so the button can be there  */}
      <TopBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Sidebar for navigation */}
        <Sidebar />

        <div style={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          backgroundColor: "var(--main-bg)",
          transition: "background-color 0.3s ease"
        }}>
          
          <Routes>
            <Route path="/" element={<MyDrive />} />
            <Route path="/my-drive" element={<MyDrive />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            {/* The Create Page */}
            <Route 
              path="/create" 
              element={
                <Input
                  createText="Create New Item"
                  handleClick={handleCreate} 
                />
              } 
            />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default MainPage;
