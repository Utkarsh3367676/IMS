import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, Box } from "@mui/material";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  sku: Yup.string().required("SKU is required"),
  quantity: Yup.number().required("Quantity is required").min(0),
  price: Yup.number().required("Price is required").min(0),
  category: Yup.string().required("Category is required"),
  expiration_date: Yup.date().nullable(),
  alert_threshold: Yup.number().min(0),
});

const ItemForm = ({ item, onSave, onCancel }) => {
  const initialValues = {
    name: item?.name || "",
    sku: item?.sku || "",
    quantity: item?.quantity || 0,
    price: item?.price || 0,
    category: item?.category || "",
    expiration_date: item?.expiration_date || "",
    alert_threshold: item?.alert_threshold || 0,
    description: item?.description || "",
  };

  return (
    <Box p={3}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              name="name"
              as={TextField}
              label="Name"
              fullWidth
              margin="normal"
              error={touched.name && errors.name}
              helperText={touched.name && errors.name}
            />

            <Field
              name="sku"
              as={TextField}
              label="SKU"
              fullWidth
              margin="normal"
              error={touched.sku && errors.sku}
              helperText={touched.sku && errors.sku}
            />

            <Field
              name="quantity"
              as={TextField}
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              error={touched.quantity && errors.quantity}
              helperText={touched.quantity && errors.quantity}
            />

            <Field
              name="price"
              as={TextField}
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              error={touched.price && errors.price}
              helperText={touched.price && errors.price}
            />

            <Field
              name="category"
              as={TextField}
              label="Category"
              fullWidth
              margin="normal"
              error={touched.category && errors.category}
              helperText={touched.category && errors.category}
            />

            <Field
              name="expiration_date"
              as={TextField}
              label="Expiration Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <Field
              name="alert_threshold"
              as={TextField}
              label="Alert Threshold"
              type="number"
              fullWidth
              margin="normal"
            />

            <Field
              name="description"
              as={TextField}
              label="Description"
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />

            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {item ? "Update" : "Create"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ItemForm;
