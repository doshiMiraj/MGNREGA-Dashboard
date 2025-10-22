const { cacheHelpers } = require("../config/redis");

class CacheService {
  constructor() {
    this.defaultTTL = parseInt(process.env.REDIS_TTL) || 86400; // 24 hours
    this.keyPrefix = "mgnrega:";
  }

  /**
   * Get cached comparison data
   */
  async getComparison(districtCodes, finYear) {
    const codes = Array.isArray(districtCodes)
      ? districtCodes.sort().join(",")
      : districtCodes;
    return await this.get("comparison", { codes, finYear });
  }

  /**
   * Cache statistics data
   */
  async cacheStats(type, params, data, ttl = this.defaultTTL) {
    return await this.set(`stats_${type}`, params, data, ttl);
  }

  /**
   * Get cached statistics data
   */
  async getStats(type, params) {
    return await this.get(`stats_${type}`, params);
  }

  /**
   * Invalidate all district caches
   */
  async invalidateDistrictCaches() {
    return await this.invalidateType("district");
  }

  /**
   * Invalidate all comparison caches
   */
  async invalidateComparisonCaches() {
    return await this.invalidateType("comparison");
  }

  /**
   * Invalidate all caches
   */
  async invalidateAll() {
    try {
      const pattern = `${this.keyPrefix}*`;
      const success = await cacheHelpers.flushPattern(pattern);

      if (success) {
        console.log(`All cache INVALIDATED`);
      }

      return success;
    } catch (error) {
      console.error("Cache INVALIDATE ALL error:", error.message);
      return false;
    }
  }
  /**
  Generate cache key
  * @param {string} type - Cache type (district, comparison, stats, etc.)
  * @param {Object} params - Parameters to include in key
  * @returns {string} Cache key
  */
  generateKey(type, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join(":");

    return `${this.keyPrefix}${type}:${sortedParams}`;
  }

  /**
   * Get cached data
   * @param {string} type - Cache type
   * @param {Object} params - Parameters
   * @returns {Promise<Object|null>} Cached data or null
   */
  async get(type, params = {}) {
    try {
      const key = this.generateKey(type, params);
      const cachedData = await cacheHelpers.get(key);

      if (cachedData) {
        console.log(`✅ Cache HIT: ${key}`);
        return cachedData;
      }

      console.log(`❌ Cache MISS: ${key}`);
      return null;
    } catch (error) {
      console.error("Cache GET error:", error.message);
      return null;
    }
  }

  /**
   * Set cached data
   * @param {string} type - Cache type
   * @param {Object} params - Parameters
   * @param {Object} data - Data to cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>} Success status
   */
  async set(type, params = {}, data, ttl = this.defaultTTL) {
    try {
      const key = this.generateKey(type, params);
      const success = await cacheHelpers.set(key, data, ttl);

      if (success) {
        console.log(`✅ Cache SET: ${key} (TTL: ${ttl}s)`);
      }

      return success;
    } catch (error) {
      console.error("Cache SET error:", error.message);
      return false;
    }
  }

  /**
   * Delete cached data
   * @param {string} type - Cache type
   * @param {Object} params - Parameters
   * @returns {Promise<boolean>} Success status
   */
  async delete(type, params = {}) {
    try {
      const key = this.generateKey(type, params);
      const success = await cacheHelpers.del(key);

      if (success) {
        console.log(`✅ Cache DELETE: ${key}`);
      }

      return success;
    } catch (error) {
      console.error("Cache DELETE error:", error.message);
      return false;
    }
  }

  /**
   * Invalidate all cache for a specific type
   * @param {string} type - Cache type
   * @returns {Promise<boolean>} Success status
   */
  async invalidateType(type) {
    try {
      const pattern = `${this.keyPrefix}${type}:*`;
      const success = await cacheHelpers.flushPattern(pattern);

      if (success) {
        console.log(`✅ Cache INVALIDATED: ${pattern}`);
      }

      return success;
    } catch (error) {
      console.error("Cache INVALIDATE error:", error.message);
      return false;
    }
  }

  /**
   * Cache district data
   */
  async cacheDistrictData(districtCode, finYear, data, ttl = this.defaultTTL) {
    return await this.set("district", { districtCode, finYear }, data, ttl);
  }

  /**
   * Get cached district data
   */
  async getDistrictData(districtCode, finYear) {
    return await this.get("district", { districtCode, finYear });
  }

  /**
   * Cache all districts data
   */
  async cacheAllDistricts(finYear, data, ttl = this.defaultTTL) {
    return await this.set("all_districts", { finYear }, data, ttl);
  }

  /**
   * Get cached all districts data
   */
  async getAllDistricts(finYear) {
    return await this.get("all_districts", { finYear });
  }

  /**
   * Cache comparison data
   */
  async cacheComparison(districtCodes, finYear, data, ttl = this.defaultTTL) {
    const codes = Array.isArray(districtCodes)
      ? districtCodes.sort().join(",")
      : districtCodes;
    return await this.set("comparison", { codes, finYear }, data, ttl);
  }
}

module.exports = new CacheService();
