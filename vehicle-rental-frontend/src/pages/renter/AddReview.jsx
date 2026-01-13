import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AddReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Load booking
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await api.get("/renter/bookings");

        const foundBooking = res.data.bookings.find(
          (b) => b._id === bookingId
        );

        if (!foundBooking) {
          setError("Booking not found");
        } else {
          setBooking(foundBooking);
        }
      } catch {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/renter/reviews", {
        booking: booking._id,
        vehicle:
          typeof booking.vehicle === "object"
            ? booking.vehicle._id
            : booking.vehicle,
        rating,
        comment,
      });

      alert("Review submitted for approval");
      navigate("/bookings");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add review"
      );
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

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500">
        {error}
      </div>
    );
  }

  const vehicleName =
    typeof booking.vehicle === "object" && booking.vehicle
      ? `${booking.vehicle.make} ${booking.vehicle.model}`
      : "Vehicle";

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-white text-center">
          Add Review
        </h2>

        <p className="text-sm text-gray-400 text-center">
          {vehicleName}
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ⭐ STAR RATING */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-3xl focus:outline-none"
                >
                  <span
                    className={
                      star <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Selected:{" "}
              <span className="text-white font-medium">
                {rating} / 5
              </span>
            </p>
          </div>

          {/* COMMENT */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Comment
            </label>
            <textarea
              placeholder="Write your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 resize-none
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
