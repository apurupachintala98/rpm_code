// DeleteTopicDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function DeleteTopicDialog({
  open,
  topicName,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete topic</DialogTitle>
      <DialogContent>
        <Typography>
          Do you want to delete {topicName}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}