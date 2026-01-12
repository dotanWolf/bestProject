import "./Input.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Keep Bootstrap
import { useState, useRef } from "react";

function Input(props) {
  const { createText, handleClick, buttonText } = props;

  // State
  const [type, setType] = useState("folder"); 
  const [folderName, setFolderName] = useState("");
  const [fileData, setFileData] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = (fileSelected) => {
    if (!fileSelected) return;

    const reader = new FileReader();
    const isBinary = fileSelected.type.startsWith("image/") || fileSelected.type === "application/pdf";

    reader.onload = () => {
      setFileData({
        name: fileSelected.name,
        type: "file",
        content: reader.result, 
      });
    };

    if (isBinary) {
      reader.readAsDataURL(fileSelected); 
    } else {
      reader.readAsText(fileSelected); 
    }
  };

  const onButtonClick = async () => {
    let dataToSend;

    if (type === "folder") {
      if (!folderName.trim()) return alert("Please enter a folder name");
      dataToSend = { name: folderName, type: "folder", content: "" };
    } else {
      if (!fileData) return alert("Please select a file.");
      dataToSend = fileData;
    }

    const success = await handleClick(dataToSend);

    if (success) {
      setFolderName("");
      setFileData(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="input-container">
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>{createText}</h2>

      {/* Toggle Buttons (Bootstrap Group) */}
      <div className="btn-group mb-4 w-100" role="group">
        <button
          type="button"
          className={`btn ${type === "folder" ? "btn-primary" : "btn-dark-outline"}`}
          onClick={() => setType("folder")}
        >
          New Folder
        </button>
        <button
          type="button"
          className={`btn ${type === "file" ? "btn-primary" : "btn-dark-outline"}`}
          onClick={() => setType("file")}
        >
          Upload File
        </button>
      </div>

      {/* Inputs (Bootstrap form-control overridden by CSS) */}
      <div className="form-group mb-4">
        {type === "folder" ? (
          <>
            <label className="form-label">Folder Name</label>
            <input
              type="text"
              className="form-control dark-input"
              placeholder="e.g. My Documents"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </>
        ) : (
          <>
            <label className="form-label">Select File</label>
            <input
              type="file"
              className="form-control dark-input"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </>
        )}
      </div>

      <button
        type="button"
        className={`btn w-100 py-2 ${buttonText ? "btn-danger" : "btn-success"}`}
        style={{ fontWeight: "600" }}
        onClick={onButtonClick}
      >
        {buttonText || (type === "folder" ? "Create Folder" : "Upload File")}
      </button>
    </div>
  );
}

export default Input;