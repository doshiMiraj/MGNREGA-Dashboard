const District = require("../models/District");
const cacheService = require("../services/cacheService");
const calculationService = require("../services/calculationService");
const { sequelize } = require("../config/database");
const { Op } = require("sequelize");

class StatsController {
  /**
   * Get state-level statistics
   * GET /api/stats/state?finYear=2024-2025
   */
  async getStateStats(req, res) {
    try {
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Check cache
      const cached = await cacheService.getStats("state", { finYear });
      if (cached) {
        return res.json({ success: true, source: "cache", data: cached });
      }

      const data = await District.findAll({
        where: { fin_year: finYear, state_name: "UTTAR PRADESH" },
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data found",
        });
      }

      // Calculate state-level aggregates
      const aggregate = calculationService.aggregateData(data);

      // Get unique districts count
      const totalDistricts = new Set(data.map((d) => d.district_code)).size;

      // Calculate demographic statistics
      const demographics = {
        total_persondays: aggregate.total_persondays,
        women_persondays: aggregate.women_persondays,
        women_participation_rate: aggregate.women_participation_rate.toFixed(2),
        sc_persondays: aggregate.sc_persondays,
        sc_participation_rate:
          aggregate.total_persondays > 0
            ? (
                (aggregate.sc_persondays / aggregate.total_persondays) *
                100
              ).toFixed(2)
            : 0,
        st_persondays: aggregate.st_persondays,
        st_participation_rate:
          aggregate.total_persondays > 0
            ? (
                (aggregate.st_persondays / aggregate.total_persondays) *
                100
              ).toFixed(2)
            : 0,
      };

      const stats = {
        fin_year: finYear,
        state: "UTTAR PRADESH",
        total_districts: totalDistricts,
        employment: {
          total_households_worked: aggregate.total_households_worked,
          total_individuals_worked: aggregate.total_individuals_worked,
          avg_employment_days: aggregate.avg_employment_days.toFixed(1),
        },
        financial: {
          total_expenditure_lakhs: aggregate.total_expenditure.toFixed(2),
          total_expenditure_crores: (aggregate.total_expenditure / 100).toFixed(
            2
          ),
          total_wages_lakhs: aggregate.total_wages.toFixed(2),
          avg_wage_rate: aggregate.avg_wage_rate.toFixed(2),
        },
        works: {
          total_completed: aggregate.total_completed_works,
          total_ongoing: aggregate.total_ongoing_works,
          completion_rate: aggregate.work_completion_rate.toFixed(2),
        },
        demographics: demographics,
        per_district_average: {
          avg_households: Math.round(
            aggregate.total_households_worked / totalDistricts
          ),
          avg_expenditure: (
            aggregate.total_expenditure / totalDistricts
          ).toFixed(2),
          avg_completed_works: Math.round(
            aggregate.total_completed_works / totalDistricts
          ),
        },
      };

      // Cache result
      await cacheService.cacheStats("state", { finYear }, stats, 21600); // 6 hours

      res.json({ success: true, source: "database", data: stats });
    } catch (error) {
      console.error("Error in getStateStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch state statistics",
        error: error.message,
      });
    }
  }

  /**
   * Get district-level statistics with performance metrics
   * GET /api/stats/district/:districtCode?finYear=2024-2025
   */
  async getDistrictStats(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      const data = await District.findAll({
        where: { district_code: districtCode, fin_year: finYear },
        order: [["month", "ASC"]],
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }

      // Calculate aggregates
      const aggregate = calculationService.aggregateData(data);
      const latestData = data[data.length - 1];
      const performanceScore =
        calculationService.calculatePerformanceScore(latestData);
      const efficiency = calculationService.calculateEfficiency(latestData);

      // Monthly breakdown
      const monthlyData = data.map((record) => ({
        month: record.month,
        households_worked: record.total_households_worked,
        expenditure: parseFloat(record.total_exp),
        completed_works: record.number_of_completed_works,
        avg_wage_rate: parseFloat(record.average_wage_rate_per_day_per_person),
      }));

      const stats = {
        district_name: data[0].district_name,
        district_code: districtCode,
        fin_year: finYear,
        summary: {
          total_households_worked: aggregate.total_households_worked,
          total_individuals_worked: aggregate.total_individuals_worked,
          total_expenditure: aggregate.total_expenditure.toFixed(2),
          total_wages: aggregate.total_wages.toFixed(2),
          completed_works: aggregate.total_completed_works,
          ongoing_works: aggregate.total_ongoing_works,
        },
        averages: {
          avg_employment_days: aggregate.avg_employment_days.toFixed(1),
          avg_wage_rate: aggregate.avg_wage_rate.toFixed(2),
          work_completion_rate: aggregate.work_completion_rate.toFixed(2),
          women_participation_rate:
            aggregate.women_participation_rate.toFixed(2),
        },
        performance: performanceScore,
        efficiency: {
          cost_per_household: efficiency.cost_per_household.toFixed(2),
          cost_per_personday: efficiency.cost_per_personday.toFixed(2),
          cost_per_work: efficiency.cost_per_work.toFixed(2),
          wage_to_material_ratio: efficiency.wage_to_material_ratio.toFixed(2),
        },
        monthly_breakdown: monthlyData,
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error in getDistrictStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch district statistics",
        error: error.message,
      });
    }
  }

  /**
   * Get dashboard overview statistics
   * GET /api/stats/dashboard?finYear=2024-2025
   */
  async getDashboardStats(req, res) {
    try {
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Check cache
      const cached = await cacheService.getStats("dashboard", { finYear });
      if (cached) {
        return res.json({ success: true, source: "cache", data: cached });
      }

      const data = await District.findAll({
        where: { fin_year: finYear },
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data found",
        });
      }

      // State-level aggregate
      const stateAggregate = calculationService.aggregateData(data);
      const totalDistricts = new Set(data.map((d) => d.district_code)).size;

      // Find top performers
      const districtData = {};
      data.forEach((record) => {
        if (!districtData[record.district_code]) {
          districtData[record.district_code] = [];
        }
        districtData[record.district_code].push(record);
      });

      const districtPerformances = Object.entries(districtData).map(
        ([code, records]) => {
          const aggregate = calculationService.aggregateData(records);
          const latestRecord = records[records.length - 1];
          const score =
            calculationService.calculatePerformanceScore(latestRecord);

          return {
            district_code: code,
            district_name: records[0].district_name,
            households_worked: aggregate.total_households_worked,
            performance_score: score.overall,
          };
        }
      );

      // Sort by performance
      districtPerformances.sort(
        (a, b) => b.performance_score - a.performance_score
      );

      const dashboard = {
        fin_year: finYear,
        state: "UTTAR PRADESH",
        overview: {
          total_districts: totalDistricts,
          total_households_worked: stateAggregate.total_households_worked,
          total_expenditure_crores: (
            stateAggregate.total_expenditure / 100
          ).toFixed(2),
          total_works_completed: stateAggregate.total_completed_works,
          avg_wage_rate: stateAggregate.avg_wage_rate.toFixed(2),
        },
        key_metrics: {
          employment_days_per_household:
            stateAggregate.avg_employment_days.toFixed(1),
          work_completion_rate: stateAggregate.work_completion_rate.toFixed(2),
          women_participation_rate:
            stateAggregate.women_participation_rate.toFixed(2),
          payment_efficiency: "95.2", // Placeholder - can be calculated from actual data
        },
        top_performers: {
          by_households: districtPerformances
            .sort((a, b) => b.households_worked - a.households_worked)
            .slice(0, 5),
          by_performance: districtPerformances
            .sort((a, b) => b.performance_score - a.performance_score)
            .slice(0, 5),
        },
        bottom_performers: {
          by_performance: districtPerformances
            .sort((a, b) => a.performance_score - b.performance_score)
            .slice(0, 5),
        },
      };

      // Cache result
      await cacheService.cacheStats("dashboard", { finYear }, dashboard, 21600);

      res.json({ success: true, source: "database", data: dashboard });
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
        error: error.message,
      });
    }
  }

  /**
   * Get demographic statistics
   * GET /api/stats/demographics?finYear=2024-2025
   */
  async getDemographicStats(req, res) {
    try {
      const { finYear, districtCode } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      const whereClause = { fin_year: finYear };
      if (districtCode) {
        whereClause.district_code = districtCode;
      }

      const data = await District.findAll({
        where: whereClause,
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data found",
        });
      }

      const aggregate = calculationService.aggregateData(data);

      const demographics = {
        fin_year: finYear,
        scope: districtCode ? "district" : "state",
        total_persondays: aggregate.total_persondays,
        breakdown: {
          women: {
            persondays: aggregate.women_persondays,
            percentage: aggregate.women_participation_rate.toFixed(2),
          },
          sc: {
            persondays: aggregate.sc_persondays,
            percentage:
              aggregate.total_persondays > 0
                ? (
                    (aggregate.sc_persondays / aggregate.total_persondays) *
                    100
                  ).toFixed(2)
                : 0,
          },
          st: {
            persondays: aggregate.st_persondays,
            percentage:
              aggregate.total_persondays > 0
                ? (
                    (aggregate.st_persondays / aggregate.total_persondays) *
                    100
                  ).toFixed(2)
                : 0,
          },
          general: {
            persondays:
              aggregate.total_persondays -
              aggregate.sc_persondays -
              aggregate.st_persondays,
            percentage:
              aggregate.total_persondays > 0
                ? (
                    ((aggregate.total_persondays -
                      aggregate.sc_persondays -
                      aggregate.st_persondays) /
                      aggregate.total_persondays) *
                    100
                  ).toFixed(2)
                : 0,
          },
        },
      };

      if (districtCode) {
        demographics.district_name = data[0].district_name;
        demographics.district_code = districtCode;
      }

      res.json({ success: true, data: demographics });
    } catch (error) {
      console.error("Error in getDemographicStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch demographic statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new StatsController();
