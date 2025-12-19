import express from 'express';
import {
  createDukan,
  getAllDukans,
  getDukanById,
  updateDukan,
  deleteDukan
} from '../controllers/dukan.controller.js';


const router = express.Router();


router.post('/', createDukan);
router.get('/', getAllDukans);
router.get('/:id', getDukanById);
router.put('/:id', updateDukan);
router.delete('/:id', deleteDukan);

export default router;