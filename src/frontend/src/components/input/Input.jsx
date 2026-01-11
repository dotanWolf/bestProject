import "./Input.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function Input(props) {
  const { createText, handleClick, buttonText } = props;

  // State to switch between Folder creation and File upload
  const [type, setType] = useState("folder");
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = (fileSelected) => {
    const reader = new FileReader();

    // This runs once the file is fully read into memory
    reader.onload = () => {
      const base64String = reader.result; // This is the 'content' your controller wants

      // Construct the JSON object exactly as your controller expects
      const fileJson = {
        name: fileSelected.name,
        type: "file",
        content: base64String,
      };

      setFile(fileJson);
    };

    // Start reading the file as a Data URL (Base64)
    reader.readAsDataURL(fileSelected);
  };

  const onButtonClick = async () => {
    let dataToSend;
    if (type === "folder") {
      if (!folderName.trim()) return alert("Please enter a folder name");
      dataToSend = {
        name: folderName,
        type: "folder",
      };
    } else {
      // If the user clicks 'Create' but the reader isn't done yet
      if (!file) {
        return alert(
          "Please select a file and wait a moment for it to process."
        );
      }
      dataToSend = file; // This is the fileJson object from handleFileUpload
    }

    const isValid = await handleClick(dataToSend);

    if (isValid) {
      setFolderName("");
      setFile(null);
      // If it's a file input, we want to clear the actual HTML input too
      // if (type === "file") {
      //    document.getElementById('fileInput')?.value = "";
      // }
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
            className={`btn ${
              type === "folder" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setType("folder")}
          >
            New Folder
          </button>
          <button
            type="button"
            className={`btn ${
              type === "file" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setType("file")}
          >
            Upload File
          </button>
        </div>

        {/* Dynamic Input Field */}
        <div className="form-floating mb-3">
          {type === "folder" ? (
            // Folder type: Text Input
            <>
              <input
                type="text"
                className="form-control"
                id="floatingInput"
                placeholder="Folder Name"
                value={folderName || ""}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <label htmlFor="floatingInput">Folder Name</label>
            </>
          ) : (
            // File type: File Input
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        className={`btn ${buttonText ? "btn-danger" : "btn-success"}`}
        onClick={onButtonClick}
      >
        {buttonText || (type === "folder" ? "Create Folder" : "Upload File")}
      </button>
    </div>
  );
}

export default Input;
