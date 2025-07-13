import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import styles from "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import FileViewer from "./components/FileViewer";
import downloadIcon from "./components/assets/download.png";
import Logout from "./components/Logout";
import Footer from "./components/Footer";
import UserProfileMenu from "./components/UserProfileMenu";
//Importing fro, .env file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  //waring to show if backend is down.
  const [IsbackendAvailable, setIsbackendAvailable] = useState(true);
  const [page, setPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [headingVisible, setHeadingVisible] = useState(false);
  //for table view 
  const FILES_PER_PAGE = 15;
  const isLogoutPage = window.location.pathname === "/logout";
   //start with 1 for viewing files in the ui, i am using the full data set to sort, filter. 
  const getFilePage = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/files?all=true`); // Fetch all files
      setFiles(res.data.files); // Store all files
      setTotalFiles(res.data.total); // Set total file count
      setBackendAvailable(true);
    } catch (error) {
      setBackendAvailable(false);
    }
  };
  const uploadFiles = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    await axios.post(`${API_BASE_URL}/api/files/upload`, formData);
    getFilePage(page);
  };
  useEffect(() => {
    getFilePage(page);
  }, [page]);

  //on logo or TypeFace text click 
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        style={{
          background: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="brand-title" onClick={scrollToTop}
          style={{ color: "#222", cursor: "pointer" }}>
            <img
              src={downloadIcon}
              alt="Dropbox Icon"
              style={{
                width: 32,
                height: 32,
                color: "black",
                marginRight: 12,
                verticalAlign: "middle",
              }}
            />
            TypeFace-Dropbox
          </span>
          <UserProfileMenu isLogoutPage={isLogoutPage} />
        </Toolbar>
      </AppBar>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Container style={{ marginTop: "88px", textAlign: "center" }}>
                {!IsbackendAvailable && (
                  <Alert severity="warning" style={{ marginBottom: "16px" }}>
                    Please Check backend at base URL,Backend is not available. 
                  </Alert>
                )}
                <Paper
                  elevation={3}
                  style={{ padding: "16px", borderRadius: "8px" }}
                >
                  <FileUploader
                    setFiles={setSelectedFiles}
                    uploadFiles={uploadFiles}
                  />
                </Paper>
                <Paper
                  elevation={4}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    marginTop: "16px",
                  }}
                >
                  <FileViewer
                    files={files}
                    page={page}
                    totalFiles={totalFiles}
                    filesPerPage={FILES_PER_PAGE}
                    onPageChange={setPage}
                  />
                </Paper>
              </Container>
              <Footer />
            </>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}
export default App;
