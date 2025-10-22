const express = require("express");
const router = express.Router();
const comparisonController = require("../controllers/comparisonController");

// Compare multiple districts
router.get(
  "/districts",
  comparisonController.compareDistricts.bind(comparisonController)
);

// Compare district with state average
router.get(
  "/district/:districtCode/vs-state",
  comparisonController.compareWithStateAverage.bind(comparisonController)
);

// Get district rankings
router.get(
  "/rankings",
  comparisonController.getDistrictRankings.bind(comparisonController)
);

// Compare with peer districts
router.get(
  "/district/:districtCode/peers",
  comparisonController.comparePeers.bind(comparisonController)
);

module.exports = router;
