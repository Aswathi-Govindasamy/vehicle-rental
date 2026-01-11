import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ======================================================
   PAYMENTS
   ====================================================== */

// Create Razorpay order for a booking
// POST /api/payments/create
router.post(
  "/create",
  protect,
  authorizeRoles("renter"),
  createPaymentOrder
);

// Verify Razorpay payment
// POST /api/payments/verify
router.post(
  "/verify",
  protect,
  authorizeRoles("renter"),
  verifyPayment
);

export default router;
