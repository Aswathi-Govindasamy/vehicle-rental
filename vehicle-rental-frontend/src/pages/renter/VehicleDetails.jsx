import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleDetails, createBooking } from "../../api/renter.api";
import useAuth from "../../auth/useAuth";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        setReviews(data.reviews || []);
      } catch {
        setError("Failed to load vehicle details");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  /* ================= CALCULATE DAYS & PRICE ================= */
  useEffect(() => {
    if (!startDate || !endDate || !vehicle) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

 const DAY = 1000 * 60 * 60 * 24;

const calculatedDays =
  Math.floor((end - start) / DAY) + 1;



    setDays(calculatedDays);
    setTotalPrice(calculatedDays * vehicle.pricePerDay);
  }, [startDate, endDate, vehicle]);

  /* ================= HANDLE BOOKING ================= */
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

      // ✅ Correct flow
      navigate("/bookings");
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

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500">
        {error || "Vehicle not found"}
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-6">
          {vehicle.make} {vehicle.model}
        </h2>

        {/* IMAGE */}
        <div className="w-full h-64 bg-gray-800 rounded-xl overflow-hidden mb-6">
          {vehicle.images?.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-2 text-gray-300">
          <p><span className="text-gray-400">Type:</span> {vehicle.type}</p>
          <p><span className="text-gray-400">Location:</span> {vehicle.location}</p>
          <p><span className="text-gray-400">Price:</span> ₹{vehicle.pricePerDay} / day</p>
        </div>

        {vehicle.description && (
          <p className="mt-4 text-gray-400">{vehicle.description}</p>
        )}

        <hr className="my-8 border-gray-800" />

        {/* BOOKING */}
        {user?.role === "renter" && (
          <>
            <h3 className="text-xl font-semibold text-white mb-4">Book this vehicle</h3>

            {bookingError && (
              <p className="text-red-500 mb-3">{bookingError}</p>
            )}

            <div className="space-y-4 max-w-md">
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
              />

              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
              />

              {days > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm">
                  <p>Days: <strong>{days}</strong></p>
                  <p>Total: <strong>₹{totalPrice}</strong></p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>
            </div>
          </>
        )}

        <hr className="my-8 border-gray-800" />

        {/* REVIEWS */}
        <h3 className="text-xl font-semibold text-white mb-4">Reviews</h3>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="font-semibold text-white">{r.user?.name}</p>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={s <= r.rating ? "text-yellow-400" : "text-gray-600"}>★</span>
                  ))}
                </div>
                {r.comment && <p className="text-gray-300 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default VehicleDetails;
