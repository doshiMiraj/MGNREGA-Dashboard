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
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import ComparisonCard from "../components/dashboard/ComparisonCard";
import ComparisonTable from "../components/comparison/ComparisonTable";
import { useLocation } from "../context/LocationContext";
import { useDistrictList, useAvailableYears } from "../hooks/useMGNREGAData";
import mgnregaService from "../services/mgnregaService";
import { useLanguage } from "../context/LanguageContext";

const ComparisonPage = () => {
  const { selectedFinYear, selectFinYear } = useLocation();
  const { districts: allDistricts, loading: loadingDistricts } =
    useDistrictList();
  const { years, loading: loadingYears } = useAvailableYears();
  const { t } = useLanguage();

  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [localYear, setLocalYear] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [stateAverage, setStateAverage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize year
  useEffect(() => {
    if (selectedFinYear) {
      setLocalYear(selectedFinYear);
    } else if (years.length > 0) {
      setLocalYear(years[0]);
      selectFinYear(years[0]);
    }
  }, [selectedFinYear, years, selectFinYear]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setLocalYear(year);
    selectFinYear(year);
    setComparisonData(null); // Reset comparison when year changes
  };

  const handleDistrictSelect = (event) => {
    const codes = event.target.value;
    // Limit to 5 districts
    if (codes.length <= 5) {
      setSelectedDistricts(codes);
    }
  };

  const handleRemoveDistrict = (codeToRemove) => {
    setSelectedDistricts((prev) =>
      prev.filter((code) => code !== codeToRemove)
    );
  };

  const handleCompare = async () => {
    if (selectedDistricts.length < 2) {
      setError("Please select at least 2 districts to compare");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch comparison data
      const result = await mgnregaService.compareDistricts(
        selectedDistricts,
        localYear
      );

      if (result.success) {
        setComparisonData(result.data);

        // Fetch state average for comparison cards
        const stateResult = await mgnregaService.getStateStats(localYear);
        if (stateResult.success) {
          setStateAverage(stateResult.data);
        }
      } else {
        setError(result.message || "Failed to fetch comparison data");
      }
    } catch (err) {
      setError("Failed to load comparison data");
      console.error("Comparison error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDistricts || loadingYears) {
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
          {t("compareDistricts")}
        </Typography>

        {/* Selection Panel */}
        <Paper sx={{ p: 3, mb: 4 }} className="card-shadow">
          <Typography variant="h6" gutterBottom>
            {t("selectDistrictsToCompare")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {t("chooseMultipleDistricts")}
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
              <InputLabel>{t("selectDistrictsMax5")}</InputLabel>
              <Select
                multiple
                value={selectedDistricts}
                onChange={handleDistrictSelect}
                label={t("selectDistrictsMax5")}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((code) => {
                      const district = allDistricts.find(
                        (d) => d.code === code
                      );
                      return (
                        <Chip
                          key={code}
                          label={district?.name || code}
                          size="small"
                          onDelete={() => handleRemoveDistrict(code)}
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {allDistricts.map((district) => (
                  <MenuItem
                    key={district.code}
                    value={district.code}
                    disabled={
                      selectedDistricts.length >= 5 &&
                      !selectedDistricts.includes(district.code)
                    }
                  >
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
                label="Financial Year"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              startIcon={<CompareArrowsIcon />}
              onClick={handleCompare}
              disabled={selectedDistricts.length < 2 || loading}
              sx={{ minWidth: 150 }}
            >
              {t("compareButton")}
            </Button>
          </Box>

          {selectedDistricts.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {selectedDistricts.length}
                {selectedDistricts.length === 1
                  ? t("districtSelected")
                  : t("districtsSelected")}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onRetry={handleCompare} />}

        {/* Loading State */}
        {loading && <LoadingSpinner message={t("comparingDistricts")} />}

        {/* Comparison Results */}
        {!loading && comparisonData && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Summary Alert */}
            <Alert severity="info">
              <strong>{t("bestPerformer")}:</strong>{" "}
              {comparisonData.rankings?.best_performer?.district_name}(
              {t("score")}:{" "}
              {Math.round(
                comparisonData.rankings?.best_performer?.performance?.overall ||
                  0
              )}
              )
            </Alert>

            {/* Comparison Table */}
            <ComparisonTable districts={comparisonData.comparison} />

            {/* State Average Comparison (for first district only) */}
            {stateAverage && comparisonData.comparison.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mt: 3, fontWeight: 600 }}>
                  {comparisonData.comparison[0].district_name} vs State Average
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <ComparisonCard
                      title="Households Worked"
                      districtValue={
                        comparisonData.comparison[0].metrics
                          ?.total_households_worked || 0
                      }
                      stateAverage={
                        stateAverage.per_district_average?.avg_households || 0
                      }
                      format="number"
                      higherIsBetter={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ComparisonCard
                      title="Total Expenditure"
                      districtValue={
                        comparisonData.comparison[0].metrics
                          ?.total_expenditure || 0
                      }
                      stateAverage={
                        stateAverage.per_district_average?.avg_expenditure || 0
                      }
                      format="currency"
                      higherIsBetter={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ComparisonCard
                      title="Avg Wage Rate"
                      districtValue={
                        parseFloat(
                          comparisonData.comparison[0].metrics?.avg_wage_rate
                        ) || 0
                      }
                      stateAverage={
                        parseFloat(stateAverage.financial?.avg_wage_rate) || 0
                      }
                      format="currency"
                      higherIsBetter={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <ComparisonCard
                      title="Work Completion"
                      districtValue={
                        parseFloat(
                          comparisonData.comparison[0].metrics
                            ?.work_completion_rate
                        ) || 0
                      }
                      stateAverage={
                        parseFloat(stateAverage.works?.completion_rate) || 0
                      }
                      format="percentage"
                      higherIsBetter={true}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}

        {/* Empty State */}
        {!loading && !comparisonData && !error && (
          <Paper sx={{ p: 6, textAlign: "center" }} className="card-shadow">
            <CompareArrowsIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Select districts to start comparing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose 2-5 districts and click Compare to see side-by-side
              analysis
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default ComparisonPage;
