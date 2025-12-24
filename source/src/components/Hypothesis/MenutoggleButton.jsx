import React from "react";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function MenuToggleButton({ open, onClick }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 32,
        left: "100%",   // attach to right edge of wrapper
        ml: "-5px",    // most of the button outside
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={onClick}
        disableRipple
        sx={{
          width: 32,
          height: 32,
          padding: 0,
          borderRadius: "0",
          bgcolor: "#1F6FFF",
          color: "#FFFFFF",
          "&:hover": {
            bgcolor: "#1F6FFF"
          },
        }}
      >
        {open ? (
          <ChevronLeftIcon sx={{ fontSize: 22 }} />
        ) : (
          <ChevronRightIcon sx={{ fontSize: 22 }} />
        )}
      </IconButton>
    </Box>
  );
}
