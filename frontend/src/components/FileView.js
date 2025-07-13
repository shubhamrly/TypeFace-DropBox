import React from "react";
import { Card, CardContent, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import previewFallback from "./assets/previewfallback.jpg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function FileCard({ file }) {
  const navigate = useNavigate();
  // preview api call for card content.
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

  // card click preview if possible in browser, get file name from mongo
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
            file.originalName}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
}

export default FileCard;