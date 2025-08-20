import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useMultiPageForm } from '../MultiPageFormContext';
import {
  useGetAllProductsQuery,
  IFetchProduct,
  useGetAllProductCategoriesQuery,
  IFetchCategory,
} from '../../../../server/api/productHooks';
import { usePreviewCollectionProductsMutation } from '../../../../server/api/collectionHooks';
import { InputField } from '../InputField';
import { DropdownField } from '../Dropdown';
import { MatchingProductsList, MatchingProduct } from '../MatchingProductsList';

// Reusable Selectable Product Card Component
interface SelectableProductCardProps {
  product: IFetchProduct;
  isSelected: boolean;
  onToggle: (productId: string) => void;
  mode?: 'manual' | 'hybrid';
  isAutomatic?: boolean;
  isExcluded?: boolean;
}

const SelectableProductCard: React.FC<SelectableProductCardProps> = ({
  product,
  isSelected,
  onToggle,
  mode = 'manual',
  isAutomatic = false,
  isExcluded = false,
}) => {
  const getCardStyle = () => {
    if (mode === 'hybrid') {
      if (isAutomatic && isExcluded) {
        return 'border-red-300 bg-red-50'; // Excluded automatic product
      } else if (isAutomatic) {
        return 'border-blue-300 bg-blue-50'; // Included automatic product
      } else if (isSelected) {
        return 'border-[#DF8D28] bg-[#DF8D28]/5'; // Manually selected product
      }
    } else if (isSelected) {
      return 'border-[#DF8D28] bg-[#DF8D28]/5'; // Manual mode selected
    }
    return 'border-gray-200 hover:border-gray-300'; // Default
  };

  const getStatusIcon = () => {
    if (mode === 'hybrid') {
      if (isAutomatic && isExcluded) {
        return (
          <Icon
            icon="material-symbols:remove-circle"
            className="w-4 h-4 text-red-600"
          />
        );
      } else if (isAutomatic) {
        return (
          <Icon
            icon="material-symbols:auto-awesome"
            className="w-4 h-4 text-blue-600"
          />
        );
      } else if (isSelected) {
        return (
          <Icon
            icon="material-symbols:add-circle"
            className="w-4 h-4 text-orange-600"
          />
        );
      }
    }
    return null;
  };

  return (
    <div
      className={`border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${getCardStyle()}`}
      onClick={() => onToggle(product._id)}
    >
      {/* Selection Checkbox */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === 'hybrid' && isAutomatic ? (
            // For automatic products in hybrid mode, show exclude/include toggle
            <input
              type="checkbox"
              checked={!isExcluded}
              onChange={() => onToggle(product._id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            // For manual products, show standard selection
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(product._id)}
              className="w-4 h-4 text-customorange border-gray-300 rounded focus:ring-customorange"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <span className="text-sm font-medium  text-gray-900 truncate">
            {product.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {/* <span className="text-xs text-gray-500">
            Rs. {get(product, 'variants[0].price', 0).toFixed(2)}
          </span> */}
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={`
      ${import.meta.env.VITE_API_IMAGE_BASE_URL}${product.images[0]}
              `}
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
        <p className="text-sm text-gray-600 mb-1">{product.category?.name}</p>
        {product.variants && product.variants.length > 0 && (
          <p className="text-sm font-semibold text-gray-900">
            Rs. {product.variants[0].price}
          </p>
        )}

        {/* Status Badge for Hybrid Mode */}
        {mode === 'hybrid' && (
          <div className="mt-2">
            {isAutomatic && isExcluded ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                <Icon
                  icon="material-symbols:remove-circle"
                  className="w-3 h-3"
                />
                Excluded
              </span>
            ) : isAutomatic ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                <Icon
                  icon="material-symbols:auto-awesome"
                  className="w-3 h-3"
                />
                Auto-included
              </span>
            ) : isSelected ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                <Icon icon="material-symbols:add-circle" className="w-3 h-3" />
                Manually added
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                Available
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductSelectionPage: React.FC = () => {
  const { formData, updateFormData } = useMultiPageForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    formData.selectedProducts || []
  );

  // State for hybrid mode - automatically matched products
  const [automaticProducts, setAutomaticProducts] = useState<MatchingProduct[]>(
    []
  );
  const [totalAutomaticCount, setTotalAutomaticCount] = useState(0);
  const [excludedProducts, setExcludedProducts] = useState<string[]>(
    formData.conditions?.excludedProductIds?.map((id) => id.toString()) || []
  );

  // API hooks
  const previewProductsMutation = usePreviewCollectionProductsMutation();

  // Fetch products and categories
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProductsQuery();
  const products = productsData?.products || [];
  const { data: categories = [] } = useGetAllProductCategoriesQuery();

  // Fetch automatic products for hybrid mode
  useEffect(() => {
    if (
      formData.collectionMode === 'hybrid' &&
      formData.conditions?.groups?.length > 0
    ) {
      previewProductsMutation.mutate(
        {
          conditions: formData.conditions,
        },
        {
          onSuccess: (data) => {
            setAutomaticProducts(data?.previewProducts || []);
            setTotalAutomaticCount(data?.totalCount || 0);
          },
          onError: (error) => {
            console.error('Error fetching automatic products:', error);
            setAutomaticProducts([]);
            setTotalAutomaticCount(0);
          },
        }
      );
    }
  }, [formData.collectionMode, formData.conditions]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: IFetchProduct) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory || product.category?._id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Category options for dropdown
  const categoryOptions = useMemo(() => {
    const options = [{ value: '', label: 'All Categories' }];
    categories.forEach((category: IFetchCategory) => {
      options.push({ value: category._id, label: category.name });
    });
    return options;
  }, [categories]);

  // Handle product selection
  const handleProductToggle = (productId: string) => {
    if (formData.collectionMode === 'hybrid') {
      // In hybrid mode, handle manual additions and exclusions
      const isAutomaticProduct = automaticProducts.some(
        (p) => p._id === productId
      );

      if (isAutomaticProduct) {
        // This is an automatic product, toggle exclusion
        const newExcludedProducts = excludedProducts.includes(productId)
          ? excludedProducts.filter((id) => id !== productId)
          : [...excludedProducts, productId];

        setExcludedProducts(newExcludedProducts);
        updateFormData({
          conditions: {
            ...formData.conditions,
            excludedProductIds: newExcludedProducts,
          },
        });
      } else {
        // This is a manual product, toggle manual selection
        const newSelectedProducts = selectedProducts.includes(productId)
          ? selectedProducts.filter((id) => id !== productId)
          : [...selectedProducts, productId];

        setSelectedProducts(newSelectedProducts);
        updateFormData({
          selectedProducts: newSelectedProducts,
          conditions: {
            ...formData.conditions,
            manualProductIds: newSelectedProducts,
          },
        });
      }
    } else {
      // Manual mode - standard selection
      const newSelectedProducts = selectedProducts.includes(productId)
        ? selectedProducts.filter((id) => id !== productId)
        : [...selectedProducts, productId];

      setSelectedProducts(newSelectedProducts);
      updateFormData({ selectedProducts: newSelectedProducts });
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const allProductIds = filteredProducts.map(
      (product: IFetchProduct) => product._id
    );
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
          <h2 className="text-xl font-bold text-gray-900">
            {formData.collectionMode === 'hybrid'
              ? 'Manage Products'
              : 'Select Products'}
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          {formData.collectionMode === 'hybrid'
            ? 'Your collection automatically includes products matching your rules. You can manually add more products or exclude automatic ones.'
            : 'Choose which products to include in this manual collection. You can search and filter to find specific products.'}
        </p>
      </div>

      {/* Automatic Products Section for Hybrid Mode */}
      {formData.collectionMode === 'hybrid' && (
        <div className="bg-blue-50 rounded-xl border border-blue-200">
          <div className="p-4 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <Icon
                icon="material-symbols:auto-awesome"
                className="w-5 h-5 text-blue-600"
              />
              <h3 className="font-semibold text-blue-900">
                Automatically Included Products
              </h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {totalAutomaticCount} products
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              These products match your collection rules. Click to exclude
              specific products.
            </p>
          </div>

          <MatchingProductsList
            products={automaticProducts}
            totalCount={totalAutomaticCount}
            isLoading={previewProductsMutation.isPending}
            error={previewProductsMutation.error?.message}
          />
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        {formData.collectionMode === 'hybrid' && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Add More Products Manually
            </h3>
            <p className="text-sm text-gray-600">
              Search and select additional products to include in your
              collection.
            </p>
          </div>
        )}
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
              className={`text-sm ${
                selectedProducts.length === filteredProducts.length
                  ? 'text-customorange cursor-not-allowed'
                  : 'text-black hover:text-orange-600'
              } font-medium`}
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
            {selectedProducts.length} of {filteredProducts.length} products
            selected
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
            <p className="text-gray-600">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product: IFetchProduct) => {
                const isAutomatic = automaticProducts.some(
                  (p) => p._id === product._id
                );
                const isExcluded = excludedProducts.includes(product._id);

                return (
                  <SelectableProductCard
                    key={product._id}
                    product={product}
                    isSelected={selectedProducts.includes(product._id)}
                    onToggle={handleProductToggle}
                    mode={formData.collectionMode as 'manual' | 'hybrid'}
                    isAutomatic={isAutomatic}
                    isExcluded={isExcluded}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {(selectedProducts.length > 0 ||
        (formData.collectionMode === 'hybrid' && totalAutomaticCount > 0)) && (
        <div className="bg-[#DF8D28]/10 rounded-xl p-6 border border-[#DF8D28]/20">
          <div className="flex items-center gap-3">
            <Icon
              icon="material-symbols:check-circle"
              className="w-6 h-6 text-[#DF8D28]"
            />
            <div>
              {formData.collectionMode === 'hybrid' ? (
                <>
                  <h4 className="font-semibold text-gray-900">
                    Collection Summary
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      • {totalAutomaticCount - excludedProducts.length}{' '}
                      automatically included products
                    </p>
                    <p>• {selectedProducts.length} manually added products</p>
                    <p>• {excludedProducts.length} excluded products</p>
                    <p className="font-medium">
                      Total:{' '}
                      {totalAutomaticCount -
                        excludedProducts.length +
                        selectedProducts.length}{' '}
                      products
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-900">
                    {selectedProducts.length} Product
                    {selectedProducts.length !== 1 ? 's' : ''} Selected
                  </h4>
                  <p className="text-sm text-gray-600">
                    These products will be added to your collection when you
                    create it.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
