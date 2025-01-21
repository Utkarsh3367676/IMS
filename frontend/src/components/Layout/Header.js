// components/Header/Header.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
  const { auth, logout } = useAuth();

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#34495e" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          Inventory Management
        </Typography>
        {auth && (
          <Button
            variant="contained"
            color="secondary"
            onClick={logout}
            style={{ fontSize: "16px" }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
