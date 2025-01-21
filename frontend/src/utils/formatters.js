export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US");
