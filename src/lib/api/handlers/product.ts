import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiPaginated, apiSuccess } from "@/lib/api-response";
import { buildPaginationMeta, getPagination } from "@/lib/pagination";
import { withMongoId, withMongoIds } from "@/lib/serializers";
import { handleGenericDelete, handleGenericGetById, parseBody, slugify } from "../crud";
import { buildProductSlugFromFormFields } from "@/utils/productSlug";

const productInclude = {
  category: true,
  subCategory: true,
  claspType: true,
  variants: true,
};

function formatProduct(p: Awaited<ReturnType<typeof fetchProduct>>) {
  if (!p) return null;
  const mapped = withMongoId(p);
  const metadata =
    p.metadata && typeof p.metadata === "object"
      ? (p.metadata as Record<string, unknown>)
      : {};
  return {
    ...mapped,
    category: p.category ? withMongoId(p.category) : p.categoryId,
    subCategory: p.subCategory ? withMongoId(p.subCategory) : p.subCategoryId,
    claspType: p.claspType ? withMongoId(p.claspType) : p.claspTypeId,
    productType:
      typeof metadata.productType === "string" ? metadata.productType : undefined,
    gender: typeof metadata.gender === "string" ? metadata.gender : undefined,
    karat: typeof metadata.karat === "string" ? metadata.karat : undefined,
    video: p.video ? [p.video] : [],
    videoThumbnail: p.videoThumbnail ? [p.videoThumbnail] : [],
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

function hasOwn(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function getVariantRows(body: Record<string, unknown>): Record<string, unknown>[] {
  const raw = body.variants ?? body.variant;
  if (!Array.isArray(raw)) return [];
  return raw.filter((v) => v && typeof v === "object") as Record<string, unknown>[];
}

function normalizeProductVideo(body: Record<string, unknown>): string | null {
  const uploaded = normalizeStringArray(body.video);
  const existing = normalizeStringArray(body.existingVideo);
  return uploaded[0] || existing[0] || null;
}

function buildProductMetadata(
  body: Record<string, unknown>,
  existingMetadata?: unknown
) {
  const metadata: Record<string, unknown> =
    existingMetadata && typeof existingMetadata === "object"
      ? { ...(existingMetadata as Record<string, unknown>) }
      : {};

  if (body.metadata && typeof body.metadata === "object") {
    Object.assign(metadata, body.metadata as Record<string, unknown>);
  }

  if (hasOwn(body, "productType")) {
    const value = String(body.productType || "").trim();
    if (value) metadata.productType = value;
    else delete metadata.productType;
  }

  if (hasOwn(body, "gender")) {
    const value = String(body.gender || "").trim();
    if (value) metadata.gender = value;
    else delete metadata.gender;
  }

  if (hasOwn(body, "karat")) {
    const value = String(body.karat || "").trim();
    if (value) metadata.karat = value;
    else delete metadata.karat;
  }

  if (
    hasOwn(body, "makingCharges") &&
    body.makingCharges &&
    typeof body.makingCharges === "object" &&
    "type" in body.makingCharges
  ) {
    const value = String(
      (body.makingCharges as { type?: unknown }).type || ""
    ).trim();
    if (value) metadata.makingChargesType = value;
    else delete metadata.makingChargesType;
  }

  return metadata;
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
    name: v.name != null && String(v.name).trim() ? String(v.name).trim() : null,
    price: Number(v.price) || 0,
    wt: Number(v.wt) || 0,
    unit: String(v.unit || "gm").replace(/^grams$/i, "gm"),
    costPrice: v.costPrice != null ? Number(v.costPrice) : null,
    isActive: v.isActive !== false,
  }));
}

