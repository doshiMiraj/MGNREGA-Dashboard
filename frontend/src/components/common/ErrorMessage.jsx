import React from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorMessage = ({
  message = "Something went wrong",
  title = "Error",
  onRetry = null,
}) => {
  return (
    <Box sx={{ my: 4, px: 2 }}>
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon />}
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
