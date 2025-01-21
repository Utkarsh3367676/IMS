// components/Dashboard/Dashboard.js
import React, { useState, useEffect } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { Line, Pie } from "react-chartjs-2";
import Summary from "../components/Dashboard/Summary";
import StockAlerts from "../components/Dashboard/StockAlerts";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await api.get("/api/inventory/stats/");
        setStats(statsResponse.data);

        const alertsResponse = await api.get("/api/inventory/alerts/");
        setAlerts(alertsResponse.data.results);

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  // Prepare data for charts
  const categoryData = {
    labels: stats.categories.map((c) => c.category),
    datasets: [
      {
        data: stats.categories.map((c) => c.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const stockValueData = {
    labels: stats.stock_value_history.map((d) => d.date),
    datasets: [
      {
        label: "Total Stock Value",
        data: stats.stock_value_history.map((d) => d.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Inventory Dashboard
      </Typography>

      {/* Summary Section */}
      <Summary stats={stats} />

      <Grid container spacing={3}>
        {/* Stock Alerts Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Stock Alerts</Typography>
            <StockAlerts alerts={alerts} />
          </Paper>
        </Grid>

        {/* Categories Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Categories Distribution</Typography>
            <Box height={300}>
              <Pie data={categoryData} />
            </Box>
          </Paper>
        </Grid>

        {/* Stock Value Line Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Stock Value Trend</Typography>
            <Box height={300}>
              <Line data={stockValueData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
