import React, { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus, X, Search } from "lucide-react";
import {
  useCreateGiftMutation,
  useUpdateGiftMutation,
  IFetchGift,
  ICreateGiftData,
} from "../../../server/api/giftHooks";
import { IFetchProduct } from "../../../server/api/productHooks";

interface GiftFormProps {
  gift?: IFetchGift;
  onSuccess: () => void;
  onCancel: () => void;
  products: IFetchProduct[];
}

interface GiftProductForm {
  product: string;
  quantity: number;
  isOptional: boolean;
  alternativeProducts: string[];
}

const GiftForm: React.FC<GiftFormProps> = ({ gift, onSuccess, onCancel, products }) => {
  const [selectedProducts, setSelectedProducts] = useState<GiftProductForm[]>(
    gift?.products?.map(p => ({
      product: p.product._id,
      quantity: p.quantity,
      isOptional: p.isOptional,
      alternativeProducts: p.alternativeProducts?.map(alt => alt._id) || []
    })) || [{ product: "", quantity: 1, isOptional: false, alternativeProducts: [] }]
  );
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState<number | null>(null);

  const createGiftMutation = useCreateGiftMutation();
  const updateGiftMutation = useUpdateGiftMutation();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const form = useForm({
    defaultValues: {
      name: gift?.name || "",
      description: gift?.description || "",
      type: gift?.type || "gift" as "gift" | "package",
      pricingType: gift?.pricingType || "calculated" as "fixed" | "calculated" | "discounted",
      fixedPrice: gift?.fixedPrice || 0,
      discountPercentage: gift?.discountPercentage || 0,
      discountAmount: gift?.discountAmount || 0,
      category: gift?.category || "",
      setCategory: gift?.setCategory || "",
      occasion: gift?.occasion || "",
      setType: gift?.setType || "" as "necklace_set" | "bridal_set" | "earring_set" | "bracelet_set" | "ring_set" | "custom" | "",
      setTheme: gift?.setTheme || "",
      metalType: gift?.metalType || "",
      stoneType: gift?.stoneType || "",
      tags: gift?.tags?.join(", ") || "",
      isActive: gift?.isActive ?? true,
      isAvailable: gift?.isAvailable ?? true,
      stockType: gift?.stockType || "unlimited" as "unlimited" | "limited" | "based_on_products",
      totalStock: gift?.totalStock || 0,
      featuredImage: gift?.featuredImage || "",
      slug: gift?.slug || "",
      visibleAs: gift?.visibleAs || "",
      weight: gift?.weight || 0,
      isCustomizable: gift?.isCustomizable ?? false,
      allowPartialPurchase: gift?.allowPartialPurchase ?? false,
      minimumOrderQuantity: gift?.minimumOrderQuantity || 1,
      maximumOrderQuantity: gift?.maximumOrderQuantity || 100,
      priority: gift?.priority || 1,
    },
    onSubmit: async ({ value }) => {
      try {
        const giftData: ICreateGiftData = {
          name: value.name,
          description: value.description,
          type: value.type,
          pricingType: value.pricingType,
          fixedPrice: value.fixedPrice || undefined,
          discountPercentage: value.discountPercentage || undefined,
          discountAmount: value.discountAmount || undefined,
          category: value.category || undefined,
          setCategory: value.setCategory || undefined,
          occasion: value.occasion || undefined,
          setType: value.setType || undefined,
          setTheme: value.setTheme || undefined,
          metalType: value.metalType || undefined,
          stoneType: value.stoneType || undefined,
          tags: value.tags ? value.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
          isActive: value.isActive,
          isAvailable: value.isAvailable,
          stockType: value.stockType,
          totalStock: value.totalStock || undefined,
          images: [],
          featuredImage: value.featuredImage || undefined,
          slug: value.slug || undefined,
          visibleAs: value.visibleAs,
          weight: value.weight || undefined,
          isCustomizable: value.isCustomizable,
          allowPartialPurchase: value.allowPartialPurchase,
          minimumOrderQuantity: value.minimumOrderQuantity || undefined,
          maximumOrderQuantity: value.maximumOrderQuantity || undefined,
          priority: value.priority,
          products: selectedProducts.filter(p => p.product).map(p => ({
            product: p.product,
            quantity: p.quantity,
            isOptional: p.isOptional,
            alternativeProducts: p.alternativeProducts.filter(Boolean)
          }))
        };

        if (gift) {
          await updateGiftMutation.mutateAsync({ id: gift._id, data: giftData });
        } else {
          await createGiftMutation.mutateAsync(giftData);
        }
        onSuccess();
      } catch (error) {
        console.error("Error saving gift:", error);
      }
    },
  });

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { product: "", quantity: 1, isOptional: false, alternativeProducts: [] }]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof GiftProductForm, value: string | number | boolean | string[]) => {
    const updated = [...selectedProducts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedProducts(updated);
  };

  const addAlternativeProduct = (productIndex: number, productId: string) => {
    const updated = [...selectedProducts];
    if (!updated[productIndex].alternativeProducts.includes(productId)) {
      updated[productIndex].alternativeProducts.push(productId);
      setSelectedProducts(updated);
    }
  };

  const removeAlternativeProduct = (productIndex: number, altProductId: string) => {
    const updated = [...selectedProducts];
    updated[productIndex].alternativeProducts = updated[productIndex].alternativeProducts.filter(id => id !== altProductId);
    setSelectedProducts(updated);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p._id === productId);
    return product?.name || "Unknown Product";
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => !value ? "Name is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gift Name *
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter gift name"
              />
              {field.state.meta.errors && (
                <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="type">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as "gift" | "package")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gift">Gift</option>
                <option value="package">Package</option>
              </select>
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="description">
        {(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter gift description"
            />
          </div>
        )}
      </form.Field>

      {/* Occasion and Set Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field name="occasion">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occasion
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select occasion</option>
                <option value="Wedding">Wedding</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Birthday">Birthday</option>
                <option value="Festival">Festival</option>
                <option value="Engagement">Engagement</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="setType">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Type
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as "necklace_set" | "bridal_set" | "earring_set" | "bracelet_set" | "ring_set" | "custom" | "")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select set type</option>
                <option value="necklace_set">Necklace Set</option>
                <option value="bridal_set">Bridal Set</option>
                <option value="earring_set">Earring Set</option>
                <option value="bracelet_set">Bracelet Set</option>
                <option value="ring_set">Ring Set</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          )}
        </form.Field>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Products</h3>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="space-y-4">
          {selectedProducts.map((selectedProduct, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Product {index + 1}</h4>
                {selectedProducts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Product Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedProduct.product ? getProductName(selectedProduct.product) : ""}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(index);
                      }}
                      onFocus={() => setShowProductDropdown(index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Search and select product"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  
                  {showProductDropdown === index && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => {
                            updateProduct(index, "product", product._id);
                            setShowProductDropdown(null);
                            setProductSearch("");
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category?.name || 'No Category'}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedProduct.quantity}
                    onChange={(e) => updateProduct(index, "quantity", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Optional */}
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProduct.isOptional}
                      onChange={(e) => updateProduct(index, "isOptional", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Optional Product</span>
                  </label>
                </div>
              </div>

              {/* Alternative Products */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternative Products
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedProduct.alternativeProducts.map((altProductId) => (
                    <span
                      key={altProductId}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                    >
                      {getProductName(altProductId)}
                      <button
                        type="button"
                        onClick={() => removeAlternativeProduct(index, altProductId)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addAlternativeProduct(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Add alternative product</option>
                  {products
                    .filter(p => p._id !== selectedProduct.product && !selectedProduct.alternativeProducts.includes(p._id))
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <form.Field name="discountPercentage">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={field.state.value}
                onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="priority">
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <input
                type="number"
                min="1"
                value={field.state.value}
                onChange={(e) => field.handleChange(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="visibleAs"
          validators={{
            onChange: ({ value }) => !value ? "Visible As is required" : undefined,
          }}
        >
          {(field) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visible As *
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select visibility</option>
                <option value="featured">Featured</option>
                <option value="bestsellers">Best Sellers</option>
                <option value="newarrivals">New Arrivals</option>
                <option value="recommended">Recommended</option>
                <option value="popular">Popular</option>
              </select>
              {field.state.meta.errors && (
                <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="flex items-center">
          <form.Field name="isActive">
            {(field) => (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            )}
          </form.Field>
        </div>
      </div>

      <form.Field name="tags">
        {(field) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., luxury, wedding, gold"
            />
          </div>
        )}
      </form.Field>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createGiftMutation.isPending || updateGiftMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createGiftMutation.isPending || updateGiftMutation.isPending
            ? "Saving..."
            : gift
            ? "Update Gift"
            : "Create Gift"}
        </button>
      </div>

      {/* Click outside to close dropdown */}
      {showProductDropdown !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowProductDropdown(null)}
        />
      )}
    </form>
  );
};

export default GiftForm;