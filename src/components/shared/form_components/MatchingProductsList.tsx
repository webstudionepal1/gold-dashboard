import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export interface MatchingProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  variants: Array<{
    price: number;
  }>;
}

interface MatchingProductsListProps {
  products: MatchingProduct[];
  totalCount: number;
  isLoading: boolean;
  error?: string | null;
}

export const MatchingProductsList: React.FC<MatchingProductsListProps> = ({
  products,
  totalCount,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Icon
            icon="eos-icons:loading"
            className="w-8 h-8 text-blue-500 animate-spin"
          />
          <span className="ml-2 text-gray-600">
            Loading matching products...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center justify-center py-8 text-red-600">
          <Icon
            icon="material-symbols:error-outline"
            className="w-6 h-6 mr-2"
          />
          <span>Error loading products: {error}</span>
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <Icon
            icon="material-symbols:inventory-2-outline"
            className="w-12 h-12 mx-auto mb-2 opacity-50"
          />
          <p className="text-lg font-medium mb-1">No matching products found</p>
          <p className="text-sm">
            Try adjusting your conditions to match more products.
          </p>
        </div>
      </div>
    );
  }

  const getLowestPrice = (variants: Array<{ price: number }>) => {
    if (!variants || variants.length === 0) return 0;
    return Math.min(...variants.map((v) => v.price));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon
              icon="material-symbols:check-circle"
              className="w-5 h-5 text-green-600"
            />
            Matching Products
          </h4>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {totalCount} {totalCount === 1 ? "product" : "products"}
            </span>
            {totalCount > products.length && (
              <span className="text-sm text-gray-600">
                (showing first {products.length})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      icon="material-symbols:image-outline"
                      className="w-12 h-12 text-gray-400"
                    />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h5 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    ${getLowestPrice(product.variants).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.variants?.length || 0} variant
                    {product.variants?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more indicator */}
        {totalCount > products.length && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <Icon icon="material-symbols:more-horiz" className="w-4 h-4" />
              <span>
                And {totalCount - products.length} more product
                {totalCount - products.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
