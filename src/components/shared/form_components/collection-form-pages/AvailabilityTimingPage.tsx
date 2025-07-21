import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { useMultiPageForm } from "../MultiPageFormContext";

export const AvailabilityTimingPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useMultiPageForm();

  // Validation functions
  const validateDateRange = () => {
    const errors: string[] = [];
    const fromDate = formData.availableFrom
      ? new Date(formData.availableFrom)
      : null;
    const untilDate = formData.availableUntil
      ? new Date(formData.availableUntil)
      : null;

    if (fromDate && untilDate && fromDate >= untilDate) {
      errors.push("Available until date must be after available from date");
    }

    if (fromDate && fromDate < new Date()) {
      errors.push("Available from date cannot be in the past");
    }

    updateValidation("dateRange", errors.length === 0, errors);
  };

  const validateSortOrder = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Sort order cannot be negative");
    }
    updateValidation("sortOrder", errors.length === 0, errors);
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handle date changes
  const handleDateChange = (
    field: "availableFrom" | "availableUntil",
    value: string
  ) => {
    updateFormData({ [field]: value });
    setTimeout(validateDateRange, 0); // Validate after state update
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:schedule"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h2 className="text-xl font-bold text-gray-900">
            Availability & Timing
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Configure when your collection will be available and review settings.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Limited Edition Settings */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:star"
              className="w-5 h-5 text-gray-600"
            />
            Limited Edition Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Limited Edition Collection
                </label>
                <p className="text-sm text-gray-500">
                  Mark this collection as limited edition to create urgency
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isLimitedEdition}
                  onChange={(e) =>
                    updateFormData({ isLimitedEdition: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {formData.isLimitedEdition && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="material-symbols:info"
                    className="w-5 h-5 text-gray-600 mt-0.5"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Limited Edition Benefits
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Special "Limited Edition" badge displayed on
                        collection
                      </li>
                      <li>• Higher priority in search and recommendations</li>
                      <li>• Creates urgency and exclusivity for customers</li>
                      <li>• Can be featured in limited edition promotions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability Schedule */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:calendar-month"
              className="w-5 h-5 text-gray-600"
            />
            Availability Schedule
          </h3>

          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Set when this collection should be available to customers. Leave
              dates empty to make the collection available immediately and
              indefinitely.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available From */}
              <div className="space-y-2">
                <InputField
                  label="Available From"
                  type="date"
                  value={formatDateForInput(formData.availableFrom)}
                  onChange={(e) =>
                    handleDateChange("availableFrom", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Collection becomes visible to customers on this date
                </p>
              </div>

              {/* Available Until */}
              <div className="space-y-2">
                <InputField
                  label="Available Until"
                  type="date"
                  value={formatDateForInput(formData.availableUntil)}
                  onChange={(e) =>
                    handleDateChange("availableUntil", e.target.value)
                  }
                />
                <p className="text-sm text-gray-500">
                  Collection becomes hidden from customers after this date
                </p>
              </div>
            </div>

            {/* Date Range Preview */}
            {(formData.availableFrom || formData.availableUntil) && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Availability Preview:
                </h4>
                <div className="text-sm text-gray-600">
                  {formData.availableFrom && formData.availableUntil ? (
                    <p>
                      Available from{" "}
                      {new Date(formData.availableFrom).toLocaleDateString()} to{" "}
                      {new Date(formData.availableUntil).toLocaleDateString()}
                    </p>
                  ) : formData.availableFrom ? (
                    <p>
                      Available from{" "}
                      {new Date(formData.availableFrom).toLocaleDateString()}{" "}
                      onwards
                    </p>
                  ) : formData.availableUntil ? (
                    <p>
                      Available until{" "}
                      {new Date(formData.availableUntil).toLocaleDateString()}
                    </p>
                  ) : (
                    <p>Available immediately and indefinitely</p>
                  )}
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {validationState.dateRange?.errors.map((error, index) => (
              <p
                key={index}
                className="text-red-500 text-sm flex items-center gap-1"
              >
                <Icon icon="material-symbols:error" className="w-4 h-4" />
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:sort"
              className="w-5 h-5 text-gray-600"
            />
            Display Settings
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <InputField
                label="Sort Order"
                type="number"
                min="0"
                placeholder="0"
                value={formData.sortOrder || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({ sortOrder: value });
                  validateSortOrder(value);
                }}
                onBlur={(e) => validateSortOrder(Number(e.target.value) || 0)}
              />
              <p className="text-sm text-gray-500">
                Lower numbers appear first. Use this to control the order of
                collections on your store.
              </p>
              {validationState.sortOrder?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">
                Sort Order Examples:
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  • <strong>0-10:</strong> Featured/priority collections
                </p>
                <p>
                  • <strong>10-50:</strong> Regular collections
                </p>
                <p>
                  • <strong>50+:</strong> Seasonal or archived collections
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Summary */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:summarize"
              className="w-5 h-5 text-gray-600"
            />
            Collection Summary
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700">Collection Name</p>
                <p className="text-gray-600">{formData.name || "Not set"}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700">Collection Mode</p>
                <p className="text-gray-600 capitalize">
                  {formData.collectionMode}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700">Material Type</p>
                <p className="text-gray-600">
                  {formData.materialType || "Not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700">Status</p>
                <div className="flex gap-2 mt-1">
                  {formData.isActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                  {formData.isFeatured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                  {formData.isLimitedEdition && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Limited Edition
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700">Media Assets</p>
                <p className="text-gray-600">
                  {formData.images.length} images,{" "}
                  {formData.bannerImage ? "1" : "0"} banner,{" "}
                  {formData.video ? "1" : "0"} video
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700">SEO & Marketing</p>
                <p className="text-gray-600">
                  {formData.metadata.keywords.length} keywords,{" "}
                  {formData.metadata.tags.length} tags
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Notes */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Icon
              icon="material-symbols:info"
              className="w-6 h-6 text-gray-600 mt-1"
            />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Ready to Create Your Collection?
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                You've configured all the essential settings for your
                collection. Once created, you can:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add or remove products based on your collection mode</li>
                <li>• Update any of these settings at any time</li>
                <li>
                  • Monitor collection performance and customer engagement
                </li>
                <li>• Create marketing campaigns and promotions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
