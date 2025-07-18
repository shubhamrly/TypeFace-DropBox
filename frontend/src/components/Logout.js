import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import byeGif from "./assets/bye.gif";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { resetState } from "./fileViewerSlice";
import { persistor } from "./store";
import UserProfileMenu from "./UserProfileMenu";
function Logout() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    persistor.purge();
  }, [dispatch]);
  return (
    <>
      <Container style={{ marginTop: "88px", textAlign: "center",marginBottom: "120px" }}>
        <img
          src={byeGif}
          alt="bye-GIF"
          style={{
            marginTop: "16px",
            width: "500px",
            height: "auto",
            position: "relative",
          }}
        />
      </Container>
      <Footer />
    </>
  );
}
export default Logout;
