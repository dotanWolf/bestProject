import Sidebar from "../components/Sidebar/Sidebar";
import Input from "../input/Input.jsx"; 
import TopBar from "../components/TopBar/TopBar"; 
import { useState } from "react";
import "../components/Sidebar/Sidebar.css";
import { Routes, Route } from 'react-router-dom';

const MyDrive = () => <h1 style={{color: 'var(--text-color)'}}>My Drive Content</h1>;
const Recent = () => <h1 style={{color: 'var(--text-color)'}}>Recent Files</h1>;
const Starred = () => <h1 style={{color: 'var(--text-color)'}}>Starred Files</h1>;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const data = [
    {
      createText: "A UserName",
      type: "text",
      typeLabel: "username",
      buttonText: "Next",
    },
    {
      createText: "An Email Address",
      type: "email",
      typeLabel: "email address",
      buttonText: "Next",
    },
    {
      createText: "A Password",
      type: "password",
      typeLabel: "password",
      buttonText: "Create",
    },
  ];

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < data.length - 1) {
      setStep(step + 1);
    } else {
      // Create the account logic
      console.log("Account creation triggered");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentItem = data[step];

return (
    <div 
      id="app-container" 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}
    >
      <TopBar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

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
           <Route 
                path="/create" 
                element={
                  <Input
                    createText={currentItem.createText}
                    type={currentItem.type}
                    typeLabel={currentItem.typeLabel}
                    buttonText={currentItem.buttonText}
                    handleClick={handleNext}
                  />
                } 
              />
          </Routes>
        </div>

      </div>
    </div>
  );
}

export default App;