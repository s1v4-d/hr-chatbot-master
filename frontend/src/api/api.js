import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Change to production URL as needed
});

// Login API
export const loginAPI = (username, password) =>
  api.post("/login", { username, password });

// Upload API
export const uploadFileAPI = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Chat API
export const chatAPI = (message) => api.post("/chat", { query: message });
