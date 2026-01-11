import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Admin Dashboard
        </h2>

        {/* GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/users"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:bg-gray-800 hover:shadow-lg transition flex flex-col"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Manage Users
            </h3>
            <p className="text-sm text-gray-400">
              View, block or manage users
            </p>
          </Link>

          <Link
            to="/admin/vehicles"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:bg-gray-800 hover:shadow-lg transition flex flex-col"
          >
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Vehicle Approvals
            </h3>
            <p className="text-sm text-gray-400">
              Approve or reject vehicles
            </p>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:bg-gray-800 hover:shadow-lg transition flex flex-col"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              All Bookings
            </h3>
            <p className="text-sm text-gray-400">
              Monitor all system bookings
            </p>
          </Link>

          <Link
            to="/admin/payments"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:bg-gray-800 hover:shadow-lg transition flex flex-col"
          >
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              All Payments
            </h3>
            <p className="text-sm text-gray-400">
              Track payment transactions
            </p>
          </Link>

          <Link
            to="/admin/reviews"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:bg-gray-800 hover:shadow-lg transition flex flex-col"
          >
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Review Moderation
            </h3>
            <p className="text-sm text-gray-400">
              Approve or remove reviews
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
