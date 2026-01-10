import "./Input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function Input(props) {
  const { createText, handleClick } = props;

  // State to switch between Folder creation and File upload
  const [mode, setMode] = useState("folder"); 
  const [inputValue, setInputValue] = useState("");
  const [fileValue, setFileValue] = useState(null);

  const onButtonClick = async () => {
    // Determine what data to send based on mode
    const dataToSend = mode === "folder" ? inputValue : fileValue;
    
    // Call the server logic passed from App.jsx
    const isValid = await handleClick(dataToSend, mode);
    
    if (isValid) {
      setInputValue("");
      setFileValue(null);
    }
  };

  return (
    <div className="input-container">
      <div className="top-container">
        <h1>{createText}</h1>
        
        {/* Toggle Buttons */}
        <div className="btn-group mb-3" role="group">
          <button 
            type="button" 
            className={`btn ${mode === 'folder' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setMode("folder")}
          >
            New Folder
          </button>
          <button 
            type="button" 
            className={`btn ${mode === 'file' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => setMode("file")}
          >
            Upload File
          </button>
        </div>

        {/* Dynamic Input Field */}
        <div className="form-floating mb-3">
          {mode === "folder" ? (
            // Folder Mode: Text Input
            <>
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Folder Name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <label htmlFor="floatingInput">Folder Name</label>
            </>
          ) : (
            // File Mode: File Input
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFileValue(e.target.files[0])}
            />
          )}
        </div>
      </div>

      <button type="button" className="btn btn-success" onClick={onButtonClick}>
        {mode === "folder" ? "Create Folder" : "Upload File"}
      </button>
    </div>
  );
}

export default Input;