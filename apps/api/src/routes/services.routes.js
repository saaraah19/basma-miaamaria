import { Router } from "express";
import { serviceSchema, serviceUpdateSchema, serviceReorderSchema } from "@bsma/shared";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from "../controllers/services.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", getServices);
router.post("/", protect, validate(serviceSchema), createService);
router.patch("/reorder", protect, validate(serviceReorderSchema), reorderServices);
router.put("/:id", protect, validate(serviceUpdateSchema), updateService);
router.delete("/:id", protect, deleteService);

export default router;
