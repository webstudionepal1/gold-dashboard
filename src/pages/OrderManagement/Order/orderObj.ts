export const Ordertitle: Record<string, string> = {
  "order-details": "Order Details",
  "confirmed-order-details": "Confirmed Orders",
  "assigned-order-details": "Assigned Orders",
  "completed-order-details": "Completed Orders",
  "cancelled-order-details": "Cancelled Orders",
};

export const StepperObj: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  assigned: 2,
  delivery: 3,
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-[#e9fbef] text-[#6db289]";
    case "pending":
      return "bg-[#d1d1d1] text-[#8d8d8d]";
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    case "not completed":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const orderIndexColumns = [
  {
    key: "customer",
    title: "Customer Name",
  },
  {
    title: "Order Date",
    key: "createdAt",
  },
  {
    key: "totalAmount",
    title: "Total Amount",
  },
  {
    key: "orderedProducts",
    title: "Total Items",
  },
  {
    key: "orderStatus",
    title: "Status",
  },
];

export const confirmedColumns = [
  {
    key: "customer",
    title: "Customer Name",
  },
  {
    key: "createdAt",
    title: "Order Date",
  },
  {
    key: "deliveryDate",
    title: "Delivery Date",
  },
  {
    key: "totalAmount",
    title: "Total Amount",
  },
  {
    key: "orderedProducts",
    title: "Total Items",
  },
  {
    key: "orderStatus",
    title: "Status",
  },
];

export const order_details_columns = [
  { key: "name", title: "Item Name" },
  { key: "qty", title: "QTY" },
  { key: "price", title: "Price" },
  { key: "total_price", title: "Total Price" },
  { key: "status", title: "Status" },
]