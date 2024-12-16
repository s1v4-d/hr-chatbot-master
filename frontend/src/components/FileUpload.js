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
  const [error, setError] = useState("");
  const { isIndexing, setIsIndexing } = useContext(IndexingContext);
  const navigate = useNavigate();
  const [uploadStep, setUploadStep] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a DOCX file first.");
      return;
    }

    // Immediately show a message that we're sending the file to the server
    setUploadStep("sending");
    try {
      const response = await uploadFileAPI(file);

      if (response.status === 200 || response.status === 202) {
        // Server accepted the file, now we simulate the processing steps
        setIsIndexing(true);

        // Step 1: Uploading...
        setUploadStep("uploading");
        setTimeout(() => {
          // Step 2: Chunking...
          setUploadStep("chunking");
          setTimeout(() => {
            // Step 3: Indexing...
            setUploadStep("indexing");
            setTimeout(() => {
              // Done, navigate to chatbot
              setIsIndexing(false);
              navigate("/chatbot");
            }, 10000); // 10 seconds indexing
          }, 10000); // 10 seconds chunking
        }, 10000); // 10 seconds uploading

      } else {
        setError("Unexpected response from server. Try again.");
        setUploadStep("idle");
      }
    } catch (err) {
      setError("Upload failed. Check console for details.");
      console.error("Upload failed", err);
      setUploadStep("idle");
    }
  };

  const renderContent = () => {
    if (uploadStep === "idle") {
      return (
        <>
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
          {error && <Typography color="error" mt={2}>{error}</Typography>}
        </>
      );
    }

    if (uploadStep === "sending") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" mb={2}>Sending file to server...</Typography>
          <CircularProgress />
        </Box>
      );
    }

    if (uploadStep === "uploading") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" mb={2}>Uploading document...</Typography>
          <CircularProgress />
        </Box>
      );
    }

    if (uploadStep === "chunking") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" mb={2}>Chunking the document...</Typography>
          <CircularProgress />
        </Box>
      );
    }

    if (uploadStep === "indexing") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" mb={2}>Indexing document, please wait...</Typography>
          <CircularProgress />
        </Box>
      );
    }

    return null;
  };

  return (
    <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400, mx: "auto", mt: 4 }}>
      {renderContent()}
    </Paper>
  );
};

export default FileUpload;
