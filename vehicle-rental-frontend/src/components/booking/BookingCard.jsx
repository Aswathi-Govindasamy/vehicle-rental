const BookingCard = ({ booking }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 transition hover:shadow-md">
      <p className="text-lg font-semibold text-gray-800">
        {booking.vehicle.make} {booking.vehicle.model}
      </p>

      <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
        <span>
          Status:{" "}
          <span
            className={`font-medium ${
              booking.status === "booked"
                ? "text-green-600"
                : booking.status === "pending_payment"
                ? "text-yellow-600"
                : booking.status === "cancelled"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {booking.status}
          </span>
        </span>

        <span className="font-medium text-gray-800">
          ₹{booking.totalAmount}
        </span>
      </div>
    </div>
  );
};

export default BookingCard;
