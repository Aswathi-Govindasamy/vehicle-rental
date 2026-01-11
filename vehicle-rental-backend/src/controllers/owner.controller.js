import Vehicle from "../models/Vehicle.model.js";
import Booking from "../models/Booking.model.js";
import Maintenance from "../models/Maintenance.model.js";

/* ======================================================
   ADD VEHICLE
   ====================================================== */
   export const addVehicle = async (req, res, next) => {
  try {
    const {
      make,
      model,
      year,
      type,
      pricePerDay,
      location,
      description,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => file.path)
      : [];

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      make,
      model,
      year,
      type,
      pricePerDay,
      location,
      description,
      images,
      approved: false,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};



/* ======================================================
   GET MY VEHICLES
   ====================================================== */
export const getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json({ success: true, vehicles });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   UPDATE VEHICLE
   ====================================================== */
export const updateVehicle = async (req, res, next) => {
  try {
    const allowedUpdates = [
      "make",
      "model",
      "year",
      "type",
      "pricePerDay",
      "location",
      "images",
      "description",
      "isAvailable",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }

    res.json({ success: true, vehicle });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   DELETE VEHICLE (SAFE DELETE)
   ====================================================== */
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }

    // ❗ Prevent deletion if active bookings exist
    const activeBooking = await Booking.findOne({
      vehicle: vehicle._id,
      status: { $in: ["pending_payment", "booked"] },
    });

    if (activeBooking) {
      res.status(400);
      throw new Error(
        "Vehicle cannot be deleted while active bookings exist"
      );
    }

    await vehicle.deleteOne();

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   BOOKINGS FOR A SPECIFIC VEHICLE
   ====================================================== */
export const getVehicleBookings = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }

    const bookings = await Booking.find({ vehicle: vehicle._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   ALL BOOKINGS FOR OWNER (ALL VEHICLES)
   ====================================================== */
export const getAllBookingsForOwner = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).select("_id");

    const bookings = await Booking.find({
      vehicle: { $in: vehicles.map((v) => v._id) },
    })
      .populate("vehicle")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   ADD MAINTENANCE
   ====================================================== */
export const addMaintenance = async (req, res, next) => {
  try {
    const { vehicle, description, cost } = req.body;

    if (!vehicle || !description) {
      res.status(400);
      throw new Error("Vehicle and description are required");
    }

    const ownedVehicle = await Vehicle.findOne({
      _id: vehicle,
      owner: req.user._id,
    });

    if (!ownedVehicle) {
      res.status(403);
      throw new Error("You do not own this vehicle");
    }

    const record = await Maintenance.create({
      vehicle,
      owner: req.user._id,
      description,
      cost,
      status: "in-progress",
    });

    // mark vehicle unavailable during maintenance
    ownedVehicle.isAvailable = false;
    await ownedVehicle.save();

    res.status(201).json({ success: true, record });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   COMPLETE MAINTENANCE
   ====================================================== */
export const completeMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!record) {
      res.status(404);
      throw new Error("Maintenance record not found");
    }

    record.status = "completed";
    await record.save();

    await Vehicle.findByIdAndUpdate(record.vehicle, {
      isAvailable: true,
    });

    res.json({
      success: true,
      message: "Maintenance completed",
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   MAINTENANCE HISTORY
   ====================================================== */
export const getMaintenanceHistory = async (req, res, next) => {
  try {
    const records = await Maintenance.find({ owner: req.user._id })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (error) {
    next(error);
  }
};
