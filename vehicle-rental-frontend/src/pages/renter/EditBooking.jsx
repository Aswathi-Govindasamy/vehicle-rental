import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyBookings, modifyBooking } from "../../api/renter.api";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await getMyBookings();
        const booking = res.bookings.find(b => b._id === id);

        if (!booking) {
          setError("Booking not found");
          return;
        }

        if (booking.status !== "pending_payment") {
          setError("Only unpaid bookings can be modified");
          return;
        }

        setStartDate(booking.startDate.slice(0, 10));
        setEndDate(booking.endDate.slice(0, 10));
      } catch {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await modifyBooking(id, { startDate, endDate });
      alert("Booking updated successfully");
      navigate("/bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl space-y-4 w-96"
      >
        <h2 className="text-xl font-semibold">Edit Booking Dates</h2>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBooking;
