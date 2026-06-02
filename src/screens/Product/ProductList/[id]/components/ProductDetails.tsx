import { get } from "lodash";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IFetchProduct } from "../../../../../server/api/productHooks";
import { DropdownSection } from "./DropDownSection";
import { ReviewsSection } from "./ReviewSection";

const MM_PER_INCH = 25.4;

// Type for product variant
interface ProductVariant {
  price: number;
  wt: number;
  unit: string;
  sku?: string;
  isActive?: boolean;
}

// Type for stones
interface ProductStone {
  name: string;
  weight: string;
  price: string;
  color: string;
}

// Type for other charges
interface OtherCharge {
  name: string;
  value: number;
}

// Type for wastage
interface Wastage {
  type: "fixed" | "per";
  value: number;
}

interface ProductDetailsProps {
  review?: any;
  product: IFetchProduct & {
    productType?: string;
    gender?: string;
    wastage?: Wastage;
    stones?: ProductStone[];
    others?: OtherCharge[];
    isFeatured?: boolean;
  };
}
export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  review,
}) => {
  // Add safety checks for product data
  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
        <Icon
          icon="mdi:package-variant-closed"
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
        />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Product data not available
        </h3>
        <p className="text-sm text-gray-500">
          Please try refreshing the page or contact support.
        </p>
      </div>
    );
  }

  // Organize data into logical sections
  const basicInfo = {
    "Product Type": get(product, "productType", "gold"),
    Category: get(product, "category.name", "-"),
    "Sub Category": get(product, "subCategory.name", "-"),
    "Visible As": get(product, "visibleAs", "normal"),
  };

  // Get stones data first
  const stones = get(product, "stones", []);

  // Check product type
  const productType = (
    get(product, "productType", "gold") || "gold"
  ).toLowerCase();
  const isNormalProduct = productType === "normal";
  const isGoldOrSilver = productType === "gold" || productType === "silver";
  const hasGemstones = stones && stones.length > 0;
  const hasTotalCarat = get(product, "totalCarat", 0) > 0;
  const isGemstoneProduct =
    hasGemstones ||
    hasTotalCarat ||
    get(product, "color") ||
    get(product, "clarity");

  // For normal products, show simplified view
  if (isNormalProduct) {
    return (
      <div className="space-y-3 col-span-2">
        {/* Compact Header for Normal Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-800">
                  {get(product, "name", "Untitled Product")}
                </h1>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    get(product, "isActive", true)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {get(product, "isActive", true) ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-blue-600">
                  <Icon
                    icon="mdi:package-variant"
                    className="w-4 h-4 inline mr-1"
                  />
                  Normal Product
                </span>
                <span className="text-gray-600">
                  <Icon icon="mdi:tag" className="w-4 h-4 inline mr-1" />
                  {get(product, "category.name", "Uncategorized")}
                </span>
              </div>
            </div>
            {/* Inline Price Display */}
            {get(product, "variant[0].price") && (
              <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg font-bold">
                Rs.{" "}
                {(get(product, "variant[0].price", 0) || 0).toLocaleString()}
              </div>
            )}
          </div>

          {/* Compact Description */}
          {get(product, "description") && (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words">
              {get(product, "description")}
            </p>
          )}
        </div>
        <ReviewsSection product={product} reviews={review} />
      </div>
    );
  }

  // Build specifications conditionally
  const specifications: { [key: string]: string } = {
    "Making Charges": get(product, "makingCharges", 0)
      ? `Rs ${(get(product, "makingCharges.value", 0) || 0).toLocaleString()}`
      : "Rs 0",
    "Rhodoum Finishes": get(product, "rhodoumFinishes", false) ? "Yes" : "No",
  };

  // Add length if available
  if (get(product, "length", 0)) {
    const mm = Number(get(product, "length", 0) || 0);
    specifications["Length"] = `${(mm / MM_PER_INCH).toFixed(2)} in`;
  }

  // Add dimension if available
  if (get(product, "dimension", 0)) {
    const mm = Number(get(product, "dimension", 0) || 0);
    specifications["Dimension"] = `${(mm / MM_PER_INCH).toFixed(2)} in`;
  }

  // Add clasp type only for jewelry items (not for loose stones/gems)
  if (get(product, "claspType.name") && !isGemstoneProduct) {
    specifications["Clasp Type"] = get(product, "claspType.name", "-");
  }

  // Add shape only for gemstone products
  if (get(product, "shape") && isGemstoneProduct) {
    specifications["Shape"] = get(product, "shape", "-");
  }

  // Build gemstone info conditionally - only show if it's actually a gemstone product
  const gemstoneInfo: { [key: string]: string } = {};

  if (isGemstoneProduct) {
    if (isGoldOrSilver && hasTotalCarat) {
      // For gold/silver with gemstones, show karat
      gemstoneInfo["Total Karat"] = `${get(product, "totalCarat", 0) || 0} kt`;
    } else if (hasTotalCarat) {
      // For pure gemstones, show carat
      gemstoneInfo["Total Carat"] = `${get(product, "totalCarat", 0) || 0} ct`;
    }

    if (get(product, "color")) {
      gemstoneInfo["Color"] = get(product, "color", "-");
    }

    if (get(product, "clarity")) {
      gemstoneInfo["Clarity"] = get(product, "clarity", "-");
    }

    if (get(product, "quantity", 0)) {
      const quantity = get(product, "quantity", 0);
      gemstoneInfo["Quantity"] = quantity ? quantity.toString() : "0";
    }
  }

  // Get wastage info
  const wastageInfo = get(product, "wastage");
  const wastageDisplay =
    wastageInfo && wastageInfo.value !== undefined && wastageInfo.type
      ? `${wastageInfo.value}${wastageInfo.type === "per" ? "%" : " (flat)"}`
      : "-";

  // Get other charges
  const otherCharges = get(product, "others", []) as OtherCharge[];

  return (
    <div className="space-y-4 col-span-2">
      {/* Compact Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-800">
                {get(product, "name", "Untitled Product")}
              </h1>
              <div className="flex gap-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    get(product, "isActive", true)
                      ? "bg-green text-white"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {get(product, "isActive", true) ? "Active" : "Inactive"}
                </span>
                {get(product, "isFeatured", false) && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    <Icon icon="mdi:star" className="w-3 h-3 inline mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-amber-600">
                <Icon icon="mdi:tag" className="w-4 h-4 inline mr-1" />
                {get(product, "category.name", "Uncategorized")}
              </span>
              {get(product, "subCategory.name") && (
                <span className="text-gray-600">
                  <Icon
                    icon="mdi:tag-outline"
                    className="w-4 h-4 inline mr-1"
                  />
                  {get(product, "subCategory.name")}
                </span>
              )}
              <span className="text-gray-600 capitalize">
                <Icon icon="mdi:account" className="w-4 h-4 inline mr-1" />
                {get(product, "gender", "unisex")}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Description */}
        {get(product, "description") && (
          <p className="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-line break-words">
            {get(product, "description")}
          </p>
        )}

        {/* Compact Tags and Wastage in same row */}
        <div className="flex items-center justify-between gap-4">
          {/* Tags */}
          {product.tags &&
            Array.isArray(product.tags) &&
            product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 10).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full"
                  >
                    #
                    {tag && typeof tag === "string"
                      ? tag.replace(/\s+/g, "")
                      : "tag"}
                  </span>
                ))}
                {/* {product.tags.length > 4 && (
                  <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    +{product.tags.length - 4}
                  </span>
                )} */}
              </div>
            )}

          {/* Wastage Info */}
          {wastageDisplay !== "-" && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Icon
                icon="mdi:information"
                className="w-4 h-4 text-yellow-600"
              />
              <span className="text-xs font-medium text-yellow-800">
                Wastage: {wastageDisplay}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Compact Variants Section */}
      {get(product, "variant", []) &&
        get(product, "variant", []).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Variants
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {get(product, "variant", []).length}
                </span>
              </h3>
            </div>
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {get(product, "variant", []).map(
                (item: ProductVariant, index: number) => (
                  <div
                    key={item?.sku || `variant-${index}`}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
                  >
                    {/* Compact Price and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg text-base font-bold">
                          Rs. {item?.price?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {item?.wt || 0}{" "}
                          <span className="text-xs text-gray-600">
                            {item?.unit || "units"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            get(item, "isActive", true)
                              ? "bg-green text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {get(item, "isActive", true) ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Compact Stones Section */}
      {stones && stones.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Icon
                icon="mdi:diamond-stone"
                className="w-4 h-4 text-purple-600"
              />
              Stones & Gems
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {stones.length}
              </span>
            </h3>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {stones.map((stone: ProductStone, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 capitalize text-sm">
                      {stone.name || "Unnamed Stone"}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {stone.color || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">
                      Weight:{" "}
                      <span className="font-medium text-gray-900">
                        {stone.weight
                          ? stone.weight.toString().concat(" Carat")
                          : "N/A"}
                      </span>
                    </span>
                    <span className="font-medium text-green-600">
                      Rs. {stone.price || "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compact Other Charges Section */}
      {otherCharges && otherCharges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Icon icon="mdi:receipt" className="w-4 h-4 text-green-600" />
              Additional Charges
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {otherCharges.length}
              </span>
            </h3>
          </div>
          <div className="p-3">
            <div className="space-y-2">
              {otherCharges.map((charge: OtherCharge, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 capitalize text-sm">
                      {charge.name || "Unnamed Charge"}
                    </span>
                    <span className="font-bold text-green-600 text-sm">
                      Rs. {(charge.value || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800 text-sm">
                  Total Additional Charges:
                </span>
                <span className="font-bold text-base text-green-600">
                  Rs.
                  {otherCharges
                    .reduce(
                      (sum: number, charge: OtherCharge) =>
                        sum + (charge.value || 0),
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        <DropdownSection
          title="Basic Information"
          data={basicInfo}
          className=""
        />
        <DropdownSection title="Specifications" data={specifications} />
      </div>

      {/* Gemstone Information - Only show if it's a gemstone product */}
      {isGemstoneProduct && Object.keys(gemstoneInfo).length > 0 && (
        <DropdownSection
          title={`${
            isGoldOrSilver ? "Gold/Silver with Gemstone" : "Gemstone"
          } Information`}
          data={gemstoneInfo}
        />
      )}
    </div>
  );
};
