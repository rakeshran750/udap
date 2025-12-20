import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://udap.onrender.com/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error.message);
    throw error;
  }
);

export const api = {
  // Auth endpoints
  sendSignupOtp: (email) =>
    apiClient.post("/auth/signup/send-otp", { email }),

  verifySignupOtp: (email, otp) =>
    apiClient.post("/auth/signup/verify-otp", { email, otp }),

  completeSignup: (email, name, phone, password) =>
    apiClient.post("/auth/signup/complete", { email, name, phone, password }),

  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),

  // Shop (Dukan) endpoints
  createDukan: (data) =>
    apiClient.post("/dukan", data),

  getAllDukans: () =>
    apiClient.get("/dukan"),

  getDukanById: (id) =>
    apiClient.get(`/dukan/${id}`),

  updateDukan: (id, data) =>
    apiClient.put(`/dukan/${id}`, data),

  deleteDukan: (id) =>
    apiClient.delete(`/dukan/${id}`),

  // Legacy endpoints (for backward compatibility)
  findDukanByPhone: (phone) =>
    apiClient.get(`/dukan/phone/${phone}`),

  // Customer endpoints
  createCustomer: (data) =>
    apiClient.post("/customer", data),

  getCustomers: (dukanId) =>
    apiClient.get(`/customer/${dukanId}`),

  getCustomerById: (customerId) =>
    apiClient.get(`/customer/detail/${customerId}`),

  // Transaction endpoints
  addTransaction: (data) =>
    apiClient.post("/transaction", data),

  getBalance: (customerId) =>
    apiClient.get(`/transaction/balance/${customerId}`),

  getTransactionsByDukan: (dukanId) =>
    apiClient.get(`/transaction/dukan/${dukanId}`),

  getTransactionsByCustomer: (customerId) =>
    apiClient.get(`/transaction/customer/${customerId}`),

  getDashboardStats: (dukanId, days = 7) =>
    apiClient.get(`/transaction/stats/${dukanId}?days=${days}`),
};
