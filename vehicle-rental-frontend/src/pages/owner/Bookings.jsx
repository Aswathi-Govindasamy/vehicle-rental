import { useEffect, useState } from "react";
import { getOwnerBookings } from "../../api/owner.api";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getOwnerBookings();
      setBookings(data.bookings);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Bookings (My Vehicles)
        </h2>

        {bookings.length === 0 && (
          <p className="text-gray-400 bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            No bookings yet
          </p>
        )}

        {/* 🔳 GRID: 1 / 2 / 4 columns */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-semibold text-white">
                  {b.vehicle.make} {b.vehicle.model}
                </h4>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold
                    ${
                      b.status === "booked"
                        ? "bg-green-900/40 text-green-400"
                        : b.status === "pending_payment"
                        ? "bg-yellow-900/40 text-yellow-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                >
                  {b.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-4 text-sm text-gray-400 space-y-2">
                <p>
                  <span className="font-medium text-gray-300">
                    Renter:
                  </span>{" "}
                  {b.user.name}
                </p>

                <p>
                  <span className="font-medium text-gray-300">
                    Duration:
                  </span>{" "}
                  {new Date(b.startDate).toDateString()} →{" "}
                  {new Date(b.endDate).toDateString()}
                </p>

                <p>
                  <span className="font-medium text-gray-300">
                    Total:
                  </span>{" "}
                  ₹{b.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerBookings;
