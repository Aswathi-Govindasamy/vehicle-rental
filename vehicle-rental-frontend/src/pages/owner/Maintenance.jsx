import { useEffect, useState } from "react";
import {
  getMaintenanceHistory,
  addMaintenance,
  completeMaintenance,
  getMyVehicles,
} from "../../api/owner.api";

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    try {
      const [historyRes, vehiclesRes] = await Promise.all([
        getMaintenanceHistory(),
        getMyVehicles(),
      ]);

      setRecords(historyRes.records || []);
      setVehicles(vehiclesRes.vehicles || []);
    } catch {
      setError("Failed to load maintenance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= ADD MAINTENANCE ================= */

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!vehicle) {
      setError("Please select a vehicle");
      return;
    }

    try {
      await addMaintenance({
        vehicle, // ✅ AUTO ID
        description,
        cost,
      });

      setVehicle("");
      setDescription("");
      setCost("");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add maintenance");
    }
  };

  /* ================= COMPLETE ================= */

  const handleComplete = async (id) => {
    try {
      await completeMaintenance(id);
      loadData();
    } catch {
      setError("Failed to update maintenance status");
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

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Maintenance
        </h2>

        {/* ================= ADD MAINTENANCE ================= */}
        <form
          onSubmit={handleAdd}
          className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 mb-12"
        >
          <h4 className="text-xl font-semibold text-white mb-6">
            Add Maintenance
          </h4>

          {error && (
            <p className="mb-6 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ✅ VEHICLE DROPDOWN */}
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              required
              className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5
                         text-sm text-gray-200 focus:outline-none"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.make} {v.model}
                </option>
              ))}
            </select>

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5
                         text-sm text-gray-200 placeholder-gray-500"
            />

            <input
              placeholder="Cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5
                         text-sm text-gray-200 placeholder-gray-500"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-md
                         text-sm font-medium hover:bg-indigo-700 transition"
            >
              Add Maintenance
            </button>
          </div>
        </form>

        {/* ================= HISTORY ================= */}
        <h4 className="text-2xl font-semibold text-white mb-6">
          Maintenance History
        </h4>

        {records.length === 0 && (
          <p className="text-gray-400 bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            No maintenance records
          </p>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {records.map((r) => {
            const vehicleName =
              typeof r.vehicle === "object" && r.vehicle !== null
                ? `${r.vehicle.make} ${r.vehicle.model}`
                : "Vehicle";

            return (
              <div
                key={r._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                           hover:shadow-lg transition p-6 flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <p className="text-lg font-semibold text-white">
                    {vehicleName}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold
                      ${
                        r.status === "completed"
                          ? "bg-green-900/40 text-green-400"
                          : "bg-yellow-900/40 text-yellow-400"
                      }`}
                  >
                    {r.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-400 mt-3 text-sm">
                  {r.description}
                </p>

                <p className="text-gray-300 mt-2 text-sm">
                  Cost: ₹{r.cost}
                </p>

                {r.status !== "completed" && (
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleComplete(r._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md
                                 text-sm hover:bg-green-700 transition"
                    >
                      Mark Completed
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
