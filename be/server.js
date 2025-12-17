import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import seedCustomers from "./seeds/seedCustomers.js";
dotenv.config();


const PORT = process.env.PORT || 5000;





// //DB connection and server start
connectDB()
  .then(async () => {

    // Seed properties safely
    await seedCustomers();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });


// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );
