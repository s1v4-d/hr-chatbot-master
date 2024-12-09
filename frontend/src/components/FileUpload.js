import { useState } from "react";
import { uploadFile } from "../api";
import "../styles/FileUploadPage.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData);
      console.log("File uploaded:", response.data);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default FileUpload;