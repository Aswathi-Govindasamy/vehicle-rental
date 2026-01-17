import express from "express";
import {
  viewVehicles,
  getVehicleDetails,
  createBooking,
  getMyBookings,
  cancelBooking,
  getMyPayments,
  addReview,
  modifyBooking,
} from "../controllers/renter.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ======================================================
   VEHICLE BROWSING
   ====================================================== */

// Browse all available vehicles (public)
// GET /api/renter/vehicles
router.get("/vehicles", viewVehicles);

// Get single vehicle details + reviews (public)
// GET /api/renter/vehicles/:id
router.get("/vehicles/:id", getVehicleDetails);

/* ======================================================
   BOOKINGS
   ====================================================== */

// Create booking (payment pending)
// POST /api/renter/bookings
router.post(
  "/bookings",
  protect,
  authorizeRoles("renter"),
  createBooking
);

// Get my bookings
// GET /api/renter/bookings
router.get(
  "/bookings",
  protect,
  authorizeRoles("renter"),
  getMyBookings
);

// Cancel booking
// PATCH /api/renter/bookings/:id/cancel
router.patch(
  "/bookings/:id/cancel",
  protect,
  authorizeRoles("renter"),
  cancelBooking
);

/* ======================================================
   PAYMENTS (VIEW ONLY – PAYMENT ACTIONS ARE IN payment.routes.js)
   ====================================================== */

// Get my payments
// GET /api/renter/payments
router.get(
  "/payments",
  protect,
  authorizeRoles("renter"),
  getMyPayments
);

/* ======================================================
   REVIEWS
   ====================================================== */

// Add review after completed booking
// POST /api/renter/reviews
router.post(
  "/reviews",
  protect,
  authorizeRoles("renter"),
  addReview
);
router.patch(
  "/bookings/:id/modify",
  protect,
  authorizeRoles("renter"),
  modifyBooking
);


export default router;
