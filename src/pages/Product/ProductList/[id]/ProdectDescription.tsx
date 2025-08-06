import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../../server/api/productHooks";
import { ProductDetails } from "./components/ProductDetails";
import { ProductImage } from "./components/ProductImage";
import { ReviewsSection } from "./components/ReviewSection";
import { useGetAllReviews } from "../../../../server/api/reviewHooks";
import Header from "../../../../components/shared/table_heading/Header";

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
      <div className="space-y-6 overflow-y-auto">
        {/* Product Image - Smaller and at the top */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <ProductImage images={images} />
          </div>
        </div>
        {/* Product Details - Full width below image */}
        <ProductDetails product={product} />
      </div>
      {review && <ReviewsSection product={product} reviews={review} />}
    </div>
  );
};

export default ProductDescription;
