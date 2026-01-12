import InputUser from "../InputUser/InputUser.jsx";
import ImageInput from "../../ImageInput/ImageInput.jsx"; 
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { emailValidator, passwordValidator, usernameValidator } from "./validator";

function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  // Define steps
  const data = [
    { createText: "A UserName", type: "text", typeLabel: "username", buttonText: "Next", validator: usernameValidator },
    { createText: "An Email Address", type: "email", typeLabel: "email address", buttonText: "Next", validator: emailValidator },
    { createText: "A Password", type: "password", typeLabel: "password", buttonText: "Next", validator: passwordValidator },
    // Step 3: Image Input
    { createText: "Profile Picture", type: "image", buttonText: "Create Account" }
  ];

  const handleClick = async (input) => {
    // 1. Handle standard text inputs (Steps 0, 1, 2)
    if (step < 3) {
      const isValid = await data[step].validator(input);

      if (isValid) {
        const updatedInput = [...userInput, input];
        setUserInput(updatedInput);
        setStep(step + 1);
        return true;
      }
      return false;
    } 
    
    // 2. Handle Final Submission (Step 3 - Image)
    else {
      // 'input' here is the image data passed from ImageInput
      
      const user = { 
        username: userInput[0], 
        email: userInput[1], 
        password: userInput[2], 
        profileImage: input || "/src/ImageInput/default.png" 
      };

      try {
        const userRes = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        if (userRes.ok) {
          const data = await userRes.json();
          console.log("Signup Success:", data); 

          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId); 
          
          navigate("/my-drive");
          return true;
        } else {
          const err = await userRes.json();
          alert("Sign up failed: " + (err.error || "Unknown error"));
          return false;
        }
      } catch (error) {
        console.error("Connection Error:", error);
        alert("Server connection failed");
        return false;
      }
    }
  };

  const currentItem = data[step];

  // If it's the image step, render ImageInput
  if (step === 3) {
    return (
      <div className="signup-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
         {/* FIX: Passed 'handleClick' so ImageInput can call it */}
         <ImageInput 
            handleClick={handleClick} 
            buttonText={currentItem.buttonText}
         />
      </div>
    );
  }

  // Otherwise render standard input
  return <InputUser {...currentItem} handleClick={handleClick} />;
}

export default SignUpPage;