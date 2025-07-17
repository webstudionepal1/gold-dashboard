import React, { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { TextareaField } from "../TextArea";
import { useMultiPageForm } from "../MultiPageFormContext";

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const BasicInformationPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useMultiPageForm();

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
      errors.push("Collection name is required");
    } else if (value.length > 100) {
      errors.push("Collection name cannot exceed 100 characters");
    }
    updateValidation("name", errors.length === 0, errors);
  };

  const validateSlug = (value: string) => {
    const errors: string[] = [];
    if (!value.trim()) {
      errors.push("Slug is required");
    } else if (!/^[a-z0-9-]+$/.test(value)) {
      errors.push(
        "Slug can only contain lowercase letters, numbers, and hyphens"
      );
    }
    updateValidation("slug", errors.length === 0, errors);
  };

  const validateShortDescription = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 500) {
      errors.push("Short description cannot exceed 500 characters");
    }
    updateValidation("shortDescription", errors.length === 0, errors);
  };

  const validateDescription = (value: string) => {
    const errors: string[] = [];
    if (value && value.length > 2000) {
      errors.push("Description cannot exceed 2000 characters");
    }
    updateValidation("description", errors.length === 0, errors);
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
          Essential details about your collection that will be visible to
          customers.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Collection Name */}
        <div className="space-y-2">
          <InputField
            label="Collection Name"
            placeholder="Enter collection name (e.g., Summer Gold Collection)"
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
              className="text-red-500 text-sm flex items-center gap-1">
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <InputField
            label="URL Slug"
            placeholder="collection-url-slug"
            required
            value={formData.slug}
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
            This will be used in the collection URL: /collections/
            {formData.slug || "your-slug"}
          </p>
          {validationState.slug?.errors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm flex items-center gap-1">
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <TextareaField
            label="Short Description"
            placeholder="Brief description for collection previews and search results (optional)"
            rows={3}
            value={formData.shortDescription}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ shortDescription: value });
              validateShortDescription(value);
            }}
            onBlur={(e) => validateShortDescription(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">
              Used in collection previews and search results
            </p>
            <span
              className={`${
                formData.shortDescription.length > 450
                  ? "text-red-500"
                  : "text-gray-400"
              }`}>
              {formData.shortDescription.length}/500
            </span>
          </div>
          {validationState.shortDescription?.errors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm flex items-center gap-1">
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <TextareaField
            label="Full Description"
            placeholder="Detailed description of your collection, its inspiration, and what makes it special (optional)"
            rows={6}
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
              Detailed description shown on the collection page
            </p>
            <span
              className={`${
                formData.description.length > 1800
                  ? "text-red-500"
                  : "text-gray-400"
              }`}>
              {formData.description.length}/2000
            </span>
          </div>
          {validationState.description?.errors.map((error, index) => (
            <p
              key={index}
              className="text-red-500 text-sm flex items-center gap-1">
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          ))}
        </div>

        {/* Status Settings */}
        <div className="bg-gradient-to-r from-[#DF8D28]/5 to-[#DF8D28]/10 rounded-xl p-6 border border-[#DF8D28]/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:settings"
              className="w-5 h-5 text-[#DF8D28]"
            />
            Collection Status
          </h3>

          <div className="space-y-4">
            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Active Collection
                </label>
                <p className="text-sm text-gray-500">
                  Make this collection visible to customers
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    updateFormData({ isActive: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DF8D28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DF8D28]"></div>
              </label>
            </div>

            {/* Featured Status */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Featured Collection
                </label>
                <p className="text-sm text-gray-500">
                  Highlight this collection on the homepage
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    updateFormData({ isFeatured: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DF8D28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DF8D28]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
