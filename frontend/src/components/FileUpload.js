import { useState, useContext } from "react";
import { uploadFileAPI } from "../api/api";
import { IndexingContext } from "../context/IndexingContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Paper
} from "@mui/material";

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
      setUploadMessage(response.data.message || "File accepted. Indexing...");
      setIsIndexing(true);
      // Simulate longer indexing delay
      setTimeout(() => {
        setIsIndexing(false);
        navigate("/chatbot");
      }, 10000); // 10 seconds
    } catch (err) {
      setUploadMessage("Upload failed. Check console for details.");
      console.error("Upload failed", err);
    }
  };

  return (
    <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" mb={2}>Upload Documents</Typography>
      <Typography variant="body1" mb={2}>Upload DOCX files to process with our HR Chatbot.</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="file"
          inputProps={{ accept: ".docx" }}
          onChange={(e) => setFile(e.target.files[0])}
          variant="outlined"
          sx={{ mb: 2, width: "100%" }}
        />
        <Button type="submit" variant="contained" fullWidth>Upload</Button>
      </form>
      {uploadMessage && <Typography mt={2}>{uploadMessage}</Typography>}
      {isIndexing && (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="body1" mb={1}>Indexing document, please wait...</Typography>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
