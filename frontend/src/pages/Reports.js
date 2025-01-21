import React from "react";
import ReportGenerator from "../components/Reports/ReportGenerator";
import "../styles/Reports.css";

const Reports = () => {
  return (
    <div className="reports-container">
      <h1>Reports</h1>
      <ReportGenerator />
    </div>
  );
};

export default Reports;
