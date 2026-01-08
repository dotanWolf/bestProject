import "./Input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Input(props) {
  const { createText, type, typeLabel, buttonText, handleNext } = props;
  return (
    <div className="input-container">
      <div className="top-container">
        <h1>Create {createText}</h1>
        <div class="form-floating mb-3">
          <input
            type={type}
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label for="floatingInput">{typeLabel}</label>
        </div>
      </div>
      <button type="button" class="btn btn-primary" onClick={handleNext}>
        {buttonText}
      </button>
    </div>
  );
}

export default Input;
