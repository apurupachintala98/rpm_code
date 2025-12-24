// HypothesisMenu.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function HypothesisMenu({
  open,
  items = [],
  selectedId,
  onSelect,
  onEdit, // Add onEdit prop to handle edit functionality
  onDelete, // Add onDelete prop to handle delete functionality
}) {
  if (!open) return null;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "#E3EEFF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* fixed header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#1A1A1A" }}
        >
          Reimbursement Hypothesis
        </
        Typography>
      </Box>

      {/* scrollable list */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 3,
          pb: 3,
          pr: 5,
        }}
      >
        {items.map((item) => (
          <Paper
            key={item.id}
            onClick={() => onSelect(item)}
            elevation={1}
            sx={{
              mb: 2,
              p: 2.2,
              cursor: "pointer",
              borderRadius: 1.5,
              backgroundColor: "#FFFFFF",
              border:
                item.id === selectedId
                  ? "1px solid #1F6FFF"
                  : "1px solid rgba(0,0,0,0.06)",
              boxShadow:
                item.id === selectedId
                  ? "0px 8px 18px rgba(0,0,0,0.18)"
                  : "0px 4px 12px rgba(0,0,0,0.12)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#222222",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onSelect
                    if (onEdit) {
                      onEdit(item); // Trigger edit mode for this item
                    }
                  }}
                  title="Edit hypothesis"
                >
                  <EditOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  size="small"
                  title="Delete hypothesis"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onSelect
                    if (onDelete) {
                      onDelete?.(item); // Trigger delete for this item
                    }
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "rgba(0,0,0,0.6)", fontSize: 12 }}
            >
              Last Edit: {item.lastEdit}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}