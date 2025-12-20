import express from "express";
import {
  createCustomer,
  getCustomersByDukan,
  getCustomerById,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/detail/:customerId", getCustomerById);
router.get("/:dukanId", getCustomersByDukan);

export default router;
