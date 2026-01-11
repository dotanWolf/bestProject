import InputUser from "../InputUser/InputUser.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "./validator";
function SignUpPage() {
  const navigate = useNavigate();
  const data = [
    {
      createText: "A UserName",
      type: "text",
      typeLabel: "username",
      buttonText: "Next",
      validator: usernameValidator,
    },
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

  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);
    if (isValid) {
      if (step < data.length - 1) {
        // Not the last step: save data and move forward
        setUserInput([...userInput, input]);
        setStep(step + 1);
        return true;
      } else {
        try {
          // Construct the final object using previous steps + current input
          const finalData = {
          username: userInput[0],
          email: userInput[1],
          password: input,
          profileImage: "default-avatar.png" 
        };

          const response = await fetch(`http://localhost:8080/api/users/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalData) // Sending the actual data
          });

          if (response.ok) {
            navigate("/main");
            return true;
          } else {
            alert("Signup failed. Please try again.");
            return false;
          }
        } catch (error) {
          console.error("Submission failed", error);
          return false;
        }
      }
    } else {
      return null; // Validation failed
    }
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

export default SignUpPage;