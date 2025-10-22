import api from "./api";

class MGNREGAService {
  // ========== District Endpoints ==========

  /**
   * Get all districts for a financial year
   */
  async getAllDistricts(finYear) {
    try {
      const response = await api.get("/api/districts", {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get district list (names and codes only)
   */
  async getDistrictList(finYear = null) {
    try {
      const params = finYear ? { finYear } : {};
      const response = await api.get("/api/districts/list", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get available financial years
   */
  async getAvailableYears() {
    try {
      const response = await api.get("/api/districts/years/available");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get specific district data
   */
  async getDistrictData(districtCode, finYear) {
    try {
      const response = await api.get(`/api/districts/${districtCode}`, {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get latest district data
   */
  async getLatestDistrictData(districtCode) {
    try {
      const response = await api.get(`/api/districts/${districtCode}/latest`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get district summary
   */
  async getDistrictSummary(districtCode, finYear) {
    try {
      const response = await api.get(`/api/districts/${districtCode}/summary`, {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== Historical Endpoints ==========

  /**
   * Get district trends
   */
  async getDistrictTrends(districtCode, finYear) {
    try {
      const response = await api.get(
        `/api/historical/district/${districtCode}/trends`,
        {
          params: { finYear },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get monthly comparison
   */
  async getMonthlyComparison(districtCode, years) {
    try {
      const response = await api.get(
        `/api/historical/district/${districtCode}/monthly-comparison`,
        {
          params: { years: years.join(",") },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get performance evolution
   */
  async getPerformanceEvolution(districtCode, finYear) {
    try {
      const response = await api.get(
        `/api/historical/district/${districtCode}/performance-evolution`,
        {
          params: { finYear },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get state trends
   */
  async getStateTrends(finYear) {
    try {
      const response = await api.get("/api/historical/state/trends", {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== Comparison Endpoints ==========

  /**
   * Compare multiple districts
   */
  async compareDistricts(districtCodes, finYear) {
    try {
      const response = await api.get("/api/comparison/districts", {
        params: {
          codes: districtCodes.join(","),
          finYear,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Compare district with state average
   */
  async compareWithState(districtCode, finYear) {
    try {
      const response = await api.get(
        `/api/comparison/district/${districtCode}/vs-state`,
        {
          params: { finYear },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get district rankings
   */
  async getDistrictRankings(finYear, metric = "households_worked", limit = 10) {
    try {
      const response = await api.get("/api/comparison/rankings", {
        params: { finYear, metric, limit },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get peer districts
   */
  async getPeerDistricts(districtCode, finYear) {
    try {
      const response = await api.get(
        `/api/comparison/district/${districtCode}/peers`,
        {
          params: { finYear },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== Statistics Endpoints ==========

  /**
   * Get state statistics
   */
  async getStateStats(finYear) {
    try {
      const response = await api.get("/api/stats/state", {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get district statistics
   */
  async getDistrictStats(districtCode, finYear) {
    try {
      const response = await api.get(`/api/stats/district/${districtCode}`, {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(finYear) {
    try {
      const response = await api.get("/api/stats/dashboard", {
        params: { finYear },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get demographic statistics
   */
  async getDemographicStats(finYear, districtCode = null) {
    try {
      const params = { finYear };
      if (districtCode) params.districtCode = districtCode;

      const response = await api.get("/api/stats/demographics", { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========== Helper Methods ==========

  /**
   * Handle and format errors
   */
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        message: "No response from server. Please check your connection.",
        status: 503,
      };
    } else {
      return {
        message: error.message || "An unexpected error occurred",
        status: 500,
      };
    }
  }
}

export default new MGNREGAService();
