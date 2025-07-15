import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";
import {
  FaSearch,
  FaSort,
  FaFilter,
  FaEye,
  FaDownload,
  FaInfoCircle,
  FaThList,
  FaTh,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import previewFallback from "./assets/previewfallback.jpg";
import emptyTableImage from "./assets/emptyTable.png";
import {
  setSortOption,
  setFilterType,
  setSearchTerm,
  setViewMode,
} from "./fileViewerSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//icon colors
const iconColors = {
  view: "rgb(21, 158, 60)",
  download: "rgb(62, 0, 148)",
  info: "rgb(0, 123, 255)",
  rename: "rgb(255, 193, 7)",
  delete: "rgb(244, 67, 54)",
};

//table view, oer page 15 then on page change find more 
function FileViewer({ page = 1, filesPerPage = 15, onPageChange, refreshFiles }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sortOption, filterType, searchTerm, viewMode } = useSelector(
    (state) => state.fileViewer
  );
  const [files, setFiles] = useState([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoFile, setInfoFile] = useState(null);
  const [backendWarning, setBackendWarning] = useState(false);
  const [totalFiles, setTotalFiles] = useState(0);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [alertOpen, setAlertOpen] = useState(false);
 
  useEffect(() => {
    getFiles();
  }, [searchTerm, sortOption, filterType]);
  
  //to get the latest
  useEffect(() => {
    if (typeof refreshFiles === "function") {
      refreshFiles(getFiles);
    }
  }, [refreshFiles]);
  
  const getFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/files?all=true`);
      let allFiles = res.data.files;
      if (searchTerm) {
        allFiles = allFiles.filter((file) =>
          file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterType) {
        allFiles = allFiles.filter((file) => file.fileType === filterType);
      }
      //sorting in the date and size
      allFiles = allFiles.sort((a, b) => {
        if (sortOption === "date-1") {
          return new Date(b.uploadedDate) - new Date(a.uploadedDate);
        } else if (sortOption === "date-2") {
          return new Date(a.uploadedDate) - new Date(b.uploadedDate);
        } else if (sortOption === "size-2") {
          return a.size - b.size;
        } else if (sortOption === "size-1") {
          return b.size - a.size;
        }
        return 0;
      });
      setFiles(allFiles);
      setTotalFiles(allFiles.length);
      setBackendAvailable(true);
    } catch (error) {
      setBackendAvailable(false);
    }
  };
  // search and all menu  is in redux persistance
  const handleSearch = (i) => {
    const term = i.target.value;
    dispatch(setSearchTerm(term));
  };
  const handleSortChange = (i) => {
    const option = i.target.value;
    dispatch(setSortOption(option));
  };
  const handleFilterChange = (i) => {
    const type = i.target.value;
    dispatch(setFilterType(type));
  };
  const handleViewModeChange = (i, newViewMode) => {
    if (newViewMode !== null) {
      dispatch(setViewMode(newViewMode));
    }
  };

  // for thumbhnails
  const renderPreview = (file) => (
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
          i.target.onerror = null;
          i.target.src = previewFallback;
        }}
      />
    </div>
  );
  // in new tab
  const handleView = (file) => {
    window.open(`${API_BASE_URL}/api/files/preview/${file.filename}`, "_blank");
  };
  // calling servicee to make a blob
  const handleDownload = async (file) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/files/preview/${file.filename}`
      );
      if (!response.ok) {
        setBackendWarning(true);
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setBackendWarning(true);
    }
  };
  //mongo call
  const handleInfoOpen = (file) => {
    setInfoFile(file);
    setInfoDialogOpen(true);
  };
  const handleInfoClose = () => {
    setInfoDialogOpen(false);
    setInfoFile(null);
  };

  // mongo changes only
  const handleRenameClick = (file, event) => {
    if (event) event.stopPropagation();
    setFileToRename(file);
    setNewFileName(file.originalName);
    setRenameDialogOpen(true);
  };
  const handleDeleteClick = (file, event) => {
    if (event) event.stopPropagation();
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };
  const handleRenameFile = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/files/rename/${fileToRename.filename}`,
        { newName: newFileName }
      );
      const updatedFiles = files.map((file) => 
        file._id === response.data._id ? { ...file, originalName: newFileName } : file
      );
      setFiles(updatedFiles);
      setRenameDialogOpen(false);
      setAlertType("success");
      setAlertMessage("File renamed successfully");
      setAlertOpen(true);
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to rename file. Please try again.");
      setAlertOpen(true);
    }
  };
  //delete
  const handleDeleteFile = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/files/delete/${fileToDelete.filename}`);
      const updatedFiles = files.filter((file) => file._id !== fileToDelete._id);
      setFiles(updatedFiles);
      setTotalFiles(totalFiles - 1);
      setDeleteDialogOpen(false);
      setAlertType("success");
      setAlertMessage("File deleted successfully");
      setAlertOpen(true);
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to delete file. Please try again.");
      setAlertOpen(true);
    }
  };
