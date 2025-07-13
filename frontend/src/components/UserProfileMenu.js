import React, { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { FaUserSecret } from "react-icons/fa";
import { MdEmail, MdLogout } from "react-icons/md";
function UserProfileMenu({ isLogoutPage }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {isLogoutPage ? (
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            backgroundColor: "rgb(254 36 61)",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Sign In
        </button>
      ) : (
        <>
          <IconButton onClick={handleAvatarClick}>
            <FaUserSecret style={{ fontSize: 32, color: "rgb(254 36 61)" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}><MdEmail style={{ fontSize: 20, color: "#1976d2" }}  />:shubhamgh00@gmail.com</MenuItem>
            <MenuItem onClick={() => (window.location.href = "/logout")}>
            <MdLogout style={{ fontSize: 20, color: "#fe243d" }} />:
              Sign Out
            </MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}

export default UserProfileMenu;
