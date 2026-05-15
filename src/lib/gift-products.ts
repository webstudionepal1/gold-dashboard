import { prisma } from "@/lib/prisma";
import { withMongoId, withMongoIds } from "@/lib/serializers";

const productInclude = {
  category: true,
  subCategory: true,
  claspType: true,
  variants: true,
};

function formatProductForGift(
  p: NonNullable<Awaited<ReturnType<typeof prisma.product.findUnique>>>
) {
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

export function extractProductId(product: unknown): string | null {
  if (!product) return null;
  if (typeof product === "string") return product;
  if (typeof product === "object") {
    const o = product as { _id?: string; id?: string };
    return o._id || o.id || null;
  }
  return null;
}

export async function enrichGiftProductsJson(productsJson: unknown) {
  if (!Array.isArray(productsJson)) return [];

  const entries = productsJson.filter(
    (e) => e && typeof e === "object"
  ) as Record<string, unknown>[];

  const ids = new Set<string>();
  for (const entry of entries) {
    const pid = extractProductId(entry.product);
    if (pid) ids.add(pid);
    if (Array.isArray(entry.alternativeProducts)) {
      for (const alt of entry.alternativeProducts) {
        const aid = extractProductId(alt);
        if (aid) ids.add(aid);
      }
    }
  }

  if (ids.size === 0) return entries;

  const dbProducts = await prisma.product.findMany({
    where: { id: { in: [...ids] } },
    include: productInclude,
  });

  const byId = new Map(
    dbProducts.map((p) => [p.id, formatProductForGift(p)])
  );

  return entries.map((entry) => {
    const pid = extractProductId(entry.product);
    const full = pid ? byId.get(pid) : null;
    const alternativeProducts = Array.isArray(entry.alternativeProducts)
      ? entry.alternativeProducts.map((alt) => {
          const aid = extractProductId(alt);
          return (aid && byId.get(aid)) || alt;
        })
      : [];

    return {
      ...entry,
      product: full ?? entry.product,
      alternativeProducts,
    };
  });
}

export function resolveRelationName(ref: unknown, fallback = "—"): string {
  if (ref == null) return fallback;
  if (typeof ref === "string") return ref || fallback;
  if (typeof ref === "object") {
    const o = ref as { name?: string; _id?: string; id?: string };
    return o.name || o._id || o.id || fallback;
  }
  return fallback;
}

export function getGiftProductVariants(
  product: unknown
): Array<{
  price?: number;
  wt?: number;
  unit?: string;
  isActive?: boolean;
}> {
  if (!product || typeof product !== "object") return [];
  const p = product as { variant?: unknown[]; variants?: unknown[] };
  const list = p.variant ?? p.variants;
  return Array.isArray(list)
    ? (list as Array<{
        price?: number;
        wt?: number;
        unit?: string;
        isActive?: boolean;
      }>)
    : [];
}

export function getGiftProductDisplayName(
  product: unknown,
  fallback = "Unknown product"
): string {
  if (!product) return fallback;
  if (typeof product === "string") return fallback;
  if (typeof product === "object" && "name" in product) {
    return String((product as { name?: string }).name || fallback);
  }
  return fallback;
}
