const express = require("express");
const router = express.Router();
const historicalController = require("../controllers/historicalController");

// Get historical trends for a district
router.get(
  "/district/:districtCode/trends",
  historicalController.getDistrictTrends.bind(historicalController)
);

// Get month-by-month comparison across years
router.get(
  "/district/:districtCode/monthly-comparison",
  historicalController.getMonthlyComparison.bind(historicalController)
);

// Get performance evolution over time
router.get(
  "/district/:districtCode/performance-evolution",
  historicalController.getPerformanceEvolution.bind(historicalController)
);

// Get state-level historical trends
router.get(
  "/state/trends",
  historicalController.getStateTrends.bind(historicalController)
);

module.exports = router;
