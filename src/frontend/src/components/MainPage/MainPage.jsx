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
import Starred from "../Starred/Starred.jsx";
import SharedItems from '../SharedItems/SharedItems.jsx'
import Recent from "../Recent/Recent.jsx";

function MainPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState(null)

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const fetchUser = async (token, userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`, // Use Capital A and standard Bearer casing
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        navigate("/signup")
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      fetchUser(token, userId);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: dataToSend.name,
          type: dataToSend.type,
          content: dataToSend.content || "",
          parentId: currentFolderId,
          isTrashed: false,
          isStarred: false,
        }),
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

  const setFolderIdInMainPage = (folderId) => {
    setCurrentFolderId(folderId)
  }

  if (loadingUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
          color: "white",
        }}
      >
        Loading App...
      </div>
    );
  }

  return (
    <div
      id="app-container"
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      <TopBar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        user={user || {}}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bg-main)",
            overflowY: "auto",
            transition: "background-color 0.3s ease",
          }}
        >
          <Routes>
            {/* <Route path="/" element={<MyDrive />} /> */}
            <Route path="/my-drive" element={<MyDrive setFolderIdInMainPage = {setFolderIdInMainPage} />} />
            <Route path="/recent" element={<Recent />} />
            <Route path="/starred" element={<Starred />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="shared-with-me" element={<SharedItems/>}/>
            <Route
              path="/create"
              element={
                <div style={{ padding: "40px" }}>
                  {" "}
                  <Input
                    createText="Create New Item"
                    handleClick={handleCreate}
                  />{" "}
                </div>
              }
            />
            <Route path="/update/:id" element={<Update />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
