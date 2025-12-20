import Customer from "../models/Customer.js";

export const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
};

export const getCustomersByDukan = async (req, res) => {
  const customers = await Customer.find({ dukanId: req.params.dukanId });
  res.json(customers);
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
