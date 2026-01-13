import { useNavigate } from "react-router-dom";
import InputUser from "../InputUser/InputUser.jsx";
import { useState } from "react";
import { passwordValidator } from "../SignUpPage/validator";

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  const data = [
    {
      createText: "Enter Your Email",
      type: "email",
      typeLabel: "email address",
      rightButtonText: "Next",
      leftButtonText: "Sign Up",
      // LOGIN: Valid only if user EXISTS
      validator: async (input) => {
        const response = await fetch(
          `http://localhost:8080/api/tokens/${input}`
        );
        const result = await response.json();
        return result.exists === true;
      },
    },
    {
      createText: "Enter Your Password",
      type: "password",
      typeLabel: "password",
      rightButtonText: "Login",
      leftButtonText: "Sign Up",
      validator: passwordValidator,
    },
  ];
  const leftButtonClick = () => {
    navigate("/signup")
  }
  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);

    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);

      if (step < data.length - 1) {
        setStep(step + 1);
        return true;
      } else {
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
            localStorage.setItem("userId", tokenData.userId);
            navigate("/my-drive");
            return true;
          }
          alert("Invalid credentials.");
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      alert("User not found.");
    }
    return false;
  };

  const currentItem = data[step];
  return <InputUser {...currentItem} handleClick={handleClick} leftButtonClick = {leftButtonClick} />;
}
export default LoginPage;
