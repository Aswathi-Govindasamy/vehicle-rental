import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMyVehicles,
  updateVehicle,
} from "../../api/owner.api";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await getMyVehicles();
        const vehicle = data.vehicles.find(
          (v) => v._id === id
        );
        setForm(vehicle);
      } catch {
        setError("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVehicle(id, form);
      navigate("/owner/vehicles");
    } catch {
      setError("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading...
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-8">
          Edit Vehicle
        </h2>

        {error && (
          <p className="mb-6 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md px-4 py-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            "make",
            "model",
            "year",
            "pricePerDay",
            "location",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">
                {field}
              </label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5
                           text-sm text-gray-200
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2.5
                         text-sm text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              Update Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
