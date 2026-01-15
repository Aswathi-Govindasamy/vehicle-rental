import express from "express";
import {
  getAllUsers,
  toggleUserBlock,
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
  getAllBookings,
  getAllPayments,
  getAllReviews,
  deleteReview,   // ✅ MATCHES CONTROLLER
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ================= USERS ================= */
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.patch("/users/:id/block", protect, authorizeRoles("admin"), toggleUserBlock);

/* ================= VEHICLES ================= */
router.get("/vehicles", protect, authorizeRoles("admin"), getAllVehicles);
router.patch("/vehicles/:id/approve", protect, authorizeRoles("admin"), approveVehicle);
router.delete("/vehicles/:id/reject", protect, authorizeRoles("admin"), rejectVehicle);

/* ================= BOOKINGS ================= */
router.get("/bookings", protect, authorizeRoles("admin"), getAllBookings);

/* ================= PAYMENTS ================= */
router.get("/payments", protect, authorizeRoles("admin"), getAllPayments);

/* ================= REVIEWS ================= */
router.get("/reviews", protect, authorizeRoles("admin"), getAllReviews);

// ✅ ONLY DELETE REVIEW
router.delete(
  "/reviews/:id",
  protect,
  authorizeRoles("admin"),
  deleteReview
);

export default router;
