import { get } from "lodash";
import { IFetchProduct } from "../../../../../server/api/productHooks";
import { DropdownSection } from "./DropDownSection";
import { Inventory } from "./Inventory";

interface ProductDetailsProps {
  product: IFetchProduct;
}
export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Helper function to filter out empty values
  const filterEmptyValues = (
    obj: Record<string, string | number | boolean | null>
  ) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
        return (
          value !== null &&
          value !== undefined &&
          value !== "-" &&
          value !== "" &&
          value !== 0 &&
          value !== "false" &&
          String(value).trim() !== ""
        );
      })
    );
  };

  const rawSpecifications = {
    Length: get(product, "length", null),
    "Clasp Type": get(product, "claspType.name", null),
    "Rhodoum Finishes": get(product, "rhodoumFinishes", false) ? "Yes" : null,
  };

  const rawNatural = {
    Shape: get(product, "shape", null),
    Color: get(product, "color", null),
    Quantity: get(product, "quantity", null),
    Clarity: get(product, "clarity", null),
  };

  const specifications = filterEmptyValues(rawSpecifications);
  const natural = filterEmptyValues(rawNatural);
  //   const inventory = {
  //  "Stock QTY":get(product, ''), "Reorder Level":""
  //   }
  const inventories = product.variant.map((item) => ({
    Weight: `${get(item, "wt", 0)} ${get(item, "unit", "")}`,
    "Stock Qty": get(item, "remainingStock", 0),
    "Reorder Level": get(item, "reorderPoint", 0),
  }));

  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-sm">
      {/* Product Header */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">
            {get(product, "name", "Untitled Product")}
          </h1>
          {get(product, "status") && (
            <span className="px-2 py-1 text-xs font-medium text-white rounded-full bg-amber-500">
              {get(product, "status")}
            </span>
          )}
        </div>
        {get(product, "category.name") && (
          <p className="text-sm font-semibold text-amber-600">
            {get(product, "category.name")}
          </p>
        )}
      </div>

      {/* Product Description */}
      {get(product, "description") && get(product, "description") !== "-" && (
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-700">{get(product, "description")}</p>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              #{tag.replace(/\s+/g, "")}
            </span>
          ))}
        </div>
      )}

      {/* Product Variants */}
      {product.variant.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Price Variants
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {product.variant.map((item, index) => (
              <div
                key={index}
                className="min-w-24 flex flex-col bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-900 text-center font-bold text-sm">{`$${item?.price}`}</span>
                <span className="text-gray-600 text-xs font-medium text-center">
                  {`${item?.wt} ${item?.unit}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory */}
      <Inventory inventory={inventories} />

      {/* Specifications - Only show if there's data */}
      {Object.keys(specifications).length > 0 && (
        <DropdownSection title="Specifications" data={specifications} />
      )}

      {/* Natural Gold Information - Only show if there's data */}
      {Object.keys(natural).length > 0 && (
        <DropdownSection title="Natural Gold Information" data={natural} />
      )}
    </div>
  );
};
