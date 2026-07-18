import { Router } from "express";
import { getMedia, uploadMedia as uploadMediaHandler, deleteMedia } from "../controllers/media.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { handleUpload } from "../middleware/upload.js";
import { uploadMedia } from "../lib/cloudinary.js";

const router = Router();

router.get("/", protect, getMedia);
router.post("/upload", protect, handleUpload(uploadMedia.single("file")), uploadMediaHandler);
router.delete("/:id", protect, deleteMedia);

export default router;
