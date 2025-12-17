import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  dukanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dukan",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ["UDHARI", "PAID"],
    required: true,
  },
  note: String,
  txnDate: { type: Date, default: Date.now },

  // Offline support
  deviceTxnId: { type: String, unique: true },
  synced: { type: Boolean, default: true },
});

export default mongoose.model("Transaction", transactionSchema);
