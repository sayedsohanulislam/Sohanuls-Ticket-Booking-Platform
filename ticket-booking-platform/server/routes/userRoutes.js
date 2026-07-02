import { Router } from "express";
import {
  me,
  updateMe,
  list,
  changeRole,
  markFraud,
  vendorRevenue,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Authenticated
router.get("/me", protect, me);
router.put("/me", protect, updateMe);
router.get("/vendor/revenue", protect, authorize("vendor"), vendorRevenue);

// Admin only
router.get("/", protect, authorize("admin"), list);
router.patch("/:id/role", protect, authorize("admin"), changeRole);
router.patch("/:id/fraud", protect, authorize("admin"), markFraud);

export default router;
