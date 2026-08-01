// after
import { Router } from "express";
import {
  getSection,
  getSectionAdmin,
  updateContent,
  publishContentBlock,
  discardContentDraft,
} from "../controllers/content.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:section", getSection);
router.get("/:section/admin", protect, getSectionAdmin);
router.put("/:section/:key", protect, updateContent);
router.post("/:section/:key/publish", protect, publishContentBlock);
router.delete("/:section/:key/draft", protect, discardContentDraft);

export default router;