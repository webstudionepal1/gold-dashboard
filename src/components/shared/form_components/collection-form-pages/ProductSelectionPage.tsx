import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMultiPageForm } from "../MultiPageFormContext";
import {
  useGetAllProductsQuery,
  IFetchProduct,
  useGetAllProductCategoriesQuery,
  IFetchCategory
} from "../../../../server/api/productHooks";
import { InputField } from "../InputField";
import { DropdownField } from "../Dropdown";
import { get } from "lodash";

// Reusable Selectable Product Card Component
interface SelectableProductCardProps {
  product: IFetchProduct;
  isSelected: boolean;
  onToggle: (productId: string) => void;
}

const SelectableProductCard: React.FC<SelectableProductCardProps> = ({
  product,
  isSelected,
  onToggle,
}) => {
  return (
    <div
      className={`border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-[#DF8D28] bg-[#DF8D28]/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onToggle(product._id)}
    >
      {/* Selection Checkbox */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(product._id)}
            className="w-4 h-4 text-customorange border-gray-300 rounded focus:ring-customorange"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={get(product, "images[0]", "/placeholder.svg")}
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
        <p className="text-sm text-gray-600 mb-1">
          {product.category?.name}
        </p>
        {product.variants && product.variants.length > 0 && (
          <p className="text-sm font-semibold text-gray-900">
            ${product.variants[0].price}
          </p>
        )}
      </div>
    </div>
  );
};

export const ProductSelectionPage: React.FC = () => {
  const { formData, updateFormData } = useMultiPageForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    formData.selectedProducts || []
  );

  // Fetch products and categories
  const { data: products = [], isLoading: isLoadingProducts } = useGetAllProductsQuery();
  const { data: categories = [] } = useGetAllProductCategoriesQuery();

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: IFetchProduct) => {
      const matchesSearch = !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory ||
        product.category?._id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Category options for dropdown
  const categoryOptions = useMemo(() => {
    const options = [{ value: "", label: "All Categories" }];
    categories.forEach((category: IFetchCategory) => {
      options.push({ value: category._id, label: category.name });
    });
    return options;
  }, [categories]);

  // Handle product selection
  const handleProductToggle = (productId: string) => {
    const newSelectedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];

    setSelectedProducts(newSelectedProducts);
    updateFormData({ selectedProducts: newSelectedProducts });
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const allProductIds = filteredProducts.map(product => product._id);
    setSelectedProducts(allProductIds);
    updateFormData({ selectedProducts: allProductIds });
  };

  const handleSelectNone = () => {
    setSelectedProducts([]);
    updateFormData({ selectedProducts: [] });
  };

  // Update form data when selectedProducts changes
  useEffect(() => {
    updateFormData({ selectedProducts });
  }, [selectedProducts, updateFormData]);

  if (isLoadingProducts) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DF8D28] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:inventory-2"
            className="w-6 h-6 text-customorange"
          />
          <h2 className="text-xl font-bold text-gray-900">Select Products</h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Choose which products to include in this manual collection. You can search and filter to find specific products.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField
            label="Search Products"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownField
            label="Filter by Category"
            firstInput="All Categories"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-customorange hover:text-orange-600 font-medium"
            >
              Select All ({filteredProducts.length})
            </button>
            <button
              type="button"
              onClick={handleSelectNone}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Select None
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {selectedProducts.length} of {filteredProducts.length} products selected
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-xl border border-gray-200">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Icon
              icon="material-symbols:inventory-2-outline"
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
            />
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product: IFetchProduct) => (
                <SelectableProductCard
                  key={product._id}
                  product={product}
                  isSelected={selectedProducts.includes(product._id)}
                  onToggle={handleProductToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {selectedProducts.length > 0 && (
        <div className="bg-[#DF8D28]/10 rounded-xl p-6 border border-[#DF8D28]/20">
          <div className="flex items-center gap-3">
            <Icon
              icon="material-symbols:check-circle"
              className="w-6 h-6 text-[#DF8D28]"
            />
            <div>
              <h4 className="font-semibold text-gray-900">
                {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''} Selected
              </h4>
              <p className="text-sm text-gray-600">
                These products will be added to your collection when you create it.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
