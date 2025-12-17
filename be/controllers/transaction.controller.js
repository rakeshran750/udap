import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
  const { deviceTxnId } = req.body;

  if (deviceTxnId) {
    const exists = await Transaction.findOne({ deviceTxnId });
    if (exists) return res.json(exists);
  }

  const txn = await Transaction.create(req.body);
  res.status(201).json(txn);
};

export const getCustomerBalance = async (req, res) => {
  const { customerId } = req.params;

  const result = await Transaction.aggregate([
    { $match: { customerId: customerId } },
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
};

export const getTransactionsByDukan = async (req, res) => {
  try {
    const { dukanId } = req.params;
    
    const transactions = await Transaction.find({ dukanId })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(100); // Limit to recent 100 transactions

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const transactions = await Transaction.find({ customerId })
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};