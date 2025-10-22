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
  Alert,
  Grid,
} from "@mui/material";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import QuickStats from "../components/dashboard/QuickStats";
import PerformanceIndicator from "../components/dashboard/PerformanceIndicator";
import EmploymentTrendChart from "../components/charts/EmploymentTrendChart";
import DemographicChart from "../components/charts/DemographicChart";
import { useLocation } from "../context/LocationContext";
import { useLanguage } from "../context/LanguageContext";
import {
  useDistrictList,
  useAvailableYears,
  useDistrictStats,
} from "../hooks/useMGNREGAData";

const DashboardPage = () => {
  const { selectedDistrict, selectedFinYear, selectDistrict, selectFinYear } =
    useLocation();

  const { t } = useLanguage();

  const {
    districts,
    loading: loadingDistricts,
    error: districtError,
  } = useDistrictList();
  const {
    years,
    loading: loadingYears,
    error: yearError,
  } = useAvailableYears();

  const [localDistrict, setLocalDistrict] = useState("");
  const [localYear, setLocalYear] = useState("");

  // Fetch district stats when district and year are selected
  const {
    stats,
    loading: loadingStats,
    error: statsError,
    refetch,
  } = useDistrictStats(selectedDistrict?.code, selectedFinYear);

  // Initialize from context
  useEffect(() => {
    if (selectedDistrict) {
      setLocalDistrict(selectedDistrict.code);
    }
    if (selectedFinYear) {
      setLocalYear(selectedFinYear);
    }
  }, [selectedDistrict, selectedFinYear]);

  // Auto-select first year if available
  useEffect(() => {
    if (years.length > 0 && !localYear) {
      setLocalYear(years[0]);
      selectFinYear(years[0]);
    }
  }, [years, localYear, selectFinYear]);

  const handleDistrictChange = (event) => {
    const code = event.target.value;
    setLocalDistrict(code);

    const district = districts.find((d) => d.code === code);
    if (district) {
      selectDistrict(district);
    }
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setLocalYear(year);
    selectFinYear(year);
  };

  if (loadingDistricts || loadingYears) {
    return <LoadingSpinner message={t("loading")} />;
  }

  if (districtError || yearError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage
          message={districtError || yearError}
          title={t("error")}
          onRetry={() => window.location.reload()}
        />
      </Container>
    );
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
          {t("districtDashboard")}
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }} className="card-shadow">
          <Typography variant="h6" gutterBottom>
            {t("selectDistrictAndYear")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
            <FormControl sx={{ minWidth: 250 }}>
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

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>{t("selectYear")}</InputLabel>
              <Select
                value={localYear}
                onChange={handleYearChange}
                label={t("selectYear")}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Content */}
        {!selectedDistrict ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {t("pleaseSelectDistrict")}
          </Alert>
        ) : loadingStats ? (
          <LoadingSpinner message={t("loadingDashboard")} />
        ) : statsError ? (
          <ErrorMessage message={t("failedToLoad")} onRetry={refetch} />
        ) : stats ? (
          <>
            {/* District Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                {selectedDistrict.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("selectYear")}: {selectedFinYear}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Quick Stats */}
              {stats.summary && (
                <QuickStats stats={stats.summary} loading={false} />
              )}

              {/* Main Content Grid */}
              <Grid container spacing={3}>
                {/* Employment Trends */}
                <Grid item xs={12} lg={8}>
                  <EmploymentTrendChart
                    data={stats.monthly_breakdown || []}
                    loading={false}
                  />
                </Grid>

                {/* Performance Score */}
                <Grid item xs={12} lg={4}>
                  <PerformanceIndicator
                    performance={stats.performance || null}
                    loading={false}
                  />
                </Grid>

                {/* Demographics */}
                <Grid item xs={12} lg={6}>
                  <DemographicChart
                    demographics={{
                      women_persondays:
                        (stats.summary?.total_households_worked || 0) * 0.55,
                      sc_persondays:
                        (stats.summary?.total_households_worked || 0) * 0.2,
                      st_persondays:
                        (stats.summary?.total_households_worked || 0) * 0.1,
                      total_persondays:
                        stats.summary?.total_households_worked || 0,
                      women_participation_rate: 55,
                    }}
                    loading={false}
                  />
                </Grid>

                {/* Additional Stats Card */}
                <Grid item xs={12} lg={6}>
                  <Paper sx={{ p: 3 }} className="card-shadow">
                    <Typography variant="h6" gutterBottom>
                      {t("keyMetrics")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("avgEmploymentDays")}
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {stats.averages?.avg_employment_days || 0} {t("days")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("workCompletionRate")}
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {stats.averages?.work_completion_rate || 0}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("womenParticipation")}
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          {stats.averages?.women_participation_rate || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <Alert severity="warning">{t("noDataForSelection")}</Alert>
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;
