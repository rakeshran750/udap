import Customer from "../models/Customer.js";
import Dukan from "../models/dukan.model.js";

export const createCustomer = async (req, res) => {
  try {
    const { dukanId, name, phone, address } = req.body;

    if (!dukanId || !name?.trim()) {
      return res.status(400).json({ message: "Shop and customer name are required" });
    }

    // Ensure the shop belongs to the logged-in user
    const dukan = await Dukan.findOne({ _id: dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }

    const customer = await Customer.create({
      dukanId,
      name: name.trim(),
      phone: phone || undefined,
      address: address || undefined,
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error("Error creating customer", err);
    res.status(500).json({ message: err.message || "Failed to create customer" });
  }
};

export const getCustomersByDukan = async (req, res) => {
  try {
    const { dukanId } = req.params;
    const dukan = await Dukan.findOne({ _id: dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }

    const customers = await Customer.find({ dukanId });
    res.json(customers);
  } catch (err) {
    console.error("Error fetching customers", err);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer by id", err);
    res.status(500).json({ message: "Failed to fetch customer" });
  }
};
