import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { DropdownField } from "../Dropdown";
import { useProductForm } from "../ProductFormContext";
import { ProductVariant } from "../ProductFormContext";

// Unit options for variants
const unitOptions = [
  { value: "grams", label: "Grams" },
  { value: "kg", label: "Kilograms" },
  { value: "pieces", label: "Pieces" },
  { value: "carats", label: "Carats" },
];

export const ProductVariantsPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  const [skuValidationStates, setSKUValidationStates] = useState<{
    [key: string]: string;
  }>({});

  // Add new variant
  const addVariant = () => {
    const newVariant: ProductVariant = {
      sku: "",
      price: 0,
      wt: 0,
      unit: "grams",
      totalStock: 0,
      usedStock: 0,
      remainingStock: 0,
      reorderPoint: 10,
      isActive: true,
    };

    updateFormData({
      variants: [...formData.variants, newVariant],
    });
  };

  // Remove variant
  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      updateFormData({ variants: newVariants });
    }
  };

  // Update variant
  const updateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], ...updates };

    // Auto-calculate remaining stock
    if (updates.totalStock !== undefined || updates.usedStock !== undefined) {
      const totalStock = updates.totalStock ?? newVariants[index].totalStock;
      const usedStock = updates.usedStock ?? newVariants[index].usedStock;
      newVariants[index].remainingStock = totalStock - usedStock;
    }

    updateFormData({ variants: newVariants });
  };

  // Validate SKU
  const validateSKU = async (sku: string, variantIndex: number) => {
    const skuKey = `variant-${variantIndex}-sku`;

    if (!sku.trim()) {
      setSKUValidationStates((prev) => ({ ...prev, [skuKey]: "" }));
      return;
    }

    setSKUValidationStates((prev) => ({ ...prev, [skuKey]: "validating" }));

    try {
      const response = await fetch(
        `/api/v1/en/validate-sku/${encodeURIComponent(sku)}`
      );
      const result = await response.json();

      setSKUValidationStates((prev) => ({
        ...prev,
        [skuKey]: result.success ? "valid" : "invalid",
      }));
    } catch (error) {
      setSKUValidationStates((prev) => ({ ...prev, [skuKey]: "error" }));
    }
  };

  // Validate variants
  const validateVariants = () => {
    const errors: string[] = [];

    if (formData.variants.length === 0) {
      errors.push("At least one variant is required");
    }

    // Check for duplicate SKUs
    const skus = formData.variants
      .map((v) => v.sku)
      .filter((sku) => sku && sku.trim() !== "");
    const uniqueSkus = new Set(skus);
    if (skus.length !== uniqueSkus.size) {
      errors.push("SKUs must be unique across all variants");
    }

    // Validate stock calculations
    const hasInvalidStock = formData.variants.some(
      (variant) =>
        variant.remainingStock !== variant.totalStock - variant.usedStock
    );
    if (hasInvalidStock) {
      errors.push("Remaining stock must equal total stock minus used stock");
    }

    updateValidation("variants", errors.length === 0, errors);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:inventory"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h2 className="text-xl font-bold text-gray-900">
            Product Variants & Pricing
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Configure different variants of your product with pricing and inventory
          details.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Variants Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon
              icon="material-symbols:list"
              className="w-5 h-5 text-[#DF8D28]"
            />
            Product Variants ({formData.variants.length})
          </h3>
          <button
            type="button"
            onClick={addVariant}
            className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-4 py-2 hover:bg-[#B8691A] transition-colors">
            <Icon icon="material-symbols:add" className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        {/* Variants List */}
        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Icon
                    icon="material-symbols:package"
                    className="w-4 h-4 text-[#DF8D28]"
                  />
                  Variant {index + 1}
                </h4>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors">
                    <Icon icon="material-symbols:delete" className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* SKU */}
                <div className="space-y-2">
                  <InputField
                    label="SKU"
                    placeholder="Enter unique SKU (optional)"
                    value={variant.sku || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateVariant(index, { sku: value });
                      // Clear validation state when typing
                      const skuKey = `variant-${index}-sku`;
                      if (skuValidationStates[skuKey]) {
                        setSKUValidationStates((prev) => ({
                          ...prev,
                          [skuKey]: "",
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      validateSKU(e.target.value, index);
                      validateVariants();
                    }}
                  />
                  {/* SKU Validation Status */}
                  {variant.sku && skuValidationStates[`variant-${index}-sku`] && (
                    <div className="mt-1">
                      {skuValidationStates[`variant-${index}-sku`] ===
                        "validating" && (
                        <p className="text-xs text-blue-500 flex items-center gap-1">
                          <Icon
                            icon="eos-icons:loading"
                            className="w-3 h-3 animate-spin"
                          />
                          Checking SKU availability...
                        </p>
                      )}
                      {skuValidationStates[`variant-${index}-sku`] ===
                        "valid" && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Icon icon="material-symbols:check-circle" className="w-3 h-3" />
                          SKU is available
                        </p>
                      )}
                      {skuValidationStates[`variant-${index}-sku`] ===
                        "invalid" && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <Icon icon="material-symbols:error" className="w-3 h-3" />
                          SKU already exists
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Leave empty to auto-generate SKU
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <InputField
                    label="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={variant.price || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      updateVariant(index, { price: value });
                    }}
                    onBlur={validateVariants}
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Weight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.wt || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        updateVariant(index, { wt: value });
                      }}
                    />
                    <DropdownField
                      label="Unit"
                      options={unitOptions}
                      value={variant.unit}
                      onChange={(e) => {
                        updateVariant(index, {
                          unit: e.target.value as ProductVariant["unit"],
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Total Stock */}
                <div className="space-y-2">
                  <InputField
                    label="Total Stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={variant.totalStock || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      updateVariant(index, { totalStock: value });
                    }}
                    onBlur={validateVariants}
                  />
                </div>

                {/* Used Stock */}
                <div className="space-y-2">
                  <InputField
                    label="Used Stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={variant.usedStock || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      updateVariant(index, { usedStock: value });
                    }}
                    onBlur={validateVariants}
                  />
                </div>

                {/* Remaining Stock (Read-only) */}
                <div className="space-y-2">
                  <InputField
                    label="Remaining Stock"
                    type="number"
                    value={variant.remainingStock || 0}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Auto-calculated: Total - Used
                  </p>
                </div>

                {/* Reorder Point */}
                <div className="space-y-2">
                  <InputField
                    label="Reorder Point"
                    type="number"
                    min="0"
                    placeholder="10"
                    value={variant.reorderPoint || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      updateVariant(index, { reorderPoint: value });
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Alert when stock falls below this level
                  </p>
                </div>

                {/* Cost Price */}
                <div className="space-y-2">
                  <InputField
                    label="Cost Price (Optional)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={variant.costPrice || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      updateVariant(index, { costPrice: value });
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Your cost for this variant
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Active Variant
                    </label>
                    <p className="text-xs text-gray-500">
                      Available for sale
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={variant.isActive}
                      onChange={(e) =>
                        updateVariant(index, { isActive: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#DF8D28]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DF8D28]"></div>
                  </label>
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm">
                  <div
                    className={`flex items-center gap-1 ${
                      variant.remainingStock <= variant.reorderPoint
                        ? "text-red-600"
                        : variant.remainingStock <= variant.reorderPoint * 2
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}>
                    <Icon
                      icon={
                        variant.remainingStock <= variant.reorderPoint
                          ? "material-symbols:warning"
                          : variant.remainingStock <= variant.reorderPoint * 2
                          ? "material-symbols:info"
                          : "material-symbols:check-circle"
                      }
                      className="w-4 h-4"
                    />
                    <span>
                      {variant.remainingStock <= variant.reorderPoint
                        ? "Low Stock"
                        : variant.remainingStock <= variant.reorderPoint * 2
                        ? "Medium Stock"
                        : "Good Stock"}
                    </span>
                  </div>
                  {variant.price > 0 && variant.costPrice && (
                    <div className="text-gray-600">
                      Margin: {((variant.price - variant.costPrice) / variant.price * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Errors */}
        {validationState.variants?.errors.map((error, index) => (
          <div
            key={index}
            className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm flex items-center gap-2">
              <Icon icon="material-symbols:error" className="w-4 h-4" />
              {error}
            </p>
          </div>
        ))}

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-gray-600"
            />
            Variant Management Tips
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>SKU:</strong> Use unique identifiers for inventory
              tracking. Leave empty to auto-generate.
            </p>
            <p>
              • <strong>Stock Management:</strong> Remaining stock is
              automatically calculated as Total - Used.
            </p>
            <p>
              • <strong>Reorder Point:</strong> Set alerts for when to restock
              each variant.
            </p>
            <p>
              • <strong>Cost Price:</strong> Track your costs to calculate profit
              margins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
