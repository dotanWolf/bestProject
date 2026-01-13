import InputUser from "../InputUser/InputUser.jsx";
import ImageInput from "../../ImageInput/ImageInput.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "./validator";

function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  // Define steps
  const data = [
    {
      createText: "A UserName",
      type: "text",
      typeLabel: "username",
      rightButtonText: "Next",
      leftButtonText: "Login",
      validator: usernameValidator,
    },
    {
      createText: "An Email Address",
      type: "email",
      typeLabel: "email address",
      rightButtonText: "Next",
      leftButtonText: "Login",
      validator: emailValidator,
    },
    {
      createText: "A Password",
      type: "password",
      typeLabel: "password",
      rightButtonText: "Next",
      leftButtonText: "Login",
      validator: passwordValidator,
    },
    // Step 3: Image Input
    {
      createText: "Profile Picture",
      type: "image",
      rightButtonText: "Create Account",
      leftButtonText: "Login",
      validator: () => true,
    },
  ];

  const leftButtonClick = () => {
    navigate("/login");
  };
  const createUser = async (updatedInput) => {
    const user = {
      username: updatedInput[0],
      email: updatedInput[1],
      password: updatedInput[2],
      profileImage: updatedInput[3],
    };

    try {
      const userRes = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (userRes.ok) {
        try {
          const tokenRes = await fetch("http://localhost:8080/api/tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              password: user.password,
            }),
          });

          if (tokenRes.ok) {
            // what now
            const tokenData = await tokenRes.json();
            localStorage.setItem("token", tokenData.token);
            localStorage.setItem("userId", tokenData.userId);
            navigate("/my-drive");
          }
        } catch (error) {
          console.log(error);
        }
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
  };

  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);

    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);

      if (step < data.length - 1) {
        // Not the last step: save data and move forward
        setUserInput([...userInput, input]);
        setStep(step + 1);
        return true;
      } else {
        createUser(updatedInput);
      }
      return true;
    }
    return null;
  };

  const currentItem = data[step];

  // If it's the image step, render ImageInput
  if (step === 3) {
    return (
      <div
        className="signup-container"
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        {/* FIX: Passed 'handleClick' so ImageInput can call it */}
        <ImageInput
          handleClick={handleClick}
          buttonText={currentItem.buttonText}
        />
      </div>
    );
  }

  // Otherwise render standard input
  return (
    <InputUser
      {...currentItem}
      handleClick={handleClick}
      leftButtonClick={leftButtonClick}
    />
  );
}

export default SignUpPage;
