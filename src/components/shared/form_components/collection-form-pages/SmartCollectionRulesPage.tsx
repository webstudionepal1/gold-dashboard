import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DropdownField } from "../Dropdown";
import { ConditionBuilder } from "../ConditionBuilder";
import { useMultiPageForm } from "../MultiPageFormContext";

// Collection mode options
const collectionModeOptions = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "hybrid", label: "Hybrid" },
];

export const SmartCollectionRulesPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useMultiPageForm();

  const handleCollectionModeChange = (
    mode: "manual" | "automatic" | "hybrid"
  ) => {
    updateFormData({
      collectionMode: mode,
      conditions: {
        ...formData.conditions,
        isAutomatic: mode === "automatic" || mode === "hybrid",
      },
    });

    // Validate collection mode
    updateValidation("collectionMode", true, []);
  };

  const handleConditionsChange = (newConditions: any) => {
    updateFormData({ conditions: newConditions });

    // Validate conditions for automatic/hybrid modes
    if (
      formData.collectionMode === "automatic" ||
      formData.collectionMode === "hybrid"
    ) {
      const hasValidConditions =
        newConditions.groups && newConditions.groups.length > 0;
      updateValidation(
        "conditions",
        hasValidConditions,
        hasValidConditions
          ? []
          : [
              "At least one condition group is required for automatic collections",
            ]
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:smart-toy"
            className="w-6 h-6 text-customorange"
          />
          <h2 className="text-xl font-bold text-gray-900">
            Smart Collection Rules
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Choose how products will be managed in this collection.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Collection Mode Selection */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:settings"
              className="w-5 h-5 text-customorange"
            />
            Collection Management Mode
          </h3>

          <div className="space-y-4">
            <DropdownField
              label="Collection Mode"
              firstInput="Select collection mode"
              required
              options={collectionModeOptions}
              value={formData.collectionMode}
              onChange={(e) =>
                handleCollectionModeChange(
                  e.target.value as "manual" | "automatic" | "hybrid"
                )
              }
            />

            {/* Mode Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.collectionMode === "manual"
                    ? "border-[#DF8D28] bg-[#DF8D28]/5"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="material-symbols:hand-gesture"
                    className="w-5 h-5 text-customorange"
                  />
                  <h4 className="font-semibold text-gray-900">Manual</h4>
                </div>
                <p className="text-sm text-gray-600">
                  You manually select which products to include in this
                  collection. Full control over product selection.
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.collectionMode === "automatic"
                    ? "border-[#DF8D28] bg-[#DF8D28]/5"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="material-symbols:auto-mode"
                    className="w-5 h-5 text-customorange"
                  />
                  <h4 className="font-semibold text-gray-900">Automatic</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Products are automatically included based on conditions you
                  set. Collection updates automatically when new products match.
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.collectionMode === "hybrid"
                    ? "border-[#DF8D28] bg-[#DF8D28]/5"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="material-symbols:merge"
                    className="w-5 h-5 text-customorange"
                  />
                  <h4 className="font-semibold text-gray-900">Hybrid</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Combination of automatic rules and manual selection. Start
                  with automatic rules, then manually add or exclude specific
                  products.
                </p>
              </div>
            </div>

            {/* Validation Errors */}
            {validationState.collectionMode?.errors.map((error, index) => (
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

        {/* Condition Builder - Show for automatic and hybrid modes */}
        {(formData.collectionMode === "automatic" ||
          formData.collectionMode === "hybrid") && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Icon
                  icon="material-symbols:rule"
                  className="w-5 h-5 text-customorange"
                />
                Automatic Collection Rules
              </h3>
              <p className="text-sm text-gray-600">
                Define the conditions that products must meet to be
                automatically included in this collection.
              </p>
            </div>

            <div className="p-6">
              <ConditionBuilder
                conditions={formData.conditions}
                onChange={handleConditionsChange}
                collectionMode={formData.collectionMode}
                showMatchingProducts={true}
              />

              {/* Validation Errors */}
              {validationState.conditions?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1 mt-4"
                >
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Manual Mode Information */}
        {formData.collectionMode === "manual" && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <Icon
                icon="material-symbols:info"
                className="w-6 h-6 text-gray-600 mt-1"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Manual Product Selection
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  With manual mode selected, you'll be able to choose specific
                  products to include in this collection after creating it. You
                  can always change the collection mode later if needed.
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Next steps:</strong> After creating this collection,
                    you'll be able to browse your product catalog and manually
                    select which items to include.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hybrid Mode Information */}
        {formData.collectionMode === "hybrid" && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <Icon
                icon="material-symbols:info"
                className="w-6 h-6 text-gray-600 mt-1"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Hybrid Collection Management
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your collection will automatically include products that match
                  the rules above, and you can also manually add or exclude
                  specific products.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Automatic:</strong> Products matching your rules
                      will be automatically included
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <strong>Manual Override:</strong> You can manually add
                      products that don't match rules or exclude products that
                      do
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-customorange"
            />
            Collection Mode Guide
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Manual:</strong> Best for curated collections with
              specific products you want to showcase
            </p>
            <p>
              • <strong>Automatic:</strong> Perfect for collections based on
              product attributes (e.g., "All Gold Rings", "Summer Collection")
            </p>
            <p>
              • <strong>Hybrid:</strong> Ideal when you want automatic rules but
              also need to fine-tune the selection manually
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
