import { useNavigate } from "react-router-dom"; // Add this
import InputUser from "../InputUser/InputUser.jsx";
import { useState } from "react";
import ImageInput from "../../ImageInput/ImageInput.jsx";
import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "./validator";

function SignUpPage() {
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

  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  const createUser = async () => {
    const user = {
      username: updatedInput[0],
      email: updatedInput[1],
      password: updatedInput[2],
      profileImage: updatedInput[3],
    };

    try {
      // 1. Create the user
      const userRes = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (userRes.ok) {
        // 2. User created! Now get the JWT token
        const tokenRes = await fetch("http://localhost:8080/api/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Note: Usually you send username/password to get a token
          body: JSON.stringify({
            email: user.email,
            password: user.password,
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();

          // 3. Save the JWT to localStorage
          // The key "token" must match what your MainPage looks for
          localStorage.setItem("token", tokenData.token);
          // 4. Move to the main page
          navigate("/");
        } else {
          alert("Account created, but failed to log in automatically.");
          navigate("/login");
        }
      } else {
        alert("Sign up failed. User might already exist.");
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);

    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);

      if (step < data.length) {
        // Not the last step: save data and move forward
        setUserInput([...userInput, input]);
        setStep(step + 1);
        return true;
      } else {
        createUser()
      }
      return true;
    }
    return null;
  };

  if (step <= 2) {
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
  } else {
    return <ImageInput handleClick={handleClick}/>;
  }
}

export default SignUpPage;
