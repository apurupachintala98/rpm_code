// components/common/Toast.jsx
import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function Toast({
  open,
  message,
  severity = "success",
  autoHideDuration = 3000,
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
  
}