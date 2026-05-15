import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api-response";
import { withMongoId } from "@/lib/serializers";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatOrderStatus(status: string) {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function buildLast7DayBuckets() {
  const now = startOfDay(new Date());
  const buckets: { key: string; label: string; start: Date; end: Date }[] = [];

  for (let i = 6; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(start.getDate() - i);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    buckets.push({
      key: start.toISOString().slice(0, 10),
      label: DAY_LABELS[start.getDay()],
      start,
      end,
    });
  }

  return buckets;
}

type MetalJson = {
  perGram?: number;
  perOunce?: number;
  currency?: string;
};

function toMetalPriceRecord(
  id: string,
  metal: MetalJson,
  createdAt: Date
) {
  const ts = createdAt.toISOString();
  return {
    _id: id,
    pricePerGram: metal.perGram ?? 0,
    pricePerOunce: metal.perOunce ?? 0,
    currency: metal.currency ?? "NPR",
    timestamp: ts,
    source: "database",
    createdAt: ts,
    updatedAt: ts,
    __v: 0,
    isActive: true,
  };
}

export async function handleDashboard() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const sevenDaysAgo = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
  const dayBuckets = buildLast7DayBuckets();

  const [
    orderAggregates,
    ordersLast7Days,
    todaysOrders,
    products,
    transactions,
    lowStock,
    metalPriceRow,
    orderItemsWithCategory,
    customerOrderCounts,
    allCustomers,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { totalAmount: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: todayStart } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: { variants: { where: { isActive: true }, orderBy: { price: "asc" } } },
    }),
    prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isActive: true, quantity: { lte: 10 } },
      orderBy: { quantity: "asc" },
      take: 10,
    }),
    prisma.metalPrice.findFirst({
      where: { isLatest: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      include: {
        product: { include: { category: true } },
      },
    }),
    prisma.order.groupBy({
      by: ["customerId"],
      _count: { id: true },
      where: { customerId: { not: null } },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const dailySales = dayBuckets.map((bucket) => {
    const amount = ordersLast7Days
      .filter((o) => o.createdAt >= bucket.start && o.createdAt < bucket.end)
      .reduce((sum, o) => sum + o.totalAmount, 0);
    return { day: bucket.label, amount };
  });

  const dailyOrderCounts = dayBuckets.map((bucket) => ({
    label: bucket.label,
    count: ordersLast7Days.filter(
      (o) => o.createdAt >= bucket.start && o.createdAt < bucket.end
    ).length,
  }));

  const categoryTotals = new Map<string, number>();
  let categoryGrandTotal = 0;

  for (const item of orderItemsWithCategory) {
    const categoryName = item.product?.category?.name ?? "Uncategorized";
    const variant = item.selectedVariant as { price?: number } | null;
    const unitPrice = variant?.price ?? 0;
    const lineTotal = unitPrice * item.quantity;
    categoryTotals.set(categoryName, (categoryTotals.get(categoryName) ?? 0) + lineTotal);
    categoryGrandTotal += lineTotal;
  }

  const totalSalesByCategory =
    categoryGrandTotal > 0
      ? Array.from(categoryTotals.entries()).map(([category, amount]) => ({
          category,
          percentage: Math.round((amount / categoryGrandTotal) * 100),
        }))
      : [];

  const customerIds = customerOrderCounts
    .map((row) => row.customerId)
    .filter((id): id is string => Boolean(id));

  const topCustomerUsers =
    customerIds.length > 0
      ? await prisma.user.findMany({ where: { id: { in: customerIds } } })
      : [];

  const userById = new Map(topCustomerUsers.map((u) => [u.id, u]));

  const topCustomersFromOrders = customerOrderCounts.map((row) => {
    const user = userById.get(row.customerId!);
    return {
      id: row.customerId!,
      name: user?.name ?? "Guest",
      orderCount: row._count.id,
      image: user?.image || "/logo.png",
    };
  });

  const topCustomers =
    topCustomersFromOrders.length > 0
      ? topCustomersFromOrders
      : allCustomers.map((c) => ({
          id: c.id,
          name: c.name,
          orderCount: 0,
          image: c.image || "/logo.png",
        }));

  const totalRevenue = orderAggregates._sum.totalAmount ?? 0;
  const totalOrders = orderAggregates._count.id;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  let metalPrices: Record<string, unknown> | undefined;

  if (metalPriceRow) {
    const gold = metalPriceRow.gold as MetalJson;
    const silver = metalPriceRow.silver as MetalJson;
    const goldPrice = toMetalPriceRecord(`${metalPriceRow.id}-gold`, gold, metalPriceRow.createdAt);
    const silverPrice = toMetalPriceRecord(
      `${metalPriceRow.id}-silver`,
      silver,
      metalPriceRow.createdAt
    );
    metalPrices = { goldPrice, silverPrice };
  }

  const data = {
    salesMetrics: {
      dailySales,
      totalSalesByCategory,
      totalRevenue,
      totalOrders,
      averageOrderValue,
    },
    orderMetrics: {
      dailyOrders: {
        labels: dailyOrderCounts.map((d) => d.label),
        datasets: [
          {
            label: "Orders",
            data: dailyOrderCounts.map((d) => d.count),
          },
        ],
      },
      todaysOrders: todaysOrders.map((order) => ({
        item: order.items[0]?.product?.name ?? "Order",
        customer: order.customer?.name ?? "Guest",
        qty: order.items.reduce((sum, item) => sum + item.quantity, 0),
        status: formatOrderStatus(order.orderStatus),
        orderId: order.id,
      })),
    },
    priceList: products.map((product) => ({
      title: product.name,
      price: product.variants[0]?.price ?? 0,
      image: product.images[0]?.startsWith("/")
        ? product.images[0]
        : product.images[0]
          ? product.images[0]
          : "/logo.png",
    })),
    recentTransactions: transactions.map((t) =>
      withMongoId({
        ...t,
        transactionId: t.transactionId,
        orderId: t.orderId ?? "",
        orderDate: t.orderDate.toISOString().split("T")[0],
        totalAmount: t.totalAmount,
      })
    ),
    lowStockItems: lowStock.map((product, index) => ({
      id: index + 1,
      name: product.name,
      status: product.quantity === 0 ? "Out of stock" : "Low",
      currentStock: product.quantity,
      minStockLevel: 5,
    })),
    topCustomers,
    metalPrices,
  };

  return apiSuccess(data);
}

export async function handleMetalPricesLatest() {
  const price = await prisma.metalPrice.findFirst({
    where: { isLatest: true },
    orderBy: { createdAt: "desc" },
  });

  if (!price) {
    return apiSuccess({
      goldPrice: {
        pricePerGram: 0,
        pricePerOunce: 0,
        currency: "NPR",
        timestamp: new Date().toISOString(),
        source: "database",
      },
      silverPrice: {
        pricePerGram: 0,
        pricePerOunce: 0,
        currency: "NPR",
        timestamp: new Date().toISOString(),
        source: "database",
      },
    });
  }

  const gold = price.gold as MetalJson;
  const silver = price.silver as MetalJson;
  const goldPrice = toMetalPriceRecord(`${price.id}-gold`, gold, price.createdAt);
  const silverPrice = toMetalPriceRecord(`${price.id}-silver`, silver, price.createdAt);

  return apiSuccess({
    goldPrice,
    silverPrice,
    nepali: {
      gold: { fineGold24k: goldPrice },
      silver: silverPrice,
    },
    lastUpdated: price.createdAt.toISOString(),
  });
}
