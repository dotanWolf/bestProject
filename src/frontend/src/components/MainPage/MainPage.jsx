import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Import your components
import Sidebar from "../Sidebar/Sidebar"; 
import TopBar from "../Topbar/Topbar"; 
import SearchResults from "../../pages/search/SearchResults";
import Input from "../input/Input";
import Trash from "../Trash/Trash.jsx";
import MyDrive from "../MyDrive/MyDrive.jsx"; 
import Update from "../../pages/Update/update.jsx";

// Placeholder for Starred/Recent if not ready yet
const RecentPlaceholder = () => <div style={{ padding: "40px", color: 'white' }}><h1>Recent Files (Coming Soon)</h1></div>;
const Starred = () => <div style={{ padding: "40px", color: 'white' }}><h1>Starred Files</h1></div>;

function MainPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // זה ה-State שיחזיק את התמונה
  const [user, setUser] = useState(null); 

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- תיקון: שליפת המשתמש כדי להציג תמונה ב-TopBar ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // שליפה לפי ID

    if (token && userId) {
      const fetchData = async () => {
        try {
          // שימוש ב-userId בכתובת ה-URL
          const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
             headers: {
               'userid': userId,
               'token': token
             }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data); // עדכון ה-State עם המידע (כולל תמונה)
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };
      fetchData();
    }
  }, []);

  const handleCreate = async (dataToSend) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Session error. Please log in again.");
      navigate("/login");
      return false;
    }

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
        navigate("/my-drive");
        return true;
      } else {
        const err = await response.json();
        alert(err.error || "Creation failed");
        return false;
      }
    } catch (error) {
      console.error("Network Error:", error);
      return false;
    }
  };

  return (
    <div 
      id="app-container" 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}
    >
      {/* מעבירים את ה-user ל-TopBar כדי שהתמונה תוצג */}
      <TopBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} />

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
            
            {/* החזרתי את Recent ל-Placeholder כדי לא לשבור לך את הקוד */}
            <Route path="/recent" element={<RecentPlaceholder />} />
            
            <Route path="/starred" element={<Starred />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/create" element={<div style={{ padding: "40px" }}> <Input createText="Create New Item" handleClick={handleCreate} />  </div>} />
            <Route path="/update/:id" element={<Update />} />
          </Routes>

        </div>
      </div>
    </div>
  ); 
}

export default MainPage;