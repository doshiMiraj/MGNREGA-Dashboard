const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// Get state-level statistics
router.get("/state", statsController.getStateStats.bind(statsController));

// Get district statistics
router.get(
  "/district/:districtCode",
  statsController.getDistrictStats.bind(statsController)
);

// Get dashboard overview
router.get(
  "/dashboard",
  statsController.getDashboardStats.bind(statsController)
);

// Get demographic statistics
router.get(
  "/demographics",
  statsController.getDemographicStats.bind(statsController)
);

module.exports = router;
