import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://192.168.56.1:5000", 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional: 10 sec timeout
});

// Optional: Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Example: Attach token (if you have auth)
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors globally
    console.error("Axios error:", error?.response || error?.message);
    return Promise.reject(error);
  }
);

export default api;
