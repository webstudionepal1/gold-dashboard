import { get } from "lodash";
import { IFetchProduct } from "../../../../../server/api/productHooks";
import { DropdownSection } from "./DropDownSection";
import { ReviewsSection } from "./ReviewSection";
import { useGetAllReviews } from "../../../../../server/api/reviewHooks";
import { Inventory } from "./Inventory";

interface ProductDetailsProps {
  product: IFetchProduct;
}
export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Add safety checks for product data
  if (!product) {
    return (
      <div className="p-4 text-center text-gray-500">
        Product data not available
      </div>
    );
  }

  const specifications = {
    Length: get(product, "length", 0),
    "Clasp Type": get(product, "claspType.name", "-"),
    "Rhodoum Finishes": get(product, "rhodoumFinishes", "false"),
  };
  const natural = {
    Shape: get(product, "shape", "-"),
    Color: get(product, "color", "-"),
    Quantity: get(product, "quantity", "-"),
    Clarity: get(product, "clarity", "-"),
  };
  //   const inventory = {
  //  "Stock QTY":get(product, ''), "Reorder Level":""
  //   }
  const inventories = (product.variant || []).map((item) => ({
    Weight: `${get(item, "wt", 0)} ${get(item, "unit", "")}`,
    "Stock Qty": get(item, "remainingStock", 0),
    "Reorder Level": get(item, "reorderPoint", 0),
  }));

  return (
    <div className="p-4 space-y-4 bg-white rounded-md">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">
            {get(product, "name", "-")}
          </h1>
          <span className="px-2 py-1 text-xs text-white rounded bg-amber-500">
            {get(product, "status", "-")}
          </span>
        </div>
        <p className="text-sm font-semibold text-amber-500">
          {get(product, "category.name", "-")}
        </p>
      </div>
      <p className="text-xs text-gray-600">
        {get(product, "description", "-")}
      </p>
      <div className="flex gap-2">
        {product.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
            u #{tag.replace(/\s+/g, "")}
          </span>
        ))}
      </div>
      {product.variant && product.variant.length > 0 && (
        <div className="flex items-center gap-4">
          {product.variant.map((item:any) => (
            <div
              key={item?.sku || `variant-${item?.wt}-${item?.unit}`}
              className="w-28 flex flex-col bg-white border-2 p-4 rounded-lg py-2">
              <span className="text-gray-900 text-center font-semibold text-">{`$ ${item?.price} /-`}</span>
              <span className=" text-gray-500 text-xs font-bold text-center">
                {`${item?.wt} ${item?.unit}`}
              </span>
            </div>
          ))}
        </div>
      )}
      <Inventory inventory={inventories} />
      <DropdownSection title="Specifications" data={specifications} />
      <DropdownSection title="Natural Gold Information" data={natural} />
    </div>
  );
};
