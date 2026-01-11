import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Owner Dashboard
        </h2>

        {/* GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* My Vehicles */}
          <Link
            to="/owner/vehicles"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:shadow-lg hover:bg-gray-800 transition flex flex-col"
          >
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              My Vehicles
            </h3>
            <p className="text-sm text-gray-400">
              View and manage your listed vehicles
            </p>
          </Link>

          {/* Add Vehicle */}
          <Link
            to="/owner/vehicles/add"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:shadow-lg hover:bg-gray-800 transition flex flex-col"
          >
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Add Vehicle
            </h3>
            <p className="text-sm text-gray-400">
              List a new vehicle for rent
            </p>
          </Link>

          {/* Bookings */}
          <Link
            to="/owner/bookings"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:shadow-lg hover:bg-gray-800 transition flex flex-col"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Bookings
            </h3>
            <p className="text-sm text-gray-400">
              View bookings for your vehicles
            </p>
          </Link>

          {/* Maintenance */}
          <Link
            to="/owner/maintenance"
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow
                       hover:shadow-lg hover:bg-gray-800 transition flex flex-col"
          >
            <div className="text-4xl mb-4">🛠</div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Maintenance
            </h3>
            <p className="text-sm text-gray-400">
              Track service & maintenance records
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
