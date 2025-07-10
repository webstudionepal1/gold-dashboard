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
  const { data: product, isLoading } = useGetProductById(id ?? "");
  const { data: review } = useGetAllReviews({ product: id ?? "" });
  if (isLoading) return <div className="text-center">Loading...</div>;
  if (!product) return <div className="text-center">Product not found.</div>;
  const images = product.images.map(
    (item) => `${import.meta.env.VITE_API_IMAGE_BASE_URL}${item}`
  );
  return (
    <div>
      <Header text="Product Description" />
      <div className="grid grid-cols-1 gap-4 mt-4 overflow-y-auto md:grid-cols-2">
        <ProductImage images={images} />
        <ProductDetails product={product} />
      </div>
      {review && <ReviewsSection product={product} reviews={review} />}
    </div>
  );
};

export default ProductDescription;
