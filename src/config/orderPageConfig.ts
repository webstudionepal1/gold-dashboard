import { useParams } from "react-router-dom";

export type PageType =
  | "order-details"
  | "confirmed-order-details"
  | "completed-order-details"
  | "assigned-order-details"
  | "pickup-order-details"
  | "cancelled-order-details";

export const pageConfigs: Record<
  PageType,
  {
    heading: string;
    buttonText: string;
    onClick: () => void;
  }
> = {
  "order-details": {
    heading: "Order Details",
    buttonText: "Update Order",
    onClick: () => {
      console.log("Updating Order");
    },
  },
  "confirmed-order-details": {
    heading: "Confirmed Orders",
    buttonText: "Assign Delivery",
    onClick: () => {
      console.log("CONFIRMED ORDERS");
    },
  },
  "completed-order-details": {
    heading: "Completed Order",
    buttonText: "Print Invoice",
    onClick: () => {
      console.log("Printing Invoice");
    },
  },
  "assigned-order-details": {
    heading: "Assigned Order",
    buttonText: "Track Delivery",
    onClick: () => {
      console.log("Tracking...");
    },
  },
  "pickup-order-details": {
    heading: "Pickup Order",
    buttonText: "Mark as Delivered",
    onClick: () => {
      console.log("Marking as delivered...");
    },
  },
  "cancelled-order-details": {
    heading: "Cancelled Order",
    buttonText: "Refund Customer",
    onClick: () => {
      console.log("Refunding...");
    },
  },
};
