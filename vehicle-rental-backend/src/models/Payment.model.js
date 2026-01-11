import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔐 Razorpay specific
    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    // 🔗 Generic transaction reference (invoice-safe)
    transactionId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than zero"],
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String, // upi, card, netbanking
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    // 🧾 Invoice / receipt reference (future use)
    invoiceNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
