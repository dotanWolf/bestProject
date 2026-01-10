import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar"; 
import TopBar from "../components/Topbar/Topbar"; 
import "../components/Sidebar/Sidebar.css";
import SearchResults from "../pages/search/SearchResults";
import Create from "../pages/Create/create";
import Delete from "../pages/Delete/delete";

// Placeholder components for other pages
const MyDrive = () => <h1 style={{color: 'var(--text-color)'}}>My Drive Content</h1>;
const Recent = () => <h1 style={{color: 'var(--text-color)'}}>Recent Files</h1>;
const Starred = () => <h1 style={{color: 'var(--text-color)'}}>Starred Files</h1>;

function App() {
  // State for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
            <Route path="/create" element={<Create />} />
            {/* The Delete Page */}
            <Route path="/delete" element={<Delete />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default App;