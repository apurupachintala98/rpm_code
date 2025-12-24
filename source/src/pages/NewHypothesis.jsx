import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import HypothesisMenu from "../components/Hypothesis/HypothesisMenu";
import MenuToggleButton from "../components/Hypothesis/MenutoggleButton";
import HypothesisDetails from "../components/Hypothesis/HypothesisDetails";
import DeleteTopicDialog from "../components/Hypothesis/DeleteTopicDialog";
import { API_CONFIG } from "../config/api"
//import { useToast } from "../hooks/useToast";

export default function NewHypothesisPage() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDelete, setShowDelete] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  //const {showToast, ToastContainer} = useToast();

  // dialog is open on first load
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleCreateOrRename = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: trimmed,
      lastEdit: new Date().toISOString().slice(0, 10)
    }

    const nextItems = [newItem, ...items];

    setItems(nextItems);
    setSelected(newItem);
    setDialogOpen(false);
  };

  const handleEditHypothesis = (item) => {
    // Set the selected item for editing
    setSelected(item);
    // Note: The actual data fetching and form population will be handled
    // by the HypothesisDetailsForm component when it detects editing mode
  };

  const handleDeleteHypothesis = async (item) => {
    try {
      // Call the delete API to remove from database - using POST method with query parameter
      setDialogOpen(false)
      const endpoint = `${API_CONFIG.BASE_URL_ALT}${API_CONFIG.ENDPOINTS.DELETE_HYPOTHESIS}?hypothesis_id=${item.id}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "accept": "application/json",
        },
      });

      if (res.ok) {
        const response = await res.json();
        console.log("Delete response:", response);

        // Only update local state if backend deletion was successful
        const updatedItems = items.filter(i => i.id !== item.id);
        setItems(updatedItems);

        // If the deleted item was selected, select the first remaining item or null
        if (selected && selected.id === item.id) {
          setSelected(updatedItems.length > 0 ? updatedItems[0] : null);
        }

        console.log(`Hypothesis "${item.title}" deleted successfully`);
      } else {
        const errorText = await res.text();
        console.error("Failed to delete hypothesis", res.status, errorText);

        // Show more user-friendly error message
        try {
          const errorObj = JSON.parse(errorText);
          alert(`Failed to delete hypothesis: ${errorObj.detail || errorText}`);
        } catch {
          alert(`Failed to delete hypothesis: ${errorText || 'Unknown error'}`);
        }
      }
      // showToast("Deleted Successfully", "success")
    } catch (error) {
      console.error("Error deleting hypothesis:", error);
      alert(`Error deleting hypothesis: ${error.message}`);
    }
  };

  const handleHypothesisSaved = (savedData, action) => {
    // Update the items array with the saved data
    const updatedItem = {
      id: savedData.hypothesis_id,
      title: savedData.hypothesis_name,
      lastEdit: new Date().toISOString().slice(0, 10),
      details: savedData.details,
      rationale: savedData.rationale,
      lobs: savedData.lobs || [], // Include LOB data
      category: savedData.category || '', // Include category data
    };

    if (action === "updated") {
      // Update existing item in the array
      const updatedItems = items.map(item =>
        item.id === savedData.hypothesis_id ? updatedItem : item
      );
      setItems(updatedItems);
    } else if (action === "inserted") {
      // Add new item to the beginning of the array
      items[0] = updatedItem
      setItems(items);
    }
    setSelected(null);
    // showToast(action === "updated" ? "Saved Successfully" : "Created Successfully", "success")
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_TOPICS}`
        const res = await fetch(endpoint, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        if (!res.ok) {
          console.error("Failed to load topics", res.status);
          return;
        }

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];

        // map backend fields -> UI model
        const mapped = data.map((h) => ({
          id: h.hypothesis_id,
          title: h.hypothesis_nm,
          lastEdit: h.hypothesis_last_updtd_dt,
          details: h.hypothesis_smry_txt,
          rationale: h.hypothesis_rtnle_smry_txt,
          lobs: h.lobs || [], // Include LOB data from backend
          category: h.category || '', // Include category data from backend
        }));

        if (mapped.length > 0) {
          setItems(mapped);
          //setSelected(mapped[0]); // first item (like Topic Name 1)
        }
      } catch (err) {
        console.error("Error fetching topics", err);
      }
    };

    loadItems();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          width: open ? 340 : 40,
          transition: "width 0.25s ease",
          bgcolor: "#E3EEFF",
          height: "100vh",
        }}
      >
        <HypothesisMenu
          open={open}
          items={items}
          selectedId={selected?.id}
          onSelect={setSelected}
          onEdit={handleEditHypothesis}
          onDelete={(item) => {
            setShowDelete(true)
            setItemToDelete(item)
          }}
        />
        <MenuToggleButton open={open} onClick={() => setOpen((o) => !o)} />
        {itemToDelete && <DeleteTopicDialog
          open={showDelete}
          topicName={itemToDelete?.title}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            handleDeleteHypothesis(itemToDelete)
            setItemToDelete(null)
          }}
        />}
      </Box>

      <HypothesisDetails
        items={items}
        setItems={setItems}
        selected={selected}
        setSelected={setSelected}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onCreateOrRename={handleCreateOrRename}
        onHypothesisSaved={handleHypothesisSaved}
      />
     {/* <ToastContainer/> */}
    </Box>
  );
}
