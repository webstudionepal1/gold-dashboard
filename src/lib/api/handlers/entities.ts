import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withMongoId, withMongoIds } from "@/lib/serializers";
import { handleGenericDelete, handleGenericList, parseBody, slugify } from "../crud";
import { getPagination, buildPaginationMeta } from "@/lib/pagination";
import { enrichGiftProductsJson } from "@/lib/gift-products";
import {
  buildGiftPersistenceData,
  formatGiftRow,
} from "@/lib/gift-api";
import {
  formatOrderForApi,
  normalizeOrderStatus,
  normalizePaymentStatus,
} from "@/lib/order-api";
import { formatTransactionForApi } from "@/lib/transaction-api";

function normalizeArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p.map(String) : [val];
    } catch {
      return val ? [val] : [];
    }
  }
  return [];
}

// Banner
export async function handleBannerList(req: NextRequest) {
  const items = await prisma.banner.findMany({ orderBy: { priority: "desc" } });
  return apiSuccess(withMongoIds(items));
}

export async function handleBannerCreate(req: NextRequest) {
  const body = await parseBody(req);
  const item = await prisma.banner.create({
    data: {
      title: body.title ? String(body.title) : null,
      description: body.description ? String(body.description) : null,
      image: normalizeArray(body.image),
      mobImage: normalizeArray(body.mobImage),
      video: normalizeArray(body.video),
      videoThumbnail: normalizeArray(body.videoThumbnail),
      category: body.category ? String(body.category) : null,
      subCategory: body.subCategory ? String(body.subCategory) : null,
      priority: Number(body.priority) || 0,
      locations: normalizeArray(body.locations),
      type: body.type ? String(body.type) : null,
      status: String(body.status || "active"),
    },
  });
  return apiSuccess(withMongoId(item), "Banner created", 201);
}

export async function handleBannerUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.banner.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title ? String(body.title) : null }),
      ...(body.image && { image: normalizeArray(body.image) }),
      ...(body.status && { status: String(body.status) }),
    },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleBannerDelete(id: string) {
  return handleGenericDelete("banner", id);
}

// Gift
export async function handleGiftList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip, search } = getPagination(searchParams);
  const typeParam = searchParams.get("type");
  const occasionParam = searchParams.get("occasion");
  const setTypeParam = searchParams.get("setType");

  const andConditions: any[] = [];

  const trimmedSearch = (search || "").trim();
  if (trimmedSearch) {
    andConditions.push({
      OR: [
        { name: { contains: trimmedSearch, mode: "insensitive" } },
        { description: { contains: trimmedSearch, mode: "insensitive" } },
        { slug: { contains: trimmedSearch, mode: "insensitive" } },
        { tags: { has: trimmedSearch } },
      ],
    });
  }

  if (typeParam && typeParam !== "all") {
    andConditions.push({ type: typeParam as "gift" | "package" });
  }

  if (occasionParam && occasionParam !== "all") {
    andConditions.push({ occasion: { equals: occasionParam, mode: "insensitive" } });
  }

  if (setTypeParam && setTypeParam !== "all") {
    andConditions.push({ setType: setTypeParam });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const [items, total] = await Promise.all([
    prisma.gift.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.gift.count({ where }),
  ]);

  const gifts = await Promise.all(
    items.map(async (item) =>
      formatGiftRow(item, await enrichGiftProductsJson(item.products))
    )
  );

  return apiSuccess({
    gifts,
    pagination: buildPaginationMeta(total, page, limit),
  });
}

export async function handleGiftGet(id: string) {
  const item = await prisma.gift.findUnique({ where: { id } });
  if (!item) return apiError("Not found", 404);
  return apiSuccess(
    formatGiftRow(item, await enrichGiftProductsJson(item.products))
  );
}

export async function handleGiftCreate(req: NextRequest) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const data = buildGiftPersistenceData(body);
    const item = await prisma.gift.create({ data });
    return apiSuccess(
      formatGiftRow(item, await enrichGiftProductsJson(item.products)),
      "Created",
      201
    );
  } catch (error) {
    console.error("Gift create error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create gift";
    return apiError(message, 500);
  }
}

