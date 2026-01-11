import express from "express";
import {
  addVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
  getVehicleBookings,
  getAllBookingsForOwner,
  addMaintenance,
  completeMaintenance,
  getMaintenanceHistory,
} from "../controllers/owner.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";


const router = express.Router();

/* ======================================================
   VEHICLE MANAGEMENT
   ====================================================== */

// Add new vehicle
// POST /api/owner/vehicles

router.post(
  "/vehicles",
  protect,
  authorizeRoles("owner"),
  upload.array("images", 5), // ✅ IMAGE HANDLING
  addVehicle
);
// Get all vehicles owned by logged-in owner
// GET /api/owner/vehicles
router.get(
  "/vehicles",
  protect,
  authorizeRoles("owner"),
  getMyVehicles
);

// Update vehicle
// PATCH /api/owner/vehicles/:id
router.patch(
  "/vehicles/:id",
  protect,
  authorizeRoles("owner"),
  updateVehicle
);

// Delete vehicle (safe delete)
// DELETE /api/owner/vehicles/:id
router.delete(
  "/vehicles/:id",
  protect,
  authorizeRoles("owner"),
  deleteVehicle
);

/* ======================================================
   BOOKINGS
   ====================================================== */

// Get bookings for a specific vehicle
// GET /api/owner/vehicles/:id/bookings
router.get(
  "/vehicles/:id/bookings",
  protect,
  authorizeRoles("owner"),
  getVehicleBookings
);

// Get ALL bookings for all owner vehicles
// GET /api/owner/bookings
router.get(
  "/bookings",
  protect,
  authorizeRoles("owner"),
  getAllBookingsForOwner
);

/* ======================================================
   MAINTENANCE
   ====================================================== */

// Add maintenance record
// POST /api/owner/maintenance
router.post(
  "/maintenance",
  protect,
  authorizeRoles("owner"),
  addMaintenance
);

// Complete maintenance
// PATCH /api/owner/maintenance/:id/complete
router.patch(
  "/maintenance/:id/complete",
  protect,
  authorizeRoles("owner"),
  completeMaintenance
);

// Get maintenance history
// GET /api/owner/maintenance
router.get(
  "/maintenance",
  protect,
  authorizeRoles("owner"),
  getMaintenanceHistory
);

export default router;
