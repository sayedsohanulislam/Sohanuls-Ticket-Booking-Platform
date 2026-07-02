import { Router } from "express";
import {
  listTickets,
  advertised,
  latest,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  verifyTicket,
  toggleAdvertise,
  myTickets,
  allForAdmin,
} from "../controllers/ticketController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", listTickets);
router.get("/advertised", advertised);
router.get("/latest", latest);

// Admin only
router.get("/admin/all", protect, authorize("admin"), allForAdmin);
router.patch("/:id/verify", protect, authorize("admin"), verifyTicket);
router.patch("/:id/advertise", protect, authorize("admin"), toggleAdvertise);

// Vendor only
router.get("/vendor/mine", protect, authorize("vendor"), myTickets);
router.post("/", protect, authorize("vendor", "admin"), createTicket);
router.put("/:id", protect, updateTicket);
router.delete("/:id", protect, deleteTicket);

// Public by-id (must come after specific paths)
router.get("/:id", getTicket);

export default router;
