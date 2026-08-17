import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const faceVerificationTokenMiddleware = (req, res, next) => {
  try {
    const faceToken = req.headers['x-face-token'];

    if (!faceToken) {
      return res.status(401).json({ message: "Face token not provided" });
    }

    // Verifikasi token
    const decoded = jwt.verify(faceToken, process.env.JWT_SECRET);

    // Simpan data user yang terverifikasi di request
    req.face_result = decoded;

    // Lanjutkan ke route berikutnya
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired face token" });
  }
};