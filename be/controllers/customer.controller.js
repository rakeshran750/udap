import Customer from "../models/Customer.js";

export const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
};

export const getCustomersByDukan = async (req, res) => {
  const customers = await Customer.find({ dukanId: req.params.dukanId });
  res.json(customers);
};
