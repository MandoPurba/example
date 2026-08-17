import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtVerify = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error("JWT_SECRET not configured in environment");
    }

    const decoded = jwt.verify(token, secretKey);

    req.auth = {
      user: {
        id: decoded.id,      
        username: decoded.username, 
        role: decoded.role,  
      },
      raw: decoded,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};