const { PERFORMANCE_THRESHOLDS } = require("../config/constants");

class CalculationService {
  /**
   * Calculate performance score based on various metrics
   * @param {Object} districtData - District data object
   * @returns {Object} Performance scores
   */
  calculatePerformanceScore(districtData) {
    const scores = {
      employment: this.getEmploymentScore(
        districtData.average_days_of_employment_provided_per_household
      ),
      wageRate: this.getWageRateScore(
        districtData.average_wage_rate_per_day_per_person
      ),
      paymentTimeliness: this.getPaymentTimelinessScore(
        districtData.percentage_payments_gererated_within_15_days
      ),
      workCompletion: this.getWorkCompletionScore(
        districtData.number_of_completed_works,
        districtData.total_no_of_works_takenup
      ),
      womenParticipation: this.getWomenParticipationScore(
        districtData.women_persondays,
        districtData.persondays_of_central_liability_so_far
      ),
    };

    // Calculate overall score (weighted average)
    scores.overall =
      scores.employment * 0.3 +
      scores.wageRate * 0.2 +
      scores.paymentTimeliness * 0.2 +
      scores.workCompletion * 0.2 +
      scores.womenParticipation * 0.1;

    // Add rating
    scores.rating = this.getRating(scores.overall);

    return scores;
  }

  /**
   * Get employment score (0-100)
   */
  getEmploymentScore(avgDays) {
    const { GOOD, AVERAGE } = PERFORMANCE_THRESHOLDS.EMPLOYMENT_DAYS;
    if (avgDays >= GOOD) return 100;
    if (avgDays >= AVERAGE)
      return 50 + ((avgDays - AVERAGE) / (GOOD - AVERAGE)) * 50;
    return (avgDays / AVERAGE) * 50;
  }

  /**
   * Get wage rate score (0-100)
   */
  getWageRateScore(wageRate) {
    const { GOOD, AVERAGE } = PERFORMANCE_THRESHOLDS.WAGE_RATE;
    if (wageRate >= GOOD) return 100;
    if (wageRate >= AVERAGE)
      return 50 + ((wageRate - AVERAGE) / (GOOD - AVERAGE)) * 50;
    return (wageRate / AVERAGE) * 50;
  }

  /**
   * Get payment timeliness score (0-100)
   */
  getPaymentTimelinessScore(percentage) {
    const { GOOD, AVERAGE } = PERFORMANCE_THRESHOLDS.PAYMENT_TIMELINESS;
    if (percentage >= GOOD) return 100;
    if (percentage >= AVERAGE)
      return 50 + ((percentage - AVERAGE) / (GOOD - AVERAGE)) * 50;
    return (percentage / AVERAGE) * 50;
  }

  /**
   * Get work completion score (0-100)
   */
  getWorkCompletionScore(completed, total) {
    if (total === 0) return 0;
    const completionRate = (completed / total) * 100;
    const { GOOD, AVERAGE } = PERFORMANCE_THRESHOLDS.WORK_COMPLETION;
    if (completionRate >= GOOD) return 100;
    if (completionRate >= AVERAGE)
      return 50 + ((completionRate - AVERAGE) / (GOOD - AVERAGE)) * 50;
    return (completionRate / AVERAGE) * 50;
  }

  /**
   * Get women participation score (0-100)
   */
  getWomenParticipationScore(womenPersondays, totalPersondays) {
    if (totalPersondays === 0) return 0;
    const participationRate = (womenPersondays / totalPersondays) * 100;
    // Target: 50% women participation
    if (participationRate >= 50) return 100;
    return (participationRate / 50) * 100;
  }

  /**
   * Get rating based on score
   */
  getRating(score) {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    if (score >= 20) return "Below Average";
    return "Poor";
  }

