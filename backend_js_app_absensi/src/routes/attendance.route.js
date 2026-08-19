import express from 'express';
import { createAttendance, getAllAttendances, getInsightAttendanceByUserId, getAttendanceById, getAttendanceByUserId, getAttendanceUserByToday, updateAttendance, deleteAttendance, getMonthlyAttendance } from '../controllers/attendance.controller.js';
import { faceVerificationTokenMiddleware } from '../../middleware/faceVerificationMiddleware.js';
import { jwtVerify } from '../../middleware/jwtVerify.js';
const router = express.Router();

router.post('/', faceVerificationTokenMiddleware, createAttendance);
router.get('/today/:userId', getAttendanceUserByToday);

router.get('/', getAllAttendances);
router.get('/monthly', getMonthlyAttendance);
router.get('/:id', getAttendanceById);
router.get('/user/:userId', getAttendanceByUserId);
router.get('/user/insight/:userId', getInsightAttendanceByUserId);
router.put('/user/:userId', faceVerificationTokenMiddleware, updateAttendance);
router.delete('/:id', deleteAttendance);
export default router;