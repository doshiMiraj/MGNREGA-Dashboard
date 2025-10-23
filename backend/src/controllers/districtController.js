const District = require("../models/District");
const dataGovService = require("../services/dataGovService");
const cacheService = require("../services/cacheService");
const { Op } = require("sequelize");

class DistrictController {
  /**
   * Get all districts for a financial year
   * GET /api/districts?finYear=2024-2025
   */
  async getAllDistricts(req, res) {
    try {
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Check cache first
      const cachedData = await cacheService.getAllDistricts(finYear);
      if (cachedData) {
        return res.json({
          success: true,
          source: "cache",
          data: cachedData,
        });
      }

      // Fetch from database
      const districts = await District.findAll({
        where: { fin_year: finYear },
        order: [["district_name", "ASC"]],
      });

      if (districts.length === 0) {
        // Try to fetch from API if not in database
        console.log("No data in DB, fetching from API...");
        const apiResult = await dataGovService.fetchAllDistricts(finYear);

        if (apiResult.success && apiResult.data.length > 0) {
          // Transform and save to database
          const transformedData = apiResult.data.map((record) =>
            dataGovService.transformRecord(record)
          );

          await District.bulkCreate(transformedData, {
            updateOnDuplicate: Object.keys(District.rawAttributes).filter(
              (key) => !["id", "created_at", "updated_at"].includes(key)
            ),
          });

          // Cache the data
          await cacheService.cacheAllDistricts(finYear, transformedData);

          return res.json({
            success: true,
            source: "api",
            data: transformedData,
            message: "Data fetched from API and cached",
          });
        }

        return res.status(404).json({
          success: false,
          message: "No data found for the specified financial year",
        });
      }

      // Cache the database result
      const plainDistricts = districts.map((d) => d.toJSON());
      await cacheService.cacheAllDistricts(finYear, plainDistricts);

      res.json({
        success: true,
        source: "database",
        data: plainDistricts,
      });
    } catch (error) {
      console.error("Error in getAllDistricts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch districts",
        error: error.message,
      });
    }
  }

  /**
   * Get specific district data
   * GET /api/districts/:districtCode?finYear=2024-2025
   */
  async getDistrictById(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      // Check cache first
      const cachedData = await cacheService.getDistrictData(
        districtCode,
        finYear
      );
      if (cachedData) {
        return res.json({
          success: true,
          source: "cache",
          data: cachedData,
        });
      }

      // Fetch from database
      const districtData = await District.findAll({
        where: {
          district_code: districtCode,
          fin_year: finYear,
        },
        order: [["month", "ASC"]],
      });

      if (districtData.length === 0) {
        // Try to fetch from API
        console.log(
          `No data for district ${districtCode}, fetching from API...`
        );
        const apiResult = await dataGovService.fetchDistrictData(
          districtCode,
          finYear
        );

        if (apiResult.success && apiResult.data.length > 0) {
          // Transform and save to database
          const transformedData = apiResult.data.map((record) =>
            dataGovService.transformRecord(record)
          );

          await District.bulkCreate(transformedData, {
            updateOnDuplicate: Object.keys(District.rawAttributes).filter(
              (key) => !["id", "created_at", "updated_at"].includes(key)
            ),
          });

          // Cache the data
          await cacheService.cacheDistrictData(
            districtCode,
            finYear,
            transformedData
          );

          return res.json({
            success: true,
            source: "api",
            data: transformedData,
          });
        }

        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }

      // Cache the database result
      const plainData = districtData.map((d) => d.toJSON());
      await cacheService.cacheDistrictData(districtCode, finYear, plainData);

      res.json({
        success: true,
        source: "database",
        data: plainData,
      });
    } catch (error) {
      console.error("Error in getDistrictById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch district data",
        error: error.message,
      });
    }
  }

  /**
   * Get district list (names and codes only)
   * GET /api/districts/list
   */
  async getDistrictList(req, res) {
    try {
      const { finYear } = req.query;

      // Get unique districts
      const districts = await District.findAll({
        attributes: ["district_code", "district_name", "state_name"],
        where: finYear ? { fin_year: finYear } : {},
        group: ["district_code", "district_name", "state_name"],
        order: [["district_name", "ASC"]],
      });

      const uniqueDistricts = [];
      const seen = new Set();

      for (const district of districts) {
        const key = district.district_code;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueDistricts.push({
            code: district.district_code,
            name: district.district_name,
            state: district.state_name,
          });
        }
      }

      res.json({
        success: true,
        data: uniqueDistricts,
        count: uniqueDistricts.length,
      });
    } catch (error) {
      console.error("Error in getDistrictList:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch district list",
        error: error.message,
      });
    }
  }

  /**
   * Get latest data for a district
   * GET /api/districts/:districtCode/latest
   */
  async getLatestDistrictData(req, res) {
    try {
      const { districtCode } = req.params;

      const latestData = await District.findOne({
        where: { district_code: districtCode },
        order: [
          ["fin_year", "DESC"],
          ["month", "DESC"],
        ],
      });

      if (!latestData) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }

      res.json({
        success: true,
        data: latestData.toJSON(),
      });
    } catch (error) {
      console.error("Error in getLatestDistrictData:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch latest district data",
        error: error.message,
      });
    }
  }

  /**
   * Get available financial years
   * GET /api/districts/years/available
   */
  async getAvailableYears(req, res) {
    try {
      const years = await District.findAll({
        attributes: ["fin_year"],
        group: ["fin_year"],
        order: [["fin_year", "DESC"]],
      });

      const yearList = years.map((y) => y.fin_year);

      res.json({
        success: true,
        data: yearList,
      });
    } catch (error) {
      console.error("Error in getAvailableYears:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available years",
        error: error.message,
      });
    }
  }

  /**
   * Get district performance summary
   * GET /api/districts/:districtCode/summary?finYear=2024-2025
   */
  async getDistrictSummary(req, res) {
    try {
      const { districtCode } = req.params;
      const { finYear } = req.query;

      if (!finYear) {
        return res.status(400).json({
          success: false,
          message: "Financial year is required",
        });
      }

      const districtData = await District.findAll({
        where: {
          district_code: districtCode,
          fin_year: finYear,
        },
      });

      if (districtData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "District not found",
        });
      }

      // Calculate summary metrics
      const summary = {
        district_name: districtData[0].district_name,
        district_code: districtCode,
        fin_year: finYear,
        total_households_worked: 0,
        total_individuals_worked: 0,
        total_expenditure: 0,
        total_persondays: 0,
        completed_works: 0,
        ongoing_works: 0,
        average_wage_rate: 0,
        months_data: districtData.length,
      };

      districtData.forEach((record) => {
        summary.total_households_worked = Math.max(
          summary.total_households_worked,
          record.total_households_worked
        );
        summary.total_individuals_worked = Math.max(
          summary.total_individuals_worked,
          record.total_individuals_worked
        );
        summary.total_expenditure += parseFloat(record.total_exp) || 0;
        summary.total_persondays = Math.max(
          summary.total_persondays,
          record.persondays_of_central_liability_so_far
        );
        summary.completed_works = Math.max(
          summary.completed_works,
          record.number_of_completed_works
        );
        summary.ongoing_works = record.number_of_ongoing_works; // Latest value
        summary.average_wage_rate +=
          parseFloat(record.average_wage_rate_per_day_per_person) || 0;
      });

      summary.average_wage_rate = (
        summary.average_wage_rate / districtData.length
      ).toFixed(2);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error("Error in getDistrictSummary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch district summary",
        error: error.message,
      });
    }
  }
}

module.exports = new DistrictController();
