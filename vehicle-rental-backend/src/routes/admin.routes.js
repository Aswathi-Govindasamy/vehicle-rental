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
  rejectReview, // ✅ keep only delete
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

// ❌ NO APPROVE ROUTE

router.delete(
  "/reviews/:id/reject",
  protect,
  authorizeRoles("admin"),
  rejectReview
);

export default router;
