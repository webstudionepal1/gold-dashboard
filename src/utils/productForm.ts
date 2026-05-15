import {
  ProductFormData,
  ProductVariant,
} from "@/components/shared/form_components/ProductFormContext";
import { resolveMediaUrl } from "@/utils/media";

function mapVariantUnit(unit?: string): ProductVariant["unit"] {
  const u = String(unit || "").toLowerCase();
  if (u === "gm" || u === "gram" || u === "grams") return "grams";
  if (u === "kg") return "kg";
  if (u === "pieces" || u === "piece") return "pieces";
  if (u === "carats" || u === "carat") return "carats";
  return "grams";
}

function resolveRelationId(
  relation: unknown,
  fallbackId?: string
): string {
  if (typeof relation === "string") return relation;
  if (relation && typeof relation === "object") {
    const obj = relation as { _id?: string; id?: string };
    return obj._id || obj.id || fallbackId || "";
  }
  return fallbackId || "";
}

function parseMakingCharges(product: Record<string, unknown>): {
  makingCharges: number;
  makingChargesType: "fixed" | "per";
} {
  const mc = product.makingCharges;
  if (mc && typeof mc === "object" && mc !== null) {
    const obj = mc as { type?: string; value?: unknown };
    return {
      makingCharges: Number(obj.value) || 0,
      makingChargesType: obj.type === "per" ? "per" : "fixed",
    };
  }
  return {
    makingCharges: Number(mc) || 0,
    makingChargesType: "fixed",
  };
}

export function mapProductToFormData(
  product: Record<string, unknown>
): Partial<ProductFormData> {
  const metadata = (product.metadata || {}) as Record<string, unknown>;
  const { makingCharges, makingChargesType } = parseMakingCharges(product);

  const variantsRaw =
    (product.variant as Record<string, unknown>[]) ||
    (product.variants as Record<string, unknown>[]) ||
    [];

  const variants: ProductVariant[] = variantsRaw.map((v) => ({
    sku: String(v.sku || ""),
    name: String(v.name || ""),
    price: Number(v.price) || 0,
    wt: Number(v.wt) || 0,
    unit: mapVariantUnit(v.unit as string),
    costPrice: v.costPrice != null ? Number(v.costPrice) : undefined,
    isActive: v.isActive !== false,
  }));

  const stonesRaw = (product.stones as Record<string, unknown>[]) || [];
  const stones = stonesRaw.map((s) => ({
    name: String(s.name || ""),
    weight: Number(s.weight ?? s.carat) || 0,
    price: Number(s.price) || 0,
    color: String(s.color || ""),
    karat: s.karat ? String(s.karat) : undefined,
  }));

  const othersRaw = (product.others as Record<string, unknown>[]) || [];
  const otherCharges = othersRaw.map((o) => ({
    name: String(o.name || ""),
    price: Number(o.value ?? o.price) || 0,
  }));

  const visibleAsRaw = product.visibleAs;
  const visibleAs = Array.isArray(visibleAsRaw)
    ? visibleAsRaw.map(String)
    : typeof visibleAsRaw === "string" && visibleAsRaw
      ? visibleAsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : ["public"];

  const wastageRaw = product.wastage;
  let wastage: ProductFormData["wastage"];
  if (wastageRaw && typeof wastageRaw === "object") {
    const w = wastageRaw as { type?: string; value?: unknown };
    wastage = {
      type: w.type === "per" ? "per" : "fixed",
      value: Number(w.value) || 0,
    };
  }

  const str = (v: unknown) => (v == null ? "" : String(v));

  return {
    name: str(product.name),
    slug: str(product.slug),
    description: str(product.description),
    productType: (metadata.productType ||
      product.productType ||
      "gold") as ProductFormData["productType"],
    karat: (metadata.karat || product.karat || "") as ProductFormData["karat"],
    category: resolveRelationId(product.category, String(product.categoryId || "")),
    subCategory: resolveRelationId(
      product.subCategory,
      String(product.subCategoryId || "")
    ),
    length: Number(product.length) || 0,
    claspType: resolveRelationId(
      product.claspType,
      String(product.claspTypeId || "")
    ),
    rhodoumFinishes: Boolean(product.rhodoumFinishes),
    shape: str(product.shape),
    quantity: Number(product.quantity) || 0,
    totalCarat: product.totalCarat == null ? 0 : Number(product.totalCarat) || 0,
    color: str(product.color),
    clarity: str(product.clarity),
    dimension: Number(product.dimension) || 0,
    gender: (metadata.gender || product.gender || "male") as ProductFormData["gender"],
    makingCharges,
    makingChargesType,
    wastage,
    variants: variants.length
      ? variants
      : [{ price: 0, wt: 0, unit: "grams", isActive: true }],
    stones,
    tags: Array.isArray(product.tags) ? product.tags.map(String) : [],
    otherCharges,
    images: (Array.isArray(product.images) ? product.images : []).map((item) =>
      resolveMediaUrl(String(item))
    ),
    video: null,
    existingVideo: (product.video as string) || null,
    visibleAs,
    isActive: product.isActive !== false,
    isFeatured: Boolean(product.isFeatured),
  };
}
