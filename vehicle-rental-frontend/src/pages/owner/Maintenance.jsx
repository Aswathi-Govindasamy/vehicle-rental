import { useEffect, useState } from "react";
import {
  getMaintenanceHistory,
  addMaintenance,
  completeMaintenance,
} from "../../api/owner.api";

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vehicle, setVehicle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");

  const loadRecords = async () => {
    const data = await getMaintenanceHistory();
    setRecords(data.records);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await addMaintenance({
        vehicle,
        description,
        cost,
      });
      setVehicle("");
      setDescription("");
      setCost("");
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add maintenance");
    }
  };

  const handleComplete = async (id) => {
    await completeMaintenance(id);
    loadRecords();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Maintenance
        </h2>

        {/* ADD MAINTENANCE */}
        <form
          onSubmit={handleAdd}
          className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 mb-10"
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
            <input
              placeholder="Vehicle ID"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              required
              className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5 text-sm
                         text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5 text-sm
                         text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <input
              placeholder="Cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5 text-sm
                         text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-md text-sm font-medium
                         hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
        </form>

        {/* HISTORY */}
        <h4 className="text-2xl font-semibold text-white mb-6">
          Maintenance History
        </h4>

        {records.length === 0 && (
          <p className="text-gray-400 bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            No records
          </p>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {records.map((r) => (
            <div
              key={r._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                         hover:shadow-lg transition p-6 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <p className="text-lg font-semibold text-white">
                  {r.vehicle.make} {r.vehicle.model}
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
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm
                               hover:bg-green-700 transition"
                  >
                    Mark Completed
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

export default Maintenance;
