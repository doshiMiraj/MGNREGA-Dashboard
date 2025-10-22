import React from "react";
import { Grid } from "@mui/material";
import MetricCard from "./MetricCard";
import { useLanguage } from "../../context/LanguageContext";

const QuickStats = ({ stats, loading = false }) => {
  const { t } = useLanguage();
  if (!stats) return null;

  const metrics = [
    {
      title: t("householdsWorked"),
      value: stats.total_households_worked,
      icon: "home_work",
      color: "primary",
      format: "large",
      subtitle: t("totalBeneficiaries"),
    },
    {
      title: t("totalExpenditure"),
      value: stats.total_expenditure,
      icon: "account_balance_wallet",
      color: "success",
      format: "currency",
      subtitle: t("inLakhs"),
    },
    {
      title: t("avgWageRate"),
      value: stats.avg_wage_rate,
      icon: "payments",
      color: "warning",
      format: "currency",
      subtitle: t("perDayPerPerson"),
    },
    {
      title: t("worksCompleted"),
      value: stats.completed_works,
      icon: "task_alt",
      color: "info",
      format: "large",
      subtitle: t("projectsFinished"),
    },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <MetricCard {...metric} loading={loading} />
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickStats;
