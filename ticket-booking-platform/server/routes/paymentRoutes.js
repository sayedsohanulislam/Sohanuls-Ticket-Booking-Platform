import { Router } from "express";
import {
  createPaymentIntent,
  confirmPayment,
  myTransactions,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/transactions", myTransactions);

export default router;
