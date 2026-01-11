import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyVehicles,
  deleteVehicle,
} from "../../api/owner.api";

const OwnerVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVehicles = async () => {
    try {
      const data = await getMyVehicles();
      setVehicles(data.vehicles || []);
    } catch {
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // ✅ FIXED DELETE HANDLER (THIS WAS THE ISSUE)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await deleteVehicle(id);
      alert("Vehicle deleted successfully");
      loadVehicles();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Vehicle cannot be deleted while booked"
      );
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

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            My Vehicles
          </h2>

          <Link
            to="/owner/vehicles/add"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium
                       hover:bg-indigo-700 transition"
          >
            ➕ Add Vehicle
          </Link>
        </div>

        {/* EMPTY STATE */}
        {vehicles.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
            No vehicles added yet
          </div>
        )}

        {/* GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                         hover:shadow-lg transition p-6 flex flex-col"
            >
              {/* IMAGE */}
              <div className="h-32 bg-gray-800 rounded-xl overflow-hidden mb-4">
                {v.images && v.images.length > 0 ? (
                  <img
                    src={v.images[0]}
                    alt={`${v.make} ${v.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* INFO */}
              <h4 className="text-lg font-semibold text-white">
                {v.make} {v.model}
              </h4>

              <p className="text-gray-400 mt-1 text-sm">
                ₹ {v.pricePerDay} / day
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full w-fit
                  ${
                    v.approved
                      ? "bg-green-900/40 text-green-400"
                      : "bg-yellow-900/40 text-yellow-400"
                  }`}
              >
                {v.approved ? "APPROVED" : "PENDING"}
              </span>

              {/* ACTIONS */}
              <div className="mt-auto pt-4 flex gap-4">
                <Link
                  to={`/owner/vehicles/${v._id}/edit`}
                  className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(v._id)}
                  disabled={v.bookingCount > 0}
                  className={`text-sm font-medium transition
                    ${
                      v.bookingCount > 0
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-red-400 hover:text-red-300"
                    }`}
                >
                  Delete
                </button>
              </div>

              {/* BOOKED INFO */}
              {v.bookingCount > 0 && (
                <p className="text-xs text-red-400 mt-2">
                  Cannot delete – vehicle has active bookings
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerVehicles;
