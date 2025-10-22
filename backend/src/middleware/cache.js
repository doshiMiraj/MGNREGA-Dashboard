const cacheService = require("../services/cacheService");
const logger = require("../utils/logger");

/**
 * Cache middleware for GET requests
 * @param {string} cacheType - Type of cache (district, comparison, etc.)
 * @param {Function} keyGenerator - Function to generate cache key from request
 * @param {number} ttl - Time to live in seconds
 */
const cacheMiddleware = (cacheType, keyGenerator, ttl) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    try {
      // Generate cache key from request
      const params = keyGenerator(req);

      // Try to get cached data
      const cachedData = await cacheService.get(cacheType, params);

      if (cachedData) {
        logger.info(`Cache hit: ${cacheType}`, params);
        return res.json({
          success: true,
          source: "cache",
          data: cachedData,
          cached: true,
        });
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data) {
        // Only cache successful responses
        if (data && data.success && data.data) {
          cacheService
            .set(cacheType, params, data.data, ttl)
            .then(() => {
              logger.info(`Data cached: ${cacheType}`, params);
            })
            .catch((err) => {
              logger.error(`Cache set error: ${err.message}`);
            });
        }

        // Call original json function
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error(`Cache middleware error: ${error.message}`);
      // Continue without cache on error
      next();
    }
  };
};

/**
 * Cache middleware for district data
 */
const cacheDistrictData = cacheMiddleware(
  "district",
  (req) => ({
    districtCode: req.params.districtCode,
    finYear: req.query.finYear,
  }),
  86400 // 24 hours
);

/**
 * Cache middleware for all districts
 */
const cacheAllDistricts = cacheMiddleware(
  "all_districts",
  (req) => ({
    finYear: req.query.finYear,
  }),
  86400 // 24 hours
);

/**
 * Cache middleware for district list
 */
const cacheDistrictList = cacheMiddleware(
  "district_list",
  (req) => ({
    finYear: req.query.finYear || "all",
  }),
  604800 // 7 days
);

/**
 * Cache middleware for statistics
 */
const cacheStats = (statType, ttl = 21600) => {
  return cacheMiddleware(
    `stats_${statType}`,
    (req) => ({
      ...req.query,
      ...req.params,
    }),
    ttl
  );
};

/**
 * Invalidate cache after data modification
 */
const invalidateCache = (cacheTypes) => {
  return async (req, res, next) => {
    try {
      const types = Array.isArray(cacheTypes) ? cacheTypes : [cacheTypes];

      for (const type of types) {
        await cacheService.invalidateType(type);
        logger.info(`Cache invalidated: ${type}`);
      }

      next();
    } catch (error) {
      logger.error(`Cache invalidation error: ${error.message}`);
      // Continue even if cache invalidation fails
      next();
    }
  };
};

module.exports = {
  cacheMiddleware,
  cacheDistrictData,
  cacheAllDistricts,
  cacheDistrictList,
  cacheStats,
  invalidateCache,
};
