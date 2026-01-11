import { Link } from "react-router-dom";
import useAuth from "../../auth/UseAuth";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* 🔷 LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Vehicle Rental Logo"
              className="h-9 w-9 object-contain rounded-full"
            />
            <span className="text-xl font-bold text-white">
              RentMyRide
            </span>
          </Link>

          {/* 🔗 LINKS */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>

            {user?.role === "renter" && (
              <>
                <Link
                  to="/bookings"
                  className="text-gray-300 hover:text-white transition"
                >
                  My Bookings
                </Link>
                <Link
                  to="/payments"
                  className="text-gray-300 hover:text-white transition"
                >
                  Payments
                </Link>
              </>
            )}

            {user?.role === "owner" && (
              <Link
                to="/owner/dashboard"
                className="text-gray-300 hover:text-white transition"
              >
                Owner
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="text-gray-300 hover:text-white transition"
              >
                Admin
              </Link>
            )}

            {!user ? (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
