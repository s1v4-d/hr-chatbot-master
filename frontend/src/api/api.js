import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Update to production if needed
});

export const loginAPI = (username, password) =>
  api.post("/login", { username, password });

export const uploadFileAPI = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const chatAPI = (message) =>
  api.post("/chat", { query: message });
