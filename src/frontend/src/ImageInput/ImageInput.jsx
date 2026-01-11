import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import defaultPicture from "./default.png";
function ImageInput(props) {
  const [isDefault, setIsDefault] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(defaultPicture);
  const [picture, setPicture] = useState(null);
  const handleDefaultClick = () => {
    setIsDefault(true);
    setPreviewUrl(defaultPicture);
  };

  const handleUploadClick = (fileSelected) => {
    if (!fileSelected) return;

    setIsDefault(false);
    setPicture(fileSelected); // Save the actual file for the server later

    // Create a temporary local URL for the preview
    const objectUrl = URL.createObjectURL(fileSelected);
    setPreviewUrl(objectUrl);
  };

  const handleClick = () => {
    console.log(previewUrl)
    props.handleClick(previewUrl)
  }
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
