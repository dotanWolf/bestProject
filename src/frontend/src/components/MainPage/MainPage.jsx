import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

// Import your components
import Sidebar from "../Sidebar/Sidebar"; 
import TopBar from "../Topbar/Topbar"; 
import SearchResults from "../../pages/search/SearchResults";
import Input from "../input/Input";
import Trash from "../Trash/Trash.jsx";
import MyDrive from "../MyDrive/MyDrive.jsx"; 

// Placeholder components for routes that don't have files yet
const Recent = () => <div style={{ padding: "40px", color: 'white' }}><h1>Recent Files</h1></div>;
const Starred = () => <div style={{ padding: "40px", color: 'white' }}><h1>Starred Files</h1></div>;

function MainPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleCreate = async (dataToSend) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // 1. Validation check
    if (!token || !userId || userId === "undefined") {
      alert("Session error. Please log in again.");
      navigate("/login");
      return false;
    }

    try {
      const response = await fetch("http://localhost:8080/api/files", {
        method: 'POST',
        headers: { 
          // 2. Standardized Headers (Lowercase to match Controller)
          'userid': userId, 
          'token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: dataToSend.name,
          type: dataToSend.type,
          content: dataToSend.content || "", // Handle file content
          parentId: null,
          isTrashed: false 
        })
      });

      if (response.ok) {
        // Success: Redirect to My Drive to see the new file
        navigate("/my-drive");
        return true;
      } else {
        const err = await response.json();
        alert(err.error || "Creation failed");
        return false;
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error - check console");
      return false;
    }
  };

  return (
    <div 
      id="app-container" 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}
    >
      <TopBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <div style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          backgroundColor: "var(--main-bg)",
          overflowY: "auto"
        }}>
          
          <Routes>
            <Route path="/" element={<MyDrive />} />
            <Route path="/my-drive" element={<MyDrive />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route 
              path="/create" 
              element={
                <div style={{ padding: "40px" }}>
                    <Input
                      createText="Create New Item"
                      handleClick={handleCreate} 
                    />
                </div>
              } 
            />
          </Routes>

        </div>
      </div>
    </div>
  ); 
}

export default MainPage;