export async function handleGiftUpdate(req: NextRequest, id: string) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) return apiError("Not found", 404);

    const data = buildGiftPersistenceData(body, existing);
    const item = await prisma.gift.update({ where: { id }, data });
    return apiSuccess(
      formatGiftRow(item, await enrichGiftProductsJson(item.products))
    );
  } catch (error) {
    console.error("Gift update error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update gift";
    return apiError(message, 500);
  }
}

export async function handleGiftDelete(id: string) {
  return handleGenericDelete("gift", id);
}

export async function handleGiftStatus(req: NextRequest, id: string) {
  const body = await req.json();
  const item = await prisma.gift.update({
    where: { id },
    data: { isActive: Boolean(body.isActive) },
  });
  return apiSuccess(withMongoId(item));
}

// Contact
export async function handleContactList(req: NextRequest) {
  return handleGenericList(req, "contact", ["name", "email", "subject"], {
    assignedTo: true,
    respondedBy: true,
  });
}

export async function handleContactCreate(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.contact.create({
    data: {
      name: String(body.name),
      email: String(body.email),
      subject: String(body.subject),
      description: String(body.description || ""),
      status: body.status || "open",
      priority: body.priority || "medium",
    },
    include: { assignedTo: true, respondedBy: true },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleContactDelete(id: string) {
  return handleGenericDelete("contact", id);
}

// Company
export async function handleCompanyList() {
  const items = await prisma.company.findMany();
  return apiSuccess(withMongoIds(items));
}

export async function handleCompanyCreate(req: NextRequest) {
  const body = await parseBody(req);
  const existing = await prisma.company.findFirst();
  const allowed = [
    "name", "companyName", "ownerNo", "address", "email", "phone",
    "description", "registrationNo", "city", "zipCode", "openDay",
    "openTime", "closeTime", "paymentMode", "bankName", "accountNo",
    "accountHolder", "branch", "logo"
  ];
  if (existing) {
    const data: Record<string, any> = {};
    for (const k of allowed) {
      if (body[k] !== undefined) {
        data[k] = body[k] === "" ? null : String(body[k]);
      }
    }
    const item = await prisma.company.update({
      where: { id: existing.id },
      data,
    });
    return apiSuccess(withMongoId(item), "Shop profile updated successfully");
  }

  const item = await prisma.company.create({
    data: {
      name: String(body.name || body.companyName || "Company"),
      companyName: body.companyName ? String(body.companyName) : null,
      ownerNo: body.ownerNo ? String(body.ownerNo) : null,
      address: body.address ? String(body.address) : null,
      email: body.email ? String(body.email) : null,
      phone: body.phone ? String(body.phone) : null,
      description: body.description ? String(body.description) : null,
      registrationNo: body.registrationNo ? String(body.registrationNo) : null,
      city: body.city ? String(body.city) : null,
      zipCode: body.zipCode ? String(body.zipCode) : null,
      openDay: body.openDay ? String(body.openDay) : null,
      openTime: body.openTime ? String(body.openTime) : null,
      closeTime: body.closeTime ? String(body.closeTime) : null,
      paymentMode: body.paymentMode ? String(body.paymentMode) : null,
      bankName: body.bankName ? String(body.bankName) : null,
      accountNo: body.accountNo ? String(body.accountNo) : null,
      accountHolder: body.accountHolder ? String(body.accountHolder) : null,
      branch: body.branch ? String(body.branch) : null,
      logo: body.logo ? String(body.logo) : null,
    },
  });
  return apiSuccess(withMongoId(item), "Shop profile created successfully", 201);
}

export async function handleCompanyUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const allowed = [
    "name", "companyName", "ownerNo", "address", "email", "phone",
    "description", "registrationNo", "city", "zipCode", "openDay",
    "openTime", "closeTime", "paymentMode", "bankName", "accountNo",
    "accountHolder", "branch", "logo"
  ];
  const data: Record<string, any> = {};
  for (const k of allowed) {
    if (body[k] !== undefined) {
      data[k] = body[k] === "" ? null : String(body[k]);
    }
  }
  const item = await prisma.company.update({
    where: { id },
    data,
  });
  return apiSuccess(withMongoId(item), "Shop profile updated successfully");
}

// Order
export async function handleOrderList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderStatusParam = searchParams.get("orderStatus");
  const orderStatus = orderStatusParam
    ? normalizeOrderStatus(orderStatusParam)
    : undefined;

  const items = await prisma.order.findMany({
    where: orderStatus ? { orderStatus } : undefined,
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess(items.map((item) => formatOrderForApi(item)));
}

export async function handleOrderGet(id: string) {
  const item = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: { include: { product: true } } },
  });
  if (!item) return apiError("Not found", 404);
  return apiSuccess(formatOrderForApi(item));
}

