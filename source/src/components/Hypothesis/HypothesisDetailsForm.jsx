// HypothesisDetailsForm.jsx
import React from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Link,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { API_CONFIG } from "../../config/api";

const GREY_LIGHT = "#E5E7EB";
const GREY_HOVER = "#D1D5DB";
const GREY_BODY = "#F3F4F6";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6B7280";
const BLUE = "#1F6FFF";
const BLUE_ICON = "#1F6FFF";

/* ---------- Header tile ---------- */
function HeaderTile({ title, column, sortDirByCol, setSortDirByCol }) {
    const [hover, setHover] = React.useState(false);
    const dir = sortDirByCol[column];

    const cycle = () => {
        let next = null;
        if (dir === null) next = "asc";
        else if (dir === "asc") next = "desc";
        else next = null;
        setSortDirByCol(prev => ({ ...prev, [column]: next }));
    };

    const isActive = dir !== null;
    const bg = isActive ? GREY_HOVER : hover ? GREY_HOVER : GREY_LIGHT;
    const border = isActive ? `1.5px solid ${BLUE}` : "1px solid transparent";

    const showNeutralArrows = hover && !isActive;
    const arrow =
        dir === "asc" ? "↑" :
            dir === "desc" ? "↓" :
                showNeutralArrows ? "↑↓" : "";

    return (
        <Box
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && cycle()}
            onClick={cycle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                bgcolor: bg,
                border,
                outline: "none",
                cursor: "pointer",
            }}
        >
            <Typography sx={{ fontSize: 14, color: TEXT_DARK, fontWeight: 400 }}>
                {title}
            </Typography>
            <Typography sx={{ fontSize: 12, color: TEXT_DARK, fontWeight: 400 }}>
                {arrow}
            </Typography>
        </Box>
    );
}

