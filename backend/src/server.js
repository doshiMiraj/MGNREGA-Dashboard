const app = require("./app");
const { connectDB } = require("./config/database");
const { connectRedis } = require("./config/redis");
const syncJob = require("./jobs/syncJob");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Initialize database and redis
const initializeServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    // Connect to Redis (optional - will continue without it)
    await connectRedis();

    // Start sync job
    syncJob.start();

    // Start server
    const server = app.listen(PORT, () => {
      console.log("═══════════════════════════════════════════════════");
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log("═══════════════════════════════════════════════════");
    });

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  syncJob.stop();
  if (server) {
    server.close(() => {
      console.log("HTTP server closed");
    });
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  syncJob.stop();
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
initializeServer();
