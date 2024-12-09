import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ChatbotPage from "./pages/ChatbotPage";
import FileUploadPage from "./pages/FileUploadPage";
import "./styles/App.css";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
      <Route path="/upload" element={<FileUploadPage />} />
    </Routes>
  </Router>
);

export default App;
