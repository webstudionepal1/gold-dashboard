import type { Gift } from "@prisma/client";
import { withMongoId } from "@/lib/serializers";
import { extractProductId } from "@/lib/gift-products";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMetadata(gift: { metadata?: unknown }): Record<string, unknown> {
  if (gift.metadata && typeof gift.metadata === "object" && !Array.isArray(gift.metadata)) {
    return gift.metadata as Record<string, unknown>;
  }
  return {};
}

function normalizeTags(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === "string" && val.includes(",")) {
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (val) return [String(val)];
  return [];
}

function normalizeStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === "string" && val) return [val];
  return [];
}

function normalizeGiftImages(body: Record<string, unknown>): string[] {
  const uploaded = normalizeStringArray(body.images);
  const existing = body.existingImages;
  const existingList = Array.isArray(existing)
    ? existing.map(String)
    : existing
      ? [String(existing)]
      : [];
  return [...existingList, ...uploaded].filter(Boolean);
}

function normalizeGiftProducts(products: unknown): unknown[] {
  if (!Array.isArray(products)) return [];
  return products.map((row) => {
    const p = row as Record<string, unknown>;
    const alts = Array.isArray(p.alternativeProducts) ? p.alternativeProducts : [];
    return {
      product: extractProductId(p.product) || p.product,
      quantity: Number(p.quantity) || 1,
      isOptional: p.isOptional === true || p.isOptional === "true",
      alternativeProducts: alts
        .map((alt) => extractProductId(alt) || alt)
        .filter(Boolean),
    };
  });
}

function normalizeVisibleAs(val: unknown): string {
  if (Array.isArray(val)) {
    const joined = val.map(String).filter(Boolean).join(",");
    return joined || "public";
  }
  return String(val || "public");
}

export function formatGiftRow(gift: Gift, products?: unknown) {
  const meta = getMetadata(gift);
  const base = withMongoId(gift);

  return {
    ...base,
    ...meta,
    isAvailable: meta.isAvailable !== false,
    stockType: String(meta.stockType || "unlimited"),
    totalStock: gift.stock ?? (Number(meta.totalStock) || 0),
    weight: meta.weight != null ? Number(meta.weight) : 0,
    isCustomizable: Boolean(meta.isCustomizable),
    allowPartialPurchase: Boolean(meta.allowPartialPurchase),
    minimumOrderQuantity: Number(meta.minimumOrderQuantity) || 1,
    maximumOrderQuantity: Number(meta.maximumOrderQuantity) || 100,
    priority: Number(meta.priority) || 1,
    products: products ?? gift.products,
  };
}

export function buildGiftPersistenceData(
  body: Record<string, unknown>,
  existing?: Gift | null
) {
  const prevMeta = existing ? getMetadata(existing) : {};
  const name = String(body.name || existing?.name || "").trim();
  if (!name) throw new Error("Name is required");

  const metadata: Record<string, unknown> = {
    ...prevMeta,
    isAvailable: body.isAvailable !== false && body.isAvailable !== "false",
    stockType: String(body.stockType || prevMeta.stockType || "unlimited"),
    isCustomizable:
      body.isCustomizable === true || body.isCustomizable === "true",
    allowPartialPurchase:
      body.allowPartialPurchase === true ||
      body.allowPartialPurchase === "true",
    minimumOrderQuantity: Number(body.minimumOrderQuantity) || 1,
    maximumOrderQuantity: Number(body.maximumOrderQuantity) || 100,
    priority: Number(body.priority) || 1,
    weight:
      body.weight != null && body.weight !== ""
        ? Number(body.weight)
        : Number(prevMeta.weight) || 0,
  };

  return {
    name,
    slug: body.slug ? String(body.slug) : existing?.slug || slugify(name),
    description:
      body.description != null ? String(body.description) : null,
    type: (body.type as "gift" | "package") || existing?.type || "gift",
    products: normalizeGiftProducts(body.products),
    pricingType:
      (body.pricingType as "fixed" | "calculated" | "discounted") ||
      existing?.pricingType ||
      "fixed",
    fixedPrice:
      body.fixedPrice != null && body.fixedPrice !== ""
        ? Number(body.fixedPrice)
        : null,
    discountPercentage:
      body.discountPercentage != null && body.discountPercentage !== ""
        ? Number(body.discountPercentage)
        : null,
    discountAmount:
      body.discountAmount != null && body.discountAmount !== ""
        ? Number(body.discountAmount)
        : null,
    category: body.category ? String(body.category) : null,
    setCategory: body.setCategory ? String(body.setCategory) : null,
    occasion: body.occasion ? String(body.occasion) : null,
    setType: body.setType ? String(body.setType) : null,
    setTheme: body.setTheme ? String(body.setTheme) : null,
    metalType: body.metalType ? String(body.metalType) : null,
    stoneType: body.stoneType ? String(body.stoneType) : null,
    stock: Number(body.totalStock ?? body.stock ?? 0),
    isActive: body.isActive !== false && body.isActive !== "false",
    tags: normalizeTags(body.tags),
    images: normalizeGiftImages(body),
    featuredImage: body.featuredImage ? String(body.featuredImage) : null,
    visibleAs: normalizeVisibleAs(body.visibleAs),
    metadata,
  };
}
