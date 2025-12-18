import express from "express";
import {
  addTransaction,
  getCustomerBalance,
  getTransactionsByDukan,
  getTransactionsByCustomer,
  getDashboardStats,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", addTransaction);
router.get("/balance/:customerId", getCustomerBalance);
router.get("/dukan/:dukanId", getTransactionsByDukan);
router.get("/customer/:customerId", getTransactionsByCustomer);
router.get("/stats/:dukanId", getDashboardStats);

export default router;
