import axios from "axios";

const BASE_URL = "http://localhost:5001/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error.message);
    throw error;
  }
);

export const api = {
  // Find dukan by phone (login)
  findDukanByPhone: (phone) =>
    apiClient.get(`/dukan/phone/${phone}`),

  // Create customer
  createCustomer: (data) =>
    apiClient.post("/customer", data),

  // Get customers by dukan
  getCustomers: (dukanId) =>
    apiClient.get(`/customer/${dukanId}`),

  // Add udhari / paid transaction
  addTransaction: (data) =>
    apiClient.post("/transaction", data),

  // Get customer balance
  getBalance: (customerId) =>
    apiClient.get(`/transaction/balance/${customerId}`),

  // Get transactions by dukan
  getTransactionsByDukan: (dukanId) =>
    apiClient.get(`/transaction/dukan/${dukanId}`),

  // Get transactions by customer
  getTransactionsByCustomer: (customerId) =>
    apiClient.get(`/transaction/customer/${customerId}`),
};
