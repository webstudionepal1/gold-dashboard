import { IFetchGift } from "@/server/api/giftHooks";
import { extractProductId } from "@/lib/gift-products";

export interface GiftProductFormRow {
  product: string;
  quantity: number;
  isOptional: boolean;
  alternativeProducts: string[];
}

export interface GiftFormValues {
  name: string;
  description: string;
  type: "gift" | "package";
  pricingType: "fixed" | "calculated" | "discounted";
  fixedPrice: number;
  discountPercentage: number;
  discountAmount: number;
  category: string;
  setCategory: string;
  occasion: string;
  setType:
    | "necklace_set"
    | "bridal_set"
    | "earring_set"
    | "bracelet_set"
    | "ring_set"
    | "custom"
    | "";
  setTheme: string;
  metalType: string;
  stoneType: string;
  tags: string;
  isActive: boolean;
  isAvailable: boolean;
  stockType: "unlimited" | "limited" | "based_on_products";
  totalStock: number;
  featuredImage: string;
  slug: string;
  visibleAs: string;
  weight: number;
  isCustomizable: boolean;
  allowPartialPurchase: boolean;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  priority: number;
}

const str = (v: unknown) => (v == null ? "" : String(v));

export function mapGiftProductsToForm(
  products: IFetchGift["products"] | undefined
): GiftProductFormRow[] {
  if (!products?.length) {
    return [
      { product: "", quantity: 1, isOptional: false, alternativeProducts: [] },
    ];
  }

  return products.map((p) => ({
    product: extractProductId(p.product) || "",
    quantity: Number(p.quantity) || 1,
    isOptional: Boolean(p.isOptional),
    alternativeProducts: (p.alternativeProducts || [])
      .map((alt) => extractProductId(alt) || "")
      .filter(Boolean),
  }));
}

export function mapGiftToFormData(gift: IFetchGift): GiftFormValues {
  const visibleAsRaw = gift.visibleAs;
  const visibleAs = Array.isArray(visibleAsRaw)
    ? visibleAsRaw[0] || ""
    : str(visibleAsRaw);

  return {
    name: str(gift.name),
    description: str(gift.description),
    type: gift.type || "gift",
    pricingType: gift.pricingType || "calculated",
    fixedPrice: Number(gift.fixedPrice) || 0,
    discountPercentage: Number(gift.discountPercentage) || 0,
    discountAmount: Number(gift.discountAmount) || 0,
    category: str(gift.category),
    setCategory: str(gift.setCategory),
    occasion: str(gift.occasion),
    setType: (gift.setType || "") as GiftFormValues["setType"],
    setTheme: str(gift.setTheme),
    metalType: str(gift.metalType),
    stoneType: str(gift.stoneType),
    tags: Array.isArray(gift.tags) ? gift.tags.join(", ") : str(gift.tags),
    isActive: gift.isActive ?? true,
    isAvailable: gift.isAvailable ?? true,
    stockType: gift.stockType || "unlimited",
    totalStock: Number(gift.totalStock) || 0,
    featuredImage: str(gift.featuredImage),
    slug: str(gift.slug),
    visibleAs,
    weight: Number(gift.weight) || 0,
    isCustomizable: gift.isCustomizable ?? false,
    allowPartialPurchase: gift.allowPartialPurchase ?? false,
    minimumOrderQuantity: Number(gift.minimumOrderQuantity) || 1,
    maximumOrderQuantity: Number(gift.maximumOrderQuantity) || 100,
    priority: Number(gift.priority) || 1,
  };
}
