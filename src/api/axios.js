import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// This runs before every single request automatically
// It reads the token from localStorage and attaches it
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;