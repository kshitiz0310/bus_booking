import axios from "axios";

// Change this if backend runs on another port or deployed URL
const API = axios.create({
  baseURL: "http://localhost:5004/api",
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
