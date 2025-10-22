const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

redisClient.on("ready", () => {
  console.log("Redis is ready to use");
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error.message);
    console.warn("Continuing without cache - performance may be affected");
  }
};

// Helper functions for cache operations
const cacheHelpers = {
  async get(key) {
    try {
      if (!redisClient.isOpen) return null;
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache GET error:", error.message);
      return null;
    }
  },

  async set(key, value, ttl = parseInt(process.env.REDIS_TTL) || 86400) {
    try {
      if (!redisClient.isOpen) return false;
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Cache SET error:", error.message);
      return false;
    }
  },

  async del(key) {
    try {
      if (!redisClient.isOpen) return false;
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error("Cache DEL error:", error.message);
      return false;
    }
  },

  async flushPattern(pattern) {
    try {
      if (!redisClient.isOpen) return false;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error("Cache FLUSH error:", error.message);
      return false;
    }
  },
};

module.exports = { redisClient, connectRedis, cacheHelpers };
