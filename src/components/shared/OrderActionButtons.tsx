import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { CheckIcon, PackageIcon, TruckIcon } from "lucide-react";
import { ButtonLoading } from "./LoadingStates";

interface OrderActionButtonsProps {
  order: any;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
  onCancel: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onPickup?: (orderId: string) => void;
  isLoading?: boolean;
  compact?: boolean;
}

// Utility function to get button configuration based on order status
const getOrderActionButton = (orderStatus: string) => {
  const statusConfig = {
    pending: {
      text: "Accept",
      nextStatus: "confirmed",
      variant: "primary" as const,
      icon: <CheckIcon className="w-3 h-3" />,
      disabled: false,
    },
    confirmed: {
      text: "Assign",
      nextStatus: "assigned",
      variant: "primary" as const,
      icon: <PackageIcon className="w-3 h-3" />,
      disabled: false,
    },
    assigned: {
      text: "Pick Up",
      nextStatus: "picked_up",
      variant: "primary" as const,
      icon: <TruckIcon className="w-3 h-3" />,
      disabled: false,
    },
    picked_up: {
      text: "Deliver",
      nextStatus: "delivered",
      variant: "success" as const,
      icon: <CheckIcon className="w-3 h-3" />,
      disabled: false,
    },
    delivered: {
      text: "Completed",
      nextStatus: "delivered",
      variant: "success" as const,
      icon: <CheckIcon className="w-3 h-3" />,
      disabled: true,
    },
    cancelled: {
      text: "Cancelled",
      nextStatus: "cancelled",
      variant: "danger" as const,
      icon: null,
      disabled: true,
    },
  };

  return (
    statusConfig[orderStatus as keyof typeof statusConfig] ||
    statusConfig.pending
  );
};

const getButtonStyles = (variant: string, compact: boolean = false) => {
  const baseStyles = compact
    ? "px-2 py-1 text-xs font-medium transition-all shadow-sm flex items-center gap-1 rounded"
    : "px-3 py-1.5 text-xs font-medium transition-all shadow-sm flex items-center gap-1 rounded";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-orange-600 hover:bg-orange-700 text-white",
  };

  return `${baseStyles} ${
    variants[variant as keyof typeof variants] || variants.primary
  }`;
};

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  order,
  onStatusUpdate,
  onCancel,
  onComplete,
  onPickup,
  isLoading = false,
  compact = true,
}) => {
  const [localLoading, setLocalLoading] = useState<string | null>(null);

  const orderStatus = order.orderStatus || "pending";
  const buttonConfig = getOrderActionButton(orderStatus);

  const handleStatusUpdate = async (newStatus: string) => {
    setLocalLoading(newStatus);
    try {
      if (newStatus === "delivered") {
        onComplete(order._id);
      } else if (newStatus === "picked_up" && onPickup) {
        onPickup(order._id);
      } else {
        onStatusUpdate(order._id, newStatus);
      }
    } finally {
      setLocalLoading(null);
    }
  };

  const handleCancel = async () => {
    setLocalLoading("cancel");
    try {
      onCancel(order._id);
    } finally {
      setLocalLoading(null);
    }
  };

  // Don't show buttons for completed or cancelled orders
  if (orderStatus === "delivered" || orderStatus === "cancelled") {
    return (
      <div className="flex items-center gap-1">
        <div
          className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${
            orderStatus === "delivered"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {buttonConfig.icon}
          {buttonConfig.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Main action button */}
      <button
        onClick={() => handleStatusUpdate(buttonConfig.nextStatus)}
        disabled={buttonConfig.disabled || isLoading || localLoading !== null}
        className={`${getButtonStyles(buttonConfig.variant, compact)} ${
          buttonConfig.disabled || isLoading || localLoading !== null
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}>
        {localLoading === buttonConfig.nextStatus ? (
          <Icon icon="mdi:loading" className="w-3 h-3 animate-spin" />
        ) : (
          buttonConfig.icon
        )}
        {buttonConfig.text}
      </button>

      {/* Cancel button - only show for pending and confirmed orders */}
      {(orderStatus === "pending" || orderStatus === "confirmed") && (
        <button
          onClick={handleCancel}
          disabled={isLoading || localLoading !== null}
          className={`${getButtonStyles("danger", compact)} ${
            isLoading || localLoading !== null
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}>
          {localLoading === "cancel" ? (
            <Icon icon="mdi:loading" className="w-3 h-3 animate-spin" />
          ) : (
            <Icon icon="mdi:cancel" className="w-3 h-3" />
          )}
          Cancel
        </button>
      )}
    </div>
  );
};

export default OrderActionButtons;
