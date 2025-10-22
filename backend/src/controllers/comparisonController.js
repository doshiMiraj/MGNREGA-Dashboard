const District = require("../models/District");
const cacheService = require("../services/cacheService");
const calculationService = require("../services/calculationService");
const { Op } = require("sequelize");

class ComparisonController {
  /**
   * Compare multiple districts
   * GET /api/comparison/districts?codes=3126,3140,3142&finYear=2024-2025
   */
  async compareDistricts(req, res) {
    try {
      const { codes, finYear } = req.query;

      if (!codes || !finYear) {
        return res.status(400).json({
          success: false,
          message: "District codes and financial year are required",
        });
      }

      const districtCodes = codes.split(",");

      if (districtCodes.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 districts are required for comparison",
        });
      }

      // Check cache
      const cached = await cacheService.getComparison(districtCodes, finYear);
      if (cached) {
        return res.json({ success: true, source: "cache", data: cached });
      }

      const data = await District.findAll({
        where: {
          district_code: { [Op.in]: districtCodes },
          fin_year: finYear,
        },
        order: [
          ["district_code", "ASC"],
          ["month", "ASC"],
        ],
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data found for specified districts",
        });
      }

      // Group by district
      const districtData = {};
      data.forEach((record) => {
        if (!districtData[record.district_code]) {
          districtData[record.district_code] = {
            district_code: record.district_code,
            district_name: record.district_name,
            records: [],
          };
        }
        districtData[record.district_code].records.push(record);
      });

      // Calculate aggregates and scores for each district
      const comparison = Object.values(districtData).map((district) => {
        const aggregate = calculationService.aggregateData(district.records);
        const latestRecord = district.records[district.records.length - 1];
        const performanceScore =
          calculationService.calculatePerformanceScore(latestRecord);

        return {
          district_code: district.district_code,
          district_name: district.district_name,
          metrics: {
            total_households_worked: aggregate.total_households_worked,
            total_individuals_worked: aggregate.total_individuals_worked,
            total_expenditure: aggregate.total_expenditure,
            total_wages: aggregate.total_wages,
            completed_works: aggregate.total_completed_works,
            ongoing_works: aggregate.total_ongoing_works,
            avg_wage_rate: aggregate.avg_wage_rate.toFixed(2),
            avg_employment_days: aggregate.avg_employment_days.toFixed(1),
            work_completion_rate: aggregate.work_completion_rate.toFixed(2),
            women_participation_rate:
              aggregate.women_participation_rate.toFixed(2),
          },
          performance: performanceScore,
        };
      });

      // Find best and worst performers
      const sortedByScore = [...comparison].sort(
        (a, b) => b.performance.overall - a.performance.overall
      );

      const result = {
        fin_year: finYear,
        districts_compared: comparison.length,
        comparison: comparison,
        rankings: {
          best_performer: sortedByScore[0],
          worst_performer: sortedByScore[sortedByScore.length - 1],
        },
      };

      // Cache result
      await cacheService.cacheComparison(districtCodes, finYear, result, 43200);

      res.json({ success: true, source: "database", data: result });
    } catch (error) {
      console.error("Error in compareDistricts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to compare districts",
        error: error.message,
      });
    }
  }

  /**
   * Compare district with state average
   * GET /api/comparison/district/:districtCode/vs-state?finYear=2024-2025
   */
  async compareWithStateAverage(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Get district data
      const districtData = await District.findAll({
        where: { district_code: districtCode, fin_year: finYear },
        raw: true,
      });

      if (districtData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }

      // Get all state data for comparison
      const stateData = await District.findAll({
        where: { fin_year: finYear, state_name: "UTTAR PRADESH" },
        raw: true,
      });

      // Calculate district aggregate
      const districtAggregate = calculationService.aggregateData(districtData);
      const districtPerformance = calculationService.calculatePerformanceScore(
        districtData[districtData.length - 1]
      );

      // Calculate state average
      const stateAggregate = calculationService.aggregateData(stateData);

      // Calculate state average per district
      const totalDistricts = new Set(stateData.map((d) => d.district_code))
        .size;
      const stateAverage = {
        avg_households_worked:
          stateAggregate.total_households_worked / totalDistricts,
        avg_individuals_worked:
          stateAggregate.total_individuals_worked / totalDistricts,
        avg_expenditure: stateAggregate.total_expenditure / totalDistricts,
        avg_wages: stateAggregate.total_wages / totalDistricts,
        avg_completed_works:
          stateAggregate.total_completed_works / totalDistricts,
        avg_wage_rate: stateAggregate.avg_wage_rate,
        avg_employment_days: stateAggregate.avg_employment_days,
        work_completion_rate: stateAggregate.work_completion_rate,
        women_participation_rate: stateAggregate.women_participation_rate,
      };

      // Calculate comparison percentages
      const comparison = {
        households_worked: {
          district: districtAggregate.total_households_worked,
          state_avg: Math.round(stateAverage.avg_households_worked),
          difference_percentage: calculationService.calculateGrowthRate(
            districtAggregate.total_households_worked,
            stateAverage.avg_households_worked
          ),
          status:
            districtAggregate.total_households_worked >
            stateAverage.avg_households_worked
              ? "above"
              : "below",
        },
        expenditure: {
          district: districtAggregate.total_expenditure.toFixed(2),
          state_avg: stateAverage.avg_expenditure.toFixed(2),
          difference_percentage: calculationService.calculateGrowthRate(
            districtAggregate.total_expenditure,
            stateAverage.avg_expenditure
          ),
          status:
            districtAggregate.total_expenditure > stateAverage.avg_expenditure
              ? "above"
              : "below",
        },
        wage_rate: {
          district: districtAggregate.avg_wage_rate.toFixed(2),
          state_avg: stateAverage.avg_wage_rate.toFixed(2),
          difference_percentage: calculationService.calculateGrowthRate(
            districtAggregate.avg_wage_rate,
            stateAverage.avg_wage_rate
          ),
          status:
            districtAggregate.avg_wage_rate > stateAverage.avg_wage_rate
              ? "above"
              : "below",
        },
        work_completion_rate: {
          district: districtAggregate.work_completion_rate.toFixed(2),
          state_avg: stateAverage.work_completion_rate.toFixed(2),
          difference_percentage: calculationService.calculateGrowthRate(
            districtAggregate.work_completion_rate,
            stateAverage.work_completion_rate
          ),
          status:
            districtAggregate.work_completion_rate >
            stateAverage.work_completion_rate
              ? "above"
              : "below",
        },
        women_participation: {
          district: districtAggregate.women_participation_rate.toFixed(2),
          state_avg: stateAverage.women_participation_rate.toFixed(2),
          difference_percentage: calculationService.calculateGrowthRate(
            districtAggregate.women_participation_rate,
            stateAverage.women_participation_rate
          ),
          status:
            districtAggregate.women_participation_rate >
            stateAverage.women_participation_rate
              ? "above"
              : "below",
        },
      };

      res.json({
        success: true,
        data: {
          district_name: districtData[0].district_name,
          district_code: districtCode,
          fin_year: finYear,
          comparison: comparison,
          district_performance: districtPerformance,
          summary: {
            metrics_above_state_avg: Object.values(comparison).filter(
              (c) => c.status === "above"
            ).length,
            metrics_below_state_avg: Object.values(comparison).filter(
              (c) => c.status === "below"
            ).length,
            overall_performance: districtPerformance.rating,
          },
        },
      });
    } catch (error) {
      console.error("Error in compareWithStateAverage:", error);
      res.status(500).json({
        success: false,
        message: "Failed to compare with state average",
        error: error.message,
      });
    }
  }

  /**
   * Get district rankings
   * GET /api/comparison/rankings?finYear=2024-2025&metric=households_worked
   */
  async getDistrictRankings(req, res) {
    try {
      const { finYear, metric = "households_worked", limit = 10 } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Check cache
      const cacheKey = { finYear, metric, limit };
      const cached = await cacheService.getStats("rankings", cacheKey);
      if (cached) {
        return res.json({ success: true, source: "cache", data: cached });
      }

      const data = await District.findAll({
        where: { fin_year: finYear },
        raw: true,
      });

      // Group by district
      const districtData = {};
      data.forEach((record) => {
        if (!districtData[record.district_code]) {
          districtData[record.district_code] = {
            district_code: record.district_code,
            district_name: record.district_name,
            records: [],
          };
        }
        districtData[record.district_code].records.push(record);
      });

      // Calculate metrics for each district
      const rankings = Object.values(districtData).map((district) => {
        const aggregate = calculationService.aggregateData(district.records);
        const latestRecord = district.records[district.records.length - 1];
        const performanceScore =
          calculationService.calculatePerformanceScore(latestRecord);

        return {
          district_code: district.district_code,
          district_name: district.district_name,
          households_worked: aggregate.total_households_worked,
          expenditure: aggregate.total_expenditure,
          wage_rate: aggregate.avg_wage_rate,
          work_completion_rate: aggregate.work_completion_rate,
          women_participation_rate: aggregate.women_participation_rate,
          performance_score: performanceScore.overall,
          performance_rating: performanceScore.rating,
        };
      });

      // Sort based on metric
      const metricMap = {
        households_worked: "households_worked",
        expenditure: "expenditure",
        wage_rate: "wage_rate",
        work_completion: "work_completion_rate",
        women_participation: "women_participation_rate",
        performance: "performance_score",
      };

      const sortKey = metricMap[metric] || "households_worked";
      const sorted = rankings.sort((a, b) => b[sortKey] - a[sortKey]);

      // Add ranks
      sorted.forEach((district, index) => {
        district.rank = index + 1;
      });

      const result = {
        fin_year: finYear,
        metric: metric,
        total_districts: sorted.length,
        top_performers: sorted.slice(0, parseInt(limit)),
        bottom_performers: sorted.slice(-parseInt(limit)).reverse(),
      };

      // Cache result
      await cacheService.cacheStats("rankings", cacheKey, result, 43200);

      res.json({ success: true, source: "database", data: result });
    } catch (error) {
      console.error("Error in getDistrictRankings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get rankings",
        error: error.message,
      });
    }
  }

  /**
   * Get peer comparison (compare with similar-sized districts)
   * GET /api/comparison/district/:districtCode/peers?finYear=2024-2025
   */
  async comparePeers(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Get target district data
      const targetData = await District.findAll({
        where: { district_code: districtCode, fin_year: finYear },
        raw: true,
      });

      if (targetData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }

      const targetAggregate = calculationService.aggregateData(targetData);
      const targetSize = targetAggregate.total_households_worked;

      // Get all districts
      const allData = await District.findAll({
        where: { fin_year: finYear },
        raw: true,
      });

      // Group by district and find peers
      const districtData = {};
      allData.forEach((record) => {
        if (!districtData[record.district_code]) {
          districtData[record.district_code] = [];
        }
        districtData[record.district_code].push(record);
      });

      // Calculate size for each district and find peers (within 20% of target size)
      const peers = [];
      Object.entries(districtData).forEach(([code, records]) => {
        if (code === districtCode) return; // Skip target district

        const aggregate = calculationService.aggregateData(records);
        const size = aggregate.total_households_worked;
        const sizeDiff = Math.abs((size - targetSize) / targetSize) * 100;

        if (sizeDiff <= 20) {
          // Within 20% size difference
          const performanceScore = calculationService.calculatePerformanceScore(
            records[records.length - 1]
          );
          peers.push({
            district_code: code,
            district_name: records[0].district_name,
            households_worked: size,
            size_difference_percentage: sizeDiff.toFixed(2),
            metrics: {
              expenditure: aggregate.total_expenditure.toFixed(2),
              avg_wage_rate: aggregate.avg_wage_rate.toFixed(2),
              work_completion_rate: aggregate.work_completion_rate.toFixed(2),
              women_participation_rate:
                aggregate.women_participation_rate.toFixed(2),
            },
            performance_score: performanceScore.overall.toFixed(2),
            performance_rating: performanceScore.rating,
          });
        }
      });

      // Sort by performance score
      peers.sort((a, b) => b.performance_score - a.performance_score);

      res.json({
        success: true,
        data: {
          target_district: {
            district_code: districtCode,
            district_name: targetData[0].district_name,
            households_worked: targetSize,
          },
          peers: peers,
          peer_count: peers.length,
        },
      });
    } catch (error) {
      console.error("Error in comparePeers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to compare with peers",
        error: error.message,
      });
    }
  }
}

module.exports = new ComparisonController();
