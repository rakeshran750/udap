import Dukan from '../models/dukan.model.js';

// CREATE
export const createDukan = async (req, res) => {
  try {
    const dukan = await Dukan.create({
      ...req.body,
      owner_id: req.user._id // from JWT middleware
    });

    res.status(201).json({
      message: 'Dukan created',
      data: dukan
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create dukan' });
  }
};

// READ ALL
export const getAllDukans = async (req, res) => {
  try {
    const dukans = await Dukan.find({ owner_id: req.user._id });
    res.json(dukans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dukans' });
  }
};

// READ ONE
export const getDukanById = async (req, res) => {
  try {
    const dukan = await Dukan.findOne({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!dukan) {
      return res.status(404).json({ message: 'Dukan not found' });
    }

    res.json(dukan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dukan' });
  }
};

// UPDATE
export const updateDukan = async (req, res) => {
  try {
    const dukan = await Dukan.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id },
      req.body,
      { new: true }
    );

    if (!dukan) {
      return res.status(404).json({ message: 'Dukan not found' });
    }

    res.json({
      message: 'Dukan updated',
      data: dukan
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update dukan' });
  }
};

// DELETE
export const deleteDukan = async (req, res) => {
  try {
    const dukan = await Dukan.findOneAndDelete({
      _id: req.params.id,
      owner_id: req.user._id
    });

    if (!dukan) {
      return res.status(404).json({ message: 'Dukan not found' });
    }

    res.json({ message: 'Dukan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete dukan' });
  }
};
