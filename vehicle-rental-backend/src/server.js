import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST, BEFORE ALL OTHER IMPORTS

import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import ownerRoutes from "./routes/owner.routes.js";
import renterRoutes from "./routes/renter.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

// Error middleware
import errorHandler from "./middlewares/error.middleware.js";

// Connect to MongoDB
connectDB();

const app = express();

/* ======================================================
   MIDDLEWARES
   ====================================================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-real-site-name.netlify.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* ======================================================
   ROUTES
   ====================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/renter", renterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

/* ======================================================
   HEALTH CHECK (OPTIONAL BUT GOOD)
   ====================================================== */
app.get("/", (req, res) => {
  res.send("🚗 Vehicle Rental API is running");
});

/* ======================================================
   ERROR HANDLER (MUST BE LAST)
   ====================================================== */
app.use(errorHandler);

/* ======================================================
   SERVER
   ====================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
