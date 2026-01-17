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

    // ✅ show all reviews (no approval flow)
    const reviews = await Review.find({
      vehicle: vehicle._id,
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

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    // normalize dates (remove time)
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (isNaN(start) || isNaN(end)) {
      res.status(400);
      throw new Error("Invalid date format");
    }

    // ❌ BLOCK PAST DATE BOOKINGS
    if (start < today) {
      res.status(400);
      throw new Error("Booking start date cannot be in the past");
    }

    if (start > end) {
      res.status(400);
      throw new Error("End date must be the same or after start date");
    }

    const selectedVehicle = await Vehicle.findById(vehicle);

    if (!selectedVehicle || !selectedVehicle.approved) {
      res.status(404);
      throw new Error("Vehicle not available");
    }

    // ❌ owner booking own vehicle
    if (selectedVehicle.owner.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot book your own vehicle");
    }

    // ✅ USE EXISTING SERVICE (NO LOGIC CHANGE)
    await checkAvailability(vehicle, start, end);

    // inclusive days
    const days =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const totalAmount = days * selectedVehicle.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle,
      startDate: start,
      endDate: end,
      totalAmount,
      status: "pending_payment",
    });

    res.status(201).json({
      success: true,
      booking,
    });
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
    today.setHours(0, 0, 0, 0);

    // auto-mark completed
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

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
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
          select: "make model type",
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
      approved: true, // ✅ auto-approved
    });

    res.status(201).json({
      success: true,
      review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const modifyBooking = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date are required",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: "pending_payment", // ✅ only unpaid bookings
    });

    if (!booking) {
      return res.status(400).json({
        message: "Only unpaid bookings can be modified",
      });
    }

    // ✅ Check availability for NEW dates
    // Exclude current booking itself
    await checkAvailability(
      booking.vehicle,
      startDate,
      endDate,
      booking._id // pass current booking id
    );

    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save();

    res.json({
      success: true,
      message: "Booking dates updated successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};
