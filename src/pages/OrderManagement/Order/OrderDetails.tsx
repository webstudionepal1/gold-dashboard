import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { get, map } from "lodash";
import {
  CheckIcon,
  Download,
  PackageIcon,
  TruckIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Constants for styling and configuration
const CANCELLED_STYLES = {
  banner: "p-4 bg-red-50 border-2 border-red-200 rounded-xl my-4",
  section: "bg-red-50 border-2 border-red-200 rounded-xl",
  text: "text-red-600 font-medium",
  title: "text-lg font-semibold text-red-700",
  subtitle: "text-sm text-red-600",
  badge: "text-white bg-gray-500 text-sm rounded-full py-1 px-4",
} as const;

const CARD_STYLES = {
  base: "border-2 rounded-xl border-[#d5d9e4] bg-white",
  section:
    "col-span-12 bg-white border-2 rounded-xl border-[#d5d9e4] lg:col-span-4",
} as const;

import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  useGetOrderById,
  useUpdateOrderMutation,
} from "../../../server/api/orderHooks";
import InfoSection from "./components/InfoSection";
import OrderTracker from "./components/OrderTracker";
import { order_details_columns, Ordertitle, StepperObj } from "./orderObj";
import { Constants } from "../../../utils/constants";

// Define proper TypeScript interfaces
interface OrderedProduct {
  product: {
    name: string;
  };
  selectedVariant: {
    quantity: number;
    price: number;
  };
}

interface OrderStep {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

interface InfoItem {
  id: number;
  title: string;
  value?: string | React.ReactNode;
  Note?: string;
  date?: React.ReactNode;
  reason?: string;
}

// Constants separated for better organization
const STEPS: OrderStep[] = [
  {
    id: 0,
    name: "Pending",
  },
  {
    id: 1,
    name: "Confirmed",
    icon: <CheckIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    name: "Order Handover",
    icon: <PackageIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 3,
    name: "Delivery Completion",
    icon: <TruckIcon className="w-6 h-6 text-white" />,
  },
];

const CANCELLED_STEPS: OrderStep[] = [
  {
    id: 0,
    name: "Pending",
  },
  {
    id: 1,
    name: "Order Cancelled",
    icon: <XIcon className="w-6 h-6 text-white" />,
  },
];

// Helper functions to reduce repetition
const getOrderStatusInfo = (isOrderCancelled: boolean, orderStatus: string) => {
  if (isOrderCancelled) {
    return {
      steps: CANCELLED_STEPS,
      currentStep: 1,
      trackerProps: {
        cancelledBg: "bg-red-500",
        cancelledBorder: "border-red-500",
        cancelledText: "text-red-500 font-medium",
      },
    };
  }

  return {
    steps: STEPS,
    currentStep: StepperObj[orderStatus] || 0,
    trackerProps: {},
  };
};

const createPaymentStatusBadge = (
  isOrderCancelled: boolean,
  paymentStatus: string
) => {
  if (isOrderCancelled) {
    return <div className={CANCELLED_STYLES.badge}>Cancelled</div>;
  }

  const isPaid = paymentStatus === "paid";
  const badgeClass = isPaid
    ? "text-white bg-green text-sm rounded-full py-1 px-4"
    : "text-white bg-red text-sm rounded-full py-1 px-4";

  return <div className={badgeClass}>{paymentStatus}</div>;
};

// Component for cancelled order banner
const CancelledOrderBanner: React.FC = () => (
  <div className={CANCELLED_STYLES.banner}>
    <div className="flex items-center gap-3">
      <XIcon className="w-6 h-6 text-red-500" />
      <div>
        <h3 className={CANCELLED_STYLES.title}>Order Cancelled</h3>
        <p className={CANCELLED_STYLES.subtitle}>
          This order has been cancelled and will not be processed.
        </p>
      </div>
    </div>
  </div>
);

// Component for cancelled order status card
const CancelledOrderStatusCard: React.FC = () => (
  <div className="border-2 rounded-xl border-red-200 bg-red-50">
    <div className="flex flex-col gap-4 px-3 py-2">
      <h1 className="text-xl font-semibold text-red-700">Order Status</h1>
      <div className="flex items-center justify-center gap-2 p-4">
        <XIcon className="w-8 h-8 text-red-500" />
        <div className="text-center">
          <h2 className="text-lg font-medium text-red-700">Cancelled</h2>
          <p className="text-sm text-red-600">No delivery required</p>
        </div>
      </div>
    </div>
  </div>
);

// Component for cancelled order message
const CancelledOrderMessage: React.FC = () => (
  <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-xl">
    <p className={CANCELLED_STYLES.text}>
      This order has been cancelled and cannot be modified.
    </p>
  </div>
);

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Get the current page type from the URL
  const pagePath = pathname.split("/");
  const page = pagePath[pagePath.length - 2];

  // API hooks with proper error handling
  const {
    mutate: updateOrder,
    isPending,
    isSuccess,
  } = useUpdateOrderMutation();

  const { data: order, isLoading, isError } = useGetOrderById(id);

