import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.model.js";
import Payment from "../models/Payment.model.js";
import { sendEmail } from "../services/email.service.js";

/* ======================================================
   CREATE RAZORPAY INSTANCE (SAFE)
====================================================== */
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/* ======================================================
   CREATE PAYMENT ORDER
   POST /api/payments/create
====================================================== */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400);
      throw new Error("Booking ID is required");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized");
    }

    if (booking.status !== "pending_payment") {
      res.status(400);
      throw new Error("Payment already initiated or completed");
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `booking_${booking._id}`,
    });

    const payment = await Payment.create({
      booking: booking._id,
      user: booking.user,
      razorpayOrderId: order.id,
      amount: booking.totalAmount,
      status: "created",
    });

    res.status(201).json({
      success: true,
      order,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   VERIFY PAYMENT
   POST /api/payments/verify
====================================================== */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !paymentId
    ) {
      res.status(400);
      throw new Error("Missing payment verification fields");
    }

    const payment = await Payment.findById(paymentId).populate("booking");

    if (!payment) {
      res.status(404);
      throw new Error("Payment record not found");
    }

    /* ======================================================
       ✅ ALLOW POSTMAN / TEST PAYMENTS
    ====================================================== */
    const isTestPayment =
      razorpay_payment_id.startsWith("pay_test") ||
      razorpay_signature.startsWith("signature_test");

    if (!isTestPayment) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        payment.status = "failed";
        await payment.save();
        throw new Error("Payment verification failed");
      }
    }

    /* ======================================================
       UPDATE PAYMENT + BOOKING
    ====================================================== */
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    await payment.save();

    const booking = payment.booking;
    booking.status = "booked";
    await booking.save();

    /* ======================================================
       EMAIL CONFIRMATION
    ====================================================== */
    if (req.user?.email) {
  await sendEmail(
    req.user.email,
    "Booking Confirmed 🎉",
    `
      <h3>Payment Successful</h3>
      <p>Your booking <b>${booking._id}</b> is confirmed.</p>
    `
  );
}

   

    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    next(error);
  }
};
