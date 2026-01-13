import { useEffect, useState } from "react";
import { getAllBookings } from "../../api/admin.api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    const data = await getAllBookings();
    setBookings(data.bookings);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            All Bookings
          </h2>

          {/* ✅ REFRESH BUTTON */}
          <button
            onClick={loadBookings}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm
                       hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <p className="text-gray-400">Loading bookings...</p>
        )}

        {!loading && bookings.length === 0 && (
          <p className="text-gray-400">No bookings found</p>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                         hover:shadow-lg transition p-6 flex flex-col"
            >
              {/* VEHICLE IMAGE */}
              <div className="h-36 bg-gray-800 rounded-xl overflow-hidden mb-4">
                {b.vehicle?.images?.length > 0 ? (
                  <img
                    src={b.vehicle.images[0]}
                    alt={`${b.vehicle.make} ${b.vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">Vehicle:</span>{" "}
                {b.vehicle?.make} {b.vehicle?.model}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                <span className="font-medium text-gray-300">User:</span>{" "}
                {b.user?.email || "N/A"}
              </p>

              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                    ${
                      b.status === "booked"
                        ? "bg-green-900/40 text-green-400"
                        : b.status === "cancelled"
                        ? "bg-red-900/40 text-red-400"
                        : "bg-yellow-900/40 text-yellow-400"
                    }`}
                >
                  {b.status.toUpperCase()}
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-gray-100">
                Total: ₹{b.totalAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
