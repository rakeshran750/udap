import Dukan from "../models/Dukan.js";

export const createDukan = async (req, res) => {
  try {
    const dukan = await Dukan.create(req.body);
    res.status(201).json(dukan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const findDukanByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const dukan = await Dukan.findOne({ phone });
    
    if (!dukan) {
      return res.status(404).json({ error: "Dukan not found with this phone number" });
    }

    res.json({
      success: true,
      dukan: {
        _id: dukan._id,
        name: dukan.name,
        ownerName: dukan.ownerName,
        phone: dukan.phone,
        address: dukan.address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
