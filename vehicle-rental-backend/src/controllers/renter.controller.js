import Vehicle from "../models/Vehicle.model.js";
import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";
import Review from "../models/Review.model.js";
import { checkAvailability } from "../services/booking.service.js";

/* ===============================
   VIEW VEHICLES
================================ */
export const viewVehicles = async (req, res, next) => {
  try {
    const { location, type, minPrice, maxPrice } = req.query;

    const filter = {
      approved: true,
      isAvailable: true,
    };

    if (location) filter.location = location;
    if (type) filter.type = type;

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(filter);
    res.json({ success: true, vehicles });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   VEHICLE DETAILS + REVIEWS
================================ */
export const getVehicleDetails = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      approved: true,
    });

    if (!vehicle) {
      res.status(404);
      throw new Error("Vehicle not found");
    }

    const reviews = await Review.find({
      vehicle: vehicle._id,
      approved: true,
    }).populate("user", "name");

    res.json({ success: true, vehicle, reviews });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   CREATE BOOKING
================================ */
export const createBooking = async (req, res, next) => {
  try {
    const { vehicle, startDate, endDate } = req.body;

    if (!vehicle || !startDate || !endDate) {
      res.status(400);
      throw new Error("Booking details are required");
    }

    const selectedVehicle = await Vehicle.findById(vehicle);

    if (!selectedVehicle || !selectedVehicle.approved) {
      res.status(404);
      throw new Error("Vehicle not available");
    }

    if (selectedVehicle.owner.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot book your own vehicle");
    }

    await checkAvailability(vehicle, startDate, endDate);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      res.status(400);
      throw new Error("Invalid booking dates");
    }

    const totalAmount = days * selectedVehicle.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle,
      startDate,
      endDate,
      totalAmount,
      status: "pending_payment",
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   MY BOOKINGS
================================ */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("vehicle")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const today = new Date();

    // 🔁 AUTO-MARK COMPLETED BOOKINGS
    for (const booking of bookings) {
      if (
        booking.status === "booked" &&
        booking.endDate < today
      ) {
        booking.status = "completed";
        await booking.save();
      }
    }

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};



/* ===============================
   CANCEL BOOKING
================================ */
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (!["pending_payment", "booked"].includes(booking.status)) {
      res.status(400);
      throw new Error("Booking cannot be cancelled");
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   MY PAYMENTS
================================ */
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("user", "name email")
      .populate({
        path: "booking",
        populate: {
          path: "vehicle",
          select: "model type",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

/* ===============================
   ADD REVIEW
================================ */
export const addReview = async (req, res, next) => {
  try {
    const { booking, vehicle, rating, comment } = req.body;

    if (!booking || !vehicle || !rating) {
      res.status(400);
      throw new Error("Booking, vehicle and rating are required");
    }

    const completedBooking = await Booking.findOne({
      _id: booking,
      user: req.user._id,
      vehicle,
      status: "completed",
    });

    if (!completedBooking) {
      res.status(403);
      throw new Error("Review allowed only after completed booking");
    }

    const review = await Review.create({
      user: req.user._id,
      vehicle,
      booking,
      rating,
      comment,
      approved: false,
    });

    res.status(201).json({
      success: true,
      review,
      message: "Review submitted for approval",
    });
  } catch (error) {
    next(error);
  }
};
