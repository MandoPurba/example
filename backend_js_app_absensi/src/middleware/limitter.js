import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit (lebih realistis untuk production)
  max: 3, // 10 percobaan per IP

  standardHeaders: true, // kirim RateLimit-* headers
  legacyHeaders: false,  // matikan X-RateLimit-* lama

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  },

  // optional: skip successful requests
  skipSuccessfulRequests: true,

  // optional: skip failed requests tracking (false = tetap hitung failed)
  skipFailedRequests: false,
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});