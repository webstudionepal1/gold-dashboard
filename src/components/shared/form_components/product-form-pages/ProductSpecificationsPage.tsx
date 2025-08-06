import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { DropdownField } from "../Dropdown";
import { useProductForm } from "../ProductFormContext";
import { useGetAllProductClaspsQuery } from "../../../../server/api/productHooks";

// Options for dropdowns
const shapeOptions = [
  { value: "", label: "Select Shape" },
  { value: "round", label: "Round" },
  { value: "oval", label: "Oval" },
  { value: "square", label: "Square" },
  { value: "rectangular", label: "Rectangular" },
  { value: "heart", label: "Heart" },
  { value: "pear", label: "Pear" },
  { value: "marquise", label: "Marquise" },
  { value: "emerald", label: "Emerald Cut" },
  { value: "princess", label: "Princess" },
  { value: "cushion", label: "Cushion" },
  { value: "other", label: "Other" },
];

const clarityOptions = [
  { value: "", label: "Select Clarity" },
  { value: "FL", label: "Flawless (FL)" },
  { value: "IF", label: "Internally Flawless (IF)" },
  { value: "VVS1", label: "Very Very Slightly Included 1 (VVS1)" },
  { value: "VVS2", label: "Very Very Slightly Included 2 (VVS2)" },
  { value: "VS1", label: "Very Slightly Included 1 (VS1)" },
  { value: "VS2", label: "Very Slightly Included 2 (VS2)" },
  { value: "SI1", label: "Slightly Included 1 (SI1)" },
  { value: "SI2", label: "Slightly Included 2 (SI2)" },
  { value: "I1", label: "Included 1 (I1)" },
  { value: "I2", label: "Included 2 (I2)" },
  { value: "I3", label: "Included 3 (I3)" },
  { value: "N/A", label: "Not Applicable" },
];

const colorOptions = [
  { value: "", label: "Select Color" },
  { value: "D", label: "D (Colorless)" },
  { value: "E", label: "E (Colorless)" },
  { value: "F", label: "F (Colorless)" },
  { value: "G", label: "G (Near Colorless)" },
  { value: "H", label: "H (Near Colorless)" },
  { value: "I", label: "I (Near Colorless)" },
  { value: "J", label: "J (Near Colorless)" },
  { value: "K", label: "K (Faint Yellow)" },
  { value: "L", label: "L (Faint Yellow)" },
  { value: "M", label: "M (Faint Yellow)" },
  { value: "yellow", label: "Yellow" },
  { value: "white", label: "White" },
  { value: "rose", label: "Rose" },
  { value: "mixed", label: "Mixed" },
  { value: "other", label: "Other" },
];

