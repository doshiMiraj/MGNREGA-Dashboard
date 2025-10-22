// Application Constants

module.exports = {
  // States
  STATES: {
    UTTAR_PRADESH: "UTTAR PRADESH",
  },

  // Financial Years
  DEFAULT_FIN_YEAR: "2024-2025",

  // Cache TTL (in seconds)
  CACHE_TTL: {
    DISTRICT_DATA: 86400, // 24 hours
    ALL_DISTRICTS: 86400, // 24 hours
    COMPARISON: 43200, // 12 hours
    STATISTICS: 21600, // 6 hours
    DISTRICT_LIST: 604800, // 7 days
  },

  // API Limits
  API: {
    MAX_LIMIT: 1000,
    DEFAULT_LIMIT: 100,
    DEFAULT_OFFSET: 0,
  },

  // Month mapping
  MONTHS: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  // Performance thresholds for visual indicators
  PERFORMANCE_THRESHOLDS: {
    EMPLOYMENT_DAYS: {
      GOOD: 50, // >= 50 days per household
      AVERAGE: 30, // >= 30 days per household
      POOR: 0, // < 30 days per household
    },
    WAGE_RATE: {
      GOOD: 250, // >= Rs 250 per day
      AVERAGE: 200, // >= Rs 200 per day
      POOR: 0, // < Rs 200 per day
    },
    PAYMENT_TIMELINESS: {
      GOOD: 90, // >= 90% within 15 days
      AVERAGE: 70, // >= 70% within 15 days
      POOR: 0, // < 70% within 15 days
    },
    WORK_COMPLETION: {
      GOOD: 70, // >= 70% works completed
      AVERAGE: 50, // >= 50% works completed
      POOR: 0, // < 50% works completed
    },
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Error Messages
  ERROR_MESSAGES: {
    DISTRICT_NOT_FOUND: "District not found",
    INVALID_FIN_YEAR: "Invalid financial year format",
    API_ERROR: "Failed to fetch data from external API",
    DATABASE_ERROR: "Database operation failed",
    CACHE_ERROR: "Cache operation failed",
    VALIDATION_ERROR: "Validation failed",
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    DATA_FETCHED: "Data fetched successfully",
    DATA_SYNCED: "Data synchronized successfully",
    CACHE_CLEARED: "Cache cleared successfully",
  },

  // Data sources
  DATA_SOURCE: {
    CACHE: "cache",
    DATABASE: "database",
    API: "api",
  },

  // Sync job settings
  SYNC: {
    ENABLED: true,
    CRON_SCHEDULE: "0 2 * * *", // 2 AM daily
    BATCH_SIZE: 1000,
  },
};
