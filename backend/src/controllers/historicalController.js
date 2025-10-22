const District = require("../models/District");
const cacheService = require("../services/cacheService");
const calculationService = require("../services/calculationService");
const { Op } = require("sequelize");

class HistoricalController {
  /**
   * Get historical trends for a district
   * GET /api/historical/district/:districtCode/trends
   */
  async getDistrictTrends(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear, startYear, endYear } = req.query;

      // Check cache
      const cacheKey = { districtCode, finYear, startYear, endYear };
      const cached = await cacheService.getStats("district_trends", cacheKey);
      if (cached) {
        return res.json({ success: true, source: "cache", data: cached });
      }

      let whereClause = { district_code: districtCode };

      // Filter by financial year or year range
      if (finYear) {
        whereClause.fin_year = finYear;
      } else if (startYear && endYear) {
        whereClause.fin_year = { [Op.between]: [startYear, endYear] };
      }

      const data = await District.findAll({
        where: whereClause,
        order: [
          ["fin_year", "ASC"],
          ["month", "ASC"],
        ],
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No historical data found",
        });
      }

      // Group by year
      const yearlyData = {};
      data.forEach((record) => {
        if (!yearlyData[record.fin_year]) {
          yearlyData[record.fin_year] = [];
        }
        yearlyData[record.fin_year].push(record);
      });

      // Calculate trends
      const trends = {
        district_name: data[0].district_name,
        district_code: districtCode,
        years: Object.keys(yearlyData).sort(),
        monthly_trends: {},
        yearly_summary: {},
      };

      // Monthly trends for each year
      for (const [year, records] of Object.entries(yearlyData)) {
        trends.monthly_trends[year] = records.map((r) => ({
          month: r.month,
          households_worked: r.total_households_worked,
          individuals_worked: r.total_individuals_worked,
          expenditure: parseFloat(r.total_exp),
          completed_works: r.number_of_completed_works,
          avg_wage_rate: parseFloat(r.average_wage_rate_per_day_per_person),
          women_persondays: r.women_persondays,
        }));

        // Yearly summary
        const yearAggregate = calculationService.aggregateData(records);
        trends.yearly_summary[year] = yearAggregate;
      }

      // Year-over-year comparison
      const years = trends.years;
      if (years.length > 1) {
        trends.yoy_comparison = [];
        for (let i = 1; i < years.length; i++) {
          const current = trends.yearly_summary[years[i]];
          const previous = trends.yearly_summary[years[i - 1]];
          trends.yoy_comparison.push({
            year: years[i],
            previous_year: years[i - 1],
            changes: calculationService.calculateYearlyComparison(
              current,
              previous
            ),
          });
        }
      }

      // Cache result
      await cacheService.cacheStats("district_trends", cacheKey, trends, 43200); // 12 hours

      res.json({ success: true, source: "database", data: trends });
    } catch (error) {
      console.error("Error in getDistrictTrends:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch historical trends",
        error: error.message,
      });
    }
  }

  /**
   * Get month-by-month comparison across years
   * GET /api/historical/district/:districtCode/monthly-comparison
   */
  async getMonthlyComparison(req, res) {
    try {
      const { districtCode } = req.params;
      const { years } = req.query; // Comma-separated years

      if (!years) {
        return res.status(400).json({
          success: false,
          message:
            "Years parameter is required (e.g., years=2023-2024,2024-2025)",
        });
      }

      const yearList = years.split(",");

      const data = await District.findAll({
        where: {
          district_code: districtCode,
          fin_year: { [Op.in]: yearList },
        },
        order: [
          ["fin_year", "ASC"],
          ["month", "ASC"],
        ],
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data found for specified years",
        });
      }

      // Group by month for comparison
      const monthlyComparison = {};
      const months = [
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
      ];

      months.forEach((month) => {
        monthlyComparison[month] = {};
        yearList.forEach((year) => {
          const monthData = data.find(
            (d) => d.fin_year === year && d.month === month
          );
          if (monthData) {
            monthlyComparison[month][year] = {
              households_worked: monthData.total_households_worked,
              expenditure: parseFloat(monthData.total_exp),
              completed_works: monthData.number_of_completed_works,
              avg_wage_rate: parseFloat(
                monthData.average_wage_rate_per_day_per_person
              ),
            };
          }
        });
      });

      res.json({
        success: true,
        data: {
          district_name: data[0].district_name,
          district_code: districtCode,
          years: yearList,
          monthly_comparison: monthlyComparison,
        },
      });
    } catch (error) {
      console.error("Error in getMonthlyComparison:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch monthly comparison",
        error: error.message,
      });
    }
  }

  /**
   * Get state-level historical trends
   * GET /api/historical/state/trends
   */
  async getStateTrends(req, res) {
    try {
      const { finYear, startYear, endYear } = req.query;

      // Check cache
      const cacheKey = { finYear, startYear, endYear };
      const cached = await cacheService.getStats("state_trends", cacheKey);
      if (cached) {
        return res.json({ success: true, source: "cache", data: cached });
      }

      let whereClause = { state_name: "UTTAR PRADESH" };

      if (finYear) {
        whereClause.fin_year = finYear;
      } else if (startYear && endYear) {
        whereClause.fin_year = { [Op.between]: [startYear, endYear] };
      }

      const data = await District.findAll({
        where: whereClause,
        order: [
          ["fin_year", "ASC"],
          ["month", "ASC"],
        ],
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No historical data found",
        });
      }

      // Group by year and month
      const trends = {};
      data.forEach((record) => {
        const key = `${record.fin_year}-${record.month}`;
        if (!trends[key]) {
          trends[key] = {
            fin_year: record.fin_year,
            month: record.month,
            records: [],
          };
        }
        trends[key].records.push(record);
      });

      // Aggregate for each period
      const aggregatedTrends = Object.values(trends).map((period) => {
        const aggregate = calculationService.aggregateData(period.records);
        return {
          fin_year: period.fin_year,
          month: period.month,
          ...aggregate,
        };
      });

      // Cache result
      await cacheService.cacheStats(
        "state_trends",
        cacheKey,
        aggregatedTrends,
        43200
      );

      res.json({
        success: true,
        source: "database",
        data: {
          state: "UTTAR PRADESH",
          trends: aggregatedTrends,
        },
      });
    } catch (error) {
      console.error("Error in getStateTrends:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch state trends",
        error: error.message,
      });
    }
  }

  /**
   * Get performance evolution over time
   * GET /api/historical/district/:districtCode/performance-evolution
   */
  async getPerformanceEvolution(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear } = req.query;

      const whereClause = { district_code: districtCode };
      if (finYear) {
        whereClause.fin_year = finYear;
      }

      const data = await District.findAll({
        where: whereClause,
        order: [
          ["fin_year", "ASC"],
          ["month", "ASC"],
        ],
        raw: true,
      });

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data found",
        });
      }

      // Calculate performance score for each period
      const evolution = data.map((record) => {
        const scores = calculationService.calculatePerformanceScore(record);
        return {
          fin_year: record.fin_year,
          month: record.month,
          scores: scores,
          key_metrics: {
            households_worked: record.total_households_worked,
            avg_employment_days:
              record.average_days_of_employment_provided_per_household,
            avg_wage_rate: parseFloat(
              record.average_wage_rate_per_day_per_person
            ),
            work_completion_rate:
              record.total_no_of_works_takenup > 0
                ? (
                    (record.number_of_completed_works /
                      record.total_no_of_works_takenup) *
                    100
                  ).toFixed(2)
                : 0,
          },
        };
      });

      res.json({
        success: true,
        data: {
          district_name: data[0].district_name,
          district_code: districtCode,
          evolution: evolution,
        },
      });
    } catch (error) {
      console.error("Error in getPerformanceEvolution:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch performance evolution",
        error: error.message,
      });
    }
  }
}

module.exports = new HistoricalController();
