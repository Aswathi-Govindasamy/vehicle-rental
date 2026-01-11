import api from "./axios";

// USERS
export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const toggleUserBlock = async (id) => {
  const res = await api.patch(`/admin/users/${id}/block`);
  return res.data;
};

// VEHICLES
export const getAllVehicles = async () => {
  const res = await api.get("/admin/vehicles");
  return res.data;
};

export const approveVehicle = async (id) => {
  const res = await api.patch(`/admin/vehicles/${id}/approve`);
  return res.data;
};

export const rejectVehicle = async (id) => {
  const res = await api.delete(`/admin/vehicles/${id}/reject`);
  return res.data;
};

// BOOKINGS
export const getAllBookings = async () => {
  const res = await api.get("/admin/bookings");
  return res.data;
};

// PAYMENTS
export const getAllPayments = async () => {
  const res = await api.get("/admin/payments");
  return res.data;
};

// REVIEWS
export const getAllReviews = async () => {
  const res = await api.get("/admin/reviews");
  return res.data;
};

export const approveReview = async (id) => {
  const res = await api.patch(`/admin/reviews/${id}/approve`);
  return res.data;
};

export const rejectReview = async (id) => {
  const res = await api.delete(`/admin/reviews/${id}/reject`);
  return res.data;
};
