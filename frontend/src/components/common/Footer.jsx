import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {t("appName")}.{" "}
            {t("allRightsReserved")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              href="https://nrega.nic.in/"
              target="_blank"
              rel="noopener"
              color="inherit"
              underline="hover"
            >
              {t("mgnregaOfficial")}
            </Link>
            <Link
              href="https://data.gov.in"
              target="_blank"
              rel="noopener"
              color="inherit"
              underline="hover"
            >
              {t("dataSource")}
            </Link>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1, textAlign: "center" }}
        >
          {t("dataProvidedBy")}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