//render icons
  const renderFileActions = (file) => (
    <Box
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={(i) => {
            i.stopPropagation();
            handleView(file);
          }}
          style={{ color: iconColors.view }}
        >
          <FaEye />
        </IconButton>
      </Tooltip>
      <Tooltip title="Download">
        <IconButton
          size="small"
          onClick={(i) => {
            i.stopPropagation();
            handleDownload(file);
          }}
          style={{ color: iconColors.download }}
        >
          <FaDownload />
        </IconButton>
      </Tooltip>
      <Tooltip title="Info">
        <IconButton
          size="small"
          onClick={(i) => {
            i.stopPropagation();
            handleInfoOpen(file);
          }}
          style={{ color: iconColors.info }}
        >
          <FaInfoCircle />
        </IconButton>
      </Tooltip>
      <Tooltip title="Rename">
        <IconButton
          size="small"
          onClick={(i) => handleRenameClick(file, i)}
          style={{ color: iconColors.rename }}
        >
          <FaEdit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={(i) => handleDeleteClick(file, i)}
          style={{ color: iconColors.delete }}
        >
          <FaTrashAlt />
        </IconButton>
      </Tooltip>
    </Box>
  );

  //view mode
  const renderThumbnailView = () => (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
      }}
    >
      {files.map((file) => (
        <Paper
          elevation={3}
          key={file._id}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <Card style={{ position: "relative" }}>
            <div
              onClick={() => handleView(file)}
              style={{ cursor: "pointer" }}
              title="View"
            >
              {renderPreview(file)}
            </div>
            <CardContent
              style={{
                textAlign: "center",
                position: "relative",
                paddingBottom: "40px",
              }}
            >
              <Typography>
                {file.originalName.length > 10
                  ? `${file.originalName.substring(0, 10)}...`
                  : file.originalName}
              </Typography>
              {renderFileActions(file)}
            </CardContent>
          </Card>
        </Paper>
      ))}
    </Box>
  );

  const renderListView = () => (
    <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
      <Table size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: "#f5f5f5" }}>
            <TableCell style={{ width: "50px" }}></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Uploaded</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file._id} hover>
              <TableCell>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`${API_BASE_URL}/api/files/preview/${file.filename}`}
                    alt={file.originalName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(i) => {
                      i.target.onerror = null;
                      i.target.src = previewFallback;
                    }}
                  />
                </div>
              </TableCell>
              <TableCell
                onClick={() => handleView(file)}
                style={{ cursor: "pointer" }}
              >
                {file.originalName}
              </TableCell>
              <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
              <TableCell>
                {new Date(file.uploadedDate).toLocaleString()}
              </TableCell>
              <TableCell align="center">
               <span style={{ display: "flex", justifyContent: "center", gap: "8px",alignItems: "center" }}>
                <Tooltip title="View">
                  <IconButton size="small" onClick={() => handleView(file)}>
                    <FaEye style={{ color: iconColors.view }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(file)}
                  >
                    <FaDownload style={{ color: iconColors.download }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Info">
                  <IconButton
                    size="small"
                    onClick={() => handleInfoOpen(file)}
                  >
                    <FaInfoCircle style={{ color: iconColors.info }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Rename">
                  <IconButton
                    size="small"
                    onClick={(e) => handleRenameClick(file, e)}
                  >
                    <FaEdit style={{ color: iconColors.rename }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteClick(file, e)}
                  >
                    <FaTrashAlt style={{ color: iconColors.delete }} />
                  </IconButton>
                </Tooltip>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


  return (
    <Box style={{ padding: "16px" }}>
      {}
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "8px 16px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          marginBottom: "16px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {}
        <Box style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <FaSearch style={{ marginRight: "8px" }} />
          <TextField
            label="Search Files"
            variant="outlined"
            fullWidth
            onChange={handleSearch}
            value={searchTerm}
            InputProps={{
              style: {
                height: "32px",
                padding: "0 8px",
                fontSize: "14px",
                lineHeight: "1.5",
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "10px",
                top: "-7px",
              },
            }}
          />
        </Box>
        {}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <FaSort style={{ marginRight: "8px" }} />
          <Select
            value={sortOption}
            onChange={handleSortChange}
            displayEmpty
            style={{
              width: "120px",
              height: "32px",
              fontSize: "14px",
            }}
          > <MenuItem value="date-1">ASC Date</MenuItem>
            <MenuItem value="date-2">DESC Date</MenuItem>
            <MenuItem value="size-2">ASC Size</MenuItem>
            <MenuItem value="size-1">DESC Size</MenuItem>
          </Select>
        </Box>
        {}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <FaFilter style={{ marginRight: "8px" }} />
          <Select
            value={filterType}
            onChange={handleFilterChange}
            displayEmpty
            style={{
              width: "120px",
              height: "32px",
              fontSize: "14px",
            }}
          >
            <MenuItem value="">All Files</MenuItem>
            <MenuItem value="image">Images</MenuItem>
            <MenuItem value="application">Application</MenuItem>
            <MenuItem value="text">Text Files</MenuItem>
          </Select>
        </Box>
        {}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="view mode"
          >
            <ToggleButton value="thumbnail" aria-label="thumbnail view">
              <FaTh />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <FaThList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      {}
      {files.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            marginTop: "32px",
            padding: "24px",
            color: "#888",
          }}
        >
          <img
            src={emptyTableImage}
            alt="No-files-found"
            style={{
              maxWidth: "46%",
              height: "151px",
              margin: "0 auto",
            }}
          />
        </Box>
      ) : viewMode === "thumbnail" ? (
        renderThumbnailView()
      ) : (
        renderListView()
      )}
      {}
      {totalFiles > filesPerPage && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(totalFiles / filesPerPage)}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
      {}
      <Dialog open={infoDialogOpen} onClose={handleInfoClose}>
        <DialogTitle
          style={{
            alignItems: "center",
            textAlign: "center",
            color: "blue",
            fontWeight: "bold",
            paddingBottom: "-16px",
          }}
        >
          File Infomation
        </DialogTitle>
        <DialogContent>
          {infoFile && (
            <DialogContentText>
              <strong>Name:</strong> {infoFile.originalName}
              <br />
              <strong>Type:</strong> {infoFile.fileType}
              <br />
              <strong>Size:</strong> {(infoFile.size / 1024).toFixed(2)} KB
              <br />
              <strong>Uploaded:</strong>{" "}
              {new Date(infoFile.uploadedDate).toLocaleString()}
              <br />
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>
      {}
      {}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new name for the file:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New File Name"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameFile} variant="contained" color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{fileToDelete?.originalName}"? This deletes file parmanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteFile} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Snackbar
        open={alertOpen}
        autoHideDuration={2200}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alertType} onClose={() => setAlertOpen(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
      {}
      <Snackbar
        open={backendWarning}
        autoHideDuration={2200}
        onClose={() => setBackendWarning(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setBackendWarning(false)}>
          Backend is unavailable. Try again later.
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default FileViewer;
