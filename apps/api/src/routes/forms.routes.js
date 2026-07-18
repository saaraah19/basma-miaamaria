import { Router } from "express";
import rateLimit from "express-rate-limit";
import { contactFormSchema, devisFormSchema } from "@bsma/shared";
import { submitContact, submitDevis } from "../controllers/forms.controller.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Public forms are a spam/abuse target even without auth involved —
// a dedicated limiter keeps someone from scripting hundreds of fake
// leads (and hundreds of outbound emails) in a burst.
const formsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de demandes envoyées. Réessaie plus tard." },
});

router.post("/contact", formsLimiter, validate(contactFormSchema), submitContact);
router.post("/devis", formsLimiter, validate(devisFormSchema), submitDevis);

export default router;
