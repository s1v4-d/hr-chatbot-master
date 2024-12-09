import { useState } from "react";
import { uploadFile } from "../api/api";
import "../styles/FileUploadPage.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a DOCX file first.");
      return;
    }

    try {
      const response = await uploadFile(file);
      setMessage(response.data.message);
    } catch (err) {
      setMessage("Upload failed. Please check console for details.");
      console.error("Upload failed", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
