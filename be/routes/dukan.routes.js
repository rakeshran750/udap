import express from 'express';
import {
  createDukan,
  getAllDukans,
  getDukanById,
  updateDukan,
  deleteDukan
} from '../controllers/dukan.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createDukan);
router.get('/', getAllDukans);
router.get('/:id', getDukanById);
router.put('/:id', updateDukan);
router.delete('/:id', deleteDukan);

export default router;