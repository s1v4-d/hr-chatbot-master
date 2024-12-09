import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Update this for your production backend
});

// Login API
export const login = (username, password) =>
  api.post("/login", { username, password });

// Upload API
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Chat API
export const chat = (message) => api.post("/chat", { query: message });
