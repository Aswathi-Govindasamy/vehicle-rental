import { useEffect, useState } from "react";
import {
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
} from "../../api/admin.api";

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async () => {
    const data = await getAllVehicles();
    setVehicles(data.vehicles);
    setLoading(false);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  /* ================= ACTION HANDLERS ================= */

  const handleApprove = async (id) => {
    await approveVehicle(id);
    loadVehicles(); // ✅ refresh UI
  };

  const handleReject = async (id) => {
    await rejectVehicle(id);
    loadVehicles(); // ✅ refresh UI
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Vehicle Approvals
        </h2>

        {vehicles.length === 0 && (
          <p className="text-gray-400">No vehicles found</p>
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
              <div className="h-36 bg-gray-800 rounded-xl overflow-hidden mb-4">
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
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {v.make} {v.model}
                </h4>

                <p className="text-sm text-gray-400 mt-1">
                  Owner: {v.owner?.name || "Unknown"}
                </p>
              </div>

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
              {!v.approved && (
                <div className="mt-auto pt-5 flex gap-3">
                  <button
                    onClick={() => handleApprove(v._id)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm
                               hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(v._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm
                               hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminVehicles;
