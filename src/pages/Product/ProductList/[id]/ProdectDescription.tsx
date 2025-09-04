import React from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useGetProductById } from "../../../../server/api/productHooks";
import { ProductDetails } from "./components/ProductDetails";
import { ProductImage } from "./components/ProductImage";
import { ProductVideo } from "./components/ProductVideo";
import { ReviewsSection } from "./components/ReviewSection";
import { useGetAllReviews } from "../../../../server/api/reviewHooks";
import Header from "../../../../components/shared/table_heading/Header";
import get from "lodash/get";
const ProductDescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useGetProductById(id ?? "");
  const { data: review } = useGetAllReviews({ product: id ?? "" });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">
        Error loading product: {error as any}
      </div>
    );
  if (!product) return <div className="text-center">Product not found.</div>;

  const images = (product.images || []).map(
    (item) => `${import.meta.env.VITE_API_IMAGE_BASE_URL}${item}`
  );
  return (
    <div>
      <Header text="Product Description" />

      {/* Images and Videos side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="flex flex-col gap-4 bg-white p-2 rounded-lg border">
          <div className="">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Icon
                icon="mdi:image-multiple"
                className="w-5 h-5 text-blue-600"
              />
              Product Images ({images.length})
            </h3>
            <ProductImage images={images} product={product} />
          </div>
          <div className="">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:video" className="w-5 h-5 text-red-600" />
              Product Videos ({product?.video?.length || 0})
            </h3>
            <ProductVideo product={product} />
          </div>
        </div>
        <ProductDetails product={product} review={review} />
      </div>

      {review && get(product, "productType") !== "normal" && (
        <ReviewsSection product={product} reviews={review} />
      )}
    </div>
  );
};

export default ProductDescription;
