const axios = require("axios");
require("dotenv").config();

class DataGovService {
  constructor() {
    this.baseUrl = process.env.DATA_GOV_BASE_URL;
    this.resourceId = process.env.DATA_GOV_RESOURCE_ID;
    this.apiKey = process.env.DATA_GOV_API_KEY;
    this.targetState = process.env.TARGET_STATE || "UTTAR PRADESH";

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        Accept: "application/json",
      },
    });
  }

  /**
   * Fetch MGNREGA data from data.gov.in API
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} API response
   */
  async fetchData(filters = {}) {
    try {
      const params = {
        "api-key": this.apiKey,
        format: "json",
        offset: filters.offset || 0,
        limit: filters.limit || 1000,
      };

      // Add state filter
      if (filters.state_name) {
        params["filters[state_name]"] = filters.state_name;
      } else {
        params["filters[state_name]"] = this.targetState;
      }

      // Add financial year filter
      if (filters.fin_year) {
        params["filters[fin_year]"] = filters.fin_year;
      }

      const url = `${this.resourceId}`;
      console.log(`Fetching data from data.gov.in API...`);

      const response = await this.axiosInstance.get(url, { params });

      if (response.data && response.data.status === "ok") {
        console.log(`Successfully fetched ${response.data.count} records`);
        return {
          success: true,
          data: response.data.records,
          total: response.data.total,
          count: response.data.count,
          metadata: {
            title: response.data.title,
            updated_date: response.data.updated_date,
          },
        };
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("❌ Error fetching data from data.gov.in:", error.message);

      if (error.response) {
        // API returned an error response
        return {
          success: false,
          error: error.response.data,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: "API is not responding. Please try again later.",
          statusCode: 503,
        };
      } else {
        // Something else went wrong
        return {
          success: false,
          error: error.message,
          statusCode: 500,
        };
      }
    }
  }

  /**
   * Fetch data for a specific district
   * @param {string} districtCode - District code
   * @param {string} finYear - Financial year
   * @returns {Promise<Object>} District data
   */
  async fetchDistrictData(districtCode, finYear) {
    try {
      const result = await this.fetchData({
        state_name: this.targetState,
        fin_year: finYear,
        limit: 100,
      });

      if (result.success) {
        const districtData = result.data.filter(
          (record) => record.district_code === districtCode
        );

        return {
          success: true,
          data: districtData,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Fetch all available financial years
   * @returns {Promise<Array>} List of financial years
   */
  async fetchAvailableYears() {
    try {
      const result = await this.fetchData({
        state_name: this.targetState,
        limit: 10,
      });

      if (result.success && result.data.length > 0) {
        const years = [
          ...new Set(result.data.map((record) => record.fin_year)),
        ];
        return {
          success: true,
          data: years.sort().reverse(),
        };
      }

      return {
        success: false,
        error: "No data available",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Fetch all districts in the state
   * @param {string} finYear - Financial year
   * @returns {Promise<Array>} List of districts
   */
  async fetchAllDistricts(finYear) {
    try {
      let allRecords = [];
      let offset = 0;
      const limit = 1000;
      let hasMore = true;

      while (hasMore) {
        const result = await this.fetchData({
          state_name: this.targetState,
          fin_year: finYear,
          offset: offset,
          limit: limit,
        });

        if (result.success && result.data.length > 0) {
          allRecords = allRecords.concat(result.data);
          offset += limit;

          // Check if there are more records
          if (result.count < limit || offset >= result.total) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      return {
        success: true,
        data: allRecords,
        total: allRecords.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Transform API data to database format
   * @param {Object} apiRecord - Raw API record
   * @returns {Object} Transformed record
   */
  transformRecord(apiRecord) {
    return {
      fin_year: apiRecord.fin_year,
      month: apiRecord.month,
      state_code: apiRecord.state_code,
      state_name: apiRecord.state_name,
      district_code: apiRecord.district_code,
      district_name: apiRecord.district_name,
      approved_labour_budget: parseInt(apiRecord.Approved_Labour_Budget) || 0,
      average_wage_rate_per_day_per_person:
        parseFloat(apiRecord.Average_Wage_rate_per_day_per_person) || 0,
      average_days_of_employment_provided_per_household:
        parseInt(apiRecord.Average_days_of_employment_provided_per_Household) ||
        0,
      differently_abled_persons_worked:
        parseInt(apiRecord.Differently_abled_persons_worked) || 0,
      sc_persondays: parseInt(apiRecord.SC_persondays) || 0,
      sc_workers_against_active_workers:
        parseInt(apiRecord.SC_workers_against_active_workers) || 0,
      st_persondays: parseInt(apiRecord.ST_persondays) || 0,
      st_workers_against_active_workers:
        parseInt(apiRecord.ST_workers_against_active_workers) || 0,
      women_persondays: parseInt(apiRecord.Women_Persondays) || 0,
      number_of_completed_works:
        parseInt(apiRecord.Number_of_Completed_Works) || 0,
      number_of_ongoing_works: parseInt(apiRecord.Number_of_Ongoing_Works) || 0,
      number_of_gps_with_nil_exp:
        parseInt(apiRecord.Number_of_GPs_with_NIL_exp) || 0,
      total_no_of_works_takenup:
        parseInt(apiRecord.Total_No_of_Works_Takenup) || 0,
      total_exp: parseFloat(apiRecord.Total_Exp) || 0,
      total_adm_expenditure: parseFloat(apiRecord.Total_Adm_Expenditure) || 0,
      wages: parseFloat(apiRecord.Wages) || 0,
      material_and_skilled_wages:
        parseFloat(apiRecord.Material_and_skilled_Wages) || 0,
      total_households_worked: parseInt(apiRecord.Total_Households_Worked) || 0,
      total_individuals_worked:
        parseInt(apiRecord.Total_Individuals_Worked) || 0,
      total_no_of_active_job_cards:
        parseInt(apiRecord.Total_No_of_Active_Job_Cards) || 0,
      total_no_of_active_workers:
        parseInt(apiRecord.Total_No_of_Active_Workers) || 0,
      total_no_of_hhs_completed_100_days_of_wage_employment:
        parseInt(
          apiRecord.Total_No_of_HHs_completed_100_Days_of_Wage_Employment
        ) || 0,
      total_no_of_jobcards_issued:
        parseInt(apiRecord.Total_No_of_JobCards_issued) || 0,
      total_no_of_workers: parseInt(apiRecord.Total_No_of_Workers) || 0,
      persondays_of_central_liability_so_far:
        parseInt(apiRecord.Persondays_of_Central_Liability_so_far) || 0,
      percent_of_category_b_works:
        parseInt(apiRecord.percent_of_Category_B_Works) || 0,
      percent_of_expenditure_on_agriculture_allied_works:
        parseFloat(
          apiRecord.percent_of_Expenditure_on_Agriculture_Allied_Works
        ) || 0,
      percent_of_nrm_expenditure:
        parseFloat(apiRecord.percent_of_NRM_Expenditure) || 0,
      percentage_payments_gererated_within_15_days:
        parseFloat(apiRecord.percentage_payments_gererated_within_15_days) || 0,
      remarks: apiRecord.Remarks || "NA",
      last_synced_at: new Date(),
    };
  }
}

module.exports = new DataGovService();
