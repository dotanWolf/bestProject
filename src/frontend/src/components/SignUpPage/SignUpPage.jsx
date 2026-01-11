import InputUser from "../InputUser/InputUser.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { emailValidator, passwordValidator, usernameValidator } from "./validator";

function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  const data = [
    { createText: "A UserName", type: "text", typeLabel: "username", buttonText: "Next", validator: usernameValidator },
    { createText: "An Email Address", type: "email", typeLabel: "email address", buttonText: "Next", validator: emailValidator },
    { createText: "A Password", type: "password", typeLabel: "password", buttonText: "Create", validator: passwordValidator },
  ];

  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);

    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);

      if (step < data.length - 1) {
        setStep(step + 1);
        return true;
      } else {
        const user = { 
          username: updatedInput[0], 
          email: updatedInput[1], 
          password: updatedInput[2], 
          profileImage: "placeholder" 
        };

        try {
          const userRes = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });

          if (userRes.ok) {
            // The response now contains { token, userId, username }
            const data = await userRes.json();
            console.log("Response Data:", data); 

            localStorage.setItem("token", data.token);
            // This will no longer be undefined
            localStorage.setItem("userId", data.userId); 
            
            navigate("/my-drive");
            return true;
          }
          alert("Sign up failed.");
        } catch (error) {
          console.error("Connection Error:", error);
        }
      }
    }
    return false;
  };

  const currentItem = data[step];
  return <InputUser {...currentItem} handleClick={handleClick} />;
}

export default SignUpPage;