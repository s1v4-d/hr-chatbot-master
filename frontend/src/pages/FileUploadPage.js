import FileUpload from "../components/FileUpload";
import { Box, Typography } from "@mui/material";

const FileUploadPage = () => (
  <Box textAlign="center" p={4}>
    <Typography variant="h4" mb={2}>Upload Your Documents</Typography>
    <Typography variant="body1" mb={2}>Upload DOCX files to process them with our HR Chatbot.</Typography>
    <FileUpload />
  </Box>
);

export default FileUploadPage;
