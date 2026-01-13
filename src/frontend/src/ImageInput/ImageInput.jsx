import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import defaultPicture from "./default.png";

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function ImageInput(props) {
  const [isDefault, setIsDefault] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(defaultPicture);
  const [picture, setPicture] = useState(null);
  const [base64Image, setBase64Image] = useState(defaultPicture); // Store the actual data
  const handleDefaultClick = () => {
    setPreviewUrl(defaultPicture);
    setBase64Image(defaultPicture);
  };

  const handleUploadClick = async (fileSelected) => {
    if (!fileSelected) return;

    // 1. Create preview (fast)
    setPreviewUrl(URL.createObjectURL(fileSelected));

    // 2. Convert to permanent Base64 string
    const base64 = await fileToBase64(fileSelected);
    setBase64Image(base64);
  };

  const handleClick = () => {
    props.handleClick(base64Image);
  };
  return (
    <div className="input-container">
      <div className="top-container">
        <h1>Upload Picture</h1>

        <div className="btn-group mb-3" role="group">
          <button
            type="button"
            onClick={handleDefaultClick}
            className="btn btn-primary"
          >
            Default Image
          </button>
          <input
            type="file"
            className="form-control"
            accept="image/*" // This allows all image types (.jpg, .png, .gif, etc.)
            onChange={(e) => handleUploadClick(e.target.files[0])}
          />
        </div>

        <div className="preview-container">
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px" }} />
        </div>
      </div>

      <button type="button" className="btn btn-primary" onClick={handleClick}>
        Upload Picture
      </button>
    </div>
  );
}

export default ImageInput;
