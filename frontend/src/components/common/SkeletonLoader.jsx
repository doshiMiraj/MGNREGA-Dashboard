import React from "react";
import { Box, Card, CardContent, Skeleton, Grid } from "@mui/material";

// Skeleton for metric cards
export const MetricCardSkeleton = () => (
  <Card className="card-shadow">
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="80%" height={48} sx={{ my: 1 }} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
        <Skeleton
          variant="rectangular"
          width={56}
          height={56}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </CardContent>
  </Card>
);

// Skeleton for chart
export const ChartSkeleton = () => (
  <Card className="card-shadow">
    <CardContent>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        sx={{ borderRadius: 1 }}
      />
    </CardContent>
  </Card>
);

// Skeleton for table
export const TableSkeleton = ({ rows = 5 }) => (
  <Card className="card-shadow">
    <CardContent>
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      {[...Array(rows)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width="100%"
          height={48}
          sx={{ mb: 1 }}
        />
      ))}
    </CardContent>
  </Card>
);

// Skeleton for dashboard
export const DashboardSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    {/* Quick Stats Skeleton */}
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <MetricCardSkeleton />
        </Grid>
      ))}
    </Grid>

    {/* Charts Skeleton */}
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <ChartSkeleton />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Card className="card-shadow">
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Skeleton variant="circular" width={120} height={120} />
            </Box>
            {[1, 2, 3, 4, 5].map((item) => (
              <Box key={item} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={8}
                  sx={{ borderRadius: 4 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default {
  MetricCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  DashboardSkeleton,
};
