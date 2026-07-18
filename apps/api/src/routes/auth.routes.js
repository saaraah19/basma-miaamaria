import { Router } from "express";
import rateLimit from "express-rate-limit";
import { loginSchema } from "@bsma/shared";
import { login, logout, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Deliberately stricter than the app-wide limiter — this endpoint is the
// single most attractive brute-force target in the whole API.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives de connexion. Réessaie dans 15 minutes." },
});

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
