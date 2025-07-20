import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { TextareaField } from "../TextArea";
import { DropdownField } from "../Dropdown";
import { useProductForm } from "../ProductFormContext";
import {
  useGetAllStonesQuery,
  useGetAllProductOccasionsQuery,
} from "../../../../server/api/productHooks";

// Visibility options
const visibilityOptions = [
  { value: "normal", label: "Normal" },
  { value: "featured", label: "Featured" },
  { value: "bestSellers", label: "Best Sellers" },
  { value: "newArrivals", label: "New Arrivals" },
];

export const ProductSEOMarketingPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Add tag
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      const newTags = [...formData.tags, tag.trim()];
      updateFormData({ tags: newTags });
      validateTags(newTags);
    }
  };

  // Remove tag
  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    updateFormData({ tags: newTags });
    validateTags(newTags);
  };

  // Add keyword
  const addKeyword = (keyword: string) => {
    if (keyword.trim()) {
      const currentKeywords = formData.metadata?.keywords || [];
      if (!currentKeywords.includes(keyword.trim())) {
        const newKeywords = [...currentKeywords, keyword.trim()];
        updateFormData({
          metadata: {
            ...formData.metadata,
            keywords: newKeywords,
          },
        });
      }
    }
  };

  // Remove keyword
  const removeKeyword = (index: number) => {
    const currentKeywords = formData.metadata?.keywords || [];
    const newKeywords = currentKeywords.filter((_, i) => i !== index);
    updateFormData({
      metadata: {
        ...formData.metadata,
        keywords: newKeywords,
      },
    });
  };

  // Validation functions
  const validateTags = (tags: string[]) => {
    const errors: string[] = [];
    if (tags.length === 0) {
      errors.push("At least one tag is required");
    }
    updateValidation("tags", errors.length === 0, errors);
  };

  const validateSEOTitle = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 60) {
      errors.push("SEO title cannot exceed 60 characters");
    }
    updateValidation("seoTitle", errors.length === 0, errors);
  };

  const validateSEODescription = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 160) {
      errors.push("SEO description cannot exceed 160 characters");
    }
    updateValidation("seoDescription", errors.length === 0, errors);
  };

  const validateVendor = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 100) {
      errors.push("Vendor name cannot exceed 100 characters");
    }
    updateValidation("vendor", errors.length === 0, errors);
  };

  const validateBarcode = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 50) {
      errors.push("Barcode cannot exceed 50 characters");
    }
    updateValidation("barcode", errors.length === 0, errors);
  };

  const validateCompareAtPrice = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Compare at price cannot be negative");
    }
    // Check if compare at price is higher than product price
    if (value > 0 && formData.variants.length > 0) {
      const lowestPrice = Math.min(...formData.variants.map((v) => v.price));
      if (value <= lowestPrice) {
        errors.push("Compare at price should be higher than the product price");
      }
    }
    updateValidation("compareAtPrice", errors.length === 0, errors);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:search"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h2 className="text-xl font-bold text-gray-900">SEO & Marketing</h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Optimize your product for search engines and configure marketing
          settings.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* SEO Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:search"
              className="w-5 h-5 text-blue-600"
            />
            Search Engine Optimization
          </h3>

          <div className="space-y-4">
            {/* SEO Title */}
            <div className="space-y-2">
              <InputField
                label="SEO Title"
                placeholder="Optimized title for search engines (optional)"
                value={formData.metadata?.seoTitle || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      seoTitle: value,
                    },
                  });
                  validateSEOTitle(value);
                }}
                onBlur={(e) => validateSEOTitle(e.target.value)}
              />
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-500">Leave empty to use product name</p>
                <span
                  className={`${
                    (formData.metadata?.seoTitle?.length || 0) > 50
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}>
                  {formData.metadata?.seoTitle?.length || 0}/60
                </span>
              </div>
              {validationState.seoTitle?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* SEO Description */}
            <div className="space-y-2">
              <TextareaField
                label="SEO Description"
                placeholder="Brief description for search engine results (optional)"
                rows={3}
                value={formData.metadata?.seoDescription || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      seoDescription: value,
                    },
                  });
                  validateSEODescription(value);
                }}
                onBlur={(e) => validateSEODescription(e.target.value)}
              />
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-500">
                  Appears in search engine results
                </p>
                <span
                  className={`${
                    (formData.metadata?.seoDescription?.length || 0) > 140
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}>
                  {formData.metadata?.seoDescription?.length || 0}/160
                </span>
              </div>
              {validationState.seoDescription?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                SEO Keywords
              </label>
              <div className="flex gap-2">
                <InputField
                  placeholder="Enter keyword and press Enter"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword(keywordInput);
                      setKeywordInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    addKeyword(keywordInput);
                    setKeywordInput("");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Add
                </button>
              </div>
              {formData.metadata?.keywords &&
                formData.metadata.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.metadata.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="text-blue-600 hover:text-blue-800">
                          <Icon
                            icon="material-symbols:close"
                            className="w-3 h-3"
                          />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              <p className="text-sm text-gray-500">
                Keywords help customers find your product through search
              </p>
            </div>
          </div>
        </div>

        {/* Marketing Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:campaign"
              className="w-5 h-5 text-purple-600"
            />
            Marketing & Visibility
          </h3>

          <div className="space-y-4">
            {/* Product Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Tags <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <InputField
                  placeholder="Enter tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                      setTagInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    addTag(tagInput);
                    setTagInput("");
                  }}
                  className="px-4 py-2 bg-[#DF8D28] text-white rounded-md hover:bg-[#B8691A] transition-colors">
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#DF8D28]/10 text-[#DF8D28] rounded-full text-sm border border-[#DF8D28]/20">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-[#DF8D28] hover:text-[#B8691A]">
                        <Icon
                          icon="material-symbols:close"
                          className="w-3 h-3"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {validationState.tags?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
              <p className="text-sm text-gray-500">
                Tags help categorize and filter products
              </p>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <DropdownField
                label="Product Visibility"
                firstInput="Select visibility level"
                required
                options={visibilityOptions}
                value={formData.visibleAs}
                onChange={(e) => {
                  updateFormData({
                    visibleAs: e.target.value as typeof formData.visibleAs,
                  });
                }}
              />
              <p className="text-sm text-gray-500">
                Controls where and how prominently your product appears
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:info"
              className="w-5 h-5 text-green-600"
            />
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor */}
            <div className="space-y-2">
              <InputField
                label="Vendor/Brand"
                placeholder="Brand or vendor name (optional)"
                value={formData.metadata?.vendor || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      vendor: value,
                    },
                  });
                  validateVendor(value);
                }}
                onBlur={(e) => validateVendor(e.target.value)}
              />
              {validationState.vendor?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Barcode */}
            <div className="space-y-2">
              <InputField
                label="Barcode/UPC"
                placeholder="Product barcode (optional)"
                value={formData.metadata?.barcode || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      barcode: value,
                    },
                  });
                  validateBarcode(value);
                }}
                onBlur={(e) => validateBarcode(e.target.value)}
              />
              {validationState.barcode?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Compare At Price */}
            <div className="space-y-2 md:col-span-2">
              <InputField
                label="Compare At Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.metadata?.compareAtPrice || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({
                    metadata: {
                      ...formData.metadata,
                      compareAtPrice: value,
                    },
                  });
                  validateCompareAtPrice(value);
                }}
                onBlur={(e) =>
                  validateCompareAtPrice(Number(e.target.value) || 0)
                }
              />
              <p className="text-sm text-gray-500">
                Original price to show savings (should be higher than selling
                price)
              </p>
              {validationState.compareAtPrice?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-gray-600"
            />
            SEO & Marketing Tips
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>SEO Title:</strong> Include your main keyword and keep
              it under 60 characters
            </p>
            <p>
              • <strong>Meta Description:</strong> Write compelling copy that
              encourages clicks from search results
            </p>
            <p>
              • <strong>Tags:</strong> Use relevant, searchable terms that
              customers might use to find your product
            </p>
            <p>
              • <strong>Keywords:</strong> Research what terms your customers
              search for and include them naturally
            </p>
            <p>
              • <strong>Compare At Price:</strong> Use this to show value and
              create urgency with "sale" pricing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
