import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CompareArrows as CompareIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      title: t("districtDashboardTitle"),
      description: t("districtDashboardDesc"),
      icon: <DashboardIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/dashboard",
    },
    {
      title: t("compareDistrictsTitle"),
      description: t("compareDistrictsDesc"),
      icon: <CompareIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
      path: "/comparison",
    },
    {
      title: t("historicalTrendsTitle"),
      description: t("historicalTrendsDesc"),
      icon: <TimelineIcon sx={{ fontSize: 48, color: "success.main" }} />,
      path: "/historical",
    },
  ];

  return (
    <Box
      sx={{ bgcolor: "background.default", minHeight: "calc(100vh - 128px)" }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {t("appName")}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            {t("tagline")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            {t("heroDescription")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            startIcon={<DashboardIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            {t("viewDashboard")}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          {t("features")}
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 3 }}>
                  <Button size="large" onClick={() => navigate(feature.path)}>
                    {t("explore")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About MGNREGA Section */}
      <Box sx={{ bgcolor: "grey.100", py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            {t("aboutMGNREGA")}
          </Typography>
          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            {t("mgnregaDescription1")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("mgnregaDescription2")}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              href="https://nrega.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("learnMoreAboutMGNREGA")}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <LocationIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {t("selectYourDistrict")}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t("selectDistrictDescription")}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/dashboard")}
          sx={{ mt: 2 }}
        >
          {t("getStarted")}
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;
