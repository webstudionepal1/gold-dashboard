import { withMongoId } from "@/lib/serializers";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "assigned",
  "completed",
  "cancelled",
] as const;

const PAYMENT_STATUSES = ["pending", "paid", "partial"] as const;

export type NormalizedOrderStatus = (typeof ORDER_STATUSES)[number];
export type NormalizedPaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** Map legacy UI status values to Prisma OrderStatus enum */
export function normalizeOrderStatus(status: string): NormalizedOrderStatus {
  const s = status.toLowerCase().trim();
  if (s === "delivered" || s === "complete" || s === "completed") {
    return "completed";
  }
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if ((ORDER_STATUSES as readonly string[]).includes(s)) {
    return s as NormalizedOrderStatus;
  }
  return "pending";
}

export function normalizePaymentStatus(
  status: string
): NormalizedPaymentStatus {
  const s = status.toLowerCase().trim();
  if (s === "paid" || s === "complete") return "paid";
  if (s === "partial") return "partial";
  return "pending";
}

/** Path for order details based on status (matches Routes-Config) */
export function getOrderDetailsPath(
  orderId: string,
  orderStatus?: string
): string {
  switch (normalizeOrderStatus(orderStatus || "pending")) {
    case "confirmed":
      return `/order/confirmed-order-details/${orderId}`;
    case "assigned":
      return `/order/assigned-order-details/${orderId}`;
    case "completed":
      return `/order/completed-order-details/${orderId}`;
    case "cancelled":
      return `/order/cancelled-order-details/${orderId}`;
    default:
      return `/order/order-details/${orderId}`;
  }
}

function asRecord(val: unknown): Record<string, unknown> {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    return val as Record<string, unknown>;
  }
  return {};
}

type OrderWithRelations = {
  id: string;
  orderNumber: string | null;
  customerId: string | null;
  customer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  shippingAddress: unknown;
  billingAddress: unknown;
  billDetails: unknown;
  orderTimeline: unknown;
  transactionDetails: unknown;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  totalAmount: number;
  items: Array<{
    id: string;
    quantity: number;
    selectedVariant: unknown;
    product: {
      id: string;
      name: string;
      images: string[];
    } | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export function formatOrderForApi(order: OrderWithRelations) {
  const base = withMongoId(order);
  const shippingAddress = asRecord(order.shippingAddress);
  const billingAddress = asRecord(order.billingAddress);
  const billDetails = asRecord(order.billDetails);
  const orderTimeline = asRecord(order.orderTimeline);
  const transactionDetails = asRecord(order.transactionDetails);

  const orderedProducts = order.items.map((item) => {
    const variant = asRecord(item.selectedVariant);
    return {
      quantity: item.quantity,
      selectedVariant: {
        price: Number(variant.price) || 0,
        wt: Number(variant.wt) || 0,
        unit: String(variant.unit || "gm"),
        quantity: Number(variant.quantity) || item.quantity,
      },
      product: item.product
        ? {
            _id: item.product.id,
            id: item.product.id,
            name: item.product.name,
            images: item.product.images || [],
          }
        : {
            _id: "",
            name: "Unknown product",
            images: [],
          },
    };
  });

  const customerName =
    order.customer?.name ||
    String(shippingAddress.fullname || billingAddress.fullname || "Guest");

  return {
    ...base,
    orderNumber: order.orderNumber || base._id,
    shippingAddress: {
      fullname: String(shippingAddress.fullname || customerName),
      address: String(shippingAddress.address || ""),
      phone: String(shippingAddress.phone || ""),
      landmark: String(shippingAddress.landmark || ""),
      email: String(shippingAddress.email || order.customer?.email || ""),
    },
    billingAddress: {
      fullname: String(billingAddress.fullname || customerName),
      address: String(billingAddress.address || ""),
      landmark: String(billingAddress.landmark || ""),
      phone: String(billingAddress.phone || ""),
      email: String(billingAddress.email || order.customer?.email || ""),
    },
    billDetails: {
      subTotalItemPrice: Number(billDetails.subTotalItemPrice) || order.totalAmount,
      shippingCost: Number(billDetails.shippingCost) || 0,
      discount: Number(billDetails.discount) || 0,
      coupon: Array.isArray(billDetails.coupon) ? billDetails.coupon : [],
      totalBill: Number(billDetails.totalBill) || order.totalAmount,
    },
    orderTimeline,
    transactionDetails: transactionDetails || {
      image: "",
      transactionId: "",
      payment: 0,
      remainingPayment: 0,
      paymentMethod: "",
    },
    customer: {
      _id: order.customer?.id || order.customerId || "",
      name: customerName,
      email: order.customer?.email || "",
    },
    orderedProducts,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    deliveryStatus: order.deliveryStatus,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