export async function handleOrderCreate(req: NextRequest) {
  const body = await parseBody(req);
  const item = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      shippingAddress: body.shippingAddress ?? {},
      billingAddress: body.billingAddress ?? {},
      billDetails: body.billDetails ?? {},
      orderTimeline: body.orderTimeline ?? {},
      totalAmount: Number(body.totalAmount) || 0,
      customerId: body.customerId || null,
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleOrderUpdate(req: NextRequest, id: string) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return apiError("Not found", 404);

    const orderStatus = body.orderStatus
      ? normalizeOrderStatus(String(body.orderStatus))
      : undefined;

    const rawPayment =
      body.paymentStatus ?? body.paymentStaus ?? body.payment_status;
    const paymentStatus = rawPayment
      ? normalizePaymentStatus(String(rawPayment))
      : undefined;

    const timeline =
      existing.orderTimeline &&
      typeof existing.orderTimeline === "object" &&
      !Array.isArray(existing.orderTimeline)
        ? { ...(existing.orderTimeline as Record<string, unknown>) }
        : {};
    const now = new Date().toISOString();

    if (orderStatus === "confirmed" && !timeline.orderConfirmation) {
      timeline.orderConfirmation = now;
    }
    if (orderStatus === "assigned" && !timeline.deliveryAssignment) {
      timeline.deliveryAssignment = now;
    }
    if (orderStatus === "completed") {
      if (!timeline.outForDelivery) timeline.outForDelivery = now;
      if (!timeline.deliveryCompletion) timeline.deliveryCompletion = now;
      if (!timeline.orderHandOver) timeline.orderHandOver = now;
    }

    const item = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(orderStatus && { orderTimeline: timeline }),
        ...(orderStatus === "completed" && { deliveryStatus: "delivered" }),
      },
      include: { customer: true, items: { include: { product: true } } },
    });

    return apiSuccess(formatOrderForApi(item));
  } catch (error) {
    console.error("Order update error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update order";
    return apiError(message, 500);
  }
}

export async function handleOrderDelete(id: string) {
  return handleGenericDelete("order", id);
}

// Collection
export async function handleCollectionList() {
  const items = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
  return apiSuccess(withMongoIds(items));
}

