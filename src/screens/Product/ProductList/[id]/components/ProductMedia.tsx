import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { IFetchProduct } from "@/server/api/productHooks";
import { ProductImage } from "./ProductImage";
import { ProductVideo } from "./ProductVideo";

interface ProductMediaProps {
  images: string[];
  product?: IFetchProduct;
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  images,
  product,
}) => {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");

  const hasVideos = product?.video && product.video.length > 0;
  const hasImages = images && images.length > 0;

  // If no videos, only show images
  if (!hasVideos) {
    return (
      <div className="w-full max-w-md">
        <ProductImage images={images} product={product} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Tab Navigation */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("images")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
            activeTab === "images"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}>
          <Icon icon="mdi:image-multiple" className="w-4 h-4" />
          Images ({images.length})
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
            activeTab === "videos"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}>
          <Icon icon="mdi:video" className="w-4 h-4" />
          Videos ({product?.video?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "images" && (
          <div className="animate-fadeIn">
            <ProductImage images={images} product={product} />
          </div>
        )}

        {activeTab === "videos" && (
          <div className="animate-fadeIn">
            <ProductVideo product={product} />
          </div>
        )}
      </div>
    </div>
  );
};
