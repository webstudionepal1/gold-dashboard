import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../../server/api/productHooks";
import { ProductDetails } from "./components/ProductDetails";
import { ProductImage } from "./components/ProductImage";
import { ReviewsSection } from "./components/ReviewSection";

const ProductDescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductById(id ?? "");
  if (isLoading) return <div className="text-center">Loading...</div>;
  if (!product) return <div className="text-center">Product not found.</div>;
  const images = product.images.map(
    (item) => `${import.meta.env.VITE_API_IMAGE_BASE_URL}${item}`
  );
  console.log(images)
  return (
    <div className="container px-6 py-4 mx-auto">
      <h1 className="text-3xl font-bold">Product Description</h1>
      <div className="grid grid-cols-1 gap-4 mt-4 overflow-y-auto md:grid-cols-2">
        <ProductImage images={images} />
        <ProductDetails product={product} />
      </div>
      <ReviewsSection product={product} />
    </div>
  );
};

export default ProductDescription;
