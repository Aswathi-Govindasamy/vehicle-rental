import User from "../models/User.model.js";
import Vehicle from "../models/Vehicle.model.js";
import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";
import Review from "../models/Review.model.js";

/* ======================================================
   USERS
   ====================================================== */

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// Block / unblock user
export const toggleUserBlock = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   VEHICLES
   ====================================================== */

// Get all vehicles
export const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate("owner", "name email");
    res.json({ success: true, vehicles });
  } catch (error) {
    next(error);
  }
};

// Approve / reject vehicle
export const approveVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }

    vehicle.approved = true;
    await vehicle.save();

    res.json({
      success: true,
      message: "Vehicle approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Reject vehicle (delete listing)
export const rejectVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }

    await vehicle.deleteOne();

    res.json({
      success: true,
      message: "Vehicle rejected and removed",
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   BOOKINGS
   ====================================================== */

// Get all bookings
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle");

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   PAYMENTS
   ====================================================== */

// Get all payments
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("booking");

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   REVIEWS
   ====================================================== */

// Get all reviews
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("vehicle");

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// Approve review
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    review.approved = true;
    await review.save();

    res.json({
      success: true,
      message: "Review approved",
    });
  } catch (error) {
    next(error);
  }
};

// Reject review
export const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: "Review rejected and removed",
    });
  } catch (error) {
    next(error);
  }
};
