import axios from "axios";

const instance = axios.create({
 baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default instance;
