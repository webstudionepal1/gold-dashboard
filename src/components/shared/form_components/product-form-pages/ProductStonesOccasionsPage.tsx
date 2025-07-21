import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InputField } from "../InputField";
import { DropdownField } from "../Dropdown";
import { useProductForm } from "../ProductFormContext";
import { ProductStone } from "../ProductFormContext";
import {
  useGetAllStonesQuery,
  useGetAllProductOccasionsQuery,
} from "../../../../server/api/productHooks";

export const ProductStonesOccasionsPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  // API hooks
  const { data: stones, isSuccess: stonesSuccess } = useGetAllStonesQuery();
  const { data: occasions, isSuccess: occasionsSuccess } =
    useGetAllProductOccasionsQuery();

  // Transform stones for dropdown
  const stonesList = stonesSuccess
    ? stones?.map((stone: any) => ({
        value: stone._id,
        label: stone.name,
      })) || []
    : [];

  // Transform occasions for dropdown
  const occasionsList = occasionsSuccess
    ? occasions?.map((occasion: any) => ({
        value: occasion._id,
        label: occasion.name,
      })) || []
    : [];

  // Add new stone
  const addStone = () => {
    const newStone: ProductStone = {
      stone: "",
      quantity: 1,
      totalPrice: 0,
      isOptional: true,
      isDefault: false,
    };

    const currentStones = formData.stones || [];
    updateFormData({
      stones: [...currentStones, newStone],
    });
  };

  // Remove stone
  const removeStone = (index: number) => {
    const currentStones = formData.stones || [];
    const newStones = currentStones.filter((_, i) => i !== index);
    updateFormData({ stones: newStones });
  };

  // Update stone
  const updateStone = (index: number, updates: Partial<ProductStone>) => {
    const currentStones = formData.stones || [];
    const newStones = [...currentStones];
    newStones[index] = { ...newStones[index], ...updates };
    updateFormData({ stones: newStones });
  };

  // Toggle occasion
  const toggleOccasion = (occasionId: string) => {
    const currentOccasions = formData.occasions || [];
    const isSelected = currentOccasions.includes(occasionId);

    if (isSelected) {
      const newOccasions = currentOccasions.filter((id) => id !== occasionId);
      updateFormData({ occasions: newOccasions });
    } else {
      const newOccasions = [...currentOccasions, occasionId];
      updateFormData({ occasions: newOccasions });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:diamond"
            className="w-6 h-6 text-customorange"
          />
          <h2 className="text-xl font-bold text-gray-900">
            Stones & Occasions
          </h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Configure gemstones and suitable occasions for your product.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stones Section */}
        <div className=" bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Icon
                icon="material-symbols:diamond"
                className="w-5 h-5 text-customorange "
              />
              Gemstones ({(formData.stones || []).length})
            </h3>
            <button
              type="button"
              onClick={addStone}
              className="flex bg-customorange rounded-md text-white items-center gap-2 px-4 py-2   transition-colors"
            >
              <Icon icon="material-symbols:add" className="w-4 h-4" />
              Add Stone
            </button>
          </div>

          {formData.stones && formData.stones.length > 0 ? (
            <div className="space-y-4">
              {formData.stones.map((stone, index) => (
                <div
                  key={index}
                  className="bg-white border border-purple-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">
                      Stone {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeStone(index)}
                      className=" p-1 rounded-md  transition-colors"
                    >
                      <Icon
                        icon="material-symbols:delete"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Stone Selection */}
                    <div className="space-y-2">
                      <DropdownField
                        label="Stone Type"
                        firstInput="Select stone"
                        required
                        options={stonesList}
                        value={stone.stone}
                        onChange={(e) => {
                          updateStone(index, { stone: e.target.value });
                        }}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <InputField
                        label="Quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={stone.quantity || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 1;
                          updateStone(index, { quantity: value });
                        }}
                      />
                    </div>

                    {/* Total Price */}
                    <div className="space-y-2">
                      <InputField
                        label="Total Price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={stone.totalPrice || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0;
                          updateStone(index, { totalPrice: value });
                        }}
                      />
                    </div>
                  </div>

                  {/* Stone Options */}
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Optional Stone */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Optional Stone
                          </label>
                          <p className="text-xs text-gray-500">
                            Customer can choose to exclude this stone
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stone.isOptional}
                            onChange={(e) =>
                              updateStone(index, {
                                isOptional: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-customorange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-customorange"></div>
                        </label>
                      </div>

                      {/* Default Stone */}
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Default Selection
                          </label>
                          <p className="text-xs text-gray-500">
                            Pre-selected by default
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stone.isDefault}
                            onChange={(e) =>
                              updateStone(index, {
                                isDefault: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-customorange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-customorange"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Icon
                icon="material-symbols:diamond"
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
              />
              <p>No stones added yet</p>
              <p className="text-sm">
                Click "Add Stone" to configure gemstones for this product
              </p>
            </div>
          )}
        </div>

        {/* Occasions Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:event"
              className="w-5 h-5 text-customorange"
            />
            Suitable Occasions ({(formData.occasions || []).length} selected)
          </h3>

          {occasionsList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {occasionsList.map((occasion: any) => {
                const isSelected = (formData.occasions || []).includes(
                  occasion.value
                );
                return (
                  <button
                    key={occasion.value}
                    type="button"
                    onClick={() => toggleOccasion(occasion.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? "border-green-500 bg-green-100 text-green-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Icon
                            icon="material-symbols:check"
                            className="w-3 h-3 text-white"
                          />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {occasion.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Icon
                icon="material-symbols:event"
                className="w-12 h-12 mx-auto mb-3 text-gray-300"
              />
              <p>No occasions available</p>
              <p className="text-sm">
                Occasions will appear here when they are configured
              </p>
            </div>
          )}

          {formData.occasions && formData.occasions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Icon icon="material-symbols:info" className="w-4 h-4" />
                Selected occasions help customers find products for specific
                events
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-customorange"
            />
            Stones & Occasions Guide
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Gemstones:</strong> Configure different stone options
              that customers can choose from
            </p>
            <p>
              • <strong>Optional Stones:</strong> Allow customers to customize
              their jewelry by adding or removing stones
            </p>
            <p>
              • <strong>Default Selection:</strong> Pre-select stones that are
              commonly chosen
            </p>
            <p>
              • <strong>Occasions:</strong> Help customers find the perfect
              piece for their special events
            </p>
            <p>
              • <strong>Pricing:</strong> Stone prices are added to the base
              product price when selected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
