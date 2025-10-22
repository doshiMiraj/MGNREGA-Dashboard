import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";
import { formatNumber, formatPercentage } from "../../utils/formatters";
import { useLanguage } from "../../context/LanguageContext";

const DemographicChart = ({ demographics, loading = false }) => {
  const { t } = useLanguage();

  if (loading || !demographics) {
    return (
      <Card className="card-shadow">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("demographicsBreakdown")}
          </Typography>
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              {t("noDataAvailable")}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: t("women"),
      value: demographics.women_persondays || 0,
      percentage: demographics.women_participation_rate || 0,
      color: CHART_COLORS.WOMEN,
    },
    {
      name: t("sc"),
      value: demographics.sc_persondays || 0,
      percentage:
        (demographics.sc_persondays / demographics.total_persondays) * 100 || 0,
      color: CHART_COLORS.SC,
    },
    {
      name: t("st"),
      value: demographics.st_persondays || 0,
      percentage:
        (demographics.st_persondays / demographics.total_persondays) * 100 || 0,
      color: CHART_COLORS.ST,
    },
    {
      name: t("general"),
      value:
        demographics.total_persondays -
          demographics.sc_persondays -
          demographics.st_persondays || 0,
      percentage:
        ((demographics.total_persondays -
          demographics.sc_persondays -
          demographics.st_persondays) /
          demographics.total_persondays) *
          100 || 0,
      color: CHART_COLORS.GENERAL,
    },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {data.name}
          </Typography>
          <Typography variant="caption" display="block">
            Persondays: {formatNumber(data.value)}
          </Typography>
          <Typography variant="caption" display="block">
            Percentage: {formatPercentage(data.percentage)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="card-shadow">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("demographicsBreakdown")}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t("persondaysDistribution")}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => {
                  const item = chartData.find((d) => d.name === value);
                  return `${value} (${formatPercentage(
                    item?.percentage || 0
                  )})`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Stats */}
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {chartData.map((item, index) => (
            <Box key={index} sx={{ flex: "1 1 auto", minWidth: 100 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.name}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {formatNumber(item.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DemographicChart;
