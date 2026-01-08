import Input from "../input/Input.jsx";
import { useState } from "react";

function App() {
  const data = [
    {
      createText: "A UserName",
      type: "text",
      typeLabel: "username",
      buttonText: "Next",
    },
    {
      createText: "An Email Adress",
      type: "email",
      typeLabel: "email adress",
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
      // create the acount using post
    }
  };

  const currentItem = data[step];
  return (
    <Input
      createText= {currentItem.createText}
      type={currentItem.type}
      typeLabel={currentItem.typeLabel}
      buttonText={currentItem.buttonText}
      handleNext = {handleNext}
    ></Input>
  );
}

export default App;
