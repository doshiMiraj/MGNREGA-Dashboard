import React from "react";
import { Card, CardContent, Box, Typography, Icon } from "@mui/material";
import {
  formatNumber,
  formatCurrency,
  formatLargeNumber,
} from "../../utils/formatters";

const MetricCard = ({
  title,
  value,
  icon,
  color = "primary",
  format = "number",
  subtitle = null,
  trend = null,
  loading = false,
}) => {
  // Format value based on type
  const formatValue = (val) => {
    if (val === null || val === undefined) return "-";

    switch (format) {
      case "currency":
        return formatCurrency(val, 0);
      case "large":
        return formatLargeNumber(val);
      case "percentage":
        return `${formatNumber(val, 1)}%`;
      default:
        return formatNumber(val);
    }
  };

  // Get color from theme
  const getColor = () => {
    const colors = {
      primary: "#2196f3",
      success: "#4caf50",
      warning: "#ff9800",
      error: "#f44336",
      info: "#00bcd4",
    };
    return colors[color] || colors.primary;
  };

  return (
    <Card
      className="card-shadow-hover"
      sx={{
        height: "100%",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: getColor(),
                my: 1,
              }}
            >
              {loading ? "..." : formatValue(value)}
            </Typography>

            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}

            {trend && (
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: trend.value >= 0 ? "success.main" : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {trend.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  vs last year
                </Typography>
              </Box>
            )}
          </Box>

          {/* Icon */}
          {icon && (
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: `${getColor()}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ color: getColor(), fontSize: 32 }}>{icon}</Icon>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
