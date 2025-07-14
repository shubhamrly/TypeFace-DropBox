import React,{useState} from "react";
import { Card, CardContent, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import previewFallback from "./assets/previewfallback.jpg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
function FiewView({ file }) {
    const [anchorEl, setAnchorEl] = useState(null);
     const [renameDialogOpen, setRenameDialogOpen] = useState(false);
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
     const [newFileName, setNewFileName] = useState(file.originalName);
  const navigate = useNavigate();
  const renderPreview = () => (
    <div
      style={{
        height: "140px",
        width: "100%",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <img
        src={`${API_BASE_URL}/api/files/preview/${file.filename}`}
        alt={file.originalName}
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
        onError={(i) => {
          i.target.src = previewFallback;
          console.error("preview not avaialbe for: ", i.target.src);
        }}
      />
    </div>
  );
  //handle clicks on icons
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };
  const handleRenameClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    setRenameDialogOpen(true);
  };
  const handleRenameClose = (event) => {
    if (event) event.stopPropagation();
    setRenameDialogOpen(false);
  };
  const handleRenameSubmit = (event) => {
    if (event) event.stopPropagation();
    console.log(`Renaming file ${file.filename} to ${newFileName}`);
    setRenameDialogOpen(false);
  };
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    handleMenuClose();
    setDeleteDialogOpen(true);
  };
  const handleDeleteClose = (event) => {
    if (event) event.stopPropagation();
    setDeleteDialogOpen(false);
  };
  const handleDeleteConfirm = (event) => {
    if (event) event.stopPropagation();
    console.log(`Deleting file ${file.filename}`);
    setDeleteDialogOpen(false);
  };
  const handleFileClick = () => {
    const url = `${window.location.origin}/view/${file.filename}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <Paper
      elevation={3}
      style={{ cursor: "pointer" }}
      onClick={handleFileClick}
    >
      <Card style={{ position: "relative" }}>
        {renderPreview()}
        <CardContent style={{ textAlign: "center" }}>
          <Typography
            variant="body1"
            noWrap
            fontWeight="bold !important"
            title={file.originalName}
            sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {file.originalName}
          </Typography>
        </CardContent>
      </Card> <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleRenameClick}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteClick} style={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
      {}
      <Dialog
        open={renameDialogOpen}
        onClose={handleRenameClose}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New File Name"
            type="text"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameClose}>Cancel</Button>
          <Button
            onClick={handleRenameSubmit}
            variant="contained"
            color="primary"
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{file.originalName}"? This action
          cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
export default FiewView;