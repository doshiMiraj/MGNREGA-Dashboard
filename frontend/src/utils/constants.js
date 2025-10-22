// App Constants

export const APP_NAME = "MGNREGA Dashboard";
export const APP_TAGLINE = "Track Rural Employment Progress";

export const DEFAULT_STATE = "UTTAR PRADESH";
export const DEFAULT_FIN_YEAR = "2024-2025";

// Performance thresholds for color coding
export const PERFORMANCE_THRESHOLDS = {
  EMPLOYMENT_DAYS: {
    EXCELLENT: 50,
    GOOD: 40,
    AVERAGE: 30,
  },
  WAGE_RATE: {
    EXCELLENT: 250,
    GOOD: 230,
    AVERAGE: 200,
  },
  PAYMENT_TIMELINESS: {
    EXCELLENT: 95,
    GOOD: 85,
    AVERAGE: 70,
  },
  WORK_COMPLETION: {
    EXCELLENT: 70,
    GOOD: 55,
    AVERAGE: 40,
  },
};

// Color scheme for performance indicators
export const PERFORMANCE_COLORS = {
  EXCELLENT: "#4caf50", // Green
  GOOD: "#8bc34a", // Light Green
  AVERAGE: "#ff9800", // Orange
  POOR: "#f44336", // Red
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: "#2196f3",
  SECONDARY: "#ff9800",
  SUCCESS: "#4caf50",
  WARNING: "#ff9800",
  ERROR: "#f44336",
  INFO: "#00bcd4",
  WOMEN: "#e91e63",
  SC: "#9c27b0",
  ST: "#673ab7",
  GENERAL: "#607d8b",
};

// Metrics display configuration
export const METRICS_CONFIG = {
  HOUSEHOLDS_WORKED: {
    label: "Households Worked",
    labelHindi: "कार्यरत परिवार",
    icon: "home",
    color: CHART_COLORS.PRIMARY,
    format: "number",
  },
  EXPENDITURE: {
    label: "Total Expenditure",
    labelHindi: "कुल व्यय",
    icon: "currency_rupee",
    color: CHART_COLORS.SUCCESS,
    format: "currency",
  },
  WAGE_RATE: {
    label: "Average Wage Rate",
    labelHindi: "औसत मजदूरी दर",
    icon: "payments",
    color: CHART_COLORS.WARNING,
    format: "currency",
  },
  WORKS_COMPLETED: {
    label: "Works Completed",
    labelHindi: "पूर्ण कार्य",
    icon: "task_alt",
    color: CHART_COLORS.INFO,
    format: "number",
  },
};

// Month names
export const MONTHS = {
  en: [
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
  hi: [
    "जन",
    "फर",
    "मार्च",
    "अप्रैल",
    "मई",
    "जून",
    "जुलाई",
    "अग",
    "सित",
    "अक्टू",
    "नव",
    "दिस",
  ],
};

// API endpoints (for reference)
export const API_ENDPOINTS = {
  DISTRICTS: "/api/districts",
  DISTRICT_LIST: "/api/districts/list",
  AVAILABLE_YEARS: "/api/districts/years/available",
  DISTRICT_STATS: "/api/stats/district",
  STATE_STATS: "/api/stats/state",
  DASHBOARD: "/api/stats/dashboard",
  COMPARISON: "/api/comparison/districts",
  HISTORICAL: "/api/historical/district",
};

// Route paths
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  COMPARISON: "/comparison",
  HISTORICAL: "/historical",
  ABOUT: "/about",
};

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_DISTRICT: "selectedDistrict",
  SELECTED_FIN_YEAR: "selectedFinYear",
  LANGUAGE: "language",
  THEME: "theme",
};

// Error messages
export const ERROR_MESSAGES = {
  NO_DATA: "No data available for the selected district and year",
  API_ERROR: "Failed to fetch data. Please try again later.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  LOCATION_ERROR: "Unable to detect your location",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: "Data loaded successfully",
  LOCATION_DETECTED: "Location detected successfully",
};

// Feature flags
export const FEATURES = {
  ENABLE_LOCATION_DETECTION:
    import.meta.env.REACT_APP_ENABLE_LOCATION_DETECTION === "true",
  ENABLE_MULTILANG: import.meta.env.REACT_APP_ENABLE_MULTILANG === "true",
};
