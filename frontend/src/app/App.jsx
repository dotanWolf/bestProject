import Input from "../input/Input.jsx";
import Sidebar from "../components/Sidebar/Sidebar";
import { useState } from "react";
import "../components/Sidebar/Sidebar.css";

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
    // We use a single main container with the dynamic class for Dark/Light mode
    <div 
      id="app-container" 
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{ display: "flex", height: "100vh", width: "100%" }}
    >
      
      {/* Pass the toggle function and state to Sidebar */}
      <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

      <div style={{ 
        flex: 1, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "var(--main-bg)" 
      }}>
        <Input
          createText={currentItem.createText}
          type={currentItem.type}
          typeLabel={currentItem.typeLabel}
          buttonText={currentItem.buttonText}
          handleNext={handleNext}
        />
      </div>

    </div>
  );
}

export default App;