/* ---------- Form component ---------- */
export default function HypothesisDetailsForm({
    selected,
    details,
    setDetails,
    rationale,
    setRationale,
    onPreviewCostModel,
    onHypothesisSaved,
}) {
    // Function to get or generate dynamic user ID
    // const getUserId = React.useCallback(() => {
    //     let userId = localStorage.getItem('rpm_user_id');
    //     if (!userId) {
    //         // Generate unique user ID: timestamp + random string
    //         const timestamp = Date.now();
    //         const random = Math.random().toString(36).substring(2, 8);
    //         userId = `user_${timestamp}_${random}`;
    //         localStorage.setItem('rpm_user_id', userId);
    //     }
    //     return userId;
    // }, []);

    const fileInputRef = React.useRef(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadStatus, setUploadStatus] = React.useState("");
    const [_currentHypothesisId, setCurrentHypothesisId] = React.useState(null);

    const [lobOpen, setLobOpen] = React.useState(false);
    const [selectedLobs, setSelectedLobs] = React.useState([]);
    const [marketOpen, setMarketOpen] = React.useState(false);//new
    const [selectedMarket, setSelectedMarket] = React.useState('');//new

    // Reset LOB and market selections when switching to a different hypothesis
    React.useEffect(() => {
        if (selected) {
            // Load LOB and market data from the selected hypothesis if available
            setSelectedLobs(selected.lobs || []);
            setSelectedMarket(selected.market || '');
        } else {
            // Clear selections when no hypothesis is selected
            setSelectedLobs([]);
            setSelectedMarket('');
        }
        // Also clear file selection when switching hypotheses
        setSelectedFile(null);
        setUploadStatus('');
    }, [selected]);

    const LOB_OPTIONS = React.useMemo(
        () => ["Commercial", "Medicare", "Medicaid"],
        []
    );

    const MARKET_OPTIONS = React.useMemo(
        () => ["Individual Market", "Small Group Market", "Large Group Market", "Medicare Market", "Medicaid Market"],
        []
    );//new

    const isLobSelected = key =>
        Array.isArray(selectedLobs) && selectedLobs.includes(key);

    const renderLobPlaceholder = () => "Select one or more";

    const chipStyleFor = key => {
        switch (key) {
            case "Commercial":
                return { bg: "#34D3991A", text: "#1F2937", border: "1px solid #34D399" };
            case "Medicare":
                return { bg: "#C084FC1A", text: "#1F2937", border: "1px solid #C084FC" };
            case "Medicaid":
                return { bg: "#3B82F61A", text: "#1F2937", border: "1px solid #3B82F6" };
            default:
                return { bg: "#FFEAA71A", text: "#1F2937", border: "1px solid #FBBF24" };
        }
    };

    const onUploadClick = e => {
        e.preventDefault();
        e.stopPropagation();
        // Always open file browser when clicked (file will auto-upload when selected)
        if (!isUploading && fileInputRef.current) {
            // Clear previous value to ensure onChange fires even for same file
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleFileChange = e => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.target.files[0];
        if (file && !isUploading) {
            setSelectedFile(file);
            // File selected but not auto-uploaded - user needs to click Save
            setUploadStatus(`File "${file.name}" selected. Click Save to upload.`);
        }
    };

    const handleDragOver = e => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = e => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && !isUploading) {
            const file = files[0];
            setSelectedFile(file);
            // Clear file input to avoid conflicts
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // File dropped but not auto-uploaded - user needs to click Save
            setUploadStatus(`File "${file.name}" dropped. Click Save to upload.`);
        }
    };

    const onAddHypothesis = async () => {
        try {
            setUploadStatus("Creating hypothesis...");
            const endpoint = `${API_CONFIG.BASE_URL_ALT}${API_CONFIG.ENDPOINTS.ADD_HYPOTHESIS}`;
            const requestBody = {
                hypothesis_name: selected?.title || "New Hypothesis",
                details: details || "",
                rationale: rationale || "",
                user_domn_id: "1", // Hardcoded for testing
                // lobs: selectedLobs, // Include LOB selections
                // market: selectedMarket // Include market selection
            };
            
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "X-API-Name": "add-hypothesis" // Custom header to help identify in Network Tab
                },
                body: JSON.stringify(requestBody),
            });

            if (res.ok) {
                const data = await res.json();
                setCurrentHypothesisId(data.hypothesis_id);
                
                // Handle both inserted and updated actions
                const action = data.action === "updated" ? "updated" : "created";
                const message = data.message || `Hypothesis ${action} successfully!`;
                setUploadStatus(message);
                
                // Update the parent component's state with the saved data
                if (onHypothesisSaved && data.data) {
                    onHypothesisSaved(data.data, data.action);
                }
                
                return data.hypothesis_id;
            } else {
                const errorText = await res.text();
                console.error("Failed to create hypothesis", res.status, errorText);
                throw new Error(`HTTP ${res.status}: ${errorText || 'Failed to create hypothesis'}`);
            }
        } catch (e) {
            console.error("Error creating hypothesis:", e);
            setUploadStatus(`Error creating hypothesis: ${e.message}`);
            throw new Error(`Failed to create hypothesis: ${e.message}`);
        }
    };

    const onGetHypothesis = async (hypothesisId) => {
        try {
            setUploadStatus("Retrieving hypothesis data...");
            // Use query parameter format instead of path parameter
            const endpoint = `${API_CONFIG.BASE_URL_ALT}${API_CONFIG.ENDPOINTS.GET_HYPOTHESIS}?hypothesis_id=${hypothesisId}`;
            
            const res = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "X-API-Name": "get-hypothesis" // Custom header to help identify in Network Tab
                },
            });

            if (res.ok) {
                const response = await res.json();
                
                // Handle the response structure with message, hypothesis_id, and data fields
                const message = response.message || "Hypothesis data retrieved successfully!";
                setUploadStatus(message);
                
                return response;
            } else {
                const errorText = await res.text();
                console.error("Failed to get hypothesis", res.status, errorText);
                throw new Error(`HTTP ${res.status}: ${errorText || 'Failed to retrieve hypothesis'}`);
            }
        } catch (e) {
            console.error("Error retrieving hypothesis:", e);
            setUploadStatus(`Error retrieving hypothesis: ${e.message}`);
            throw new Error(`Failed to retrieve hypothesis: ${e.message}`);
        }
    };

    const uploadFileToServer = async () => {
        // Prevent multiple simultaneous uploads
        if (isUploading) {
            return;
        }

        try {
            setIsUploading(true);
            setUploadStatus("Preparing upload...");

            // Only create hypothesis if we don't have one already
            let hypothesisId = _currentHypothesisId;
            if (!hypothesisId) {
                hypothesisId = await onAddHypothesis();
                if (!hypothesisId) {
                    throw new Error("Failed to create hypothesis");
                }
            }

            // Then get hypothesis data using the new GET API
            const hypothesisData = await onGetHypothesis(hypothesisId);
            
            if (!hypothesisData) {
                throw new Error("Failed to retrieve hypothesis data");
            }

            setUploadStatus("File upload completed successfully!");
            
            // Clear status after success
            setTimeout(() => {
                setUploadStatus("");
                setIsUploading(false);
            }, 3000);
            
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus(`Upload failed: ${error.message}`);
            setIsUploading(false);
            
            // Clear error status after 5 seconds
            setTimeout(() => {
                setUploadStatus("");
            }, 5000);
        }
    };

    return (
        <Box sx={{ px: 0, pb: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 1,
                    bgcolor: "#ffffff",
                    border: "1px solid #e5e7eb",
                }}
            >
                {/* Details */}
                <Box sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.5,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#4b5563", fontWeight: 400 }}
                        >
                            Details
                        </Typography>
                    </Box>
                    <TextField
                        multiline
                        minRows={3}
                        fullWidth
                        placeholder="Describe the reimbursement consideration..."
                        variant="outlined"
                        value={details}
                        onChange={e => setDetails(e.target.value)}
                        InputProps={{
                            sx: {
                                alignItems: "flex-start",
                                bgcolor: "#f9fafb",
                                fontSize: 14,
                            },
                        }}
                        helperText="0/100"
                        FormHelperTextProps={{
                            sx: {
                                textAlign: "right",
                                mt: 0.5,
                                fontSize: 11,
                                color: "#9ca3af",
                            },
                        }}
                    />
                </Box>

                {/* Rationale */}
                <Box sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 0.5,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#4b5563", fontWeight: 400 }}
                        >
                            Rationale
                        </Typography>
                    </Box>
                    <TextField
                        multiline
                        minRows={3}
                        fullWidth
                        placeholder="Explain why this hypothesis is required"
                        variant="outlined"
                        value={rationale}
                        onChange={e => setRationale(e.target.value)}
                        InputProps={{
                            sx: {
                                alignItems: "flex-start",
                                bgcolor: "#f9fafb",
                                fontSize: 14,
                            },
                        }}
                        helperText="0/100"
                        FormHelperTextProps={{
                            sx: {
                                textAlign: "right",
                                mt: 0.5,
                                fontSize: 11,
                                color: "#9ca3af",
                            },
                        }}
                    />
                </Box>

                {/* Select your LOB(s) and Market */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 4, mb: 0.75 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#4b5563", fontWeight: 400 }}
                        >
                            Select your LOB(s)
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#4b5563", fontWeight: 400, ml: 16 }}
                        >
                            Select a Market
                        </Typography>
                    </Box>

                    {/* new */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 260 }}>
                        <Select
                            multiple
                            open={lobOpen}
                            onOpen={() => setLobOpen(true)}
                            onClose={() => setLobOpen(false)}
                            value={Array.isArray(selectedLobs) ? selectedLobs : []}
                            onChange={e => {
                                const raw = Array.isArray(e.target.value) ? e.target.value : [];
                                setSelectedLobs(raw);
                            }}
                            displayEmpty
                            renderValue={renderLobPlaceholder}
                            inputProps={{ "aria-label": "Select your LOB(s)" }}
                            variant="outlined"
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{
                                bgcolor: "#ffffff",
                                borderRadius: 0,
                                height: 36,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: lobOpen ? "#2563EB" : "#DADDE1",
                                    borderWidth: lobOpen ? "2px" : "1px",
                                },
                                "& .MuiSelect-icon": {
                                    transform: lobOpen ? "rotate(180deg)" : "none",
                                    transition: "transform 120ms ease",
                                },
                                "& .MuiSelect-select": {
                                    fontWeight: 400,
                                    fontSize: 14,
                                },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        borderRadius: 0,
                                        border: "1.5px solid #2563EB",
                                        boxShadow: "none",
                                    },
                                },
                            }}
                        >
                            {LOB_OPTIONS.map((opt, idx) => (
                                <MenuItem
                                    key={opt}
                                    value={opt}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setSelectedLobs(prev => {
                                            const next = Array.isArray(prev) ? [...prev] : [];
                                            const i = next.indexOf(opt);
                                            if (i >= 0) next.splice(i, 1);
                                            else next.push(opt);
                                            return next;
                                        });
                                    }}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        px: 2,
                                        py: 1,
                                        fontWeight: 400,
                                        fontSize: 14,
                                        borderBottom:
                                            idx === LOB_OPTIONS.length - 1
                                                ? "none"
                                                : "1px solid #EFEFEF",
                                    }}
                                >
                                    <Typography sx={{ color: "#1B1B1B", fontWeight: 400, fontSize: 14 }}>
                                        {opt}
                                    </Typography>
                                    {isLobSelected(opt) && (
                                        <CheckIcon sx={{ color: "#4B4B4B", fontSize: 18 }} />
                                    )}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 260 }}>
                        <Select
                            open={marketOpen}
                            onOpen={() => setMarketOpen(true)}
                            onClose={() => setMarketOpen(false)}
                            value={selectedMarket}
                            onChange={e => setSelectedMarket(e.target.value)}
                            displayEmpty
                            renderValue={(selected) => selected || "Select one or more"}
                            variant="outlined"
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{
                                bgcolor: "#ffffff",
                                borderRadius: 0,
                                height: 36,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: marketOpen ? "#2563EB" : "#DADDE1",
                                    borderWidth: marketOpen ? "2px" : "1px",
                                },
                                "& .MuiSelect-icon": {
                                    transform: marketOpen ? "rotate(180deg)" : "none",
                                    transition: "transform 120ms ease",
                                },
                                "& .MuiSelect-select": {
                                    fontWeight: 400,
                                    fontSize: 14,
                                },
                            }}
                        >
                            {MARKET_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                    <Typography sx={{ color: "#1B1B1B", fontWeight: 400, fontSize: 14 }}>
                                        {option}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </Box>

                    <Box sx={{ mt: 1.25, display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {selectedLobs.map(key => {
                            const s = chipStyleFor(key);
                            return (
                                <Chip
                                    key={key}
                                    label={key}
                                    onDelete={() =>
                                        setSelectedLobs(prev => prev.filter(k => k !== key))
                                    }
                                    deleteIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />}
                                    sx={{
                                        borderRadius: 1,
                                        bgcolor: s.bg,
                                        color: s.text,
                                        border: s.border,
                                        height: 28,
                                        "& .MuiChip-label": { px: 1, fontSize: 13, fontWeight: 400 },
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>

                {/* Cost overview */}
                <Box sx={{ mt: 2 }}>
                    <Typography
                        variant="subtitle2"
                        sx={{ color: "#4b5563", fontWeight: 400, mb: 0.5 }}
                    >
                        Cost overview
                    </Typography>

                    <Box
                        sx={{
                            border: "1px solid #E5E7EB",
                            bgcolor: "#FEFEFE",
                            borderRadius: 2,
                            p: 2,
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                border: "1px solid #E5E7EB",
                                bgcolor: "#FFFFFF",
                                borderRadius: 1,
                            }}
                        >
                            <Box sx={{ bgcolor: GREY_BODY, p: 3 }}>
                                <Box
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={onUploadClick}
                                    sx={{
                                        mx: "auto",
                                        maxWidth: 640,
                                        bgcolor: isDragOver ? "#F0F9FF" : "#FFFFFF",
                                        border: isDragOver
                                            ? "2px dashed #1F6FFF"
                                            : "1px dashed #D1D5DB",
                                        borderRadius: 1,
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            bgcolor: "#F9FAFB",
                                            borderColor: "#9CA3AF",
                                        },
                                    }}
                                >
                                    <CloudUploadOutlinedIcon
                                        sx={{ fontSize: 32, color: BLUE_ICON, mb: 1 }}
                                    />
                                    <Typography sx={{ fontSize: 14, color: TEXT_DARK, fontWeight: 400 }}>
                                        {selectedFile ? (
                                            <>
                                                Click to{" "}
                                                <Link
                                                    href="#"
                                                    underline="always"
                                                    sx={{ color: BLUE_ICON, fontSize: 14, fontWeight: 400 }}
                                                    onClick={onUploadClick}
                                                >
                                                    start upload
                                                </Link>
                                                {" "}or{" "}
                                                <Link
                                                    href="#"
                                                    underline="always"
                                                    sx={{ color: BLUE_ICON, fontSize: 14, fontWeight: 400 }}
                                                    onClick={onUploadClick}
                                                >
                                                    select different file
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                Drag your file here or click to{" "}
                                                <Link
                                                    href="#"
                                                    underline="always"
                                                    sx={{ color: BLUE_ICON, fontSize: 14, fontWeight: 400 }}
                                                    onClick={onUploadClick}
                                                >
                                                    select file
                                                </Link>
                                            </>
                                        )}
                                    </Typography>
                                    <Typography
                                        sx={{ mt: 1, fontSize: 12, color: TEXT_MUTED, fontWeight: 400 }}
                                    >
                                        (Financial Impacts Excel file to automatically populate cost
                                        overview tables)
                                    </Typography>
                                    {selectedFile && (
                                        <Typography
                                            sx={{
                                                mt: 2,
                                                fontSize: 12,
                                                color: "#059669",
                                                fontWeight: 500,
                                            }}
                                        >
                                            ✓ Selected: {selectedFile.name} (
                                            {(selectedFile.size / 1024).toFixed(1)} KB)
                                        </Typography>
                                    )}
                                    {isDragOver && (
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 12,
                                                color: BLUE_ICON,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Drop your file here
                                        </Typography>
                                    )}
                                    {uploadStatus && (
                                        <Typography
                                            sx={{
                                                mt: 2,
                                                fontSize: 12,
                                                color: isUploading ? "#1F6FFF" : "#059669",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {uploadStatus}
                                        </Typography>
                                    )}
                                </Box>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="*/*"
                                    style={{ display: "none" }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Buttons row */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1.5,
                            mt: 2,
                            mb: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={async () => {
                                try {
                                    // Always save/update the hypothesis with current form data
                                    setUploadStatus("Saving hypothesis...");
                                    const hypothesisId = await onAddHypothesis();
                                    
                                    // Only upload file if user has selected one
                                    if (selectedFile && hypothesisId) {
                                        setUploadStatus("Uploading file...");
                                        await uploadFileToServer();
                                        // Only call onGetHypothesis after file upload to avoid duplicate UI entries
                                        await onGetHypothesis(hypothesisId);
                                    } else {
                                        // No file to upload, hypothesis already saved and UI updated via onHypothesisSaved
                                        setUploadStatus("Hypothesis saved successfully!");
                                        // Skip onGetHypothesis call to prevent duplicate UI entries
                                    }
                                } catch (error) {
                                    console.error("Error during save:", error);
                                    setUploadStatus(`Error: ${error.message}`);
                                }
                            }}
                            disableElevation
                            sx={{
                                minWidth: 140,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "#2D2D2D",
                                color: "#FFFFFF",
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: 14,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#1F1F1F" },
                                "&:active": { bgcolor: "#141414" },
                            }}
                        >
                            Save for Now
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onPreviewCostModel}
                            disableElevation
                            sx={{
                                minWidth: 180,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "#1F6FFF",
                                color: "#FFFFFF",
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: 14,
                                boxShadow: "none",
                                border: "1px solid #1F6FFF",
                                "&:hover": { bgcolor: "#185BCE", borderColor: "#185BCE" },
                                "&:active": { bgcolor: "#1348A6", borderColor: "#1348A6" },
                            }}
                        >
                            Preview Cost Model
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
