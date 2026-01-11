import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleDetails, createBooking } from "../../api/renter.api";
import useAuth from "../../auth/UseAuth";

const VehicleDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

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

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setBookingError("Please select start and end dates");
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
        "Booking created successfully! Proceed to payment from My Bookings."
      );
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-6">
          {vehicle.make} {vehicle.model}
        </h2>

        {/* ✅ IMAGES */}
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
          <p className="text-red-500 mb-4">{bookingError}</p>
        )}

        {user?.role === "renter" ? (
          <div className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                           text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
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
          <p className="text-gray-400">No reviews yet</p>
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
