import InputUser from "../InputUser/InputUser.jsx";
import { useState } from "react";
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

  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState([]);

  const handleClick = async (input) => {
    const isValid = await data[step].validator(input);
    if (isValid) {
      // data is valid for this section
      setUserInput([...userInput, input]);
      if (step < data.length - 1) {
        setStep(step + 1);
      } else {
        // send a post request with userInput
        
      }
      return true;
    } else {
      return null;
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
    ></InputUser>
  );
}

export default SignUpPage;
