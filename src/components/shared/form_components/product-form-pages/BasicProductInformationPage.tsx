import React, { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { TextareaField } from "../TextArea";
import { DropdownField } from "../Dropdown";
import { useProductForm } from "../ProductFormContext";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductSubCategoriesQuery,
} from "../../../../server/api/productHooks";

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const BasicProductInformationPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  // API hooks for categories and subcategories
  const { data: categories, isSuccess: categorySuccess } =
    useGetAllProductCategoriesQuery();
  const { data: subCategories, isSuccess: subCategorySuccess } =
    useGetAllProductSubCategoriesQuery();

  // Transform categories for dropdown
  const categoriesList = categorySuccess
    ? categories?.map((category: any) => ({
        value: category._id,
        label: category.name,
      })) || []
    : [];

  // Transform subcategories for dropdown (filtered by selected category)
  const subCategoriesList = subCategorySuccess
    ? subCategories
        ?.filter(
          (subCategory: any) =>
            !formData.category || subCategory.category === formData.category
        )
        ?.map((subCategory: any) => ({
          value: subCategory._id,
          label: subCategory.name,
        })) || []
    : [];

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const newSlug = generateSlug(formData.name);
      updateFormData({ slug: newSlug });
    }
  }, [formData.name, formData.slug, updateFormData]);

  // Validation functions
  const validateName = (value: string) => {
    const errors: string[] = [];
    if (!value.trim()) {
      errors.push("Product name is required");
    } else if (value.length > 200) {
      errors.push("Product name cannot exceed 200 characters");
    }
    updateValidation("name", errors.length === 0, errors);
  };

  const validateSlug = (value: string) => {
    const errors: string[] = [];
    if (value && !/^[a-z0-9-]+$/.test(value)) {
      errors.push(
        "Slug can only contain lowercase letters, numbers, and hyphens"
      );
    }
    updateValidation("slug", errors.length === 0, errors);
  };

  const validateDescription = (value: string) => {
    const errors: string[] = [];
    if (!value.trim()) {
      errors.push("Description is required");
    } else if (value.length > 2000) {
      errors.push("Description cannot exceed 2000 characters");
    }
    updateValidation("description", errors.length === 0, errors);
  };

  const validateCategory = (value: string) => {
    const errors: string[] = [];
    if (!value) {
      errors.push("Category is required");
    }
    updateValidation("category", errors.length === 0, errors);
  };

  const validateSubCategory = (value: string) => {
    const errors: string[] = [];
    if (!value) {
      errors.push("Sub-category is required");
    }
    updateValidation("subCategory", errors.length === 0, errors);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:info"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Essential details about your product that will be visible to
          customers.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Product Name */}
        <div className="space-y-2">
          <InputField
            label="Product Name"
            placeholder="Enter product name (e.g., Gold Diamond Ring)"
            required
            value={formData.name}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ name: value });
              validateName(value);

              // Auto-generate slug if it hasn't been manually edited
              if (
                !formData.slug ||
                formData.slug === generateSlug(formData.name)
              ) {
                const newSlug = generateSlug(value);
                updateFormData({ slug: newSlug });
                validateSlug(newSlug);
              }
            }}
            onBlur={(e) => validateName(e.target.value)}
          />
          {validationState.name?.errors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm flex items-center gap-1"
            >
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <InputField
            label="URL Slug"
            placeholder="product-url-slug"
            value={formData.slug || ""}
            onChange={(e) => {
              const value = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, "");
              updateFormData({ slug: value });
              validateSlug(value);
            }}
            onBlur={(e) => validateSlug(e.target.value)}
          />
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Icon icon="material-symbols:link" className="w-4 h-4" />
            This will be used in the product URL: /products/
            {formData.slug || "your-slug"}
          </p>
          {validationState.slug?.errors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm flex items-center gap-1"
            >
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <TextareaField
            label="Product Description"
            placeholder="Detailed description of your product, its features, and what makes it special"
            rows={6}
            required
            value={formData.description}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ description: value });
              validateDescription(value);
            }}
            onBlur={(e) => validateDescription(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">
              Detailed description shown on the product page
            </p>
            <span
              className={`${
                formData.description.length > 1800
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {formData.description.length}/2000
            </span>
          </div>
          {validationState.description?.errors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm flex items-center gap-1"
            >
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Category and Sub-Category */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:category"
              className="w-5 h-5 text-customorange"
            />
            Product Categorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-2">
              <DropdownField
                label="Product Category"
                firstInput="Select category"
                required
                options={categoriesList}
                value={formData.category}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({ category: value, subCategory: "" }); // Reset subcategory when category changes
                  validateCategory(value);
                }}
                onBlur={(e) => validateCategory(e.target.value)}
              />
              {validationState.category?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/*
            Sub-Category - hidden. To re-enable, uncomment the block below.

            <div className="space-y-2">
              <DropdownField
                label="Product Sub-Category"
                firstInput="Select sub-category"
                required
                options={subCategoriesList}
                value={formData.subCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({ subCategory: value });
                  validateSubCategory(value);
                }}
                onBlur={(e) => validateSubCategory(e.target.value)}
                disabled={!formData.category}
              />
              {!formData.category && (
                <p className="text-sm text-gray-500">
                  Please select a category first
                </p>
              )}
              {validationState.subCategory?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            */}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-customorange"
            />
            Tips for Better Product Information
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Product Name:</strong> Use descriptive names that
              include key features (material, gemstone, style)
            </p>
            <p>
              • <strong>Description:</strong> Include details about
              craftsmanship, materials, dimensions, and care instructions
            </p>
            <p>
              • <strong>Categories:</strong> Choose the most specific category
              to help customers find your product easily
            </p>
            <p>
              • <strong>URL Slug:</strong> Keep it short, descriptive, and
              SEO-friendly for better search visibility
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
