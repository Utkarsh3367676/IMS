
// components/Dashboard/StockAlerts.js
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true); // Start loading
        const response = await api.get("/api/inventory/alerts/", {
          params: { resolved: showResolved },
        });

        console.log("API response:", response.data); // Log API response

        // Check if the response contains results
        if (response.data && Array.isArray(response.data)) {
          setAlerts(response.data); // Update alerts if valid response
        } else {
          setAlerts([]); // Set empty array if no alerts found
        }
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setError("Failed to load alerts");
        setLoading(false); // Stop loading on error
      }
    };

    fetchAlerts();
  }, [showResolved]); // Re-fetch when resolved state changes

  if (loading) return <div>Loading alerts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stock-alerts">
      <div className="alerts-header">
        <button onClick={() => setShowResolved(!showResolved)}>
          {showResolved ? "Show Active Alerts" : "Show Resolved Alerts"}
        </button>
      </div>

      {alerts.length > 0 ? (
        <ul className="alerts-list">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`alert-item ${alert.is_resolved ? "resolved" : "active"}`}
            >
              <div className="alert-content">
                <strong>{alert.item_name}</strong>
                <p>{alert.alert_message}</p>
                <div className="alert-details">
                  <span>Current Quantity: {alert.current_quantity}</span>
                  <span>
                    Date: {new Date(alert.threshold_reached_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-alerts">
          {showResolved ? "No resolved alerts" : "No active alerts"}
        </p>
      )}
    </div>
  );
};

export default StockAlerts;
