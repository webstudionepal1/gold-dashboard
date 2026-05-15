import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiPaginated, apiSuccess } from "@/lib/api-response";
import { buildPaginationMeta, getPagination } from "@/lib/pagination";
import { withMongoId, withMongoIds } from "@/lib/serializers";
import { handleGenericDelete, handleGenericGetById, parseBody, slugify } from "../crud";

const productInclude = {
  category: true,
  subCategory: true,
  claspType: true,
  variants: true,
};

function formatProduct(p: Awaited<ReturnType<typeof fetchProduct>>) {
  if (!p) return null;
  const mapped = withMongoId(p);
  return {
    ...mapped,
    category: p.category ? withMongoId(p.category) : p.categoryId,
    subCategory: p.subCategory ? withMongoId(p.subCategory) : p.subCategoryId,
    claspType: p.claspType ? withMongoId(p.claspType) : p.claspTypeId,
    variant: withMongoIds(p.variants),
    variants: withMongoIds(p.variants),
  };
}

async function fetchProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function handleProductList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip, search, sortOrder } = getPagination(searchParams);

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: sortOrder },
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  const formatted = products.map((p) => formatProduct(p)!);
  const pagination = buildPaginationMeta(totalCount, page, limit);

  // Match legacy API shape expected by ProductList (search endpoint)
  return apiSuccess({
    products: formatted,
    pagination,
  });
}

export async function handleProductSearch(req: NextRequest) {
  return handleProductList(req);
}

export async function handleProductGet(id: string) {
  const product = await fetchProduct(id);
  if (!product) return apiError("Product not found", 404);
  return apiSuccess(formatProduct(product));
}

function extractMakingCharges(body: Record<string, unknown>): number {
  const mc = body.makingCharges;
  if (mc && typeof mc === "object" && mc !== null && "value" in mc) {
    return Number((mc as { value: unknown }).value) || 0;
  }
  return Number(mc) || 0;
}

function normalizeTags(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (val) return [String(val)];
  return [];
}

function normalizeVisibleAs(val: unknown): string {
  if (Array.isArray(val)) {
    const joined = val.map(String).filter(Boolean).join(",");
    return joined || "public";
  }
  return String(val || "public");
}

function getVariantRows(body: Record<string, unknown>): Record<string, unknown>[] {
  const raw = body.variants ?? body.variant;
  if (!Array.isArray(raw)) return [];
  return raw.filter((v) => v && typeof v === "object") as Record<string, unknown>[];
}

function buildVariantCreates(
  variants: Record<string, unknown>[],
  slug: string
) {
  const rows =
    variants.length > 0
      ? variants
      : [{ price: 0, wt: 0, unit: "grams", isActive: true }];

  return rows.map((v, index) => ({
    sku: String(v.sku || `${slug}-v${index}-${Date.now()}`),
    price: Number(v.price) || 0,
    wt: Number(v.wt) || 0,
    unit: String(v.unit || "gm").replace(/^grams$/i, "gm"),
    costPrice: v.costPrice != null ? Number(v.costPrice) : null,
    isActive: v.isActive !== false,
  }));
}

function normalizeProductImages(body: Record<string, unknown>): string[] {
  const uploaded = normalizeStringArray(body.images);
  const existing = body.existingImages;
  const existingList = Array.isArray(existing)
    ? existing.map(String)
    : existing
      ? [String(existing)]
      : [];
  return [...existingList, ...uploaded].filter(Boolean);
}

