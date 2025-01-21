import React from "react";
import ItemList from "../components/Inventory/ItemList";

const Inventory = () => {
  return (
    <div className="inventory-page">
      <h1>Inventory Management</h1>
      <ItemList />
    </div>
  );
};

export default Inventory;
