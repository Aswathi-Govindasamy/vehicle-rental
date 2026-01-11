import { useEffect, useState } from "react";
import { getMyPayments } from "../../api/payment.api";

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await getMyPayments();
        setPayments(res.payments || []);
      } catch (err) {
        console.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading payments...</p>;
  }

  if (payments.length === 0) {
    return <p className="text-center text-gray-400">No payments found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">My Payments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((p) => {
          const vehicle = p.booking?.vehicle;

          return (
            <div
              key={p._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-md"
            >
              {/* VEHICLE DETAILS */}
              <h2 className="text-lg font-semibold text-white">
                {vehicle?.make} {vehicle?.model}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Type: {vehicle?.type || "N/A"}
              </p>

              {/* PAYMENT INFO */}
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Amount:</span>{" "}
                  <span className="font-medium text-white">
                    ₹{p.amount}
                  </span>
                </p>

                <p>
                  <span className="text-gray-400">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      p.status === "paid"
                        ? "bg-green-900/40 text-green-400"
                        : p.status === "failed"
                        ? "bg-red-900/40 text-red-400"
                        : "bg-yellow-900/40 text-yellow-400"
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyPayments;
