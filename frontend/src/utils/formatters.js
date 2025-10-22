// Formatting utility functions

/**
 * Format number with Indian locale
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Format large numbers (in lakhs/crores)
 */
export const formatLargeNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const absNum = Math.abs(num);

  if (absNum >= 10000000) {
    // 1 crore
    return `${formatNumber(num / 10000000, 2)} Cr`;
  } else if (absNum >= 100000) {
    // 1 lakh
    return `${formatNumber(num / 100000, 2)} L`;
  } else if (absNum >= 1000) {
    // 1 thousand
    return `${formatNumber(num / 1000, 2)} K`;
  }

  return formatNumber(num);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Format date
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const d = new Date(date);

  if (format === "short") {
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } else if (format === "long") {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } else if (format === "time") {
    return d.toLocaleString("en-IN");
  }

  return d.toLocaleDateString("en-IN");
};

/**
 * Format growth rate with arrow indicator
 */
export const formatGrowthRate = (rate) => {
  if (rate === null || rate === undefined || isNaN(rate)) return "-";

  const arrow = rate > 0 ? "↑" : rate < 0 ? "↓" : "";
  const color = rate > 0 ? "green" : rate < 0 ? "red" : "gray";

  return {
    text: `${arrow} ${formatPercentage(Math.abs(rate))}`,
    color: color,
    value: rate,
  };
};

/**
 * Shorten text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Convert lakhs to crores
 */
export const lakhsToCrores = (lakhs) => {
  if (lakhs === null || lakhs === undefined || isNaN(lakhs)) return 0;
  return lakhs / 100;
};

/**
 * Get performance color based on value and thresholds
 */
export const getPerformanceColor = (value, thresholds) => {
  if (value >= thresholds.EXCELLENT) return "#4caf50"; // Green
  if (value >= thresholds.GOOD) return "#8bc34a"; // Light Green
  if (value >= thresholds.AVERAGE) return "#ff9800"; // Orange
  return "#f44336"; // Red
};

/**
 * Get performance rating text
 */
export const getPerformanceRating = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  if (score >= 20) return "Below Average";
  return "Poor";
};

/**
 * Format month name
 */
export const getMonthName = (monthAbbr, lang = "en") => {
  const monthMap = {
    en: {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    },
    hi: {
      Jan: "जनवरी",
      Feb: "फरवरी",
      Mar: "मार्च",
      Apr: "अप्रैल",
      May: "मई",
      Jun: "जून",
      Jul: "जुलाई",
      Aug: "अगस्त",
      Sep: "सितंबर",
      Oct: "अक्टूबर",
      Nov: "नवंबर",
      Dec: "दिसंबर",
    },
  };

  return monthMap[lang]?.[monthAbbr] || monthAbbr;
};