export async function handleCollectionCreate(req: NextRequest) {
  const body = await parseBody(req);
  const name = String(body.name);
  const item = await prisma.collection.create({
    data: {
      name,
      slug: String(body.slug || slugify(name)),
      description: body.description ? String(body.description) : null,
      collectionType: String(body.collectionType || "custom"),
      collectionMode: String(body.collectionMode || "manual"),
      images: normalizeArray(body.images),
      isActive: body.isActive !== false,
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleCollectionUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.collection.update({
    where: { id },
    data: { ...(body.name && { name: String(body.name) }) },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleCollectionDelete(id: string) {
  return handleGenericDelete("collection", id);
}

// Supplier, Purchase, Expense, etc.
export async function handleSupplierList() {
  return apiSuccess(withMongoIds(await prisma.supplier.findMany()));
}

export async function handleSupplierCreate(req: NextRequest) {
  const body = await parseBody(req);
  const item = await prisma.supplier.create({
    data: { name: String(body.name), email: body.email ? String(body.email) : null },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleSupplierUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.supplier.update({
    where: { id },
    data: { ...(body.name && { name: String(body.name) }) },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleSupplierDelete(id: string) {
  return handleGenericDelete("supplier", id);
}

export async function handlePurchaseList() {
  return apiSuccess(withMongoIds(await prisma.purchase.findMany({ include: { supplier: true } })));
}

export async function handlePurchaseCreate(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.purchase.create({
    data: {
      billNo: body.billNo,
      supplierId: body.supplierId,
      items: body.items ?? [],
      products: body.products ?? [],
      amounts: body.amounts ?? {},
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleExpenseList() {
  return apiSuccess(withMongoIds(await prisma.expense.findMany({ include: { category: true } })));
}

export async function handleExpenseCategoryList() {
  return apiSuccess(withMongoIds(await prisma.expenseCategory.findMany()));
}

export async function handleCashflowList() {
  return apiSuccess(withMongoIds(await prisma.cashFlow.findMany()));
}

export async function handleTransactionList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("fromDate");
  const to = searchParams.get("toDate");
  const where: Record<string, unknown> = {};
  if (from || to) {
    where.orderDate = {};
    if (from) (where.orderDate as Record<string, Date>).gte = new Date(from);
    if (to) (where.orderDate as Record<string, Date>).lte = new Date(to);
  }
  const items = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: { customer: true },
      },
    },
  });
  return apiSuccess(items.map((item) => formatTransactionForApi(item)));
}

export async function handleReviewList() {
  return apiSuccess(withMongoIds(await prisma.review.findMany({ include: { product: true, user: true } })));
}

export async function handlePriceConfigList() {
  const rows = await prisma.priceConfig.findMany({ orderBy: { createdAt: "desc" } });
  const formatted = rows.map((row) => {
    const cfg = (row.config || {}) as Record<string, unknown>;
    return withMongoId({
      ...cfg,
      _id: row.id,
      id: row.id,
      name: row.name,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  });
  return apiSuccess(formatted);
}

export async function handlePriceConfigCreate(req: NextRequest) {
  const body = (await parseBody(req)) as Record<string, unknown>;
  const type = String(body.type || "");
  const forType = String(body.for || "");
  if (!type || !forType) {
    return apiError("type and for are required", 400);
  }
  const name = `${type}-${forType}`;
  const item = await prisma.priceConfig.create({
    data: {
      name,
      config: body,
      isActive: body.isActive !== false,
    },
  });
  const cfg = item.config as Record<string, unknown>;
  return apiSuccess(
    withMongoId({ ...cfg, _id: item.id, name: item.name, isActive: item.isActive }),
    "Created",
    201
  );
}

export async function handlePriceConfigUpdate(req: NextRequest, id: string) {
  const body = (await parseBody(req)) as Record<string, unknown>;
  const existing = await prisma.priceConfig.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);

  const type = String(body.type || (existing.config as Record<string, unknown>)?.type || "");
  const forType = String(body.for || (existing.config as Record<string, unknown>)?.for || "");
  const name = type && forType ? `${type}-${forType}` : existing.name;

  const item = await prisma.priceConfig.update({
    where: { id },
    data: {
      name,
      config: { ...(existing.config as object), ...body },
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    },
  });
  const cfg = item.config as Record<string, unknown>;
  return apiSuccess(withMongoId({ ...cfg, _id: item.id, name: item.name }));
}

export async function handlePriceConfigDelete(id: string) {
  try {
    await prisma.priceConfig.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch {
    return apiError("Not found or could not delete", 404);
  }
}

export async function handlePushNotificationList() {
  return apiSuccess(withMongoIds(await prisma.pushNotification.findMany()));
}

export async function handlePushNotificationCreate(req: NextRequest) {
  const body = await req.json();
  const item = await prisma.pushNotification.create({
    data: {
      token: String(body.token),
      title: body.title ? String(body.title) : null,
      body: body.body ? String(body.body) : null,
      data: body.data ?? null,
      userId: body.userId || null,
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleUserList() {
  const users = await prisma.user.findMany();
  return apiSuccess(
    users.map((u) => {
      const { passwordHash, ...rest } = u;
      return withMongoId(rest);
    })
  );
}

export async function handleFinancialReport(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || new Date(Date.now() - 30 * 86400000).toISOString();
  const endDate = searchParams.get("endDate") || new Date().toISOString();

  const [orders, expenses] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: new Date(startDate), lte: new Date(endDate) } },
    }),
    prisma.expense.findMany({
      where: { date: { gte: new Date(startDate), lte: new Date(endDate) } },
    }),
  ]);

  const revenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return apiSuccess({
    period: { startDate, endDate },
    revenue: [{ label: "Sales", amount: revenue }],
    expenses: [{ label: "Operating", amount: expenseTotal }],
  });
}

export async function handleRawItemList() {
  return apiSuccess(withMongoIds(await prisma.rawItem.findMany()));
}
