import * as React from "react";
import {
    Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import NewHypothesisDialog from "./NewHypothesisDialog";
import HypothesisDetailsForm from "./HypothesisDetailsForm";
import HypothesisDetailsHeader from "./HypothesisDetailsHeader";
import CompetetiveAnalysisPreview from './CompetetiveAnalysisPreview'
import { API_CONFIG } from "../../config/api"


export default function HypothesisDetails({
    selected,
    dialogOpen,
    setDialogOpen,
    onCreateOrRename,
    onHypothesisSaved,
}) {
    const navigate = useNavigate();
    const [details, setDetails] = React.useState("");
    const [rationale, setRationale] = React.useState("");
    const [showPreview, setShowPreview] = React.useState(false);

    // Effect to populate form when a different item is selected
    React.useEffect(() => {
        if (selected) {
            // Populate form with existing data (for both new and existing items)
            setDetails(selected.details || "");
            setRationale(selected.rationale || "");
        } else {
            // Clear form when no item is selected
            setDetails("");
            setRationale("");
        }
    }, [selected]);

    const onSaveForNow = async () => {
        // Commented out old UPDATE_TOPIC API - replaced with new add-hypothesis API in form component
        /* 
        try {
            const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPDATE_TOPIC}`
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hypothesis_name: selected.title,
                    details,
                    rationale,
                }),
            }); // [web:138][web:140]

            if (!res.ok) {
                console.error("Save failed", res.status);
            }
        } catch (e) {
            console.error("Error calling update_topic", e);
        }
        */
    };

    const onPreviewCostModel = () => {
        setShowPreview(true)
    };

    return (
        <Box
            sx={{
                flex: 1,
                p: 4,
                bgcolor: "#f3f4f6",
                height: "100vh",
                overflow: "auto",
            }}
        >
            {/* top bar */}
            <HypothesisDetailsHeader
                title={selected?.title}
                onBack={() => navigate('/')}
                onNewHypothesis={() => setDialogOpen(true)}
            />

            {showPreview ? <CompetetiveAnalysisPreview onBackToForm={()=>setShowPreview(false)}/>
       : (
        <HypothesisDetailsForm
          selected={selected}
          details={details}
          setDetails={setDetails}
          rationale={rationale}
          setRationale={setRationale}
          onSaveForNow={onSaveForNow}
          onPreviewCostModel={onPreviewCostModel}
          onHypothesisSaved={onHypothesisSaved}
        />
      )}


            <NewHypothesisDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onCreate={onCreateOrRename}
            />
        </Box>
    );
}
