import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useProductForm } from '../ProductFormContext';

export const ProductInventoryStatusPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  // Calculate total inventory across all variants
  const totalStock = formData.variants.reduce(
    (sum, variant) => sum + variant.totalStock,
    0
  );
  const totalUsedStock = formData.variants.reduce(
    (sum, variant) => sum + variant.usedStock,
    0
  );
  const totalRemainingStock = formData.variants.reduce(
    (sum, variant) => sum + variant.remainingStock,
    0
  );

  // Calculate pricing information
  const priceRange =
    formData.variants.length > 0
      ? {
          min: Math.min(...formData.variants.map((v) => v.price)),
          max: Math.max(...formData.variants.map((v) => v.price)),
        }
      : { min: 0, max: 0 };

  // Count active variants
  const activeVariants = formData.variants.filter((v) => v.isActive).length;

  // Validation functions
  const validateStatus = () => {
    const errors: string[] = [];

    // Featured products must be active
    if (formData.isFeatured && !formData.isActive) {
      errors.push('Featured products must be active');
    }

    // Must have at least one active variant if product is active
    if (formData.isActive && activeVariants === 0) {
      errors.push('Active products must have at least one active variant');
    }

    updateValidation('status', errors.length === 0, errors);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:inventory"
            className="w-6 h-6 text-customorange"
          />
          <h2 className="text-xl font-bold text-gray-900">Status & Review</h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Review your product details and configure final status settings.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Product Summary */}
        <div className=" bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:summarize"
              className="w-5 h-5 text-customorange"
            />
            Product Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:info"
                  className="w-4 h-4 text-customorange"
                />
                Basic Information
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Name:</strong> {formData.name || 'Not set'}
                </p>
                <p>
                  <strong>Category:</strong>{' '}
                  {formData.category ? 'Selected' : 'Not selected'}
                </p>
                <p>
                  <strong>Sub-category:</strong>{' '}
                  {formData.subCategory ? 'Selected' : 'Not selected'}
                </p>
                <p>
                  <strong>Description:</strong>{' '}
                  {formData.description
                    ? `${formData.description.length} characters`
                    : 'Not set'}
                </p>
              </div>
            </div>

            {/* Variants & Pricing */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:sell"
                  className="w-4 h-4 text-customorange"
                />
                Variants & Pricing
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Total Variants:</strong> {formData.variants.length}
                </p>
                <p>
                  <strong>Active Variants:</strong> {activeVariants}
                </p>
                <p>
                  <strong>Price Range:</strong>{' '}
                  {priceRange.min === priceRange.max
                    ? `$${priceRange.min}`
                    : `$${priceRange.min} - $${priceRange.max}`}
                </p>
                <p>
                  <strong>Making Charges:</strong> ${formData.makingCharges}
                </p>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:inventory"
                  className="w-4 h-4 text-customorange"
                />
                Inventory Status
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Total Stock:</strong> {totalStock}
                </p>
                <p>
                  <strong>Used Stock:</strong> {totalUsedStock}
                </p>
                <p>
                  <strong>Available:</strong> {totalRemainingStock}
                </p>
                <p
                  className={`font-medium ${
                    totalRemainingStock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <strong>Status:</strong>{' '}
                  {totalRemainingStock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Media & Content */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:image"
                  className="w-4 h-4 text-customorange"
                />
                Media & Content
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Images:</strong> {formData.images.length} uploaded
                </p>
                <p>
                  <strong>Stones:</strong> {(formData.stones || []).length}{' '}
                  configured
                </p>
                <p>
                  <strong>Occasions:</strong>{' '}
                  {(formData.occasions || []).length} selected
                </p>
                <p>
                  <strong>Tags:</strong> {formData.tags.length} added
                </p>
              </div>
            </div>

            {/* SEO & Marketing */}
            {/* <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:search"
                  className="w-4 h-4 text-customorange"
                />
                SEO & Marketing
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>SEO Title:</strong>{" "}
                  {formData.metadata?.seoTitle ? "Set" : "Using product name"}
                </p>
                <p>
                  <strong>SEO Description:</strong>{" "}
                  {formData.metadata?.seoDescription ? "Set" : "Not set"}
                </p>
                <p>
                  <strong>Visibility:</strong> {formData.visibleAs}
                </p>
                <p>
                  <strong>Keywords:</strong>{" "}
                  {(formData.metadata?.keywords || []).length} added
                </p>
              </div>
            </div> */}

            {/* Additional Info */}
            {/* <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:more-horiz"
                  className="w-4 h-4 text-customorange"
                />
                Additional Details
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Vendor:</strong>{" "}
                  {formData.metadata?.vendor || "Not set"}
                </p>
                <p>
                  <strong>Barcode:</strong>{" "}
                  {formData.metadata?.barcode || "Not set"}
                </p>
                <p>
                  <strong>Compare Price:</strong>{" "}
                  {formData.metadata?.compareAtPrice
                    ? `$${formData.metadata.compareAtPrice}`
                    : "Not set"}
                </p>
                <p>
                  <strong>Rhodium Finish:</strong>{" "}
                  {formData.rhodoumFinishes ? "Yes" : "No"}
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* Status Configuration */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:settings"
              className="w-5 h-5 text-[#DF8D28]"
            />
            Product Status Settings
          </h3>

          <div className="space-y-6">
            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label className="text-base font-medium text-gray-700">
                  Active Product
                </label>
                <p className="text-sm text-gray-500">
                  Make this product visible and available for purchase
                </p>
                {!formData.isActive && (
                  <p className="text-xs text-orange-600 mt-1">
                    Inactive products are hidden from customers
                  </p>
                )}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => {
                    updateFormData({ isActive: e.target.checked });
                    setTimeout(validateStatus, 0);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DF8D28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DF8D28]"></div>
              </label>
            </div>

            {/* Featured Status */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label className="text-base font-medium text-gray-700">
                  Featured Product
                </label>
                <p className="text-sm text-gray-500">
                  Highlight this product on the homepage and in featured
                  sections
                </p>
                {formData.isFeatured && !formData.isActive && (
                  <p className="text-xs text-red-600 mt-1">
                    Featured products must be active
                  </p>
                )}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => {
                    updateFormData({ isFeatured: e.target.checked });
                    setTimeout(validateStatus, 0);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DF8D28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DF8D28]"></div>
              </label>
            </div>
          </div>

          {/* Status Validation Errors */}
          {validationState.status?.errors.map((error, index) => (
            <div
              key={index}
              className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <p className="text-red-600 text-sm flex items-center gap-2">
                <Icon icon="material-symbols:error" className="w-4 h-4" />
                {error}
              </p>
            </div>
          ))}
        </div>

        {/* Readiness Checklist */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:checklist"
              className="w-5 h-5 text-customorange"
            />
            Product Readiness Checklist
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Product name', completed: !!formData.name },
              {
                label: 'Product description',
                completed: !!formData.description,
              },
              { label: 'Category selected', completed: !!formData.category },
              {
                label: 'Sub-category selected',
                completed: !!formData.subCategory,
              },
              {
                label: 'At least one variant',
                completed: formData.variants.length > 0,
              },
              {
                label: 'At least one active variant',
                completed: activeVariants > 0,
              },
              {
                label: 'Product images',
                completed: formData.images.length > 0,
              },
              { label: 'Product tags', completed: formData.tags.length > 0 },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                <Icon
                  icon={
                    item.completed
                      ? 'material-symbols:check-circle'
                      : 'material-symbols:radio-button-unchecked'
                  }
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
            <p className="text-sm  flex items-center gap-2">
              <Icon
                icon="material-symbols:info"
                className="w-4 h-4 text-customorange"
              />
              Complete all checklist items for the best customer experience
            </p>
          </div>
        </div>

        {/* Final Notes */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:info"
              className="w-5 h-5 text-customorange"
            />
            Before Publishing
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Review all information:</strong> Double-check product
              details, pricing, and inventory levels
            </p>
            <p>
              • <strong>Test product visibility:</strong> Ensure the product
              appears correctly in your store
            </p>
            <p>
              • <strong>Monitor performance:</strong> Track how customers
              interact with your product after publishing
            </p>
            <p>
              • <strong>Update regularly:</strong> Keep inventory levels and
              product information current
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
