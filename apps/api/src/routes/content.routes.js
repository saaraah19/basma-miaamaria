import { Router } from "express";
import { getSection, updateContent } from "../controllers/content.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:section", getSection);
// No generic `validate()` here — content.controller does its own per-type
// validation because the shape depends on which (section, key) is targeted.
router.put("/:section/:key", protect, updateContent);

export default router;
