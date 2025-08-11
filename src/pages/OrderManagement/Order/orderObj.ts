// import { IFetchOrder } from "../../../server/api/orderHooks";

// export const Ordertitle: Record<string, string> = {
//   "order-details": "Order Details",
//   "confirmed-order-details": "Confirmed Orders",
//   "assigned-order-details": "Assigned Orders",
//   "completed-order-details": "Completed Orders",
//   "cancelled-order-details": "Cancelled Orders",
// };

// export const StepperObj: Record<string, number> = {
//   pending: 0,
//   confirmed: 1,
//   assigned: 2,
//   delivery: 3,
// };

// export const getStatusColor = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "completed":
//       return "bg-[#e9fbef] text-[#6db289]";
//     case "pending":
//       return "bg-[#d1d1d1] text-[#8d8d8d]";
//     case "in progress":
//       return "bg-blue-100 text-blue-800";
//     case "delivered":
//       return "bg-green-100 text-green-800";
//     case "cancelled":
//       return "bg-[#f9ebea] text-[#ce8b8e]";
//     case "not completed":
//       return "bg-[#f9ebea] text-[#ce8b8e]";
//     default:
//       return "bg-gray-100 text-gray-800";
//   }
// };

// export const orderIndexColumns = [
//   {
//     key: "customer",
//     title: "Customer Name",
//   },
//   {
//     title: "Order Date",
//     key: "createdAt",
//   },
//   {
//     key: "totalAmount",
//     title: "Total Amount",
//   },
//   {
//     key: "orderedProducts",
//     title: "Total Items",
//   },
//   {
//     key: "orderStatus",
//     title: "Status",
//   },
// ];

// export const confirmedColumns = [
//   {
//     key: "customer",
//     title: "Customer Name",
//   },
//   {
//     key: "createdAt",
//     title: "Order Date",
//   },
//   {
//     key: "deliveryDate",
//     title: "Delivery Date",
//   },
//   {
//     key: "totalAmount",
//     title: "Total Amount",
//   },
//   {
//     key: "orderedProducts",
//     title: "Total Items",
//   },
//   {
//     key: "orderStatus",
//     title: "Status",
//   },
// ];

// export const order_details_columns = [
//   { key: "name", title: "Item Name" },
//   { key: "qty", title: "QTY" },
//   { key: "price", title: "Price" },
//   { key: "total_price", title: "Total Price" },
//   { key: "status", title: "Status" },
// ];

// export const filterOptions = [
//   { value: "", label: "All Orders" },
//   { value: "pending", label: "Pending" },
//   { value: "completed", label: "Completed" },
//   { value: "delivered", label: "Delivered" },
//   { value: "cancelled", label: "Cancelled" },
// ];

// export const sortOptions = [
//   { value: "", label: "Default" },
//   { value: "name-asc", label: "Customer Name (A-Z)" },
//   { value: "name-desc", label: "Customer Name (Z-A)" },
//   { value: "date-newest", label: "Newest First" },
//   { value: "date-oldest", label: "Oldest First" },
//   { value: "amount-high", label: "Amount (High to Low)" },
//   { value: "amount-low", label: "Amount (Low to High)" },
// ];
// export interface FilterState {
//   filter: string;
//   sort: string;
//   orderStatus?: string;
//   customerName?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }
// export const filterItems = (items: IFetchOrder[], filterState: FilterState) => {
//   if (!items || items.length === 0) return [];

//   let filteredItems = [...items];

//   // Apply status filter
//   if (filterState.filter) {
//     filteredItems = filteredItems.filter((item) => {
//       return (
//         item.orderStatus.toLowerCase() === filterState.filter.toLowerCase()
//       );
//     });
//   }

//   // Apply sorting
//   if (filterState.sort) {
//     filteredItems = [...filteredItems].sort((a, b) => {
//       switch (filterState.sort) {
//         case "name-asc":
//           return (a.customer?.name || "").localeCompare(b.customer?.name || "");
//         case "name-desc":
//           return (b.customer?.name || "").localeCompare(a.customer?.name || "");
//         case "date-newest":
//           return (
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//           );
//         case "date-oldest":
//           return (
//             new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//           );
//         case "amount-high":
//           return b.totalAmount - a.totalAmount;
//         case "amount-low":
//           return a.totalAmount - b.totalAmount;
//         default:
//           return 0;
//       }
//     });
//   }

//   return filteredItems;
// };

import { IFetchOrder } from "../../../server/api/orderHooks";
import { Constants } from "../../../utils/constants";

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
  picked_up: 3,
  delivery: 4,
  delivered: 4, // Completed orders should show step 4 (Delivery Completion)
  cancelled: 4, // Cancelled orders should also show step 4 but with different styling
};

export const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "pending":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "assigned":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "picked_up":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800 border border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-200";
    case "in progress":
      return "bg-indigo-100 text-indigo-800 border border-indigo-200";
    case "not completed":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

// Helper function to get status icon
export const getStatusIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase().trim();

  switch (normalizedStatus) {
    case "pending":
      return "⏳";
    case "confirmed":
      return "✅";
    case "assigned":
      return "📦";
    case "picked_up":
      return "🚛";
    case "delivered":
    case "completed":
      return "🚚";
    case "cancelled":
      return "❌";
    default:
      return "📋";
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
    key: "orderStatusDisplay",
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
    key: "orderStatusDisplay",
    title: "Status",
  },
];

export const order_details_columns = [
  { key: "image", title: "Image" },
  { key: "name", title: "Item Name" },
  { key: "qty", title: "QTY" },
  { key: "price", title: `Price (${Constants.currency})` },
  { key: "total_price", title: `Total Price (${Constants.currency})` },
  // { key: "status", title: "Status" },
];

export const filterOptions = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "assigned", label: "Assigned" },
  { value: "picked_up", label: "Pickup" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const sortOptions = [
  { value: "", label: "Default" },
  { value: "name-asc", label: "Customer Name (A-Z)" },
  { value: "name-desc", label: "Customer Name (Z-A)" },
  { value: "date-newest", label: "Newest First" },
  { value: "date-oldest", label: "Oldest First" },
  { value: "amount-high", label: "Amount (High to Low)" },
  { value: "amount-low", label: "Amount (Low to High)" },
];
export interface FilterState {
  searchQuery?: string; // Add searchQuery
  filter: string;
  sort: string;
  orderStatus?: string;
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
}
export const filterItems = (items: IFetchOrder[], filterState: FilterState) => {
  if (!items || items.length === 0) return [];

  let filteredItems = [...items];

  // Apply search filter
  if (filterState.searchQuery) {
    const query = filterState.searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        (item.customer?.name &&
          item.customer.name.toLowerCase().includes(query)) ||
        (item._id && item._id.toLowerCase().includes(query))
    );
  }

  // Apply status filter
  if (filterState.filter) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.orderStatus.toLowerCase() === filterState.filter.toLowerCase()
    );
  }

  // Apply sorting
  if (filterState.sort) {
    filteredItems = [...filteredItems].sort((a, b) => {
      switch (filterState.sort) {
        case "name-asc":
          return (a.customer?.name || "").localeCompare(b.customer?.name || "");
        case "name-desc":
          return (b.customer?.name || "").localeCompare(a.customer?.name || "");
        case "date-newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date-oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount-high":
          return b.totalAmount - a.totalAmount;
        case "amount-low":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });
  }

  return filteredItems;
};
