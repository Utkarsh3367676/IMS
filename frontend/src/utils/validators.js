export const validateItemForm = (form) => {
  const errors = {};
  if (!form.name) errors.name = "Name is required";
  if (!form.quantity || form.quantity < 0) errors.quantity = "Invalid quantity";
  if (!form.price || form.price <= 0) errors.price = "Invalid price";
  return errors;
};
