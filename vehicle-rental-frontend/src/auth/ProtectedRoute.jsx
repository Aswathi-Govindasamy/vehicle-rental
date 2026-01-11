import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./UseAuth"
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
