import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Customer from "../models/Customer.js";
import Dukan from "../models/dukan.model.js";

export const addTransaction = async (req, res) => {
  try {
    const { dukanId, customerId, amount, type, note, txnDate, deviceTxnId } = req.body;

    if (!dukanId || !customerId || !amount || !type) {
      return res.status(400).json({ message: "Shop, customer, amount and type are required" });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const dukan = await Dukan.findOne({ _id: dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }

    const customer = await Customer.findOne({ _id: customerId, dukanId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found for this shop" });
    }

    if (deviceTxnId) {
      const exists = await Transaction.findOne({ deviceTxnId });
      if (exists) return res.json(exists);
    }

    const txn = await Transaction.create({
      dukanId,
      customerId,
      amount: numericAmount,
      type,
      note: note || undefined,
      txnDate: txnDate ? new Date(txnDate) : undefined,
      deviceTxnId: deviceTxnId || undefined,
    });

    res.status(201).json(txn);
  } catch (error) {
    console.error("Error adding transaction", error);
    res.status(500).json({ message: error.message || "Failed to add transaction" });
  }
};

export const getCustomerBalance = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const dukan = await Dukan.findOne({ _id: customer.dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }

    const result = await Transaction.aggregate([
      { $match: { customerId: new mongoose.Types.ObjectId(customerId) } },
      {
        $group: {
          _id: "$customerId",
          balance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "UDHARI"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    res.json({ balance: result[0]?.balance || 0 });
  } catch (error) {
    console.error("Error getting customer balance", error);
    res.status(500).json({ message: error.message || "Failed to get customer balance" });
  }
};

export const getTransactionsByDukan = async (req, res) => {
  try {
    const { dukanId } = req.params;

    const dukan = await Dukan.findOne({ _id: dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }
    
    const transactions = await Transaction.find({ dukanId })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to recent 100 transactions

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).json({ message: error.message || "Failed to fetch transactions" });
  }
};

export const getTransactionsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const dukan = await Dukan.findOne({ _id: customer.dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }
    
    const transactions = await Transaction.find({ customerId })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching customer transactions", error);
    res.status(500).json({ message: error.message || "Failed to fetch customer transactions" });
  }
};

// Get dashboard stats with date filter
export const getDashboardStats = async (req, res) => {
  try {
    const { dukanId } = req.params;
    const { days } = req.query; // 7, 15, 30

    const dukan = await Dukan.findOne({ _id: dukanId, owner_id: req.user._id });
    if (!dukan) {
      return res.status(403).json({ message: "Invalid shop for this user" });
    }

    const daysNum = parseInt(days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    // Get transactions within date range
    const transactions = await Transaction.find({
      dukanId,
      createdAt: { $gte: startDate }
    });

    // Calculate totals and track unique customers
    let totalUdhari = 0;
    let totalCollection = 0;
    const customerIds = new Set();
    const newCustomerIds = new Set();

    transactions.forEach(txn => {
      if (txn.type === 'UDHARI') {
        totalUdhari += txn.amount;
      } else if (txn.type === 'PAID') {
        totalCollection += txn.amount;
      }
      if (txn.customerId) {
        customerIds.add(txn.customerId.toString());
      }
    });

    // Find customers who had their first transaction in this period
    for (const customerId of customerIds) {
      const firstTxn = await Transaction.findOne({ 
        customerId, 
        dukanId 
      }).sort({ createdAt: 1 });
      
      if (firstTxn && firstTxn.createdAt >= startDate) {
        newCustomerIds.add(customerId);
      }
    }

    const newCustomers = newCustomerIds.size;
    const repeatCustomers = customerIds.size - newCustomers;

    // Get total pending balance (all time)
    const balanceResult = await Transaction.aggregate([
      { $match: { dukanId: new mongoose.Types.ObjectId(dukanId) } },
      {
        $group: {
          _id: null,
          totalBalance: {
            $sum: {
              $cond: [
                { $eq: ["$type", "UDHARI"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalBalance: balanceResult[0]?.totalBalance || 0,
        totalUdhari,
        totalCollection,
        transactionCount: transactions.length,
        newCustomers,
        repeatCustomers,
        days: daysNum
      }
    });
  } catch (error) {
    console.error("Error getting dashboard stats", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
