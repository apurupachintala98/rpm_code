import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function NewHypothesisDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 1,
          py: 1,
          maxWidth: 720,
          width: "100%",
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "#f3f4f6",
          "&:hover": { bgcolor: "#e5e7eb" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Enter New Hypothesis Name
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            New Hypothesis Name
          </Typography>

          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                fontSize: 18,
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#000000",
                color: "#ffffff",
                px: 3,
                borderRadius: 1,
                fontSize: 16,
                textTransform: "none",
                "&:hover": { bgcolor: "#111111" },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
