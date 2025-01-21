import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Dialog, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/AuthContext";
import "./ItemList.css";
import api from "../../services/api";
import ItemForm from "./ItemForm";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { auth } = useAuth();

  const isAdmin =
    Boolean(auth?.user?.is_staff) ||
    Boolean(auth?.user?.is_superuser) ||
    (auth?.user?.groups || []).includes("admin");

  const fetchItems = async () => {
    try {
      const response = await api.get("/api/inventory/items/");
      const processedItems = response.data.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        description: item.description === null ? "N/A" : item.description,
        quantity: item.quantity,
        price: item.price || 0,
        category: item.category || "N/A",
        expiration_date: item.expiration_date || "N/A",
      }));
      setItems(processedItems);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/api/inventory/items/${id}/`);
        fetchItems();
      } catch {
        setError("Failed to delete item");
      }
    }
  };

  const handleEdit = (item) => {
    if (!isAdmin) return;
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    if (!isAdmin) return;
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedItem) {
        await api.put(`/api/inventory/items/${selectedItem.id}/`, formData);
      } else {
        await api.post("/api/inventory/items/", formData);
      }
      fetchItems();
      handleCloseDialog();
    } catch {
      setError("Failed to save item");
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "sku", headerName: "SKU", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", width: 100, type: "number" },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      renderCell: (params) => `$${Number(params.row.price || 0).toFixed(2)}`,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 200,
    },
    { field: "expiration_date", headerName: "Expiration Date", width: 150 },
    ...(isAdmin
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <div className="item-list-actions" style={{width : "100px"}}>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => handleEdit(params.row)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDelete(params.row.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]
      : []),
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ width: "100%" }}>
      <div className="item-list-container" style={{ width: "90%" }}>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            startIcon={<AddIcon />}
            className="item-list-add-button"
          >
            Add New Item
          </Button>
        )}
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          components={{ Toolbar: GridToolbar }}
          disableSelectionOnClick
          autoHeight
          loading={loading}
          getRowId={(row) => row.id}
          density="comfortable"
          className="item-list-datagrid"
        />
        {isAdmin && (
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <ItemForm
              item={selectedItem}
              onSave={handleSave}
              onCancel={handleCloseDialog}
            />
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ItemList;