  /**
   * Calculate growth rate between two values
   */
  calculateGrowthRate(current, previous) {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Calculate month-over-month growth
   */
  calculateMonthlyGrowth(data) {
    const monthOrder = [
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
    const sortedData = data.sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    const growth = [];
    for (let i = 1; i < sortedData.length; i++) {
      const current = sortedData[i];
      const previous = sortedData[i - 1];

      growth.push({
        month: current.month,
        households_growth: this.calculateGrowthRate(
          current.total_households_worked,
          previous.total_households_worked
        ),
        expenditure_growth: this.calculateGrowthRate(
          parseFloat(current.total_exp),
          parseFloat(previous.total_exp)
        ),
        works_growth: this.calculateGrowthRate(
          current.number_of_completed_works,
          previous.number_of_completed_works
        ),
      });
    }

    return growth;
  }

  /**
   * Calculate year-over-year comparison
   */
  calculateYearlyComparison(currentYear, previousYear) {
    return {
      households_change: this.calculateGrowthRate(
        currentYear.total_households_worked,
        previousYear.total_households_worked
      ),
      individuals_change: this.calculateGrowthRate(
        currentYear.total_individuals_worked,
        previousYear.total_individuals_worked
      ),
      expenditure_change: this.calculateGrowthRate(
        parseFloat(currentYear.total_exp),
        parseFloat(previousYear.total_exp)
      ),
      works_change: this.calculateGrowthRate(
        currentYear.number_of_completed_works,
        previousYear.number_of_completed_works
      ),
      wage_change: this.calculateGrowthRate(
        parseFloat(currentYear.average_wage_rate_per_day_per_person),
        parseFloat(previousYear.average_wage_rate_per_day_per_person)
      ),
    };
  }

  /**
   * Aggregate data for multiple records
   */
  aggregateData(records) {
    if (!records || records.length === 0) return null;

    const aggregate = {
      total_households_worked: 0,
      total_individuals_worked: 0,
      total_expenditure: 0,
      total_wages: 0,
      total_completed_works: 0,
      total_ongoing_works: 0,
      total_persondays: 0,
      women_persondays: 0,
      sc_persondays: 0,
      st_persondays: 0,
      count: records.length,
    };

    records.forEach((record) => {
      aggregate.total_households_worked += record.total_households_worked || 0;
      aggregate.total_individuals_worked +=
        record.total_individuals_worked || 0;
      aggregate.total_expenditure += parseFloat(record.total_exp) || 0;
      aggregate.total_wages += parseFloat(record.wages) || 0;
      aggregate.total_completed_works += record.number_of_completed_works || 0;
      aggregate.total_ongoing_works += record.number_of_ongoing_works || 0;
      aggregate.total_persondays +=
        record.persondays_of_central_liability_so_far || 0;
      aggregate.women_persondays += record.women_persondays || 0;
      aggregate.sc_persondays += record.sc_persondays || 0;
      aggregate.st_persondays += record.st_persondays || 0;
    });

    // Calculate averages
    aggregate.avg_wage_rate =
      aggregate.total_wages > 0 && aggregate.total_persondays > 0
        ? (aggregate.total_wages * 100000) / aggregate.total_persondays
        : 0;

    aggregate.avg_employment_days =
      aggregate.total_households_worked > 0
        ? aggregate.total_persondays / aggregate.total_households_worked
        : 0;

    aggregate.work_completion_rate =
      aggregate.total_completed_works > 0
        ? (aggregate.total_completed_works /
            (aggregate.total_completed_works + aggregate.total_ongoing_works)) *
          100
        : 0;

    aggregate.women_participation_rate =
      aggregate.total_persondays > 0
        ? (aggregate.women_persondays / aggregate.total_persondays) * 100
        : 0;

    return aggregate;
  }

  /**
   * Calculate percentile rank
   */
  calculatePercentile(value, allValues) {
    if (!allValues || allValues.length === 0) return 0;
    const sorted = [...allValues].sort((a, b) => a - b);
    const index = sorted.indexOf(value);
    return (index / (sorted.length - 1)) * 100;
  }

  /**
   * Normalize value to 0-100 scale
   */
  normalize(value, min, max) {
    if (max === min) return 50;
    return ((value - min) / (max - min)) * 100;
  }

  /**
   * Calculate efficiency metrics
   */
  calculateEfficiency(districtData) {
    return {
      cost_per_household:
        districtData.total_households_worked > 0
          ? (parseFloat(districtData.total_exp) * 100000) /
            districtData.total_households_worked
          : 0,
      cost_per_personday:
        districtData.persondays_of_central_liability_so_far > 0
          ? (parseFloat(districtData.total_exp) * 100000) /
            districtData.persondays_of_central_liability_so_far
          : 0,
      cost_per_work:
        districtData.number_of_completed_works +
          districtData.number_of_ongoing_works >
        0
          ? (parseFloat(districtData.total_exp) * 100000) /
            (districtData.number_of_completed_works +
              districtData.number_of_ongoing_works)
          : 0,
      wage_to_material_ratio:
        parseFloat(districtData.material_and_skilled_wages) > 0
          ? parseFloat(districtData.wages) /
            parseFloat(districtData.material_and_skilled_wages)
          : 0,
    };
  }
}

module.exports = new CalculationService();
