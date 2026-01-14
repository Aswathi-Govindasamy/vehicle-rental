import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleDetails, createBooking } from "../../api/renter.api";
import useAuth from "../../auth/useAuth";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ ADDED
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
        setReviews(data.reviews);
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

    if (isNaN(start) || isNaN(end) || start > end) {
      setDays(0);
      setTotalPrice(0);
      return;
    }

    const calculatedDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

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

      // ✅ MAIN FIX
      navigate("/bookings");

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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-white mb-6">
          {vehicle.make} {vehicle.model}
        </h2>

        {/* BOOKING */}
        {user?.role === "renter" && (
          <div className="space-y-5 max-w-md">
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

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
