import { Router } from "express";
import {
  createBooking,
  myBookings,
  vendorRequests,
  acceptBooking,
  rejectBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

// User
router.post("/", createBooking);
router.get("/mine", myBookings);
router.delete("/:id/cancel", cancelBooking);


// Vendor
router.get("/requests", authorize("vendor"), vendorRequests);
router.patch("/:id/accept", authorize("vendor"), acceptBooking);
router.patch("/:id/reject", authorize("vendor"), rejectBooking);

export default router;
