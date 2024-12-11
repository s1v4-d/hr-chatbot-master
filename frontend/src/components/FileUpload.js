import { useState, useContext } from "react";
import { uploadFileAPI } from "../api/api";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { IndexingContext } from "../context/IndexingContext";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const { isIndexing, setIsIndexing } = useContext(IndexingContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage("Please select a DOCX file first.");
      return;
    }

    try {
      const response = await uploadFileAPI(file);
      setUploadMessage(response.data.message);

      // Simulate indexing delay here:
      setIsIndexing(true);
      // After some fake delay, indexing will be done and redirect to chatbot
      setTimeout(() => {
        setIsIndexing(false);
        navigate("/chatbot");
      }, 5000); // 5 seconds simulate indexing
    } catch (err) {
      setUploadMessage("Upload failed. Check console for details.");
      console.error("Upload failed", err);
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "1rem" }}
        />
        <br />
        <Button type="submit" variant="contained">Upload</Button>
      </form>
      {uploadMessage && <Typography mt={2}>{uploadMessage}</Typography>}
      {isIndexing && (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Typography>Indexing document, please wait...</Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
