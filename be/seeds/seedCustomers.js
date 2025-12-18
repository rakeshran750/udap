import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "../models/Customer.js";
import Dukan from "../models/Dukan.js";

dotenv.config();

const seedCustomers = async () => {
  try {

    // Find or create dukan
    let dukan = await Dukan.findOne({ phone: "9625296634" });

    if (!dukan) {
      dukan = await Dukan.create({
        name: "Shree General Store",
        ownerName: "Ramesh Kumar",
        phone: "9625296634",
        address: "Main Bazaar",
      });
    }

    // Clear old customers (optional)
    await Customer.deleteMany({ dukanId: dukan._id });

    // Seed data
    const customers = [
      {
        dukanId: dukan._id,
        name: "Suresh",
        phone: "9876543210",
        address: "Near Temple",
      },
      {
        dukanId: dukan._id,
        name: "Mahesh",
        phone: "9876543211",
        address: "Station Road",
      },
      {
        dukanId: dukan._id,
        name: "Raju",
        phone: "9876543212",
        address: "Gandhi Chowk",
      },
      {
        dukanId: dukan._id,
        name: "Anita",
        phone: "9876543213",
        address: "Market Area",
      },
    ];

    await Customer.insertMany(customers);

    console.log("Customers seeded successfully");

  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

export default seedCustomers;