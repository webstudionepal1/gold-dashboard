import { Icon } from "@iconify/react/dist/iconify.js";
import ArrowIcon from "./ArrowIcon";
import { IFetchProduct } from "../../../../server/api/productHooks";
import get from "lodash/get";
interface propTypes {
  productList: IFetchProduct[];
  handleCardClick: (product: IFetchProduct) => void;
}

export const ProductGridView = ({
  productList,
  handleCardClick,
}: propTypes) => {
  return (
    <div className="grid w-auto grid-cols-4 gap-3">
      {productList.map((product) => (
        <div
          key={product._id}
          className="flex flex-col overflow-hidden transition-shadow bg-white rounded-sm cursor-pointer h-80 hover:shadow-md"
          onClick={() => handleCardClick(product)}>
          <div className="flex justify-between my-4">
            <div className="flex flex-col gap-6">
              <ArrowIcon />
            </div>
            <span className="px-2 py-1 text-xs font-medium text-white rounded-sm bg-lightbrown">
              Sale
            </span>
          </div>
          <img
            src={get(product, "images[0]", '"/placeholder.svg"')}
            alt={"image"}
            className="object-contain w-auto h-auto"
          />
          <span className="text-sm font-medium text-brown bg-brown bg-opacity-'status bg-opacity-40 flex justify-center">
            {get(product, "category.name", "-")}
          </span>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="font-medium text-black text-md">
              {get(product, "title", "-")}
            </h3>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  icon={
                    i < (product?.averageRating || 0)
                      ? "mdi:star"
                      : "mdi:star-outline"
                  }
                  className={`w-4 h-4 ${
                    i < (product?.averageRating || 0)
                      ? "text-yellow"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-lg font-bold">
              ${get(product, "variants[0].price", 0).toFixed(2)}
            </span>
            {/* {product.onSale && (
              <span className="text-[#C2BDBA] line-through text-sm">
                ${product.originalPrice.toFixed(2)}
              </span>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
};
