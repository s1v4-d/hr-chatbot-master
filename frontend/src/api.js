// frontend/src/api.js

import axios from 'axios';

// Create an axios instance with the backend's base URL and port
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend's URL and port
  withCredentials: true, // Include cookies if your backend uses sessions
});

// Chat API call
export const chat = async (message) => {
  const response = await axiosInstance.post('/chat', { message });
  return response.data;
};

// File upload API call
export const uploadFile = async (formData) => {
  const response = await axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Login API call
export const login = async (credentials) => {
  const response = await axiosInstance.post('/login', credentials);
  return response.data;
};