import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { get, map } from "lodash";
import { CheckIcon, Download, PackageIcon, TruckIcon } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  useGetOrderById,
  useUpdateOrderMutation,
} from "../../../server/api/orderHooks";
import InfoSection from "./components/InfoSection";
import OrderTracker from "./components/OrderTracker";
import { order_details_columns, Ordertitle, StepperObj } from "./orderObj";

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

  const { data: order, isLoading, isError, error } = useGetOrderById(id);

  // Handle navigation after successful order update
  useEffect(() => {
    if (isSuccess) {
      if (page === "order-details") {
        navigate("/order/confirmed-order");
      } else if (page === "confirmed-order-details") {
        navigate("/order/assigned-order");
      }
    }
  }, [isSuccess, navigate, page]);

  // Transform order products data
  const orderMenu = useMemo(() => {
    if (!order?.orderedProducts) return [];

    return map(order.orderedProducts, (item) => ({
      name: get(item, "product.name", ""),
      qty: get(item, "selectedVariant.quantity", 0),
      price: `$ ${get(item, "selectedVariant.price", 0).toFixed(2)}`,
      total_price: `$ ${(
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

    return [
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
      {
        id: 6,
        title: "Payment Status",
        value: (
          <div
            className={
              order?.paymentStatus === "paid"
                ? "text-white bg-green text-sm rounded-full py-1 px-4"
                : "text-white bg-red text-sm rounded-full py-1 px-4"
            }
          >
            {get(order, "paymentStatus", "pending")}
          </div>
        ),
      },
    ];
  }, [order]);

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

    return [
      {
        id: 5,
        title: "Cancelled Date",
        date: (
          <div className="text-red">
            {get(order, "cancellation.data", "N/A")}
          </div>
        ),
      },
      {
        id: 6,
        title: "Reason for cancellation",
        reason: get(order, "cancellation.reason", "N/A"),
      },
    ];
  }, [order]);

  // Handle order status update
  const handleOrderStatusUpdate = (newStatus: string) => {
    if (!id) return;

    updateOrder({
      id,
      body: { orderStatus: newStatus },
    });
  };

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

  const orderStatus = get(order, "orderStatus", "pending");
  const orderDate = get(order, "orderDate", "").split("T")[0];
  const orderNumber = get(order, "id", "").slice(-5);

  return (
    <div className="container px-4 py-3 mx-auto">
      <Header text={Ordertitle[page] || "Order Details"} />

      {/* Order Progress Tracker */}
      <OrderTracker steps={STEPS} currentStep={StepperObj[orderStatus] || 0} />

      <div className="py-4 bg-white rounded-md">
        {/* Order Header */}
        {/* <div className="border-2 border-[#d6dbe4] mx-3 rounded-xl">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex flex-col">
              <h1
                className={clsx(
                  "text-xl font-bold",
                  page === "cancelled-order-details" ? "text-[#fe382d]" : ""
                )}
              >
                {page === "cancelled-order-details"
                  ? "Order Cancelled"
                  : "Order"}{" "}
                <span
                  className={clsx(
                    "font-bold text-xl",
                    page === "cancelled-order-details"
                      ? "text-[#fe382d]"
                      : "text-[#ffc174]"
                  )}
                >
                  #{orderNumber}
                </span>
              </h1>
              <p className="text-[#b0b0b0] font-semibold">{orderDate}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 border-2 border-[#d2dae5] px-3 py-2 rounded-xl">
                Download Invoice <Download size={24} />
              </button>
            </div>
          </div>
        </div> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 mx-3 mt-4">
          {/* Order Items Table */}
          <div className="col-span-12 bg-white border-2 rounded-xl h-auto border-[#d5d9e4] lg:col-span-8">
            <MasterTable
              rows={orderMenu}
              columns={order_details_columns}
              canSearch={false}
            />
          </div>

          {/* Side Panel */}
          <div className="col-span-12 space-y-4 lg:col-span-4">
            {/* Delivery Partner Card */}
            <div className="border-2 rounded-xl border-[#d5d9e4] bg-white">
              <div className="flex flex-col gap-4 px-3 py-2">
                <h1 className="text-xl font-semibold">Delivery Partner</h1>
                <div className="flex items-center justify-between gap-2">
                  <img
                    src="/testimg.jpg"
                    alt="Delivery Partner"
                    className="object-cover w-20 h-20 rounded-md"
                  />
                  <h1 className="text-nowrap">Australian Post</h1>
                  <button className="bg-[#e08d26] px-3 py-1 rounded-xl text-nowrap text-white">
                    Track Order
                  </button>
                </div>
              </div>
            </div>

            {/* Order Total Card */}
            <div className="border-2 rounded-xl border-[#d5d9e4] bg-white">
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
                          $
                          {typeof value === "number" ? value.toFixed(2) : value}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="my-2 rounded-md border-2 border-[#d5d9e4]">
                  <div className="flex items-center justify-between px-3 py-1 font-semibold">
                    <h1>Total</h1>
                    <p>${totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="grid grid-cols-12 gap-4 mx-3 mt-8">
          {/* Shipping Information */}
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

          {/* Billing or Cancellation Info */}
          <div className="col-span-12 bg-white border-2 rounded-xl border-[#d5d9e4] lg:col-span-4">
            {page === "cancelled-order-details" ? (
              <InfoSection
                title="Order Cancelled"
                info={orderCancelled}
                showEdit={false}
                onEditClick={() => {
                  /* Implement edit functionality */
                }}
              />
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
        </div>

        {/* Action Buttons Based on Page Type */}
        <div className="flex items-center justify-end gap-3 mx-3 mt-4 mb-2">
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

          {page === "confirmed-order-details" && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
