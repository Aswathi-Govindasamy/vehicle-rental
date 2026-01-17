import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyBookings, modifyBooking } from "../../api/renter.api";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ================= LOAD BOOKING ================= */
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await getMyBookings();
        const found = res.bookings.find((b) => b._id === id);

        if (!found) {
          setError("Booking not found");
          return;
        }

        if (found.status !== "pending_payment") {
          setError("Only unpaid bookings can be modified");
          return;
        }

        setBooking(found);
        setVehicle(found.vehicle);

        setStartDate(found.startDate.slice(0, 10));
        setEndDate(found.endDate.slice(0, 10));
      } catch {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  /* ================= RECALCULATE ================= */
  useEffect(() => {
    if (!vehicle || !startDate || !endDate) {
      setDays(0);
      setTotal(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setDays(0);
      setTotal(0);
      return;
    }

    const d = Math.max(
  1,
  Math.ceil((end - start) / (1000 * 60 * 60 * 24))
);


    setDays(d);
    setTotal(d * vehicle.pricePerDay);
  }, [startDate, endDate, vehicle]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!startDate || !endDate) {
      setError("Please select valid dates");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await modifyBooking(id, { startDate, endDate });

      alert("Booking dates updated successfully");
      navigate("/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
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

  if (error || !booking || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-500">
        {error || "Something went wrong"}
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white mb-6">
          Edit Booking
        </h2>

        {/* VEHICLE IMAGE */}
        <div className="w-full h-64 bg-gray-800 rounded-xl overflow-hidden mb-6">
          {vehicle.images?.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* VEHICLE DETAILS */}
        <div className="space-y-2 text-gray-300">
          <p>
            <span className="text-gray-400">Vehicle:</span>{" "}
            {vehicle.make} {vehicle.model}
          </p>
          <p>
            <span className="text-gray-400">Type:</span>{" "}
            {vehicle.type}
          </p>
          <p>
            <span className="text-gray-400">Location:</span>{" "}
            {vehicle.location}
          </p>
          <p>
            <span className="text-gray-400">Price:</span>{" "}
            ₹{vehicle.pricePerDay} / day
          </p>
        </div>

        <hr className="my-8 border-gray-800" />

        {/* DATE SELECTION */}
        <h3 className="text-xl font-semibold text-white mb-4">
          Modify Dates
        </h3>

        <div className="space-y-4 max-w-md">
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          />

          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2"
          />

          {days > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm">
              <p>Days: <strong>{days}</strong></p>
              <p>Total: <strong>₹{total}</strong></p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditBooking;
