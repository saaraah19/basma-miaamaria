import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "bsma_session";

/**
 * The token now lives in an httpOnly cookie set by the login controller.
 * JavaScript in the browser (including an XSS payload) cannot read this
 * cookie's value — it can still ride along on requests (that's the point),
 * but it can no longer be exfiltrated via `document.cookie` or
 * `localStorage.getItem`.
 */
export const protect = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: "Non autorisé." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.clearCookie(AUTH_COOKIE_NAME);
    return res.status(401).json({ error: "Session invalide ou expirée." });
  }
};
