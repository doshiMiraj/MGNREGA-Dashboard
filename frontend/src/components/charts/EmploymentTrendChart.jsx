import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";
import { formatNumber } from "../../utils/formatters";
import { useLanguage } from "../../context/LanguageContext";

const EmploymentTrendChart = ({ data, loading = false }) => {
  const { t } = useLanguage();

  if (loading || !data || data.length === 0) {
    return (
      <Card className="card-shadow">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("employmentTrends")}
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

  // Transform data for chart
  const chartData = data.map((item) => ({
    month: item.month,
    households: item.households_worked || 0,
    individuals: item.individuals_worked || 0,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
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
            {payload[0].payload.month}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{ color: entry.color, display: "block" }}
            >
              {entry.name}: {formatNumber(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card className="card-shadow">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("employmentTrends")}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t("monthlyEmployment")}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="households"
                stroke={CHART_COLORS.PRIMARY}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.PRIMARY, r: 4 }}
                activeDot={{ r: 6 }}
                name={t("households")}
              />
              <Line
                type="monotone"
                dataKey="individuals"
                stroke={CHART_COLORS.SECONDARY}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.SECONDARY, r: 4 }}
                activeDot={{ r: 6 }}
                name={t("individuals")}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmploymentTrendChart;
