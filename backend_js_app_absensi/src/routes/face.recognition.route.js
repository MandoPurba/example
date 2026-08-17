import express from 'express';
import multer from "multer";
import { registerFaceRecognition, verifyFaceRecognition } from '../controllers/face.recognition.controller.js';

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post('/register',  upload.single("image"), registerFaceRecognition)
router.post('/verify',  upload.single("image"), verifyFaceRecognition)

export default router;