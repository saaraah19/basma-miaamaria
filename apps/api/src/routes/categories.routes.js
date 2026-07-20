import { Router } from "express";
import { categoryCreateSchema } from "@bsma/shared";
import { getCategories, createCategory, deleteCategory } from "../controllers/categories.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, validate(categoryCreateSchema), createCategory);
router.delete("/:id", protect, deleteCategory);

export default router;