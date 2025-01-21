import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="main-layout">
      {/* Header */}
      <Header />

      <div className="layout-content" style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main
          style={{
            flexGrow: 1,
            marginLeft: isSidebarCollapsed ? "70px" : "150px", // Adjust main content margin dynamically
            transition: "margin-left 0.3s ease",
            padding: "20px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
