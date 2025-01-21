import React from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Icon for collapse/expand

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div
      style={{
        width: isCollapsed ? "70px" : "170px", // Dynamically adjust the width
        height: "100vh",
        backgroundColor: "#2c3e50",
        color: "#ecf0f1",
        position: "fixed",
        transition: "width 0.3s ease",
        overflow: "hidden", // Ensures no overflow of text when collapsed
      }}
    >
      {/* Collapse/Expand Button */}
      <div
        style={{
          display: "flex",
          justifyContent: isCollapsed ? "left" : "flex",
          padding: "10px",
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          style={{ color: "#ecf0f1" }}
          aria-label="Toggle Sidebar"
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* Sidebar Links */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          textAlign: isCollapsed ? "center" : "left",
        }}
      >
        <li
          style={{
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#ecf0f1",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Icon or Placeholder */}
            <span style={{ marginRight: isCollapsed ? "0" : "10px" }}>
              🏠 {/* Replace with an icon component */}
            </span>
            {!isCollapsed && "Dashboard"} {/* Hide text when collapsed */}
          </Link>
        </li>
        <li
          style={{
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Link
            to="/inventory"
            style={{
              textDecoration: "none",
              color: "#ecf0f1",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: isCollapsed ? "0" : "10px" }}>
              📦 {/* Replace with an icon component */}
            </span>
            {!isCollapsed && "Inventory"} {/* Hide text when collapsed */}
          </Link>
        </li>
        <li
          style={{
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Link
            to="/reports"
            style={{
              textDecoration: "none",
              color: "#ecf0f1",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: isCollapsed ? "0" : "10px" }}>
              📊 {/* Replace with an icon component */}
            </span>
            {!isCollapsed && "Reports"} {/* Hide text when collapsed */}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
