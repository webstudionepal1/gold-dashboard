import { describe, it, expect } from "vitest";
import {
  generateProductSlug,
  buildProductSlugFromFormFields,
  PRODUCT_SLUG_TARGET_LENGTH,
} from "./productSlug";

describe("generateProductSlug", () => {
  it("joins name, brand, and model with hyphens", () => {
    expect(
      generateProductSlug({
        name: "Diamond Stud Earrings",
        brand: "Panch",
        model: "18k-round",
      })
    ).toBe("diamond-stud-earrings-panch-18k-round");
  });

  it("keeps slug near 50–60 characters", () => {
    const slug = generateProductSlug({
      name: "Very Long Premium Handcrafted Gold Necklace With Temple Design",
      brand: "Panch Jewellers Collection",
      model: "22k-antique-traditional-wedding",
    });
    expect(slug.length).toBeLessThanOrEqual(PRODUCT_SLUG_TARGET_LENGTH);
    expect(slug.startsWith("very-long-premium-handcrafted-gold-necklace")).toBe(
      true
    );
  });
});

describe("buildProductSlugFromFormFields", () => {
  it("uses product type and karat as brand/model fallbacks", () => {
    expect(
      buildProductSlugFromFormFields({
        name: "Gold Bangle",
        productType: "gold",
        karat: "22k",
        shape: "round",
      })
    ).toBe("gold-bangle-gold-22k-round");
  });
});
