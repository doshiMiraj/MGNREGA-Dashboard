import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  timeout: parseInt(import.meta.env.REACT_APP_API_TIMEOUT) || 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;

    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Handle specific status codes
      switch (error.response.status) {
        case 404:
          console.warn("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        case 503:
          console.error("Service unavailable");
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server:", error.message);
    } else {
      // Something else happened
      console.error("API Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
