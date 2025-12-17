import mongoose from "mongoose";

const dukanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerName: String,
    phone: { type: String, unique: true },
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("Dukan", dukanSchema);
