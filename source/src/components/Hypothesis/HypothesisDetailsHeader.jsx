// HypothesisDetailsHeader.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const BLUE = "#1F6FFF";

export default function HypothesisDetailsHeader({
    title,
    onBack,
    onNewHypothesis,
}) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ ml: "20px", fontWeight: 400 }}>
                {title}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: "#111827",
                        color: "#ffffff",
                        borderRadius: 0,
                        textTransform: "none",
                        px: 3,
                        "&:hover": { bgcolor: "#000000" },
                        fontWeight: 400,
                        fontSize: 14,
                    }}
                    onClick={onBack}
                >
                    Back to Dashboard
                </Button>
                <Button
                    variant="contained"
                    onClick={onNewHypothesis}
                    sx={{
                        bgcolor: BLUE,
                        color: "#ffffff",
                        borderRadius: 0,
                        textTransform: "none",
                        px: 3,
                        "&:hover": { bgcolor: "#1A56D8" },
                        fontWeight: 400,
                        fontSize: 14,
                    }}
                >
                    New Hypothesis +
                </Button>
            </Box>
        </Box>
    );
}
