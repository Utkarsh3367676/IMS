// import React, { useEffect, useState } from "react";
// import api from "../../services/api";

// const StockAlerts = () => {
//   const [alerts, setAlerts] = useState([]);

//   useEffect(() => {
//     api.get("/inventory/alerts/").then((response) => {
//       setAlerts(response.data);
//     });
//   }, []);

//   return (
//     <div>
//       <h3>Stock Alerts</h3>
//       <ul>
//         {alerts.map((alert) => (
//           <li key={alert.id}>
//             {alert.name} is below the threshold with only {alert.quantity} left!
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default StockAlerts;


import api from "./api";

export const getStockAlerts = async () => {
  const response = await api.get("/inventory/alerts/");
  return response.data;
};
