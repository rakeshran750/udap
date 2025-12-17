import express from "express";
import {
  addTransaction,
  getCustomerBalance,
  getTransactionsByDukan,
  getTransactionsByCustomer,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", addTransaction);
router.get("/balance/:customerId", getCustomerBalance);
router.get("/dukan/:dukanId", getTransactionsByDukan);
router.get("/customer/:customerId", getTransactionsByCustomer);

export default router;
