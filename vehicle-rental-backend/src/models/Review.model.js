import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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

    // 🔗 Booking that allowed this review
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer",
      },
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },

    approved: {
      type: Boolean,
      default: false,
    },

    // Optional admin moderation note
    moderationNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* One review per user per vehicle */
reviewSchema.index({ user: 1, vehicle: 1 }, { unique: true });

/* Fast lookup for vehicle reviews */
reviewSchema.index({ vehicle: 1 });

export default mongoose.model("Review", reviewSchema);