export async function handleProductCreate(req: NextRequest) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const name = String(body.name || "");
    if (!name) return apiError("Name is required", 400);

    const slug = String(body.slug || slugify(name));
    const variantRows = getVariantRows(body);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: body.description ? String(body.description) : null,
        categoryId: (body.categoryId || body.category || null) as string | null,
        subCategoryId: (body.subCategoryId ||
          body.subCategory ||
          null) as string | null,
        claspTypeId: (body.claspTypeId || body.claspType || null) as
          | string
          | null,
        makingCharges: extractMakingCharges(body),
        length: body.length != null ? Number(body.length) : null,
        rhodoumFinishes: Boolean(body.rhodoumFinishes),
        shape: body.shape ? String(body.shape) : null,
        quantity: Number(body.quantity) || 0,
        totalCarat: body.totalCarat != null ? Number(body.totalCarat) : null,
        color: body.color ? String(body.color) : null,
        clarity: body.clarity ? String(body.clarity) : null,
        dimension: body.dimension != null ? Number(body.dimension) : null,
        tags: normalizeTags(body.tags),
        visibleAs: normalizeVisibleAs(body.visibleAs),
        images: normalizeProductImages(body),
        video: body.video ? String(body.video) : null,
        videoThumbnail: body.videoThumbnail
          ? String(body.videoThumbnail)
          : null,
        isActive: body.isActive !== false && body.isActive !== "false",
        isFeatured: Boolean(body.isFeatured),
        wastage: body.wastage ?? undefined,
        stones: Array.isArray(body.stones) ? body.stones : [],
        others: Array.isArray(body.others) ? body.others : [],
        metadata: body.metadata ?? {},
        variants: {
          create: buildVariantCreates(variantRows, slug),
        },
      },
      include: productInclude,
    });

    return apiSuccess(formatProduct(product), "Product created", 201);
  } catch (error) {
    console.error("Product create error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    if (message.includes("Unique constraint")) {
      return apiError("A product with this name or SKU already exists", 409);
    }
    return apiError(message, 500);
  }
}

export async function handleProductUpdate(req: NextRequest, id: string) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const existing = await fetchProduct(id);
    if (!existing) return apiError("Product not found", 404);

    const variantRows = getVariantRows(body);
    if (variantRows.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      await prisma.productVariant.createMany({
        data: buildVariantCreates(variantRows, existing.slug).map((v) => ({
          ...v,
          productId: id,
        })),
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: String(body.name) }),
        ...(body.slug && { slug: String(body.slug) }),
        ...(body.description !== undefined && {
          description: body.description ? String(body.description) : null,
        }),
        ...(body.category !== undefined && {
          categoryId: (body.categoryId || body.category || null) as
            | string
            | null,
        }),
        ...(body.subCategory !== undefined && {
          subCategoryId: (body.subCategoryId ||
            body.subCategory ||
            null) as string | null,
        }),
        ...(body.images !== undefined && {
          images: normalizeProductImages(body),
        }),
        ...(body.isActive !== undefined && {
          isActive: body.isActive !== false && body.isActive !== "false",
        }),
        ...(body.quantity !== undefined && {
          quantity: Number(body.quantity),
        }),
        makingCharges: extractMakingCharges(body),
        ...(body.wastage !== undefined && { wastage: body.wastage }),
        ...(body.stones !== undefined && {
          stones: Array.isArray(body.stones) ? body.stones : [],
        }),
        ...(body.others !== undefined && {
          others: Array.isArray(body.others) ? body.others : [],
        }),
      },
      include: productInclude,
    });

    return apiSuccess(formatProduct(product));
  } catch (error) {
    console.error("Product update error:", error);
    return apiError(
      error instanceof Error ? error.message : "Failed to update product",
      500
    );
  }
}

export async function handleProductDelete(id: string) {
  return handleGenericDelete("product", id);
}

export async function handleValidateSku(sku: string) {
  const existing = await prisma.productVariant.findUnique({ where: { sku } });
  return apiSuccess({ available: !existing, sku });
}

// Category
export async function handleCategoryList(req: NextRequest) {
  const categories = await prisma.category.findMany({
    include: { subCategories: true },
    orderBy: { createdAt: "desc" },
  });
  return apiSuccess(
    categories.map((c) => ({
      ...withMongoId(c),
      subCategory: withMongoIds(c.subCategories),
    }))
  );
}

export async function handleCategoryCreate(req: NextRequest) {
  const body = await parseBody(req);
  const cat = await prisma.category.create({
    data: {
      name: String(body.name),
      description: body.description ? String(body.description) : null,
      image: body.image ? String(body.image) : null,
      isActive: body.isActive !== false,
    },
    include: { subCategories: true },
  });
  return apiSuccess(withMongoId(cat), "Category created", 201);
}