  // Check if we're on a cancelled order page based on URL or order status
  const orderStatus = get(order, "orderStatus", "pending");
  const isCancelledOrderPage = page === "cancelled-order-details";
  const isOrderCancelled = orderStatus === "cancelled" || isCancelledOrderPage;

  // Handle navigation after successful order update
  useEffect(() => {
    if (isSuccess) {
      if (page === "order-details") {
        // Check if order was cancelled or confirmed
        if (order?.orderStatus === "cancelled") {
          navigate("/order/cancelled-order");
        } else {
          navigate("/order/confirmed-order");
        }
      } else if (page === "confirmed-order-details")
        navigate("/order/completed-order");
    }
  }, [isSuccess, navigate, page, order?.orderStatus]);

  // Transform order products data
  const orderMenu = useMemo(() => {
    if (!order?.orderedProducts) return [];

    return map(order.orderedProducts, (item) => ({
      name: get(item, "product.name", ""),
      qty: get(item, "selectedVariant.quantity", 0),
      price: `${get(item, "selectedVariant.price", 0).toFixed(2)}`,
      total_price: `${(
        Number(get(item, "selectedVariant.price", 0)) *
        Number(get(item, "selectedVariant.quantity", 0))
      ).toFixed(2)}`,
    }));
  }, [order?.orderedProducts]);

  // Calculate order details with memoization
  const orderDetails = useMemo(() => {
    if (!order)
      return {
        subTotal: { label: "SubTotal", value: 0 },
        shippingCost: { label: "Shipping Cost", value: 0 },
        discounts: { label: "Discounts", value: 0 },
        taxes: { label: "Taxes", value: 0 },
      };

    const itemCount = order.orderedProducts?.length || 0;

    return {
      subTotal: {
        label: `SubTotal (${itemCount} items)`,
        value: get(order, "totalAmount", 0),
      },
      shippingCost: {
        label: "Shipping Cost",
        value: get(order, "billDetails.shippingCost", 0),
      },
      discounts: {
        label: "Discounts",
        value: get(order, "billDetails.discount", 0),
      },
      taxes: { label: "Taxes", value: 0 },
    };
  }, [order]);

  // Calculate total amount
  const totalValue = useMemo(() => {
    return Object.values(orderDetails).reduce(
      (acc, curr) => acc + Number(curr.value),
      0
    );
  }, [orderDetails]);

  // Generate shipping information dynamically from order data
  const shippingInformation = useMemo(() => {
    if (!order) return [];

    const baseInfo: InfoItem[] = [
      {
        id: 1,
        title: "Customer ",
        value: get(order, "shippingAddress.fullname", ""),
      },
      {
        id: 2,
        title: "Phone Number",
        value: get(order, "shippingAddress.phone", ""),
      },
      {
        id: 3,
        title: "Address",
        value: get(order, "shippingAddress.address", ""),
      },
      {
        id: 4,
        title: "Email",
        value: get(order, "shippingAddress.email", ""),
      },
      {
        id: 5,
        title: "Shipping Method",
        value: get(order, "shippingMethod", "Normal"),
      },
    ];

    // Add payment status with appropriate styling
    baseInfo.push({
      id: 6,
      title: "Payment Status",
      value: createPaymentStatusBadge(
        isOrderCancelled,
        get(order, "paymentStatus", "pending")
      ),
    });

    return baseInfo;
  }, [order, isOrderCancelled]);

  // Generate billing address info from customer data
  const billingAddress = useMemo(() => {
    if (!order) return [];

    return [
      {
        id: 1,
        title: "Customer Name",
        value: get(order, "billingAddress.fullname", "-"),
      },
      {
        id: 2,
        title: "Phone Number",
        value: get(order, "billingAddress.phone", ""),
      },
      {
        id: 3,
        title: "Email",
        value: get(order, "billingAddress.email", ""),
      },
      {
        id: 4,
        title: "Address",
        value: get(order, "billingAddress.address", ""),
      },
      {
        id: 5,
        title: "landmark",
        Note: get(order, "billingAddress.landMark", "N/A"),
      },
    ];
  }, [order]);

  // Order cancellation details
  const orderCancelled = useMemo(() => {
    if (!order) return [];

    const cancellationDate = get(
      order,
      "cancellation.date",
      get(order, "updatedAt", "N/A")
    );
    const formattedDate =
      cancellationDate !== "N/A"
        ? new Date(cancellationDate).toLocaleDateString()
        : "N/A";

    return [
      {
        id: 5,
        title: "Cancelled Date",
        date: <div className="text-red font-medium">{formattedDate}</div>,
      },
      {
        id: 6,
        title: "Reason for cancellation",
        reason: get(order, "cancellation.reason", "No reason provided"),
      },
    ];
  }, [order]);

  // Handle order status update
  const handleOrderStatusUpdate = (
    newStatus: string,
    furtherData?: Record<string, string | number>
  ) => {
    if (!id) return;

    updateOrder({
      id,
      body: { orderStatus: newStatus, ...furtherData },
    });
  };

