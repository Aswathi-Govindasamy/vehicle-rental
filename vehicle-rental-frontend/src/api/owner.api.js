import api from "./axios";

/* ===================== VEHICLES ===================== */

// Get all vehicles owned by logged-in owner
export const getMyVehicles = async () => {
  const res = await api.get("/owner/vehicles");
  return res.data;
};

// Add new vehicle (with images)
export const addVehicle = async (data) => {
  const res = await api.post("/owner/vehicles", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Update vehicle
export const updateVehicle = async (id, data) => {
  const res = await api.patch(`/owner/vehicles/${id}`, data);
  return res.data;
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  const res = await api.delete(`/owner/vehicles/${id}`);
  return res.data;
};

/* ===================== BOOKINGS ===================== */

// ✅ REQUIRED BY OwnerBookings.jsx
export const getOwnerBookings = async () => {
  const res = await api.get("/owner/bookings");
  return res.data;
};

/* ===================== MAINTENANCE ===================== */

// Get maintenance history
export const getMaintenanceHistory = async () => {
  const res = await api.get("/owner/maintenance");
  return res.data;
};

// Add maintenance record
export const addMaintenance = async (data) => {
  const res = await api.post("/owner/maintenance", data);
  return res.data;
};

// Mark maintenance completed
export const completeMaintenance = async (id) => {
  const res = await api.patch(`/owner/maintenance/${id}/complete`);
  return res.data;
};
