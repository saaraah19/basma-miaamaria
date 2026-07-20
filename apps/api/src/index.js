import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import formsRoutes from "./routes/forms.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1); // needed behind a reverse proxy (Render/Railway/Nginx) for rate-limit + secure cookies to see the real client IP/protocol

// ── Security headers ──────────────────────────────────────
// Default helmet() left the CSP at its defaults, which silently blocks
// your own Cloudinary images and the Google Maps / Calendly iframes if
// CSP is ever tightened later — set it explicitly instead of relying on
// "it happened to work" defaults.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        frameSrc: ["https://www.google.com", "https://calendly.com"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Tailwind/inline critical CSS from the frontend build
        connectSrc: ["'self'", process.env.CLIENT_URL].filter(Boolean),
      },
    },
        crossOriginResourcePolicy: { policy: "cross-origin" }

  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // required so the auth cookie is sent/received cross-origin in dev
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// App-wide limiter — generous, just a backstop. Login and public forms
// have their own stricter limiters defined in their route files.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessaie dans 15 minutes." },
});
app.use(globalLimiter);

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api", formsRoutes);
app.use("/api", messagesRoutes);
app.use("/api/categories", categoriesRoutes);


app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ── Not found + error handler ─────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Route introuvable." }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Erreur serveur." });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