  // Determine which steps to show and current step based on order status
  const { steps, currentStep, trackerProps } = useMemo(
    () => getOrderStatusInfo(isOrderCancelled, orderStatus),
    [isOrderCancelled, orderStatus]
  );
  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icon
          icon="mdi:loading"
          className="w-10 h-10 animate-spin text-primary"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Icon icon="mdi:alert-circle" className="w-16 h-16 text-red" />
        <h2 className="text-xl font-medium">Error loading order details</h2>
        <p className="text-gray-600">
          Please check your connection and try again
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white rounded-lg bg-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <Header
        text={
          isOrderCancelled
            ? "Cancelled Orders"
            : Ordertitle[page] || "Order Details"
        }
      />

      {/* Order Progress Tracker */}
      <OrderTracker steps={steps} currentStep={currentStep} {...trackerProps} />

      {/* Cancelled Order Banner */}
      {isOrderCancelled && <CancelledOrderBanner />}

      <div className="py-4rounded-md grid grid-cols-1 md:grid-cols-3 mt-4 gap-4 lg:grid-cols-12">
        {/* Main Content Grid */}
        <div className="md:col-span-2 flex flex-col gap-4 lg:col-span-8">
          {/* Order Items Table */}
          <div className="col-span-12 bg-white border-2 rounded-xl h-auto border-[#d5d9e4] lg:col-span-8">
            <MasterTable
              rows={orderMenu}
              columns={order_details_columns}
              canSearch={false}
            />
          </div>
          <div className="col-span-12 bg-white border-2 rounded-xl border-[#d5d9e4] lg:col-span-8">
            <InfoSection
              title="Shipping Information"
              info={shippingInformation}
              showEdit={false}
              onEditClick={() => {
                /* Implement edit functionality */
              }}
            />
          </div>
          {/* Side Panel */}
        </div>

        {/* Additional Information Section */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="col-span-12 space-y-4 lg:col-span-4">
            {isOrderCancelled && <CancelledOrderStatusCard />}

            {/* Order Total Card */}
            <div className={CARD_STYLES.base}>
              <div className="px-3 py-2 space-y-3">
                <h1 className="text-2xl font-semibold">Total Amount</h1>
                <div className="border-b-2 border-[#d5d9e4] my-1"></div>

                <div className="flex flex-col gap-3">
                  {Object.entries(orderDetails).map(
                    ([key, { label, value }]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <p>{label}</p>
                        <p>
                          {Constants.currency}{" "}
                          {typeof value === "number" ? value.toFixed(2) : value}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="my-2 rounded-md border-2 border-[#d5d9e4]">
                  <div className="flex items-center justify-between px-3 py-1 font-semibold">
                    <h1>Total</h1>
                    <p>
                      {Constants.currency} {totalValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={CARD_STYLES.section}>
            {isOrderCancelled ? (
              <div className={CANCELLED_STYLES.section}>
                <InfoSection
                  title="Order Cancelled"
                  info={orderCancelled}
                  showEdit={false}
                  onEditClick={() => {
                    /* Implement edit functionality */
                  }}
                />
              </div>
            ) : (
              <InfoSection
                title="Billing Address"
                info={billingAddress}
                showEdit={false}
                onEditClick={() => {
                  /* Implement edit functionality */
                }}
              />
            )}
          </div>
          {/* Action Buttons - Hide for cancelled orders */}
          {!isOrderCancelled && (
            <div className="flex items-center justify-end gap-3">
              {page === "order-details" && (
                <>
                  <button
                    onClick={() => handleOrderStatusUpdate("confirmed")}
                    disabled={isPending}
                    className={clsx(
                      "bg-[#de8d29] px-4 py-2 text-white rounded-xl font-medium transition-all",
                      isPending
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-[#c97d24]"
                    )}
                  >
                    {isPending ? "Processing..." : "Accept Order"}
                  </button>
                  <button
                    className="bg-[#d1d1d1] px-4 py-2 text-[#878787] rounded-xl font-semibold hover:bg-[#c1c1c1] transition-all"
                    onClick={() => handleOrderStatusUpdate("cancelled")}
                    disabled={isPending}
                  >
                    Cancel Order
                  </button>
                </>
              )}

              {/* {page === "confirmed-order-details" && (
                <button
                  onClick={() => handleOrderStatusUpdate("assigned")}
                  disabled={isPending}
                  className={clsx(
                    "bg-[#de8d29] px-4 py-2 text-white rounded-xl font-medium transition-all",
                    isPending
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-[#c97d24]"
                  )}
                >
                  {isPending ? "Processing..." : "Assign Delivery"}
                </button>
              )} */}
              {page === "confirmed-order-details" && (
                <button
                  onClick={() =>
                    handleOrderStatusUpdate("delivered", {
                      paymentStaus: "paid",
                    })
                  }
                  disabled={isPending}
                  className={clsx(
                    "bg-[#de8d29] px-4 py-2 text-white rounded-xl font-medium transition-all",
                    isPending
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-[#c97d24]"
                  )}
                >
                  {isPending ? "Processing..." : "Complete Order"}
                </button>
              )}
            </div>
          )}

          {/* Cancelled Order Message */}
          {isOrderCancelled && <CancelledOrderMessage />}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
