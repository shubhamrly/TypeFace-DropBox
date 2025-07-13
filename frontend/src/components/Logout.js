import React from "react";
import { Container, Typography } from "@mui/material";
import byeGif from "./assets/bye.gif"; // Import the GIF
import Footer from "./Footer";

function Logout() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(resetState());
    persistor.purge();
  };
  return (
    <>
      <Container style={{ marginTop: "88px", textAlign: "center" }}>
        <img
          src={byeGif}
          alt="Bye GIF"
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
