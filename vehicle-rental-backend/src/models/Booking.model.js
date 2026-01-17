import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [1, "Total amount must be greater than zero"],
    },

    status: {
      type: String,
      enum: [
        "pending_payment", // created, waiting for payment
        "booked",          // payment successful
        "cancelled",
        "completed",
      ],
      default: "pending_payment",
    },

    // 🔗 Reference to payment record
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

/* 📅 Date validation */
/* 📅 Date validation */
bookingSchema.pre("save", function () {
  if (this.endDate < this.startDate) {
    throw new Error("End date must be the same or after start date");
  }
});


/* ⚡ Helps availability & history queries */
bookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1 });

export default mongoose.model("Booking", bookingSchema);
