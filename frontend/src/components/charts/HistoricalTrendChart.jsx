import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";
import { formatNumber } from "../../utils/formatters";

const HistoricalTrendChart = ({
  data,
  metric = "households_worked",
  title,
  loading = false,
}) => {
  if (loading || !data || data.length === 0) {
    return (
      <Card className="card-shadow">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title || "Historical Trends"}
          </Typography>
          <Box
            sx={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

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
            {payload[0].payload.year}
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
          {title || "Year-over-Year Trends"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Compare performance across financial years
        </Typography>

        <Box sx={{ mt: 2 }}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#666" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#666"
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar
                dataKey="value"
                fill={CHART_COLORS.PRIMARY}
                name={metric
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HistoricalTrendChart;
