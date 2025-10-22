const express = require("express");
const router = express.Router();
const districtController = require("../controllers/districtController");

// Get all districts for a financial year
router.get("/", districtController.getAllDistricts.bind(districtController));

// Get district list (names and codes only)
router.get(
  "/list",
  districtController.getDistrictList.bind(districtController)
);

// Get available financial years
router.get(
  "/years/available",
  districtController.getAvailableYears.bind(districtController)
);

// Get specific district data
router.get(
  "/:districtCode",
  districtController.getDistrictById.bind(districtController)
);

// Get latest data for a district
router.get(
  "/:districtCode/latest",
  districtController.getLatestDistrictData.bind(districtController)
);

// Get district performance summary
router.get(
  "/:districtCode/summary",
  districtController.getDistrictSummary.bind(districtController)
);

module.exports = router;
