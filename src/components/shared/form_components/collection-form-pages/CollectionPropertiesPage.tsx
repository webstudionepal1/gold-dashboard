import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DropdownField } from "../Dropdown";
import { InputField } from "../InputField";
import { useMultiPageForm } from "../MultiPageFormContext";

// Options for dropdowns
const materialTypeOptions = [
  { value: "", label: "Select Material Type" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "rose_gold", label: "Rose Gold" },
  { value: "white_gold", label: "White Gold" },
  { value: "mixed", label: "Mixed Materials" },
  { value: "other", label: "Other" },
];

const gemstoneTypeOptions = [
  { value: "", label: "Select Gemstone Type" },
  { value: "diamond", label: "Diamond" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "sapphire", label: "Sapphire" },
  { value: "pearl", label: "Pearl" },
  { value: "mixed", label: "Mixed Gemstones" },
  { value: "none", label: "No Gemstones" },
  { value: "other", label: "Other" },
];

const styleCategoryOptions = [
  { value: "", label: "Select Style Category" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "contemporary", label: "Contemporary" },
  { value: "minimalist", label: "Minimalist" },
  { value: "bohemian", label: "Bohemian" },
  { value: "luxury", label: "Luxury" },
  { value: "other", label: "Other" },
];

export const CollectionPropertiesPage: React.FC = () => {
  const { formData, updateFormData } = useMultiPageForm();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:diamond"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h2 className="text-xl font-bold text-gray-900">
            Collection Properties
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Define jewelry-specific characteristics to help customers find what
          they're looking for.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Material and Gemstone Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:category"
              className="w-5 h-5 text-blue-600"
            />
            Material & Gemstone
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Material Type */}
            <div className="space-y-2">
              <DropdownField
                label="Material Type"
                firstInput="Select material type"
                options={materialTypeOptions}
                value={formData.materialType}
                onChange={(e) =>
                  updateFormData({ materialType: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Icon icon="material-symbols:info" className="w-4 h-4" />
                Primary material used in this collection
              </p>
            </div>

            {/* Gemstone Type */}
            <div className="space-y-2">
              <DropdownField
                label="Gemstone Type"
                firstInput="Select gemstone type"
                options={gemstoneTypeOptions}
                value={formData.gemstoneType}
                onChange={(e) =>
                  updateFormData({ gemstoneType: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Icon icon="material-symbols:info" className="w-4 h-4" />
                Primary gemstone featured in this collection
              </p>
            </div>
          </div>
        </div>

        {/* Style Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:palette"
              className="w-5 h-5 text-purple-600"
            />
            Style & Design
          </h3>

          <div className="space-y-2">
            <DropdownField
              label="Style Category"
              firstInput="Select style category"
              options={styleCategoryOptions}
              value={formData.styleCategory}
              onChange={(e) =>
                updateFormData({ styleCategory: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Icon icon="material-symbols:info" className="w-4 h-4" />
              Overall design aesthetic and style of the collection
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-gray-600"
            />
            Why These Properties Matter
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Material & Gemstone:</strong> Help customers filter by
              their preferred materials and stones
            </p>
            <p>
              • <strong>Style Category:</strong> Enables style-based browsing
              and recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
