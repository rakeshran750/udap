import mongoose from 'mongoose';

const dukanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    ownerName: String,
    phone: {
      type: String,
      unique: true
    },
    address: String,

    // NEW FIELD
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Dukan', dukanSchema);