const genderOptions = [
  { value: "", label: "Select Target Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

export const ProductSpecificationsPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  // API hook for clasp types
  const { data: clasps, isSuccess: claspsSuccess } =
    useGetAllProductClaspsQuery();

  // Transform clasps for dropdown
  const claspsList = claspsSuccess
    ? clasps?.map((clasp: any) => ({
        value: clasp._id,
        label: clasp.name,
      })) || []
    : [];

  // Add "No Clasp" option at the beginning
  const claspOptions = [
    { value: "", label: "Select Clasp Type" },
    { value: "", label: "No Clasp" },
    ...claspsList,
  ];

  // Validation functions
  const validateLength = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Length cannot be negative");
    }
    updateValidation("length", errors.length === 0, errors);
  };

  const validateShape = (value: string) => {
    const errors: string[] = [];
    if (!value) {
      errors.push("Shape is required");
    }
    updateValidation("shape", errors.length === 0, errors);
  };

  const validateClarity = (value: string) => {
    const errors: string[] = [];
    if (!value) {
      errors.push("Clarity is required");
    }
    updateValidation("clarity", errors.length === 0, errors);
  };

  const validateDimension = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Dimension cannot be negative");
    }
    updateValidation("dimension", errors.length === 0, errors);
  };

  const validateQuantity = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Quantity cannot be negative");
    }
    updateValidation("quantity", errors.length === 0, errors);
  };

  const validateMakingCharges = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Making charges cannot be negative");
    }
    updateValidation("makingCharges", errors.length === 0, errors);
  };

  const validateTotalCarat = (value: number) => {
    const errors: string[] = [];
    if (value < 0) {
      errors.push("Total carat cannot be negative");
    }
    updateValidation("totalCarat", errors.length === 0, errors);
  };

  const validateGender = (value: string) => {
    const errors: string[] = [];
    // Gender is optional, so no validation errors for empty values
    updateValidation("gender", errors.length === 0, errors);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:straighten"
            className="w-6 h-6 text-customorange"
          />
          <h2 className="text-xl font-bold text-gray-900">
            Product Specifications
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Define the physical properties and characteristics of your product.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Physical Dimensions Section */}
        <div className=" bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:straighten"
              className="w-5 h-5 text-customorange "
            />
            Physical Dimensions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Length */}
            <div className="space-y-2">
              <InputField
                label="Length (mm)"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                value={formData.length || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({ length: value });
                  validateLength(value);
                }}
                onBlur={(e) => validateLength(Number(e.target.value) || 0)}
              />
              {validationState.length?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Dimension */}
            <div className="space-y-2">
              <InputField
                label="Width/Diameter (mm)"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                value={formData.dimension || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({ dimension: value });
                  validateDimension(value);
                }}
                onBlur={(e) => validateDimension(Number(e.target.value) || 0)}
              />
              {validationState.dimension?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <InputField
                label="Base Quantity"
                type="number"
                min="0"
                placeholder="1"
                value={formData.quantity || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({ quantity: value });
                  validateQuantity(value);
                }}
                onBlur={(e) => validateQuantity(Number(e.target.value) || 0)}
              />
              <p className="text-sm text-gray-500">
                Base quantity for this product
              </p>
              {validationState.quantity?.errors.map((error, index) => (
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

        {/* Shape and Clarity Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:diamond"
              className="w-5 h-5 text-customorange"
            />
            Shape & Quality
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shape */}
            <div className="space-y-2">
              <DropdownField
                label="Shape"
                firstInput="Select shape"
                required
                options={shapeOptions}
                value={formData.shape}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({ shape: value });
                  validateShape(value);
                }}
                onBlur={(e) => validateShape(e.target.value)}
              />
              {validationState.shape?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Clarity */}
            <div className="space-y-2">
              <DropdownField
                label="Clarity"
                firstInput="Select clarity"
                required
                options={clarityOptions}
                value={formData.clarity}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({ clarity: value });
                  validateClarity(value);
                }}
                onBlur={(e) => validateClarity(e.target.value)}
              />
              {validationState.clarity?.errors.map((error, index) => (
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

        {/* Additional Properties Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:settings"
              className="w-5 h-5 text-customorange"
            />
            Additional Properties
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color */}
            <div className="space-y-2">
              <DropdownField
                label="Color"
                firstInput="Select color"
                options={colorOptions}
                value={formData.color || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({ color: value });
                }}
              />
              <p className="text-sm text-gray-500">
                Color grade or material color
              </p>
            </div>

            {/* Clasp Type */}
            <div className="space-y-2">
              <DropdownField
                label="Clasp Type"
                firstInput="Select clasp type"
                options={claspOptions}
                value={formData.claspType || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({ claspType: value });
                }}
              />
              <p className="text-sm text-gray-500">
                Type of clasp or closure mechanism
              </p>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <DropdownField
                label="Target Gender"
                firstInput="Select target gender"
                options={genderOptions}
                value={formData.gender || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  updateFormData({
                    gender: value as "male" | "female" | "unisex" | undefined,
                  });
                  validateGender(value);
                }}
                onBlur={(e) => validateGender(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Target audience for this product
              </p>
              {validationState.gender?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Total Carat */}
            <div className="space-y-2">
              <InputField
                label="Total Carat Weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.totalCarat || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({ totalCarat: value });
                  validateTotalCarat(value);
                }}
                onBlur={(e) => validateTotalCarat(Number(e.target.value) || 0)}
              />
              <p className="text-sm text-gray-500">
                Total weight of all gemstones in carats
              </p>
              {validationState.totalCarat?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>

            {/* Making Charges */}
            <div className="space-y-2">
              <InputField
                label="Making Charges"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.makingCharges || ""}
                onChange={(e) => {
                  const value = Number(e.target.value) || 0;
                  updateFormData({ makingCharges: value });
                  validateMakingCharges(value);
                }}
                onBlur={(e) =>
                  validateMakingCharges(Number(e.target.value) || 0)
                }
              />
              <p className="text-sm text-gray-500">
                Additional charges for craftsmanship
              </p>
              {validationState.makingCharges?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>
          </div>

          {/* Rhodium Finishes Toggle */}
          <div className="mt-6 pt-4 border-t border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Rhodium Finishes
                </label>
                <p className="text-sm text-gray-500">
                  Does this product have rhodium plating or finishes?
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rhodoumFinishes}
                  onChange={(e) =>
                    updateFormData({ rhodoumFinishes: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DF8D28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DF8D28]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-customorange"
            />
            Specification Guidelines
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Dimensions:</strong> Provide accurate measurements in
              millimeters for consistency
            </p>
            <p>
              • <strong>Shape:</strong> Choose the most appropriate shape that
              describes your product
            </p>
            <p>
              • <strong>Clarity:</strong> Use standard gemological clarity
              grades when applicable
            </p>
            <p>
              • <strong>Making Charges:</strong> Include any additional costs
              for craftsmanship or special techniques
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
