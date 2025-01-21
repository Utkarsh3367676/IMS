import React, { useState } from "react";
import api from "../../services/api";

const ReportGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/inventory/items/export_csv/", {
        responseType: "blob",
        headers: {
          Accept: "text/csv,application/json",
          "Content-Type": "text/csv",
        },
      });

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `inventory_report_${new Date().toISOString().split("T")[0]}.csv`;

      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "text/csv" })
      );

      // Create temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      // Append to html page
      document.body.appendChild(link);

      // Force download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setError(null);
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-generator">
      {error && <div className="error-message">{error}</div>}
      <button
        onClick={generateReport}
        disabled={loading}
        className="download-button"
      >
        {loading ? "Generating..." : "Download Inventory Report"}
      </button>
    </div>
  );
};

export default ReportGenerator;
