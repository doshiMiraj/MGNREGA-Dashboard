import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import HistoricalTrendChart from "../components/charts/HistoricalTrendChart";
import { useLocation } from "../context/LocationContext";
import { useDistrictList } from "../hooks/useMGNREGAData";
import mgnregaService from "../services/mgnregaService";
import { useLanguage } from "../context/LanguageContext";

const HistoricalPage = () => {
  const { selectedDistrict, selectDistrict } = useLocation();
  const { districts, loading: loadingDistricts } = useDistrictList();
  const { t } = useLanguage();

  const [localDistrict, setLocalDistrict] = useState("");
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize district from context
  useEffect(() => {
    if (selectedDistrict) {
      setLocalDistrict(selectedDistrict.code);
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (event) => {
    const code = event.target.value;
    setLocalDistrict(code);

    const district = districts.find((d) => d.code === code);
    if (district) {
      selectDistrict(district);
    }

    setTrendsData(null); // Reset data when district changes
  };

  const handleViewTrends = async () => {
    if (!localDistrict) {
      setError("Please select a district");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch historical trends for all years
      const result = await mgnregaService.getDistrictTrends(localDistrict, "");

      if (result.success) {
        setTrendsData(result.data);
      } else {
        setError(result.message || "Failed to fetch trends data");
      }
    } catch (err) {
      setError("Failed to load historical data");
      console.error("Historical error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for charts
  const transformDataForChart = (metric) => {
    if (!trendsData || !trendsData.yearly_summary) return [];

    return Object.entries(trendsData.yearly_summary).map(([year, data]) => ({
      year,
      value: data[metric] || 0,
    }));
  };

  if (loadingDistricts) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "calc(100vh - 128px)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
          {t("historicalTrends")}
        </Typography>

        {/* Selection Panel */}
        <Paper sx={{ p: 3, mb: 4 }} className="card-shadow">
          <Typography variant="h6" gutterBottom>
            {t("selectDistrictForTrends")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {t("viewYearOverYear")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <InputLabel>{t("selectDistrict")}</InputLabel>
              <Select
                value={localDistrict}
                onChange={handleDistrictChange}
                label={t("selectDistrict")}
              >
                <MenuItem value="">
                  <em>{t("chooseDistrict")}</em>
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              startIcon={<TimelineIcon />}
              onClick={handleViewTrends}
              disabled={!localDistrict || loading}
              sx={{ minWidth: 150 }}
            >
              {t("viewTrends")}
            </Button>
          </Box>
        </Paper>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onRetry={handleViewTrends} />}

        {/* Loading State */}
        {loading && <LoadingSpinner message={t("loadingHistorical")} />}

        {/* Trends Results */}
        {!loading && trendsData && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Summary */}
            <Alert severity="info">
              <strong>{trendsData.district_name}</strong> -{" "}
              {t("showingDataForYears")} {trendsData.years?.length || 0}{" "}
              {t("financialYears")}
            </Alert>

            {/* Year-over-Year Comparison */}
            {trendsData.yoy_comparison &&
              trendsData.yoy_comparison.length > 0 && (
                <Paper sx={{ p: 3 }} className="card-shadow">
                  <Typography variant="h6" gutterBottom>
                    {t("yearOverYearChanges")}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {trendsData.yoy_comparison.map((comparison, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            gutterBottom
                          >
                            {comparison.previous_year} → {comparison.year}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography variant="caption">
                              Households:
                              <span
                                style={{
                                  color:
                                    comparison.changes?.households_change >= 0
                                      ? "green"
                                      : "red",
                                  fontWeight: 600,
                                  marginLeft: 4,
                                }}
                              >
                                {comparison.changes?.households_change >= 0
                                  ? "+"
                                  : ""}
                                {(
                                  comparison.changes?.households_change || 0
                                ).toFixed(1)}
                                %
                              </span>
                            </Typography>
                            <Typography variant="caption">
                              Expenditure:
                              <span
                                style={{
                                  color:
                                    comparison.changes?.expenditure_change >= 0
                                      ? "green"
                                      : "red",
                                  fontWeight: 600,
                                  marginLeft: 4,
                                }}
                              >
                                {comparison.changes?.expenditure_change >= 0
                                  ? "+"
                                  : ""}
                                {(
                                  comparison.changes?.expenditure_change || 0
                                ).toFixed(1)}
                                %
                              </span>
                            </Typography>
                            <Typography variant="caption">
                              Works Completed:
                              <span
                                style={{
                                  color:
                                    comparison.changes?.works_change >= 0
                                      ? "green"
                                      : "red",
                                  fontWeight: 600,
                                  marginLeft: 4,
                                }}
                              >
                                {comparison.changes?.works_change >= 0
                                  ? "+"
                                  : ""}
                                {(
                                  comparison.changes?.works_change || 0
                                ).toFixed(1)}
                                %
                              </span>
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

            {/* Charts Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <HistoricalTrendChart
                  data={transformDataForChart("total_households_worked")}
                  metric="households_worked"
                  title="Households Worked Over Years"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <HistoricalTrendChart
                  data={transformDataForChart("total_expenditure")}
                  metric="expenditure"
                  title="Total Expenditure Over Years"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <HistoricalTrendChart
                  data={transformDataForChart("total_completed_works")}
                  metric="completed_works"
                  title="Completed Works Over Years"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <HistoricalTrendChart
                  data={transformDataForChart("avg_wage_rate")}
                  metric="avg_wage_rate"
                  title="Average Wage Rate Over Years"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !trendsData && !error && (
          <Paper sx={{ p: 6, textAlign: "center" }} className="card-shadow">
            <TimelineIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t("selectDistrictToView")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("chooseDistrictAndView")}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HistoricalPage;
