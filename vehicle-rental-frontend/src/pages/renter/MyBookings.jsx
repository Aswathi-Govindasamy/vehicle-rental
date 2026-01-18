import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../../api/renter.api";
import { createPaymentOrder, verifyPayment } from "../../api/payment.api";

const restoreScroll = () => {
  document.body.style.overflow = "auto";
  document.body.style.position = "static";
};

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD BOOKINGS ================= */
  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.bookings || []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ================= PAY ================= */
  const handlePay = async (bookingId) => {
    try {
      const data = await createPaymentOrder(bookingId);

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Vehicle Rental System",
        description: "Booking Payment",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.paymentId,
            });

            alert("Payment successful!");
            restoreScroll();
            navigate("/payments");
          } catch {
            restoreScroll();
            alert("Payment verification failed");
          }
        },

        modal: { ondismiss: restoreScroll },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      restoreScroll();
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  /* ================= CANCEL ================= */
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(bookingId);
      alert("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (bookingId) => {
    navigate(`/bookings/edit/${bookingId}`);
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading bookings...
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          My Bookings
        </h2>

        {bookings.length === 0 && (
          <p className="text-gray-400">No bookings found</p>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {bookings.map((b) => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            const DAY = 1000 * 60 * 60 * 24;
const days =
  Math.floor((end - start) / DAY) + 1;


            return (
              <div
                key={b._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl shadow p-5 flex flex-col"
              >
                {/* VEHICLE */}
                <h4 className="text-lg font-semibold text-white">
                  {b.vehicle?.make
                    ? `${b.vehicle.make} ${b.vehicle.model}`
                    : "Vehicle Removed"}
                </h4>

                {/* DATES */}
                <p className="text-sm text-gray-400 mt-2">
                  {start.toDateString()} → {end.toDateString()}
                </p>

                {/* DAYS */}
                <p className="text-sm text-gray-300 mt-1">
                  Duration:{" "}
                  <span className="font-medium">{days} days</span>
                </p>

                {/* STATUS */}
                <span
                  className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-semibold w-fit
                    ${
                      b.status === "completed"
                        ? "bg-green-900/40 text-green-400"
                        : b.status === "pending_payment"
                        ? "bg-yellow-900/40 text-yellow-400"
                        : "bg-blue-900/40 text-blue-400"
                    }`}
                >
                  {b.status.replace("_", " ").toUpperCase()}
                </span>

                {/* TOTAL */}
                <p className="mt-3 font-medium text-gray-100">
                  Total Amount: ₹{b.totalAmount}
                </p>

                {/* ACTIONS */}
                <div className="mt-auto pt-4 space-y-2">
                  {b.status === "pending_payment" && (
                    <>
                      <button
                        onClick={() => handlePay(b._id)}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
                      >
                        Pay Now
                      </button>

                      <button
                        onClick={() => handleEdit(b._id)}
                        className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition"
                      >
                        Edit Dates
                      </button>

                      <button
                        onClick={() => handleCancel(b._id)}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}

                  {b.status === "completed" && (
                    <Link
                      to={`/reviews/add/${b._id}`}
                      className="inline-block mt-3 text-indigo-400 text-sm hover:text-indigo-300"
                    >
                      Add Review →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
