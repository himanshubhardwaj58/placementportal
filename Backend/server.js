const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// ── Security Middleware ──
// Parse cookies
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

// Rate limiting: Prevent brute-force & DDoS attacks
const limiter = rateLimit({
  max: 500, // Limit each IP to 500 requests per 15 mins (adjustable for dev)
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Restrict CORS to frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://placementportal-frontend.vercel.app"
    ], // Allow FRONTEND_URL, localhost, or deployed frontend
    credentials: true,
  })
);

// Body parser, reading data from body into req.body, with a size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── ENV ──
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// ── Routes ──
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Placement Portal API is running" });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Maximum size is 5MB" });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ── Connect DB ──
if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in environment variables!");
} else {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));
}

// Start server only if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel serverless function
module.exports = app;
