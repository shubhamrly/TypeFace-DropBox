import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Button } from "@mui/material";
import { FaUserSecret } from "react-icons/fa";
import { MdEmail, MdLogout, MdLogin } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

function UserProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // url location chcek
  const isWelcomePage = location.pathname === "/" || location.pathname === "/welcome";
  const isLogoutPage = location.pathname === "/logout";



  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <div>
      {isWelcomePage ? (
        <Button
          onClick={() => navigate("/home")}
          variant="contained"
          startIcon={<MdLogin />}
          style={{
            backgroundColor: "rgb(254 36 61)",
            color: "#fff",
            borderRadius: "4px",
            padding: "8px 16px",
            fontWeight: "bold",
          }}
        >
          Sign In
        </Button>
      ) : isLogoutPage ? (
        // On logout page, show sign-in button
        <Button
          onClick={() => navigate("/home")}
          variant="contained"
          startIcon={<MdLogin />}
          style={{
            backgroundColor: "rgb(254 36 61)",
            color: "#fff",
            borderRadius: "4px",
            padding: "8px 16px",
            fontWeight: "bold",
          }}
        >
          Sign In
        </Button>
      ) : (
        //in /home, use profile dropdown and in rest use signin
        <>
          <IconButton onClick={handleAvatarClick}>
            <FaUserSecret style={{ fontSize: 32, color: "rgb(254 36 61)" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <MdEmail style={{ fontSize: 18, color: "blue", marginRight: 2 }} />: {process.env.REACT_APP_USER_EMAIL || "shubhamgh00@gmail.com"}
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/logout")}>
              <MdLogout style={{ fontSize: 18, color: "red", marginRight: 2}} />: Sign Out
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

export default UserProfileMenu;
