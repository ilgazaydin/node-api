// src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again shortly.",
});

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many auth requests, please slow down.",
});
