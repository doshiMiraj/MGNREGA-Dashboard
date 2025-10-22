import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  getPerformanceColor,
  getPerformanceRating,
} from "../../utils/formatters";
import { useLanguage } from "../../context/LanguageContext";

const PerformanceIndicator = ({ performance, loading = false }) => {
  const { t } = useLanguage();

  if (!performance || loading) {
    return (
      <Card className="card-shadow">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("performanceScore")}
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  const scoreColor = getPerformanceColor(performance.overall, {
    EXCELLENT: 80,
    GOOD: 60,
    AVERAGE: 40,
  });

  const metrics = [
    { label: t("employment"), score: performance.employment, icon: "👷" },
    { label: t("wageRate"), score: performance.wageRate, icon: "💰" },
    {
      label: t("timeliness"),
      score: performance.paymentTimeliness,
      icon: "⏰",
    },
    {
      label: t("workCompletion"),
      score: performance.workCompletion,
      icon: "✅",
    },
    {
      label: t("womenParticipation"),
      score: performance.womenParticipation,
      icon: "👩",
    },
  ];

  return (
    <Card className="card-shadow">
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">{t("performanceScore")}</Typography>
          <Chip
            label={performance.rating}
            sx={{
              bgcolor: scoreColor,
              color: "white",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Overall Score */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `8px solid ${scoreColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: scoreColor }}
            >
              {Math.round(performance.overall)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t("overallPerformance")}
          </Typography>
        </Box>

        {/* Individual Metrics */}
        <Box sx={{ mt: 3 }}>
          {metrics.map((metric, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <span>{metric.icon}</span>
                  {metric.label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {Math.round(metric.score)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.score}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: getPerformanceColor(metric.score, {
                      EXCELLENT: 80,
                      GOOD: 60,
                      AVERAGE: 40,
                    }),
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceIndicator;
