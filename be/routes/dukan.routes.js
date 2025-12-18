import express from "express";
import { createDukan, findDukanByPhone } from "../controllers/dukan.controller.js";

const router = express.Router();
router.post("/", createDukan);
router.get("/phone/:phone", findDukanByPhone);

export default router;
