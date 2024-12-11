import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ChatbotPage from "./pages/ChatbotPage";
import FileUploadPage from "./pages/FileUploadPage";
import "./styles/App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { IndexingProvider } from "./context/IndexingContext";

const App = () => (
  <AuthProvider>
    <IndexingProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <FileUploadPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </IndexingProvider>
  </AuthProvider>
);

export default App;
