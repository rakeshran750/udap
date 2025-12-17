import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    dukanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dukan",
      required: true,
    },
    name: { type: String, required: true },
    phone: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
