import Booking from "../models/Booking.model.js";

/**
 * Check if a vehicle is available for given dates
 * Prevents overlapping bookings
 * Allows excluding a booking (used while modifying)
 */
export const checkAvailability = async (
  vehicleId,
  startDate,
  endDate,
  excludeBookingId = null
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // ❌ Invalid date range
  if (end < start) {
    const err = new Error("End date cannot be before start date");
    err.statusCode = 400;
    throw err;
  }

  const query = {
    vehicle: vehicleId,
    status: { $in: ["pending_payment", "booked"] },
    startDate: { $lte: end },
    endDate: { $gte: start },
  };

  // ✅ Exclude current booking when modifying
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBooking = await Booking.findOne(query);

  if (overlappingBooking) {
    const err = new Error(
      "Vehicle is already booked for the selected dates"
    );
    err.statusCode = 400;
    throw err;
  }

  return true;
};
