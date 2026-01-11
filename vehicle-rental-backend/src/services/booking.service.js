import Booking from "../models/Booking.model.js";

/**
 * Check if a vehicle is available for given dates
 * Prevents overlapping bookings
 */
export const checkAvailability = async (vehicleId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    const err = new Error("End date must be after start date");
    err.statusCode = 400;
    throw err;
  }

  const overlappingBooking = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ["pending_payment", "booked"] },
    $or: [
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
    ],
  });

  if (overlappingBooking) {
    const err = new Error("Vehicle is already booked for selected dates");
    err.statusCode = 400;
    throw err;
  }

  return true;
};
