import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { AUTH_COOKIE_NAME } from "../middleware/auth.middleware.js";

const COOKIE_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2h — matches JWT_EXPIRES_IN default

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "strict",
  maxAge: COOKIE_MAX_AGE_MS,
  path: "/",
});

// POST /api/auth/login
// Body is already validated by the `validate(loginSchema)` middleware.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    // LOG DE CONTRÔLE : Permet de voir si Prisma trouve l'utilisateur
    // console.log("Utilisateur trouvé en BDD :", user);
    // Deliberately identical error for "no such user" and "wrong password" —
    // distinguishing them lets an attacker enumerate valid admin emails.
    const invalid = () =>
      res.status(401).json({ error: "Email ou mot de passe incorrect." });

    if (!user) return invalid();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return invalid();

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie(AUTH_COOKIE_NAME, token, cookieOptions());
    // No token in the response body — the cookie is the only place it lives.
    res.json({ success: true, user: { email: user.email } });
  } catch {
    console.error("login error:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// POST /api/auth/logout
export const logout = (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
  res.json({ success: true });
};

// GET /api/auth/me — lets the frontend check session state without
// ever handling the token directly.
export const me = async (req, res) => {
  res.json({ user: { email: req.user.email } });
};
