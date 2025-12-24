// CostModelPreview.jsx
import React from "react";
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    Select,
    MenuItem,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function CompetetiveAnalysisPreview({ onBackToForm }) {
    const [tab, setTab] = React.useState(0);
    const [competitor, setCompetitor] = React.useState("");
    const [expanded, setExpanded] = React.useState("competitive");

    const rows = [
        {
            name: "UHC (Actual Document)",
            language:
                "Preventive Medicine Policy does not separately reimburse other E/Ms, screening services, prolonged services, counseling services, VMT, Visual Function. Bundle 99499 into the primary annual/preventive E/M; not reimbursed separately.",
            aligns: "Aligns",
        },
        {
            name: "Cigna (Actual Document)",
            language:
                "Notification: Effective June 1, 2025, except in the case of preventive E/M services, Cigna will not separately reimburse CPT code 99499 when reported with E/M CPT codes 99202 – 99205 and 99212 – 99215; it is considered included in the E/M service.",
            aligns: "Aligns",
        },
    ];

    const handleAccordionChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const isOverviewOpen = expanded === "overview";
    const isCompetitiveOpen = expanded === "competitive";

    return (
        <Box sx={{ pb: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 1,
                    border: "1px solid #E5E7EB",
                    bgcolor: "#FFFFFF",
                }}
            >
                {/* OVERVIEW accordion */}
                <Accordion
                    expanded={isOverviewOpen}
                    onChange={handleAccordionChange("overview")}
                    square
                    disableGutters
                    elevation={0}
                    sx={{
                        "&:before": { display: "none" },
                        borderBottom: "1px solid #E5E7EB",
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: 40,
                            px: 2,
                            bgcolor: isOverviewOpen ? "#E5E7EB" : "#FFFFFF",
                            "& .MuiAccordionSummary-content": { m: 0, alignItems: "center" },
                        }}
                    >
                        <Typography sx={{ fontSize: 15, color: "#111827" }}>
                            Overview
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, py: 1.5 }}>
                        <Typography sx={{ fontSize: 13, color: "#6B7280" }}>
                            Overview content placeholder.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* COMPETITIVE ANALYSIS accordion */}
                <Accordion
                    expanded={isCompetitiveOpen}
                    onChange={handleAccordionChange("competitive")}
                    square
                    disableGutters
                    elevation={0}
                    sx={{
                        "&:before": { display: "none" },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: 40,
                            px: 2,
                            bgcolor: isCompetitiveOpen ? "#E5E7EB" : "#FFFFFF",
                            "& .MuiAccordionSummary-content": { m: 0, alignItems: "center" },
                        }}
                    >
                        <Typography sx={{ fontSize: 15, color: "#111827" }}>
                            Competitive Analysis
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: 0 }}>
                        {/* Top section: inner tabs (unchanged) */}
                        <Box sx={{ borderBottom: "1px solid #E5E7EB", p: 2 }}>
                            <Tabs
                                value={tab}
                                onChange={(_, v) => setTab(v)}
                                sx={{
                                    minHeight: 32,
                                    "& .MuiTab-root": {
                                        textTransform: "none",
                                        fontSize: 13,
                                        minHeight: 32,
                                        px: 2.5,
                                        mr: 1,
                                    },
                                }}
                            >
                                <Tab label="Competitors" />
                                <Tab label="CMS" />
                                <Tab label="Other Blue Plans" />
                                <Tab label="Specialty Society or Other Agency" />
                            </Tabs>
                        </Box>

                        {/* Filter row (unchanged) */}
                        <Box sx={{ p: 2, borderBottom: "1px solid #E5E7EB" }}>
                            <Typography
                                variant="caption"
                                sx={{ display: "block", mb: 0.5, color: "#4B5563" }}
                            >
                                Select Competitors
                            </Typography>
                            <Select
                                value={competitor}
                                onChange={(e) => setCompetitor(e.target.value)}
                                displayEmpty
                                size="small"
                                sx={{ width: 260, bgcolor: "#FFFFFF" }}
                            >
                                <MenuItem value="">
                                    <em>Choose an option</em>
                                </MenuItem>
                                <MenuItem value="uhc">UHC</MenuItem>
                                <MenuItem value="cigna">Cigna</MenuItem>
                            </Select>
                        </Box>

                        {/* Main table area with gray header row (your grid) */}
                        <Box sx={{ p: 2 }}>
                            <Table
                                size="small"
                                sx={{
                                    borderCollapse: "separate",
                                    borderSpacing: 0,
                                }}
                            >
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            bgcolor: "#F3F4F6",
                                            "& th": {
                                                borderBottom: "1px solid #D1D5DB",
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: "#111827",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ width: "25%" }}>Competitors</TableCell>
                                        <TableCell sx={{ width: "55%" }}>Language</TableCell>
                                        <TableCell sx={{ width: "10%" }}>
                                            Aligns/Not Aligns
                                        </TableCell>
                                        <TableCell sx={{ width: "10%" }} />
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rows.map((row, idx) => (
                                        <TableRow
                                            key={idx}
                                            sx={{
                                                "& td": {
                                                    borderBottom: "1px solid #E5E7EB",
                                                    verticalAlign: "top",
                                                    fontSize: 13,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Typography
                                                    sx={{
                                                        fontSize: 13,
                                                        color: "#2563EB",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {row.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ color: "#374151" }}>
                                                {row.language}
                                            </TableCell>
                                            <TableCell sx={{ color: "#111827" }}>
                                                {row.aligns}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2} sx={{ borderBottom: "none" }}>
                                            <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                                                Items per page: 100 &nbsp; | &nbsp; 1–100 of 100 items
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            colSpan={2}
                                            align="right"
                                            sx={{ borderBottom: "none" }}
                                        >
                                            <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                                                1 of 10 pages
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Box>

                        {/* Bottom action bar (unchanged) */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderTop: "1px solid #E5E7EB",
                                p: 2,
                                bgcolor: "#F9FAFB",
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={onBackToForm}
                                sx={{
                                    borderRadius: 0,
                                    borderColor: "#111827",
                                    color: "#111827",
                                    textTransform: "none",
                                    px: 3,
                                    fontSize: 13,
                                }}
                            >
                                Back to Overview
                            </Button>

                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#374151",
                                        color: "#FFFFFF",
                                        borderRadius: 0,
                                        textTransform: "none",
                                        px: 3,
                                        fontSize: 13,
                                        "&:hover": { bgcolor: "#111827" },
                                    }}
                                >
                                    Save for Now
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#2563EB",
                                        color: "#FFFFFF",
                                        borderRadius: 0,
                                        textTransform: "none",
                                        px: 3,
                                        fontSize: 13,
                                        "&:hover": { bgcolor: "#1D4ED8" },
                                    }}
                                >
                                    Generate Summary
                                </Button>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Box>
    );
}
