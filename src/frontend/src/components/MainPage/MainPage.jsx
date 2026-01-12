import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

// Import your components
import Sidebar from "../Sidebar/Sidebar"; 
import TopBar from "../Topbar/Topbar"; 
import SearchResults from "../../pages/search/SearchResults";
import Input from "../input/Input";
import Trash from "../Trash/Trash.jsx";
import MyDrive from "../MyDrive/MyDrive.jsx"; 
import Update from "../../pages/Update/update.jsx";

const RecentPlaceholder = () => (
  <div style={{ padding: "40px", color: "white" }}>
    <h1 style={{ fontSize: '1.8rem', fontWeight: '500' }}>Recent Files</h1>
  </div>
);

const Starred = () => (
  <div style={{ padding: "40px", color: "white" }}>
    <h1 style={{ fontSize: '1.8rem', fontWeight: '500' }}>Starred Files</h1>
  </div>
);

function MainPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null); 
  const [loadingUser, setLoadingUser] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); 

    if (token && userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
             headers: { 'userid': userId, 'token': token }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data); 
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setLoadingUser(false);
        }
      };
      fetchUser();
    } else {
      setLoadingUser(false);
      navigate("/login");
    }
  }, [navigate]);

  const handleCreate = async (dataToSend) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("http://localhost:8080/api/files", {
        method: 'POST',
        headers: { 
          'userid': userId, 
          'token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: dataToSend.name,
          type: dataToSend.type,
          content: dataToSend.content || "", 
          parentId: null, 
          isTrashed: false 
        })
      });

      if (response.ok) {
        // Redirect to drive to see the new file
        navigate("/my-drive");
        return true;
      } else {
        alert("Creation failed");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  if (loadingUser) {
    return <div style={{display:'flex', justifyContent:'center', marginTop:'50px', color:'white'}}>Loading App...</div>;
  }

  return (
    <div 
      id="app-container" 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}
    >
      <TopBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user || {}} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        backgroundColor: "var(--bg-main)", 
        overflowY: "auto",
        transition: "background-color 0.3s ease"
      }}>
          
          <Routes>
            <Route path="/" element={<MyDrive />} />
            <Route path="/my-drive" element={<MyDrive />} />
            <Route path="/recent" element={<RecentPlaceholder />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/create" element={
                <div style={{ padding: "40px" }}> 
                    <Input createText="Create New Item" handleClick={handleCreate} /> 
                </div>
            } />
            <Route path="/update/:id" element={<Update />} />
          </Routes>
        </div>
      </div>
    </div>
  ); 
}

export default MainPage;