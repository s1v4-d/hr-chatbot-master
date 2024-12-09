import FileUpload from "../components/FileUpload";

const FileUploadPage = () => (
  <div className="file-upload-page">
    <h1>Upload Your Documents</h1>
    <p>Upload DOCX files to process them with our HR Chatbot.</p>
    <FileUpload />
  </div>
);

export default FileUploadPage;
