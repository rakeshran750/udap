// import express from "express"
// import { configDotenv } from "dotenv"
// import connectDB from "./config/db.js"
// import cors from "cors"
// configDotenv()


// import botRouter from "./routes/botRoute.js"
// import toolRouter from "./routes/toolRoute.js"
// import estatebotRoutes from "./routes/estatebotRoutes.js";
// import { seedPropertiesIfEmpty } from "./data/propertyData.js";

// const app = express()
// const port = process.env.PORT



// // app.use(cors({
// //   origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:5173","https://05ca5a7d6bb6.ngrok-free.app"],
// //   credentials: true
// // }));


// app.use(
//   cors({
//     origin: true,          // ✅ allow all origins dynamically
//     credentials: true      // ✅ allow cookies / auth headers
//   })
// );

// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));



// app.use("/api/bot",botRouter);
// app.use("/api/tool",toolRouter);
// app.use("/api/estate", estatebotRoutes);


// //DB connection and server start
// connectDB()
//   .then(async () => {

//     // Seed properties safely
//     await seedPropertiesIfEmpty();

//     app.listen(port, () => {
//       console.log(`✅ Server running on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1);
//   });


import express from "express";
import cors from "cors";

import dukanRoutes from "./routes/dukan.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();


app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());

app.use("/api/dukan", dukanRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/transaction", transactionRoutes);

export default app;
