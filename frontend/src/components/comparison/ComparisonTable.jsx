import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import {
  formatNumber,
  formatCurrency,
  getPerformanceColor,
} from "../../utils/formatters";

const ComparisonTable = ({ districts, loading = false }) => {
  if (!districts || districts.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No districts selected for comparison
        </Typography>
      </Paper>
    );
  }

  const metrics = [
    {
      key: "total_households_worked",
      label: "Households Worked",
      format: "number",
    },
    {
      key: "total_expenditure",
      label: "Total Expenditure",
      format: "currency",
    },
    {
      key: "avg_wage_rate",
      label: "Avg Wage Rate",
      format: "currency",
    },
    {
      key: "completed_works",
      label: "Completed Works",
      format: "number",
    },
    {
      key: "work_completion_rate",
      label: "Completion Rate",
      format: "percentage",
    },
    {
      key: "women_participation_rate",
      label: "Women Participation",
      format: "percentage",
    },
  ];

  const formatValue = (value, format) => {
    if (value === null || value === undefined) return "-";

    switch (format) {
      case "currency":
        return formatCurrency(value, 0);
      case "percentage":
        return `${formatNumber(value, 1)}%`;
      default:
        return formatNumber(value);
    }
  };

  // Find best value for each metric to highlight
  const getBestValue = (metricKey) => {
    const values = districts.map(
      (d) => parseFloat(d.metrics?.[metricKey]) || 0
    );
    return Math.max(...values);
  };

  const isBestValue = (districtValue, metricKey) => {
    return parseFloat(districtValue) === getBestValue(metricKey);
  };

  return (
    <TableContainer component={Paper} className="card-shadow">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "primary.main" }}>
            <TableCell sx={{ color: "white", fontWeight: 600 }}>
              Metric
            </TableCell>
            {districts.map((district) => (
              <TableCell
                key={district.district_code}
                align="center"
                sx={{ color: "white", fontWeight: 600 }}
              >
                {district.district_name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Performance Score Row */}
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell sx={{ fontWeight: 600 }}>Overall Performance</TableCell>
            {districts.map((district) => (
              <TableCell key={district.district_code} align="center">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {Math.round(district.performance?.overall || 0)}
                  </Typography>
                  <Chip
                    label={district.performance?.rating || "N/A"}
                    size="small"
                    sx={{
                      bgcolor: getPerformanceColor(
                        district.performance?.overall || 0,
                        {
                          EXCELLENT: 80,
                          GOOD: 60,
                          AVERAGE: 40,
                        }
                      ),
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </TableCell>
            ))}
          </TableRow>

          {/* Metric Rows */}
          {metrics.map((metric, index) => (
            <TableRow
              key={metric.key}
              sx={{
                "&:hover": { bgcolor: "grey.50" },
                bgcolor: index % 2 === 0 ? "white" : "grey.50",
              }}
            >
              <TableCell sx={{ fontWeight: 500 }}>{metric.label}</TableCell>
              {districts.map((district) => {
                const value = district.metrics?.[metric.key];
                const isBest = isBestValue(value, metric.key);

                return (
                  <TableCell
                    key={district.district_code}
                    align="center"
                    sx={{
                      fontWeight: isBest ? 700 : 400,
                      color: isBest ? "success.main" : "text.primary",
                      bgcolor: isBest ? "success.50" : "inherit",
                    }}
                  >
                    {formatValue(value, metric.format)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ComparisonTable;
