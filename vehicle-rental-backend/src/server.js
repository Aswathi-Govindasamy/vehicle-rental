import dotenv from "dotenv";
dotenv.config(); // MUST be first

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

// --------------------------------------------------
// DB
// --------------------------------------------------
connectDB();

const app = express();

// --------------------------------------------------
// CORS (FIXED FOR NETLIFY + RENDER)
// --------------------------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://vehiclerental123.netlify.app", // 🔴 PUT YOUR REAL NETLIFY URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: preflight support
app.options("*", cors());

// --------------------------------------------------
// MIDDLEWARES
// --------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// --------------------------------------------------
// ROUTES
// --------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/renter", renterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------
app.get("/", (req, res) => {
  res.send("🚗 Vehicle Rental API is running");
});

// --------------------------------------------------
// ERROR HANDLER (MUST BE LAST)
// --------------------------------------------------
app.use(errorHandler);

// --------------------------------------------------
// SERVER
// --------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
