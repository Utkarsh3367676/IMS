import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography} from "@mui/material";
import api from "../../services/api";

const Summary = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/inventory/stats/");
        console.log("API Response:", response.data); // Log the response to see the data structure
        setStats({
          totalItems: response.data.total_items, // update field names to match API response
          lowStockItems: response.data.low_stock_items, // update field names
          totalValue: response.data.total_value, // update field names
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  // Safeguard to ensure totalValue is a valid number before calling toFixed
  const totalValueFormatted = stats.totalValue
    ? stats.totalValue.toFixed(2)
    : "0.00";

  return (
    <Grid container spacing={3}>
      {/* Total Items */}
      <Grid item xs={12} sm={4}>
        <Paper
          elevation={3}
          sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="h6">Total Items</Typography>
          <Typography variant="h4" color="primary">
            {stats.totalItems}
          </Typography>
        </Paper>
      </Grid>

      {/* Low Stock Items */}
      <Grid item xs={12} sm={4}>
        <Paper
          elevation={3}
          sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="h6">Low Stock Items</Typography>
          <Typography variant="h4" color="error">
            {stats.lowStockItems}
          </Typography>
        </Paper>
      </Grid>

      {/* Total Value */}
      <Grid item xs={12} sm={4}>
        <Paper
          elevation={3}
          sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="h6">Total Value</Typography>
          <Typography variant="h4" color="success">
            ${totalValueFormatted}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Summary;
