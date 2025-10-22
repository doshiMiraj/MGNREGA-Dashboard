const District = require("../models/District");
const dataGovService = require("./dataGovService");
const cacheService = require("./cacheService");
const logger = require("../utils/logger");

class SyncService {
  /**
   * Sync all data for a financial year
   */
  async syncFinancialYear(finYear) {
    try {
      logger.info(`Starting sync for financial year: ${finYear}`);

      const result = await dataGovService.fetchAllDistricts(finYear);

      if (!result.success) {
        logger.error(`Failed to fetch data from API: ${result.error}`);
        return {
          success: false,
          error: result.error,
          synced: 0,
        };
      }

      if (result.data.length === 0) {
        logger.warn(`No data available for ${finYear}`);
        return {
          success: true,
          synced: 0,
          message: "No new data available",
        };
      }

      // Transform data
      const transformedData = result.data.map((record) =>
        dataGovService.transformRecord(record)
      );

      // Bulk upsert to database
      const upsertResult = await District.bulkCreate(transformedData, {
        updateOnDuplicate: Object.keys(District.rawAttributes).filter(
          (key) => !["id", "createdAt", "updatedAt"].includes(key)
        ),
      });

      logger.info(
        `Successfully synced ${upsertResult.length} records for ${finYear}`
      );

      // Invalidate all caches after sync
      await cacheService.invalidateAll();
      logger.info("Cache invalidated after sync");

      return {
        success: true,
        synced: upsertResult.length,
        finYear: finYear,
      };
    } catch (error) {
      logger.error(`Sync failed for ${finYear}:`, error);
      return {
        success: false,
        error: error.message,
        synced: 0,
      };
    }
  }

  /**
   * Sync latest available data
   */
  async syncLatest() {
    try {
      logger.info("Starting sync for latest data");

      // Get available years from API
      const yearsResult = await dataGovService.fetchAvailableYears();

      if (!yearsResult.success || yearsResult.data.length === 0) {
        logger.warn("No financial years available from API");
        return {
          success: false,
          error: "No financial years available",
          synced: 0,
        };
      }

      // Sync the latest year
      const latestYear = yearsResult.data[0];
      return await this.syncFinancialYear(latestYear);
    } catch (error) {
      logger.error("Failed to sync latest data:", error);
      return {
        success: false,
        error: error.message,
        synced: 0,
      };
    }
  }

  /**
   * Sync multiple financial years
   */
  async syncMultipleYears(years) {
    try {
      logger.info(`Starting sync for years: ${years.join(", ")}`);

      const results = [];

      for (const year of years) {
        const result = await this.syncFinancialYear(year);
        results.push(result);

        // Wait a bit between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const totalSynced = results.reduce((sum, r) => sum + r.synced, 0);
      const allSuccess = results.every((r) => r.success);

      return {
        success: allSuccess,
        years_synced: results.filter((r) => r.success).length,
        total_records: totalSynced,
        details: results,
      };
    } catch (error) {
      logger.error("Failed to sync multiple years:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Sync specific district data
   */
  async syncDistrict(districtCode, finYear) {
    try {
      logger.info(
        `Starting sync for district: ${districtCode}, year: ${finYear}`
      );

      const result = await dataGovService.fetchDistrictData(
        districtCode,
        finYear
      );

      if (!result.success) {
        logger.error(`Failed to fetch district data: ${result.error}`);
        return {
          success: false,
          error: result.error,
        };
      }

      if (result.data.length === 0) {
        logger.warn(`No data available for district ${districtCode}`);
        return {
          success: true,
          synced: 0,
          message: "No data available",
        };
      }

      // Transform and save
      const transformedData = result.data.map((record) =>
        dataGovService.transformRecord(record)
      );

      const upsertResult = await District.bulkCreate(transformedData, {
        updateOnDuplicate: Object.keys(District.rawAttributes).filter(
          (key) => !["id", "createdAt", "updatedAt"].includes(key)
        ),
      });

      // Invalidate district cache
      await cacheService.invalidateDistrictCaches();

      logger.info(
        `Successfully synced ${upsertResult.length} records for district ${districtCode}`
      );

      return {
        success: true,
        synced: upsertResult.length,
        district_code: districtCode,
        fin_year: finYear,
      };
    } catch (error) {
      logger.error(`Sync failed for district ${districtCode}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    try {
      const latestRecord = await District.findOne({
        order: [["last_synced_at", "DESC"]],
        attributes: ["last_synced_at", "fin_year", "district_name"],
      });

      const totalRecords = await District.count();
      const distinctDistricts = await District.count({
        distinct: true,
        col: "district_code",
      });
      const distinctYears = await District.count({
        distinct: true,
        col: "fin_year",
      });

      return {
        success: true,
        status: {
          last_sync: latestRecord ? latestRecord.last_synced_at : null,
          last_synced_year: latestRecord ? latestRecord.fin_year : null,
          total_records: totalRecords,
          total_districts: distinctDistricts,
          total_years: distinctYears,
          database_healthy: totalRecords > 0,
        },
      };
    } catch (error) {
      logger.error("Failed to get sync status:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if sync is needed
   */
  async needsSync(finYear) {
    try {
      const count = await District.count({
        where: { fin_year: finYear },
      });

      // If no records exist for this year, sync is needed
      if (count === 0) return true;

      // Check last sync time
      const latestRecord = await District.findOne({
        where: { fin_year: finYear },
        order: [["last_synced_at", "DESC"]],
        attributes: ["last_synced_at"],
      });

      if (!latestRecord) return true;

      // If last sync was more than 24 hours ago, sync is needed
      const hoursSinceSync =
        (Date.now() - new Date(latestRecord.last_synced_at).getTime()) /
        (1000 * 60 * 60);
      return hoursSinceSync > 24;
    } catch (error) {
      logger.error("Failed to check sync status:", error);
      return true; // Default to needing sync on error
    }
  }

  /**
   * Incremental sync - only sync if data is old
   */
  async incrementalSync(finYear) {
    try {
      const needsUpdate = await this.needsSync(finYear);

      if (!needsUpdate) {
        logger.info(`Data for ${finYear} is up to date, skipping sync`);
        return {
          success: true,
          synced: 0,
          message: "Data is up to date",
          skipped: true,
        };
      }

      return await this.syncFinancialYear(finYear);
    } catch (error) {
      logger.error("Incremental sync failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new SyncService();
