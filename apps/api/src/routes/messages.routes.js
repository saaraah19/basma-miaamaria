import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getMessages,
  markMessageRead,
  deleteMessage,
  getDevisRequests,
  markDevisRead,
  deleteDevisRequest,
} from "../controllers/messages.controller.js";

const router = Router();

router.get("/messages", protect, getMessages);
router.patch("/messages/:id/read", protect, markMessageRead);
router.delete("/messages/:id", protect, deleteMessage);

router.get("/devis-requests", protect, getDevisRequests);
router.patch("/devis-requests/:id/read", protect, markDevisRead);
router.delete("/devis-requests/:id", protect, deleteDevisRequest);

export default router;