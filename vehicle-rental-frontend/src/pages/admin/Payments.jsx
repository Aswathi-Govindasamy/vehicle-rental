import { useEffect, useState } from "react";
import { getAllPayments } from "../../api/admin.api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    const data = await getAllPayments();
    setPayments(data.payments);
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Payments
        </h2>

        {payments.length === 0 && (
          <p className="text-gray-400">No payments found</p>
        )}

        {/* GRID: 1 / 2 / 4 columns */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                         hover:shadow-lg transition p-6 flex flex-col"
            >
              <p className="text-sm text-gray-400">
                <span className="font-medium text-gray-300">
                  User:
                </span>{" "}
                {p.user?.email || "N/A"}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                <span className="font-medium text-gray-300">
                  Amount:
                </span>{" "}
                ₹{p.amount}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-4 px-3 py-1 text-xs font-semibold rounded-full w-fit
                  ${
                    p.status === "paid"
                      ? "bg-green-900/40 text-green-400"
                      : p.status === "failed"
                      ? "bg-red-900/40 text-red-400"
                      : "bg-yellow-900/40 text-yellow-400"
                  }`}
              >
                {p.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
