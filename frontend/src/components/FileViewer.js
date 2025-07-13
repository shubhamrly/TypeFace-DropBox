import React, { useState, useEffect, useMemo } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import previewFallback from "./assets/previewfallback.jpg";
import emptyTableImage from "./assets/emptyTable.png";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// FileViewer component displays files in search, sort, filter, and view mod
function FileViewer({ page = 1, filesPerPage = 15, onPageChange, refreshFiles }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [filterType, setFilterType] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoFile, setInfoFile] = useState(null);
  const [backendWarning, setBackendWarning] = useState(false);
  const [viewMode, setViewMode] = useState("thumbnail");
  const [totalFiles, setTotalFiles] = useState(0);
  const [backendAvailable, setBackendAvailable] = useState(true);
  //get files after,upload form the app js function declaration
  useEffect(() => {
    getFilePageTable();
  }, []);

  //get files after,upload form the app js function declaration
  useEffect(() => {
    if (typeof refreshFiles === "function") {
      refreshFiles(getFilePageTable);
    }
  }, [refreshFiles]);

  //for filtering changes
  const getFilePageTable = async (
    searchTerm = "",
    sortOption = "date",
    filterType = ""
  ) => {
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
      allFiles = allFiles.sort((a, b) => {
        if (sortOption === "date") {
          return new Date(b.uploadedDate) - new Date(a.uploadedDate);
        } else if (sortOption === "size") {
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
   // matching from the original name of the file uploaded
  const handleSearch = (i) => {
    const term = i.target.value;
    setSearchTerm(term);
    getFilePageTable(term, sortOption, filterType);
  };
 // sorting based on the uploaded Date, or Size  (B) 
  const handleSortChange = (i) => {
    const option = i.target.value;
    setSortOption(option);
    getFilePageTable(searchTerm, option, filterType);
  };
  // filtring is done on allowed Types so it will be fetched from array
  const handleFilterChange = (i) => {
    const type = i.target.value;
    setFilterType(type);
    getFilePageTable(searchTerm, sortOption, type);
  };

  // drive has thumbnail and list view, will try 
  const handleViewModeChange = (i, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // using cardContent mui 
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
  const handleView = (file) => {
    window.open(`${API_BASE_URL}/api/files/preview/${file.filename}`, "_blank");
  };
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
  const handleInfoOpen = (file) => {
    setInfoFile(file);
    setInfoDialogOpen(true);
  };
  const handleInfoClose = () => {
    setInfoDialogOpen(false);
    setInfoFile(null);
  };

  // Memoize files to only update UI when files actually change
  const memoizedFiles = useMemo(() => files, [files]);

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
          >
            <MenuItem value="date">Sort by Date</MenuItem>
            <MenuItem value="size">Sort by Size</MenuItem>
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
      {memoizedFiles.length === 0 ? (
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
            alt="No files found"
            style={{
              maxWidth: "46%",
              height: "151px",
              margin: "0 auto",
            }}
          />
        </Box>
      ) : viewMode === "thumbnail" ? (
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {memoizedFiles.map((file) => (
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
                  {}
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
                      >
                        <FaInfoCircle />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} style={{ marginBottom: "16px" }}>
          <Table size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell style={{ width: "50px" }}></TableCell>
                <TableCell style={{maxWidth: "300px"}}>Name</TableCell>
               
                <TableCell>Size</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memoizedFiles.map((file) => (
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
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => handleView(file)}>
                        <FaEye />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(file)}
                      >
                        <FaDownload />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Info">
                      <IconButton
                        size="small"
                        onClick={() => handleInfoOpen(file)}
                      >
                        <FaInfoCircle />
                      </IconButton>
                    </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      <Snackbar
        open={backendWarning}
        autoHideDuration={2000}
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
