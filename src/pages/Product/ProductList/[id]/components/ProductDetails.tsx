import { get } from "lodash";
import { IFetchProduct } from "../../../../../server/api/productHooks";
import { DropdownSection } from "./DropDownSection";

interface ProductDetailsProps {
  product: IFetchProduct;
}
export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const specifications = {
    Length: get(product, "length", 0),
    "Clasp Type": get(product, "claspType.name", "-"),
    "Rhodoum Finishes": get(product, "rhodoumFinishes", "false"),
  };
  const natural = {
    Shape: get(product, "shape",'-'),
    Color: get(product, "color",'-'),
    Quantity: get(product, "quantity",'-'),
    Clarity: get(product, "clarity",'-'),
  };
//   const inventory = {
//  "Stock QTY":get(product, ''), "Reorder Level":""
//   }
// const invetories = product.variant.map(item=>({}))

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
            className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded"
          >
            #{tag.replace(/\s+/g, "")}
          </span>
        ))}
      </div>
      {product.variant.length > 0 &&
        product.variant.map((item) => (
          <div className="flex items-center gap-3 py-2">
            <span className="font-bold text-gray-900 text-md">
              {`${item?.wt} ${item?.unit}`}
            </span>
            <span className="text-gray-500 text-md">{`$ ${item?.price}`}</span>
          </div>
        ))}
 {/* <Inventory inventory={inventory} />  */}
      <DropdownSection title="Specifications" data={specifications} />
      <DropdownSection
        title="Natural Gold Information"
        data={natural}
      />
    </div>
  );
};