async function resolveProductSlug(
  body: Record<string, unknown>,
  name: string
): Promise<string> {
  if (body.slug && String(body.slug).trim()) {
    return slugify(String(body.slug));
  }

  let brand = body.brand ? String(body.brand) : "";
  if (!brand) {
    const pt = String(body.productType || "");
    if (pt && pt !== "normal") brand = pt;
  }
  if (!brand) {
    const categoryId = (body.categoryId || body.category) as string | null;
    if (categoryId) {
      const cat = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true },
      });
      if (cat?.name) brand = cat.name;
    }
  }

  const metadata =
    body.metadata && typeof body.metadata === "object"
      ? (body.metadata as Record<string, unknown>)
      : {};
  const variantRows = getVariantRows(body);
  const firstVariant = variantRows[0];
  const variantName =
    firstVariant?.name != null ? String(firstVariant.name) : "";

  const slug = buildProductSlugFromFormFields({
    name,
    productType: body.productType ? String(body.productType) : undefined,
    karat: body.karat
      ? String(body.karat)
      : metadata.karat
        ? String(metadata.karat)
        : undefined,
    shape: body.shape ? String(body.shape) : undefined,
    brand: brand || undefined,
    model: body.model ? String(body.model) : undefined,
    variantName: variantName || undefined,
  });

  return slug || slugify(name);
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

    const slug = await resolveProductSlug(body, name);
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
        rhodoumFinishes:
          body.rhodoumFinishes === true || body.rhodoumFinishes === "true",
        shape: body.shape ? String(body.shape) : null,
        quantity: Number(body.quantity) || 0,
        totalCarat: body.totalCarat != null ? Number(body.totalCarat) : null,
        color: body.color ? String(body.color) : null,
        clarity: body.clarity ? String(body.clarity) : null,
        dimension: body.dimension != null ? Number(body.dimension) : null,
        tags: normalizeTags(body.tags),
        visibleAs: normalizeVisibleAs(body.visibleAs),
        images: normalizeProductImages(body),
        video: normalizeProductVideo(body),
        videoThumbnail: body.videoThumbnail
          ? String(body.videoThumbnail)
          : null,
        isActive: body.isActive !== false && body.isActive !== "false",
        isFeatured: body.isFeatured === true || body.isFeatured === "true",
        wastage: body.wastage ?? undefined,
        stones: Array.isArray(body.stones) ? body.stones : [],
        others: Array.isArray(body.others) ? body.others : [],
        metadata: buildProductMetadata(body),
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
        ...(body.length !== undefined && {
          length: body.length != null && body.length !== "" ? Number(body.length) : null,
        }),
        ...(body.rhodoumFinishes !== undefined && {
          rhodoumFinishes:
            body.rhodoumFinishes === true || body.rhodoumFinishes === "true",
        }),
        ...(body.totalCarat !== undefined && {
          totalCarat:
            body.totalCarat != null && body.totalCarat !== ""
              ? Number(body.totalCarat)
              : null,
        }),
        ...(body.color !== undefined && {
          color: body.color ? String(body.color) : null,
        }),
        ...(body.clarity !== undefined && {
          clarity: body.clarity ? String(body.clarity) : null,
        }),
        ...(body.dimension !== undefined && {
          dimension:
            body.dimension != null && body.dimension !== ""
              ? Number(body.dimension)
              : null,
        }),
        ...((body.syncImages !== undefined ||
          body.images !== undefined ||
          body.existingImages !== undefined) && {
          images: normalizeProductImages(body),
        }),
        ...((body.video !== undefined || body.existingVideo !== undefined) && {
          video: normalizeProductVideo(body),
        }),
        ...(body.isActive !== undefined && {
          isActive: body.isActive !== false && body.isActive !== "false",
        }),
        ...(body.isFeatured !== undefined && {
          isFeatured: body.isFeatured === true || body.isFeatured === "true",
        }),
        ...(body.quantity !== undefined && {
          quantity: Number(body.quantity),
        }),
        ...(body.tags !== undefined && {
          tags: normalizeTags(body.tags),
        }),
        ...(body.visibleAs !== undefined && {
          visibleAs: normalizeVisibleAs(body.visibleAs),
        }),
        makingCharges: extractMakingCharges(body),
        ...(body.wastage !== undefined && { wastage: body.wastage }),
        ...(body.stones !== undefined && {
          stones: Array.isArray(body.stones) ? body.stones : [],
        }),
        ...(body.others !== undefined && {
          others: Array.isArray(body.others) ? body.others : [],
        }),
        ...((body.metadata !== undefined ||
          body.productType !== undefined ||
          body.gender !== undefined ||
          body.karat !== undefined ||
          body.makingCharges !== undefined) && {
          metadata: buildProductMetadata(body, existing.metadata),
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
  const formatted = items.map((item) => {
    const mapped = withMongoId(item);
    return {
      ...mapped,
      categoryId: item.categoryId,
      category: item.category ? withMongoId(item.category) : item.categoryId,
    };
  });
  return apiSuccess(formatted);
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
  const categoryId = body.categoryId ?? body.category;

  const item = await prisma.subCategory.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: String(body.name) }),
      ...(categoryId && { categoryId: String(categoryId) }),
      ...(body.description !== undefined && {
        description: body.description ? String(body.description) : null,
      }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
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

export async function handleProductTypeList() {
  const items = await prisma.productType.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return apiSuccess(withMongoIds(items));
}

export async function handleProductTypeCreate(req: NextRequest) {
  const body = await parseBody(req);
  const name = String(body.name || "").trim();
  if (!name) return apiError("Name is required", 400);

  const slug = String(body.slug || slugify(name)).trim();
  const item = await prisma.productType.create({
    data: {
      name,
      slug,
      description: body.description ? String(body.description) : null,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
      isActive: body.isActive !== false,
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleProductTypeUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.productType.update({
    where: { id },
    data: {
      ...(body.name && { name: String(body.name) }),
      ...(body.slug && { slug: String(body.slug) }),
      ...(body.description !== undefined && {
        description: body.description ? String(body.description) : null,
      }),
      ...(body.sortOrder != null && { sortOrder: Number(body.sortOrder) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleProductTypeDelete(id: string) {
  return handleGenericDelete("productType", id);
}

export async function handleMetalTypeList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("activeOnly") === "true";

  const items = await prisma.metalType.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return apiSuccess(withMongoIds(items));
}

export async function handleMetalTypeCreate(req: NextRequest) {
  const body = await parseBody(req);
  const name = String(body.name || "").trim();
  if (!name) return apiError("Name is required", 400);

  const slug = String(body.slug || slugify(name)).trim();
  const item = await prisma.metalType.create({
    data: {
      name,
      slug,
      description: body.description ? String(body.description) : null,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
      isActive: body.isActive !== false,
    },
  });
  return apiSuccess(withMongoId(item), "Created", 201);
}

export async function handleMetalTypeUpdate(req: NextRequest, id: string) {
  const body = await parseBody(req);
  const item = await prisma.metalType.update({
    where: { id },
    data: {
      ...(body.name && { name: String(body.name) }),
      ...(body.slug && { slug: String(body.slug) }),
      ...(body.description !== undefined && {
        description: body.description ? String(body.description) : null,
      }),
      ...(body.sortOrder != null && { sortOrder: Number(body.sortOrder) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    },
  });
  return apiSuccess(withMongoId(item));
}

export async function handleMetalTypeDelete(id: string) {
  return handleGenericDelete("metalType", id);
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
