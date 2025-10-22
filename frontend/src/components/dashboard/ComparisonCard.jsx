import React from "react";
import { Card, CardContent, Box, Typography, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
} from "../../utils/formatters";

const ComparisonCard = ({
  title,
  districtValue,
  stateAverage,
  format = "number",
  higherIsBetter = true,
}) => {
  // Calculate difference percentage
  const calculateDifference = () => {
    if (!stateAverage || stateAverage === 0) return 0;
    return ((districtValue - stateAverage) / stateAverage) * 100;
  };

  const difference = calculateDifference();
  const isAboveAverage = difference > 0;
  const isSignificant = Math.abs(difference) > 5; // 5% threshold

  // Determine status color
  const getStatusColor = () => {
    if (!isSignificant) return "default";
    if (higherIsBetter) {
      return isAboveAverage ? "success" : "error";
    } else {
      return isAboveAverage ? "error" : "success";
    }
  };

  // Format value based on type
  const formatValue = (val) => {
    if (val === null || val === undefined) return "-";

    switch (format) {
      case "currency":
        return formatCurrency(val, 0);
      case "percentage":
        return formatPercentage(val);
      default:
        return formatNumber(val);
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (!isSignificant) return <RemoveIcon fontSize="small" />;
    return isAboveAverage ? (
      <TrendingUpIcon fontSize="small" />
    ) : (
      <TrendingDownIcon fontSize="small" />
    );
  };

  return (
    <Card className="card-shadow">
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 2,
          }}
        >
          {/* District Value */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              District
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {formatValue(districtValue)}
            </Typography>
          </Box>

          {/* VS Indicator */}
          <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
            vs
          </Typography>

          {/* State Average */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              State Avg
            </Typography>
            <Typography variant="h5" fontWeight={600} color="text.secondary">
              {formatValue(stateAverage)}
            </Typography>
          </Box>
        </Box>

        {/* Status Chip */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Chip
            icon={getTrendIcon()}
            label={
              isAboveAverage
                ? `${formatPercentage(Math.abs(difference))} above average`
                : `${formatPercentage(Math.abs(difference))} below average`
            }
            color={getStatusColor()}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ComparisonCard;
