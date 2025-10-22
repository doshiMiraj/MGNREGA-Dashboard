import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useLanguage } from "../context/LanguageContext";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 128px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center" }}>
          <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          <Typography variant="h2" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom color="text.secondary">
            {t("pageNotFound")}
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            {t("pageNotFoundDesc")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            {t("goToHome")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
