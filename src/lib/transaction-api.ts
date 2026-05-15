import { withMongoId } from "@/lib/serializers";

function asRecord(val: unknown): Record<string, unknown> {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    return val as Record<string, unknown>;
  }
  return {};
}

type TransactionWithRelations = {
  id: string;
  transactionId: string;
  orderId: string | null;
  orderDate: Date;
  totalAmount: number;
  paymentMethod: string | null;
  payment: number;
  remainingPayment: number;
  image: string | null;
  customerName: string | null;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
  order?: {
    orderStatus: string;
    shippingAddress: unknown;
    paymentStatus: string;
    customer: { name: string | null; phone: string | null } | null;
  } | null;
};

export function formatTransactionForApi(transaction: TransactionWithRelations) {
  const base = withMongoId(transaction);
  const meta = asRecord(transaction.metadata);
  const shipping = transaction.order
    ? asRecord(transaction.order.shippingAddress)
    : {};

  const remaining = Number(transaction.remainingPayment) || 0;
  const paid = Number(transaction.payment) || 0;

  const paymentStatus = String(
    meta.paymentStatus ||
      transaction.order?.paymentStatus ||
      (remaining <= 0 && paid > 0
        ? "paid"
        : paid > 0
          ? "partial"
          : "pending")
  );

  const paymentDate =
    meta.paymentDate != null
      ? String(meta.paymentDate)
      : paid > 0
        ? transaction.updatedAt.toISOString()
        : transaction.orderDate.toISOString();

  const customerPhone = String(
    meta.customerPhone || shipping.phone || transaction.order?.customer?.phone || ""
  );

  const customerName =
    transaction.customerName ||
    transaction.order?.customer?.name ||
    String(shipping.fullname || "Guest");

  return {
    ...base,
    orderId: transaction.orderId ?? "",
    transactionId: transaction.transactionId,
    paymentMethod: transaction.paymentMethod ?? "cash",
    payment: paid,
    remainingPayment: remaining,
    totalAmount: transaction.totalAmount,
    paymentStatus,
    paymentDate,
    orderDate: transaction.orderDate.toISOString(),
    customerName,
    customerPhone,
    image: transaction.image ?? "",
    orderStatus: transaction.order?.orderStatus ?? "",
  };
}
