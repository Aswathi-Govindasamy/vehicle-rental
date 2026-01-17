import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// route guards
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";

// admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminVehicles from "./pages/admin/Vehicles";
import AdminBookings from "./pages/admin/Bookings";
import AdminPayments from "./pages/admin/Payments";
import AdminReviews from "./pages/admin/Reviews";

// owner pages
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerVehicles from "./pages/owner/Vehicles";
import AddVehicle from "./pages/owner/AddVehicle";
import EditVehicle from "./pages/owner/EditVehicle";
import OwnerBookings from "./pages/owner/Bookings";
import Maintenance from "./pages/owner/Maintenance";

// renter pages
import Home from "./pages/renter/Home";
import VehicleDetails from "./pages/renter/VehicleDetails";
import MyBookings from "./pages/renter/MyBookings";
import MyPayments from "./pages/renter/MyPayments";
import AddReview from "./pages/renter/AddReview";

// misc
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// layout
import Navbar from "./components/layout/Navbar";
import EditBooking from "./pages/bookings/EditBooking";


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= PROTECTED ================= */}
        <Route element={<ProtectedRoute />}>
          
          {/* -------- ADMIN -------- */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/vehicles" element={<AdminVehicles />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
          </Route>

          {/* -------- OWNER -------- */}
          <Route element={<RoleRoute allowedRoles={["owner"]} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/vehicles" element={<OwnerVehicles />} />
            <Route path="/owner/vehicles/add" element={<AddVehicle />} />
            <Route path="/owner/vehicles/:id/edit" element={<EditVehicle />} />
            <Route path="/owner/bookings" element={<OwnerBookings />} />
            <Route path="/owner/maintenance" element={<Maintenance />} />
          </Route>

          {/* -------- RENTER -------- */}
          <Route element={<RoleRoute allowedRoles={["renter"]} />}>
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/payments" element={<MyPayments />} />
            <Route path="/reviews/add/:bookingId" element={<AddReview />} />
          </Route>

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />
        <Route
  path="/bookings/edit/:id"
  element={<EditBooking />}
/>

      </Routes>
    </Router>
  );
}

export default App;
