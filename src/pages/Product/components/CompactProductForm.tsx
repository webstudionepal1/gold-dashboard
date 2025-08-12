/**
 * CompactProductForm - A single-page product form with modern UI
 *
 * DRY Principles Applied:
 * 1. FormSection component - Reusable section wrapper with consistent styling
 * 2. FieldGroup component - Responsive grid layout for form fields
 * 3. ErrorDisplay component - Consistent error message display
 * 4. Validation helper functions - Centralized validation logic
 * 5. Shared form components - InputField, DropdownField, TextareaField
 * 6. Consistent styling patterns using Tailwind CSS classes
 * 7. Reusable event handlers for form updates
 */

import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ProductFormProvider, useProductForm, ProductFormData } from "../../../components/shared/form_components/ProductFormContext";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { TextareaField } from "../../../components/shared/form_components/TextArea";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductSubCategoriesQuery
} from "../../../server/api/productHooks";

// Form Section Component for DRY principle
interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-md border border-gray-200 shadow-sm ${className}`}>
    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-md">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-[#DF8D28]/10 rounded">
          <Icon icon={icon} className="w-4 h-4 text-[#DF8D28]" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

// Reusable Field Group Component
interface FieldGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

const FieldGroup: React.FC<FieldGroupProps> = ({ children, columns = 2 }) => {
  const getGridClasses = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2';
    }
  };

  return (
    <div className={`grid ${getGridClasses()} gap-3`}>
      {children}
    </div>
  );
};

// Error Display Component
interface ErrorDisplayProps {
  errors: string[];
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => (
  <>
    {errors.map((error, index) => (
      <p key={index} className="text-red-500 text-sm flex items-center gap-1 mt-1">
        <Icon icon="material-symbols:error" className="w-4 h-4" />
        {error}
      </p>
    ))}
  </>
);

// Main Form Content Component
const CompactFormContent: React.FC<{
  onSubmit: (data: ProductFormData) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}> = ({ onSubmit, onCancel, isEdit = false }) => {
  const { formData, updateFormData, validationState, isLoading, setIsLoading } = useProductForm();

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // API hooks
  const { data: categories } = useGetAllProductCategoriesQuery();
  const { data: subCategories } = useGetAllProductSubCategoriesQuery();

  // Transform data for dropdowns
  const categoryOptions = categories?.map((cat: any) => ({ value: cat._id, label: cat.name })) || [];
  const subCategoryOptions = subCategories?.map((sub: any) => ({ value: sub._id, label: sub.name })) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const addVariant = () => {
    const newVariant = {
      sku: "",
      price: 0,
      wt: 0,
      unit: "grams" as const,
      totalStock: 0,
      usedStock: 0,
      remainingStock: 0,
      reorderPoint: 10,
      isActive: true,
    };
    updateFormData({ variants: [...formData.variants, newVariant] });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      updateFormData({ variants: newVariants });
    }
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    updateFormData({ variants: newVariants });
  };

  // Stone management functions
  const addStone = () => {
    const newStone = {
      name: "",
      weight: 0,
      price: 0,
      color: "",
    };
    const currentStones = formData.stones || [];
    updateFormData({ stones: [...currentStones, newStone] });
  };

  const removeStone = (index: number) => {
    const currentStones = formData.stones || [];
    if (currentStones.length > 0) {
      const newStones = currentStones.filter((_, i) => i !== index);
      updateFormData({ stones: newStones });
    }
  };

  const updateStone = (index: number, field: string, value: any) => {
    const currentStones = formData.stones || [];
    const newStones = [...currentStones];
    newStones[index] = { ...newStones[index], [field]: value };
    updateFormData({ stones: newStones });
  };

  // Other charges management functions
  const addOtherCharge = () => {
    const newCharge = {
      name: "",
      price: 0,
    };
    const currentCharges = formData.otherCharges || [];
    updateFormData({ otherCharges: [...currentCharges, newCharge] });
  };

  const removeOtherCharge = (index: number) => {
    const currentCharges = formData.otherCharges || [];
    if (currentCharges.length > 0) {
      const newCharges = currentCharges.filter((_, i) => i !== index);
      updateFormData({ otherCharges: newCharges });
    }
  };

  const updateOtherCharge = (index: number, field: string, value: any) => {
    const currentCharges = formData.otherCharges || [];
    const newCharges = [...currentCharges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    updateFormData({ otherCharges: newCharges });
  };

  // Image upload functions
  const handleImageUpload = async (files: File[]) => {
    // Limit to 10 images total
    const maxImages = 10;
    const currentImageCount = selectedImages.length;
    const availableSlots = maxImages - currentImageCount;
    const filesToAdd = files.slice(0, availableSlots);

    const newImages = [...selectedImages, ...filesToAdd];
    setSelectedImages(newImages);

    // Store actual File objects in form data
    const existingImages = formData.images || [];
    const allImages = [...existingImages, ...filesToAdd];
    updateFormData({ images: allImages });
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleImageUpload(files);
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleImageUpload(files);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    // Update form data
    const newFormImages = (formData.images || []).filter((_, i) => i !== index);
    updateFormData({ images: newFormImages });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Icon icon="material-symbols:refresh" className="w-6 h-6 text-[#DF8D28] animate-spin" />
              <p className="text-gray-900 font-medium">
                {isEdit ? 'Updating product...' : 'Creating product...'}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#DF8D28]/10 rounded">
                <Icon icon="material-symbols:inventory" className="w-5 h-5 text-[#DF8D28]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {isEdit ? 'Edit Product' : 'Create New Product'}
                </h1>
                <p className="text-xs text-gray-600">
                  Complete product information form
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto md:px-0 px-2 py-2">
        <div className="space-y-4 pb-16">
          {/* Basic Information */}
          <FormSection title="Basic Information" icon="material-symbols:info">
                <FieldGroup columns={3}>
                  <div>
                    <InputField
                      label="Product Name"
                      placeholder="Enter product name"
                      required
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                    />
                    <ErrorDisplay errors={validationState.name?.errors || []} />
                  </div>
                  <div>
                    <DropdownField
                      label="Product Type"
                      required
                      options={[
                        { value: '', label: 'Select Product Type' },
                        { value: 'normal', label: 'Normal' },
                        // { value: 'diamond', label: 'Diamond' },
                        { value: 'gold', label: 'Gold' },
                        { value: 'silver', label: 'Silver' }
                      ]}
                      value={formData.productType || ''}
                      onChange={(e) => updateFormData({ productType: e.target.value as any })}
                    />
                    <ErrorDisplay errors={validationState.productType?.errors || []} />
                  </div>

                  {/* Show additional fields only if product type is not 'normal' */}
                  {formData.productType !== 'normal' && (
                    <>
                      <div>
                        <DropdownField
                          label="Category"
                          required
                          options={[{ value: '', label: 'Select Category' }, ...categoryOptions]}
                          value={formData.category}
                          onChange={(e) => updateFormData({ category: e.target.value })}
                        />
                        <ErrorDisplay errors={validationState.category?.errors || []} />
                      </div>

                      <div>
                        <DropdownField
                          label="Sub Category"
                          required
                          options={[{ value: '', label: 'Select Sub Category' }, ...subCategoryOptions]}
                          value={formData.subCategory}
                          onChange={(e) => updateFormData({ subCategory: e.target.value })}
                        />
                        <ErrorDisplay errors={validationState.subCategory?.errors || []} />
                      </div>

                      <div>
                        <DropdownField
                          label="Gender"
                          options={[
                            { value: '', label: 'Select Gender' },
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'unisex', label: 'Unisex' }
                          ]}
                          value={formData.gender || ''}
                          onChange={(e) => updateFormData({ gender: e.target.value as any })}
                        />
                      </div>
                    </>
                  )}
                </FieldGroup>
                
                <div className="mt-3">
                  <TextareaField
                    label="Description"
                    placeholder="Enter product description"
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    showCharCount
                    maxLength={2000}
                  />
                  <ErrorDisplay errors={validationState.description?.errors || []} />
                </div>
              </FormSection>

              {/* Product Specifications - Hide for normal products */}
              {formData.productType !== 'normal' && (
                <FormSection title="Specifications" icon="material-symbols:straighten">
                <FieldGroup columns={3}>
                  <div>
                    <InputField
                      label="Length (mm)"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      numberValue={formData.length || 0}
                      onNumberChange={(value) => updateFormData({ length: value })}
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                    <ErrorDisplay errors={validationState.length?.errors || []} />
                  </div>

                  <div>
                    <InputField
                      label="Width/Diameter (mm)"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      numberValue={formData.dimension || 0}
                      onNumberChange={(value) => updateFormData({ dimension: value })}
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                    <ErrorDisplay errors={validationState.dimension?.errors || []} />
                  </div>

                  <div>
                    <InputField
                      label="Making Charges"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      numberValue={formData.makingCharges || 0}
                      onNumberChange={(value) => updateFormData({ makingCharges: value })}
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                  </div>

                  <div>
                    <InputField
                      label="Color"
                      placeholder="Enter color"
                      value={formData.color || ''}
                      onChange={(e) => updateFormData({ color: e.target.value })}
                    />
                  </div>

                  {/* Show clarity only for diamond products */}
                  {formData.productType === 'diamond' && (
                    <div>
                      <InputField
                        label="Clarity"
                        placeholder="Enter clarity"
                        value={formData.clarity}
                        onChange={(e) => updateFormData({ clarity: e.target.value })}
                      />
                    </div>
                  )}

                  <div>
                    <InputField
                      label="Total Karat"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      numberValue={formData.totalCarat || 0}
                      onNumberChange={(value) => updateFormData({ totalCarat: value })}
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.rhodoumFinishes}
                        onChange={(e) => updateFormData({ rhodoumFinishes: e.target.checked })}
                        className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                      />
                      Rhodium Finishes
                    </label>
                  </div>
                </FieldGroup>

                {/* Wastage Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Wastage</h4>
                  <FieldGroup columns={2}>
                    <div>
                      <DropdownField
                        label="Wastage Type"
                        options={[
                          { value: '', label: 'Select Type' },
                          { value: 'per', label: 'Percentage (%)' },
                          { value: 'fixed', label: 'Flat Amount' }
                        ]}
                        value={formData.wastage?.type || ''}
                        onChange={(e) => updateFormData({
                          wastage: {
                            type: e.target.value as "fixed" | "per",
                            value: formData.wastage?.value || 0
                          }
                        })}
                      />
                    </div>

                    <div>
                      <InputField
                        label={formData.wastage?.type === 'per' ? 'Percentage (%)' : 'Amount'}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        numberValue={formData.wastage?.value || 0}
                        onNumberChange={(value) => updateFormData({
                          wastage: {
                            type: formData.wastage?.type || 'fixed',
                            value: value
                          }
                        })}
                        allowNegative={false}
                        clearZeroOnFocus
                      />
                    </div>
                  </FieldGroup>
                </div>
              </FormSection>
              )}

              {/* Product Variants - Show simplified version for normal products */}
              <FormSection title={formData.productType === 'normal' ? 'Pricing' : 'Variants & Pricing'} icon="material-symbols:inventory">
                {formData.productType === 'normal' ? (
                  // Simplified pricing for normal products
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded p-3 border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Product Price</h4>
                      <div className="max-w-xs">
                        <InputField
                          label="Price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          numberValue={formData.variants[0]?.price || 0}
                          onNumberChange={(value) => updateVariant(0, 'price', value)}
                          allowNegative={false}
                          clearZeroOnFocus
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Full variants for other product types
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Configure variants with pricing and inventory</p>
                        <p className="text-xs text-gray-500">
                          {formData.variants.length} variant{formData.variants.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#DF8D28] text-white rounded text-xs font-medium hover:bg-[#B8691A] transition-colors"
                      >
                        <Icon icon="material-symbols:add" className="w-3 h-3" />
                        Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-[#DF8D28] text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Variant {index + 1}</h4>
                                <p className="text-xs text-gray-500">
                                  {variant.price > 0 ? `₹${variant.price}` : 'No price'} • {variant.wt > 0 ? `${variant.wt} ${variant.unit}` : 'No weight'}
                                </p>
                              </div>
                            </div>
                            {formData.variants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remove variant"
                              >
                                <Icon icon="material-symbols:delete" className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <FieldGroup columns={3}>
                            <div>
                              <InputField
                                label="Price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                numberValue={variant.price}
                                onNumberChange={(value) => updateVariant(index, 'price', value)}
                                allowNegative={false}
                                clearZeroOnFocus
                              />
                            </div>

                            <div>
                              <InputField
                                label="Weight"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                numberValue={variant.wt}
                                onNumberChange={(value) => updateVariant(index, 'wt', value)}
                                allowNegative={false}
                                clearZeroOnFocus
                              />
                            </div>

                            <div>
                              <DropdownField
                                label="Unit"
                                options={[
                                  { value: 'grams', label: 'Grams' },
                                  { value: 'kg', label: 'Kilograms' },
                                  { value: 'pieces', label: 'Pieces' },
                                  { value: 'carats', label: 'Carats' }
                                ]}
                                value={variant.unit}
                                onChange={(e) => updateVariant(index, 'unit', e.target.value)}
                              />
                            </div>
                          </FieldGroup>

                          <div className="mt-2 flex items-center">
                            <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                              <input
                                type="checkbox"
                                checked={variant.isActive}
                                onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                                className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                              />
                              Active
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </FormSection>

              {/* Gemstones - Hide for normal products */}
              {formData.productType !== 'normal' && (
                <FormSection title="Gemstones" icon="material-symbols:diamond">
                <div className="space-y-3">
                  {formData.stones && formData.stones.length > 0 ? (
                    formData.stones.map((stone, index) => (
                      <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Stone {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeStone(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove stone"
                          >
                            <Icon icon="material-symbols:delete" className="w-3 h-3" />
                          </button>
                        </div>

                        <FieldGroup columns={4}>
                          <div>
                            <InputField
                              label="Stone Name"
                              placeholder="Enter stone name"
                              value={stone.name || ''}
                              onChange={(e) => updateStone(index, 'name', e.target.value)}
                            />
                          </div>

                          <div>
                            <InputField
                              label="Weight (Carats)"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              numberValue={stone.weight || 0}
                              onNumberChange={(value) => updateStone(index, 'weight', value)}
                              allowNegative={false}
                              clearZeroOnFocus
                            />
                          </div>

                          <div>
                            <InputField
                              label="Price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              numberValue={stone.price || 0}
                              onNumberChange={(value) => updateStone(index, 'price', value)}
                              allowNegative={false}
                              clearZeroOnFocus
                            />
                          </div>

                          <div>
                            <InputField
                              label="Color"
                              placeholder="Enter color"
                              value={stone.color || ''}
                              onChange={(e) => updateStone(index, 'color', e.target.value)}
                            />
                          </div>
                        </FieldGroup>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No gemstones added yet</p>
                  )}

                  <button
                    type="button"
                    onClick={addStone}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#DF8D28] text-white rounded text-xs font-medium hover:bg-[#B8691A] transition-colors w-full justify-center"
                  >
                    <Icon icon="material-symbols:add" className="w-3 h-3" />
                    Add Gemstone
                  </button>
                </div>
              </FormSection>
              )}

              {/* Other Charges - Hide for normal products */}
              {formData.productType !== 'normal' && (
                <FormSection title="Other Charges" icon="material-symbols:receipt-long">
                <div className="space-y-3">
                  {formData.otherCharges && formData.otherCharges.length > 0 ? (
                    formData.otherCharges.map((charge, index) => (
                      <div key={index} className="bg-gray-50 rounded p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Charge {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeOtherCharge(index)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove charge"
                          >
                            <Icon icon="material-symbols:delete" className="w-3 h-3" />
                          </button>
                        </div>

                        <FieldGroup columns={2}>
                          <div>
                            <InputField
                              label="Charge Name"
                              placeholder="Enter charge name"
                              value={charge.name || ''}
                              onChange={(e) => updateOtherCharge(index, 'name', e.target.value)}
                            />
                          </div>

                          <div>
                            <InputField
                              label="Price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              numberValue={charge.price || 0}
                              onNumberChange={(value) => updateOtherCharge(index, 'price', value)}
                              allowNegative={false}
                              clearZeroOnFocus
                            />
                          </div>
                        </FieldGroup>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No additional charges added yet</p>
                  )}

                  <button
                    type="button"
                    onClick={addOtherCharge}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#DF8D28] text-white rounded text-xs font-medium hover:bg-[#B8691A] transition-colors w-full justify-center"
                  >
                    <Icon icon="material-symbols:add" className="w-3 h-3" />
                    Add Other Charge
                  </button>
                </div>
              </FormSection>
              )}



              {/* Product Images - Show for all product types */}
              <FormSection title="Product Images" icon="material-symbols:image">
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">Upload product images (Max 10)</p>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded p-4 text-center transition-colors cursor-pointer ${
                      dragActive
                        ? "border-[#DF8D28] bg-orange-50"
                        : "border-gray-300 hover:border-[#DF8D28]"
                    } ${selectedImages.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (selectedImages.length < 10) {
                        document.getElementById('product-images')?.click();
                      }
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="product-images"
                      disabled={selectedImages.length >= 10}
                    />

                    <div className="flex flex-col items-center gap-2">
                      <Icon
                        icon="material-symbols:cloud-upload"
                        className="w-8 h-8 text-gray-400"
                      />
                      <div>
                        <p className="text-xs text-gray-500">
                          {selectedImages.length >= 10
                            ? 'Maximum 10 images reached'
                            : 'Drag and drop images or click to browse'
                          }
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {selectedImages.length}/10 images
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded border border-gray-200"
                            />

                            {/* Primary Image Badge */}
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-[#DF8D28] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                Primary
                              </div>
                            )}

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >
                              <Icon icon="material-symbols:close" className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Existing Images (for edit mode) */}
                  {!selectedImages.length && formData.existingImages && formData.existingImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {formData.existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square">
                            <img
                              src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${imageUrl}`}
                              alt={`Existing Product ${index + 1}`}
                              className="w-full h-full object-cover rounded border border-gray-200"
                            />
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-[#DF8D28] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                Primary
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info Message */}
                  {selectedImages.length > 0 && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <Icon icon="material-symbols:info" className="w-3 h-3" />
                        The first image will be used as the primary product image.
                      </p>
                    </div>
                  )}
                </div>
              </FormSection>

              {/* Status & Visibility Settings - Hide for normal products */}
              {formData.productType !== 'normal' && (
                <FormSection title="Status & Visibility" icon="material-symbols:settings">
                <FieldGroup columns={3}>
                  <div>
                    <DropdownField
                      label="Visibility"
                      options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'featured', label: 'Featured' },
                        { value: 'bestSellers', label: 'Best Sellers' },
                        { value: 'newArrivals', label: 'New Arrivals' }
                      ]}
                      value={formData.visibleAs}
                      onChange={(e) => updateFormData({ visibleAs: e.target.value as any })}
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => updateFormData({ isActive: e.target.checked })}
                        className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                      />
                      Product Active
                    </label>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => updateFormData({ isFeatured: e.target.checked })}
                        className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                      />
                      Featured Product
                    </label>
                  </div>
                </FieldGroup>
              </FormSection>
              )}

          {/* Form Actions */}
          <div className="bg-white rounded-md border border-gray-200 shadow-sm sticky bottom-2">
            <div className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-gray-600">
                  <p>Fill required fields before saving</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-[#DF8D28] text-white rounded hover:bg-[#B8691A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    {isLoading && <Icon icon="material-symbols:refresh" className="w-3 h-3 animate-spin" />}
                    <Icon icon={isEdit ? "material-symbols:edit" : "material-symbols:add"} className="w-3 h-3" />
                    {isEdit ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Main Component with Provider
interface CompactProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ProductFormData>;
  isEdit?: boolean;
}

export const CompactProductForm: React.FC<CompactProductFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}) => {
  return (
    <ProductFormProvider initialData={initialData} totalSteps={1}>
      <CompactFormContent onSubmit={onSubmit} onCancel={onCancel} isEdit={isEdit} />
    </ProductFormProvider>
  );
};
