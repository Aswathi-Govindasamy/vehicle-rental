import api from "./axios";

// Create Razorpay order
export const createPaymentOrder = async (bookingId) => {
  const res = await api.post("/payments/create", { bookingId });
  return res.data;
};

// Verify payment
export const verifyPayment = async (payload) => {
  const res = await api.post("/payments/verify", payload);
  return res.data;
};

// Get my payments
export const getMyPayments = async () => {
  const res = await api.get("/renter/payments");
  return res.data;
};
