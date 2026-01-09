import "./Input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState} from "react";
function Input(props) {
  const { createText, type, typeLabel, buttonText, handleClick } = props;

  const [inputValue, setInputValue] = useState("");

  const onButtonClick = async () => {
    const isValid = await handleClick(inputValue);
    if (isValid) setInputValue("")
  };

  return (
    <div className="input-container">
      <div className="top-container">
        <h1>Create {createText}</h1>
        <div className="form-floating mb-3">
          <input
            type={type}
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value = {inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <label htmlFor="floatingInput">{typeLabel}</label>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
}

export default Input;