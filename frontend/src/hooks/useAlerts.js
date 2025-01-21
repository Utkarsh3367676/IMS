import { useState, useEffect } from "react";
import { getStockAlerts } from "../services/alerts";

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getStockAlerts();
      setAlerts(data);
    };

    fetchAlerts();
  }, []);

  return alerts;
};

export default useAlerts;
