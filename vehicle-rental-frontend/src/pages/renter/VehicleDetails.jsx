import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleDetails, createBooking } from "../../api/renter.api";
import useAuth from "../../auth/useAuth";

const VehicleDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Fix #3 states
  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  /* ================= LOAD VEHICLE ================= */

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await getVehicleDetails(id);
        setVehicle(data.vehicle);
        setReviews(data.reviews);
      } catch {
        setError("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  /* ================= CALCULATE DAYS & PRICE (INCLUSIVE) ================= */

  useEffect(() => {
    if (!startDate || !endDate || !vehicle) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || start > end) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

    // ✅ Inclusive day count (matches backend)
    const calculatedDays =
      Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      ) + 1;

    setDays(calculatedDays);
    setTotalPrice(calculatedDays * vehicle.pricePerDay);
  }, [startDate, endDate, vehicle]);

  /* ================= HANDLE BOOKING ================= */

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setBookingError("Please select start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      setBookingError("Invalid date selected");
      return;
    }

    if (start > end) {
      setBookingError(
        "End date must be the same or after start date"
      );
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      await createBooking({
        vehicle: vehicle._id,
        startDate,
        endDate,
      });

      alert(
        "Booking created successfully. Proceed to payment from My Bookings."
      );

      setStartDate("");
      setEndDate("");
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500">
        {error}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Vehicle not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-6">
          {vehicle.make} {vehicle.model}
        </h2>

        {/* IMAGE */}
        <div className="w-full h-64 bg-gray-800 rounded-xl overflow-hidden mb-6">
          {vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-2 text-gray-300">
          <p>
            <span className="font-medium text-gray-400">Type:</span>{" "}
            {vehicle.type}
          </p>
          <p>
            <span className="font-medium text-gray-400">Location:</span>{" "}
            {vehicle.location}
          </p>
          <p>
            <span className="font-medium text-gray-400">Price:</span>{" "}
            ₹{vehicle.pricePerDay} / day
          </p>
        </div>

        {vehicle.description && (
          <p className="mt-5 text-gray-400 leading-relaxed">
            {vehicle.description}
          </p>
        )}

        <hr className="my-8 border-gray-800" />

        {/* BOOKING */}
        <h3 className="text-xl font-semibold text-white mb-4">
          Book this vehicle
        </h3>

        {bookingError && (
          <p className="text-red-500 mb-4">
            {bookingError}
          </p>
        )}

        {user?.role === "renter" ? (
          <div className="space-y-5 max-w-md">

            {/* START DATE */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* ✅ DAYS & PRICE UI */}
            {days > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm space-y-2">
                <p>
                  <span className="text-gray-400">
                    Number of days:
                  </span>{" "}
                  <span className="font-medium text-white">
                    {days}
                  </span>
                </p>

                <p>
                  <span className="text-gray-400">
                    Price per day:
                  </span>{" "}
                  ₹{vehicle.pricePerDay}
                </p>

                <p className="text-lg font-semibold text-white">
                  Total: ₹{totalPrice}
                </p>
              </div>
            )}

            {/* BOOK BUTTON */}
            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {bookingLoading
                ? "Booking..."
                : "Book Now"}
            </button>
          </div>
        ) : (
          <p className="text-gray-400">
            Login as a renter to book this vehicle.
          </p>
        )}

        <hr className="my-8 border-gray-800" />

        {/* REVIEWS */}
        <h3 className="text-xl font-semibold text-white mb-5">
          Reviews
        </h3>

        {reviews.length === 0 && (
          <p className="text-gray-400">
            No reviews yet
          </p>
        )}

        <div className="space-y-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4"
            >
              <p className="font-medium text-white">
                {r.user.name}
              </p>
              <p className="text-sm text-yellow-400">
                ⭐ {r.rating}
              </p>
              {r.comment && (
                <p className="text-gray-300 text-sm mt-2">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default VehicleDetails;
