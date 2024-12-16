import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Update to production as needed
});

// Attach Bearer token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const loginAPI = (username, password) =>
  api.post("/login", { username, password });

export const registerAPI = (username, email, password, full_name) =>
  api.post("/register", { username, email, password, full_name });

export const uploadFileAPI = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const chatAPI = (message) =>
  api.post("/chat", { query: message });