export async function handleCategoryUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const cat = await prisma.category.update({
    where: { id },
    data: {
      ...(body.name && { name: String(body.name) }),
      ...(body.description !== undefined && {
        description: body.description ? String(body.description) : null,
      }),
      ...(body.image && { image: String(body.image) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    },
    include: { subCategories: true },
  });
  return apiSuccess(withMongoId(cat));
}

export async function handleCategoryDelete(id: string) {
  return handleGenericDelete("category", id);
}

// SubCategory
export async function handleSubCategoryList() {
  const items = await prisma.subCategory.findMany({ include: { category: true } });
  return apiSuccess(withMongoIds(items));
}

export async function handleSubCategoryCreate(req: NextRequest) {
  const body = await parseBody(req);
  const item = await prisma.subCategory.create({
    data: {
      name: String(body.name),
      description: body.description ? String(body.description) : null,
      categoryId: String(body.categoryId || body.category),
      image: body.image ? String(body.image) : null,
      isActive: body.isActive !== false,
    },
  });
  return apiSuccess(withMongoId(item), "SubCategory created", 201);
}

export async function handleSubCategoryUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.subCategory.update({
    where: { id },
    data: {
      ...(body.name && { name: String(body.name) }),
      ...(body.categoryId && { categoryId: String(body.categoryId) }),
    },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleSubCategoryDelete(id: string) {
  return handleGenericDelete("subCategory", id);
}

// Clasp, Stone, Occasion - simplified CRUD
export async function handleClaspList() {
  const items = await prisma.claspType.findMany();
  return apiSuccess(withMongoIds(items));
}

export async function handleClaspCreate(req: NextRequest) {
  const body = await parseBody(req);
  const item = await prisma.claspType.create({
    data: {
      name: String(body.name),
      images: normalizeStringArray(body.images),
      isActive: body.isActive !== false,
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleClaspUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.claspType.update({
    where: { id },
    data: { ...(body.name && { name: String(body.name) }), ...(body.images && { images: normalizeStringArray(body.images) }) },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleClaspDelete(id: string) {
  return handleGenericDelete("claspType", id);
}

export async function handleStoneList() {
  const stones = await prisma.stone.findMany();
  return apiSuccess({ stones: withMongoIds(stones) });
}

export async function handleStoneCreate(req: NextRequest) {
  const body = await parseBody(req);
  const stone = await prisma.stone.create({
    data: {
      name: String(body.name),
      type: body.type ? String(body.type) : null,
      color: body.color ? String(body.color) : null,
      clarity: body.clarity ? String(body.clarity) : null,
      cut: body.cut ? String(body.cut) : null,
      shape: body.shape ? String(body.shape) : null,
      carat: body.carat != null ? Number(body.carat) : null,
      pricePerCarat: body.pricePerCarat != null ? Number(body.pricePerCarat) : null,
      totalPrice: body.totalPrice != null ? Number(body.totalPrice) : null,
      images: normalizeStringArray(body.images),
      isActive: body.isActive !== false,
    },
  });
  return apiSuccess(withMongoId(stone), "Created", 201);
}

export async function handleStoneUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const stone = await prisma.stone.update({
    where: { id },
    data: { ...(body.name && { name: String(body.name) }) },
  });
  return apiSuccess(withMongoId(stone));
}

export async function handleStoneDelete(id: string) {
  return handleGenericDelete("stone", id);
}

export async function handleOccasionList() {
  const items = await prisma.occasion.findMany();
  return apiSuccess(withMongoIds(items));
}

export async function handleOccasionCreate(req: NextRequest) {
  const body = await parseBody(req);
  const name = String(body.name);
  const item = await prisma.occasion.create({
    data: {
      name,
      slug: String(body.slug || slugify(name)),
      description: body.description ? String(body.description) : null,
      image: body.image ? String(body.image) : null,
      isActive: body.isActive !== false,
      metadata: body.metadata ?? {},
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleOccasionUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.occasion.update({
    where: { id },
    data: { ...(body.name && { name: String(body.name) }) },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleOccasionDelete(id: string) {
  return handleGenericDelete("occasion", id);
}

function normalizeStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.map(String) : [val];
    } catch {
      return val ? [val] : [];
    }
  }
  return [];
}
