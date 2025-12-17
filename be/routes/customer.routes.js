import express from "express";
import {
  createCustomer,
  getCustomersByDukan,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/", createCustomer);
router.get("/:dukanId", getCustomersByDukan);

export default router;
