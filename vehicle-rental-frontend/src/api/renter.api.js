import api from "./axios";

// Public – browse vehicles
export const getVehicles = async (params = {}) => {
  const res = await api.get("/renter/vehicles", { params });
  return res.data;
};

// Public – vehicle details + reviews
export const getVehicleDetails = async (id) => {
  const res = await api.get(`/renter/vehicles/${id}`);
  return res.data;
};
// Create booking (payment pending)
export const createBooking = async (data) => {
  const res = await api.post("/renter/bookings", data);
  return res.data;
};

// Get my bookings
export const getMyBookings = async () => {
  const res = await api.get("/renter/bookings");
  return res.data;
};

// Cancel booking
export const cancelBooking = async (id) => {
  const res = await api.patch(`/renter/bookings/${id}/cancel`);
  return res.data;
};

