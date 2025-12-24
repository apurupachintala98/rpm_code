// hooks/useToast.js
import { useState, useCallback } from "react";
import Toast from "../components/common/Toast";

export function useToast() {
  const [toastState, setToastState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback((message, severity = "success") => {
    setToastState({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  // you render <ToastContainer /> in your component tree
  const ToastContainer = () => (
    <Toast
      open={toastState.open}
      message={toastState.message}
      severity={toastState.severity}
      onClose={hideToast}
    />
  );

  return { showToast, ToastContainer };
}