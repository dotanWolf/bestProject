import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar"; 
import TopBar from "../components/Topbar/Topbar"; 
import SearchResults from "../pages/search/SearchResults";
import Create from "../pages/Create/create";
import Update from "../pages/Update/update"; 

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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100vh", 
        width: "100vw",
        overflow: "hidden"
      }}
    >
      <TopBar isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />

      <div style={{ 
        display: "flex", 
        flex: 1,
        overflow: "hidden"
      }}>
        <Sidebar />

        <main style={{ 
          flex: 1,
          overflow: "auto",
          background: "var(--main-bg)"
        }}>
          <Routes>
            <Route path="/" element={<MyDrive />} />
            <Route path="/my-drive" element={<MyDrive />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/create" element={<Create />} />
            <Route path="/update/:id" element={<Update />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;