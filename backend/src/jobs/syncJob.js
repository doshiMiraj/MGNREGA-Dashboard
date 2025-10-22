const cron = require("node-cron");
const syncService = require("../services/syncService");
const logger = require("../utils/logger");
require("dotenv").config();

class SyncJob {
  constructor() {
    this.isRunning = false;
    this.cronSchedule = process.env.SYNC_JOB_CRON || "0 2 * * *"; // Default: 2 AM daily
    this.enabled = process.env.SYNC_JOB_ENABLED === "true";
  }

  /**
   * Execute sync job
   */
  async execute() {
    if (this.isRunning) {
      logger.warn("Sync job already running, skipping this execution");
      return;
    }

    try {
      this.isRunning = true;
      logger.info("═══════════════════════════════════════════════════");
      logger.info("🔄 Starting scheduled sync job");
      logger.info("═══════════════════════════════════════════════════");

      const startTime = Date.now();

      // Sync latest data
      const result = await syncService.syncLatest();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (result.success) {
        logger.info(`✅ Sync completed successfully in ${duration}s`);
        logger.info(`   Records synced: ${result.synced}`);
        logger.info(`   Financial year: ${result.finYear}`);
      } else {
        logger.error(`❌ Sync failed: ${result.error}`);
      }

      logger.info("═══════════════════════════════════════════════════\n");
    } catch (error) {
      logger.error("Sync job execution failed:", error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Start the cron job
   */
  start() {
    if (!this.enabled) {
      logger.info("⏸️  Sync job is disabled (SYNC_JOB_ENABLED=false)");
      return;
    }

    logger.info("⏰ Starting sync job scheduler");
    logger.info(`   Schedule: ${this.cronSchedule}`);
    logger.info(`   Next run: ${this.getNextRunTime()}\n`);

    this.job = cron.schedule(this.cronSchedule, async () => {
      await this.execute();
    });

    logger.info("✅ Sync job scheduler started");
  }

  /**
   * Stop the cron job
   */
  stop() {
    if (this.job) {
      this.job.stop();
      logger.info("⏹️  Sync job scheduler stopped");
    }
  }

  /**
   * Run sync manually (for testing)
   */
  async runManually() {
    logger.info("🔧 Running sync job manually");
    await this.execute();
  }

  /**
   * Get next scheduled run time
   */
  getNextRunTime() {
    const cronParser = require("cron-parser");
    try {
      const interval = cronParser.parseExpression(this.cronSchedule);
      return interval.next().toString();
    } catch (error) {
      return "Unable to calculate";
    }
  }

  /**
   * Get job status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      isRunning: this.isRunning,
      schedule: this.cronSchedule,
      nextRun: this.getNextRunTime(),
    };
  }
}

module.exports = new SyncJob();
