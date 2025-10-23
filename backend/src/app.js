const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
const districtRoutes = require("./routes/districtRoutes");
const historicalRoutes = require("./routes/historicalRoutes");
const comparisonRoutes = require("./routes/comparisonRoutes");
const statsRoutes = require("./routes/statsRoutes");

app.use("/api/districts", districtRoutes);
app.use("/api/historical", historicalRoutes);
app.use("/api/comparison", comparisonRoutes);
app.use("/api/stats", statsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "MGNREGA Dashboard API",
    version: "1.0.0",
    endpoints: {
      health: "/health",

      // District endpoints
      districts: "/api/districts",
      districtList: "/api/districts/list",
      availableYears: "/api/districts/years/available",
      specificDistrict: "/api/districts/:districtCode?finYear=YYYY-YYYY",
      latestDistrict: "/api/districts/:districtCode/latest",
      districtSummary: "/api/districts/:districtCode/summary?finYear=YYYY-YYYY",

      // Historical endpoints
      districtTrends:
        "/api/historical/district/:districtCode/trends?finYear=YYYY-YYYY",
      monthlyComparison:
        "/api/historical/district/:districtCode/monthly-comparison?years=YYYY-YYYY,YYYY-YYYY",
      performanceEvolution:
        "/api/historical/district/:districtCode/performance-evolution?finYear=YYYY-YYYY",
      stateTrends: "/api/historical/state/trends?finYear=YYYY-YYYY",

      // Comparison endpoints
      compareDistricts:
        "/api/comparison/districts?codes=XXXX,XXXX&finYear=YYYY-YYYY",
      compareWithState:
        "/api/comparison/district/:districtCode/vs-state?finYear=YYYY-YYYY",
      rankings:
        "/api/comparison/rankings?finYear=YYYY-YYYY&metric=households_worked",
      peers: "/api/comparison/district/:districtCode/peers?finYear=YYYY-YYYY",

      // Statistics endpoints
      stateStats: "/api/stats/state?finYear=YYYY-YYYY",
      districtStats: "/api/stats/district/:districtCode?finYear=YYYY-YYYY",
      dashboardStats: "/api/stats/dashboard?finYear=YYYY-YYYY",
      demographics: "/api/stats/demographics?finYear=YYYY-YYYY",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
