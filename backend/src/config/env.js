require("dotenv").config();

// Environment variable validation and defaults
const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT) || 5000,
  API_BASE_URL:
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME || "mgnrega_db",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX) || 20,
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN) || 2,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  REDIS_TTL: parseInt(process.env.REDIS_TTL) || 86400,

  // Data.gov.in API
  DATA_GOV_API_KEY: process.env.DATA_GOV_API_KEY,
  DATA_GOV_BASE_URL:
    process.env.DATA_GOV_BASE_URL || "https://api.data.gov.in/resource",
  DATA_GOV_RESOURCE_ID:
    process.env.DATA_GOV_RESOURCE_ID || "ee03643a-ee4c-48c2-ac30-9f2ff26ab722",

  // State Configuration
  TARGET_STATE: process.env.TARGET_STATE || "UTTAR PRADESH",
  TARGET_STATE_CODE: process.env.TARGET_STATE_CODE || "31",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // Sync Job
  SYNC_JOB_ENABLED: process.env.SYNC_JOB_ENABLED === "true",
  SYNC_JOB_CRON: process.env.SYNC_JOB_CRON || "0 2 * * *",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || "./logs",
};

// Validate required environment variables
const requiredEnvVars = ["DB_PASSWORD", "DATA_GOV_API_KEY"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:");
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  console.error("\nPlease check your .env file");
  process.exit(1);
}

// Export validated environment variables
module.exports = env;
