import { useNavigate } from "react-router-dom"; // Add this
import InputUser from "../InputUser/InputUser.jsx";
import { useState } from "react";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "../SignUpPage/validator";

function LoginPage() {
  const data = [
    {
      createText: "An Email Adress",
      type: "email",
      typeLabel: "email adress",
      buttonText: "Next",
      validator: emailValidator,
    },
    {
      createText: "A Password",
      type: "password",
      typeLabel: "password",
      buttonText: "Create",
      validator: passwordValidator,
    },
  ];

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);

    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);

      if (step < data.length - 1) {
        setStep(step + 1);
        return true;
      } else {
        // Last step: login
        try {
          const tokenRes = await fetch("http://localhost:8080/api/tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: updatedInput[0],
              password: updatedInput[1],
            }),
          });

          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            localStorage.setItem("token", tokenData.token);
            navigate("/");
            return true;
          } else {
            alert("Login failed.");
            return false;
          }
        } catch (error) {
          console.error("Connection Error:", error);
          return false;
        }
      }
    }
    return false;
  };

  const currentItem = data[step];

  return (
    <InputUser
      createText={currentItem.createText}
      type={currentItem.type}
      typeLabel={currentItem.typeLabel}
      buttonText={currentItem.buttonText}
      handleClick={handleClick}
    />
  );
}
export default LoginPage;
