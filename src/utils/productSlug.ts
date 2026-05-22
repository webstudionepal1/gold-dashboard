/** Target SEO-friendly product URL length (50–60 chars). */
export const PRODUCT_SLUG_TARGET_LENGTH = 58;

export function slugifyPart(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ProductSlugParts = {
  name: string;
  brand?: string;
  model?: string;
  maxLength?: number;
};

/**
 * Build URL slug: product-name-brand-model (hyphen-separated).
 * Truncates to ~50–60 characters while keeping the product name prefix.
 */
export function generateProductSlug(parts: ProductSlugParts): string {
  const maxLen = parts.maxLength ?? PRODUCT_SLUG_TARGET_LENGTH;
  const segments = [
    slugifyPart(parts.name),
    parts.brand ? slugifyPart(parts.brand) : "",
    parts.model ? slugifyPart(parts.model) : "",
  ].filter(Boolean);

  if (segments.length === 0) return "";

  let slug = segments.join("-");
  if (slug.length <= maxLen) return slug;

  const namePart = segments[0];
  const tail = segments.slice(1).join("-");
  if (!tail) return namePart.slice(0, maxLen).replace(/-+$/g, "");

  const budget = maxLen - namePart.length - 1;
  if (budget <= 0) return namePart.slice(0, maxLen).replace(/-+$/g, "");

  const tailTruncated = tail.slice(0, budget).replace(/-+$/g, "");
  return tailTruncated ? `${namePart}-${tailTruncated}` : namePart.slice(0, maxLen);
}

export function buildProductSlugFromFormFields(input: {
  name: string;
  productType?: string;
  karat?: string;
  shape?: string;
  brand?: string;
  model?: string;
  variantName?: string;
}): string {
  const brand =
    input.brand?.trim() ||
    (input.productType && input.productType !== "normal"
      ? input.productType
      : "");

  const model =
    input.model?.trim() ||
    [input.karat, input.shape, input.variantName]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join("-");

  return generateProductSlug({
    name: input.name,
    brand: brand || undefined,
    model: model || undefined,
  });
}
