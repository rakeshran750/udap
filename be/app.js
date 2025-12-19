import express from "express";
import cors from "cors";

import dukanRoutes from "./routes/dukan.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import authRoutes from "./routes/auth.routes.js"
import { protect } from "./middleware/auth.middleware.js";

const app = express();


app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use(protect);
app.use("/api/dukan", dukanRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/transaction", transactionRoutes);

export default app;
