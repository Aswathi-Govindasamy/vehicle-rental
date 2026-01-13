import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../../api/renter.api";
import { createPaymentOrder, verifyPayment } from "../../api/payment.api";
const restoreScroll = () => {
  document.body.style.overflow = "auto";
  document.body.style.position = "static";
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId: data.paymentId,
          });

          alert("Payment successful!");
          loadBookings();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(id);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          My Bookings
        </h2>

        {bookings.length === 0 && (
          <p className="text-gray-400">No bookings found</p>
        )}

        {/* GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col"
            >
              {/* IMAGE */}
              <div className="h-36 bg-gray-800 rounded-xl overflow-hidden mb-4">
                {b.vehicle?.images?.length > 0 ? (
                  <img
                    src={b.vehicle.images[0]}
                    alt={
                      b.vehicle?.make
                        ? `${b.vehicle.make} ${b.vehicle.model}`
                        : "Vehicle Removed"
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <h4 className="text-lg font-semibold text-white">
                {b.vehicle?.make
                  ? `${b.vehicle.make} ${b.vehicle.model}`
                  : "Vehicle Removed"}
              </h4>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(b.startDate).toDateString()} →{" "}
                {new Date(b.endDate).toDateString()}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full w-fit
                  ${
                    b.status === "completed"
                      ? "bg-green-900/40 text-green-400"
                      : b.status === "pending_payment"
                      ? "bg-yellow-900/40 text-yellow-400"
                      : b.status === "booked"
                      ? "bg-blue-900/40 text-blue-400"
                      : "bg-red-900/40 text-red-400"
                  }`}
              >
                {b.status.replace("_", " ").toUpperCase()}
              </span>

              <p className="mt-3 font-medium text-gray-100">
                Total: ₹{b.totalAmount}
              </p>

              {/* ACTIONS */}
              <div className="mt-auto pt-4">
                {b.status === "pending_payment" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePay(b._id)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      Pay
                    </button>

                    <button
                      onClick={() => handleCancel(b._id)}
                      className="flex-1 bg-gray-800 text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {b.status === "completed" && (
                  <Link
                    to={`/reviews/add/${b._id}`}
                    className="inline-block mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Add Review →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
