import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    make: {
      type: String,
      required: [true, "Vehicle make is required"],
      trim: true,
    },

    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Manufacturing year is required"],
      min: [1980, "Year must be realistic"],
    },

    type: {
      type: String,
      enum: ["car", "bike", "suv", "van", "truck"],
      required: [true, "Vehicle type is required"],
      lowercase: true,
    },

    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [1, "Price must be greater than zero"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    approved: {
      type: Boolean,
      default: false, // admin approval
    },

    // ✅ Optional but useful for analytics
    totalRentals: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vehicle", vehicleSchema);
