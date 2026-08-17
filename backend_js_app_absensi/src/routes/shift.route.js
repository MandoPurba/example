import express from 'express';
import { createShift, deleteShift, getShiftById, getShifts, updateShift } from '../controllers/shift.controller.js';
const router = express.Router();

router.get('/', getShifts);
router.get('/:id', getShiftById);
router.post('/', createShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);

export default router;