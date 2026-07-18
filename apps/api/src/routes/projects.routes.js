import { Router } from "express";
import { projectCreateSchema, projectUpdateSchema, projectReorderImagesSchema } from "@bsma/shared";
import {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectImages,
  deleteProjectImage,
  setProjectImageCover,
  reorderProjectImages,
} from "../controllers/projects.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { handleUpload } from "../middleware/upload.js";
import { uploadProjectImage } from "../lib/cloudinary.js";

const router = Router();

router.get("/", getProjects);
// Must be registered before "/:idOrSlug" — otherwise "admin" is parsed as
// a project slug/id and this route is never reached.
router.get("/admin/all", protect, getAllProjects);
router.get("/:idOrSlug", getProject);
router.post("/", protect, validate(projectCreateSchema), createProject);
router.put("/:id", protect, validate(projectUpdateSchema), updateProject);
router.delete("/:id", protect, deleteProject);

router.post(
  "/:id/images",
  protect,
  handleUpload(uploadProjectImage.array("images", 20)),
  addProjectImages
);
router.delete("/images/:imageId", protect, deleteProjectImage);
router.patch("/images/:imageId/cover", protect, setProjectImageCover);
router.patch(
  "/:id/images/reorder",
  protect,
  validate(projectReorderImagesSchema),
  reorderProjectImages
);

export default router;
