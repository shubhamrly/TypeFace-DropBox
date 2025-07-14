import React from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import welcomeImage from "./assets/TypeFace.gif";
function Welcome() {
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/home");
  };
  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "120px", textAlign: "center" }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "2rem",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <img
          src={welcomeImage}
          alt="welcome-image"
          style={{
            width: "90%",
            maxWidth: "400px",
            height: "auto",
            marginBottom: "2rem",
          }}
        />
        <Box className="animated-text-container" mb={4}>
          <Typography
            variant="body1"
            color="textSecondary"
            className="animated-description"
            style={{fontWeight:"bold"}}
          >
            Easily upload, store, and share your documents and do much more.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
export default Welcome;
