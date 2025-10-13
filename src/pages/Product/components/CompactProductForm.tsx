/**
 * CompactProductForm - A single-page product form with modern UI using Formik
 *
 * DRY Principles Applied:
 * 1. FormSection component - Reusable section wrapper with consistent styling
 * 2. FieldGroup component - Responsive grid layout for form fields
 * 3. ErrorDisplay component - Consistent error message display
 * 4. Validation using Zod schema with Formik
 * 5. Shared form components - InputField, DropdownField, TextareaField
 * 6. Consistent styling patterns using Tailwind CSS classes
 * 7. Reusable event handlers for form updates
 */

import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ProductFormData } from "../../../components/shared/form_components/ProductFormContext";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { TextareaField } from "../../../components/shared/form_components/TextArea";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductSubCategoriesQuery,
} from "../../../server/api/productHooks";
import { mainProductFormSchema } from "../../../components/shared/form_components/validation/ProductFormValidation";
import { Form, FormikProvider, useFormik } from "formik";
import { DropdownTagField } from "@/components/shared/form_components/DropdownTags";
import { ProductMediaPage } from "../../../components/shared/form_components/product-form-pages/ProductMediaPage";

// Default Form Data
const defaultFormData: ProductFormData = {
  // Basic Information
  name: "",
  slug: "",
  description: "",
  productType: "gold",
  category: "",
  subCategory: "",
  existingImages: [],

  // Product Specifications
  length: 0,
  claspType: "",
  rhodoumFinishes: false,
  shape: "",
  quantity: 0,
  totalCarat: 0,
  color: "",
  clarity: "",
  dimension: 0,
  gender: undefined,
  makingCharges: 0,

  // Wastage
  wastage: undefined,

  // Product Variants
  variants: [
    {
      sku: "",
      price: 0,
      wt: 0,
      unit: "grams",
      isActive: true,
    },
  ],

  // Stones and Occasions
  stones: [],
  occasions: [],

  // Other Charges
  otherCharges: [],

  // Media Assets
  images: [],

  // SEO & Marketing
  tags: [],
  visibleAs: [],
  metadata: {
    seoTitle: "",
    seoDescription: "",
    keywords: [],
    vendor: "",
    barcode: "",
    compareAtPrice: 0,
  },

  // Inventory & Status
  isActive: true,
  isFeatured: false,
};

// Form Section Component for DRY principle
interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-md border border-gray-200 shadow-sm ${className}`}
  >
    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-md">
      <div className="flex items-center gap-2">
        <div className="p-1 bg-[#DF8D28]/10 rounded">
          <Icon icon={icon} className="w-4 h-4 text-[#DF8D28]" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-4">{children}</div>
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
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  return <div className={`grid ${getGridClasses()} gap-3`}>{children}</div>;
};

// Error Display Component
interface ErrorDisplayProps {
  errors: string[];
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => (
  <>
    {errors.map((error, index) => (
      <p key={index} className="text-red text-sm flex items-center gap-1 mt-1">
        <Icon icon="material-symbols:error" className="w-4 h-4" />
        {error}
      </p>
    ))}
  </>
);

// Main Form Content Component
const CompactFormContent: React.FC<{
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
  onCancel?: () => void;
  isEdit?: boolean;
  initialData?: Partial<ProductFormData>;
}> = ({ onSubmit, onCancel, isEdit = false, isLoading, initialData }) => {
  const formik = useFormik<ProductFormData>({
    initialValues: { ...defaultFormData, ...initialData },
    enableReinitialize: true,
    validate: (values) => {
      const result = mainProductFormSchema.safeParse(values);
      if (!result.success) {
        const errors: any = {};
        result.error.errors.forEach((error) => {
          const path = error.path.join(".");
          errors[path] = error.message;
        });
        return errors;
      }
      return {};
    },
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // API hooks
  const { data: categories } = useGetAllProductCategoriesQuery();
  const { data: subCategories } = useGetAllProductSubCategoriesQuery(
    {
      category: formik.values.category,
    },
    { enabled: !!formik.values.category }
  );

  // Transform data for dropdowns
  const categoryOptions =
    categories?.map((cat: any) => ({ value: cat._id, label: cat.name })) || [];
  const subCategoryOptions =
    subCategories?.map((sub: any) => ({ value: sub._id, label: sub.name })) ||
    [];

  // Helper functions for form updates
  const updateVariant = (index: number, field: string, value: any) => {
    const currentVariants = formik.values.variants || [];
    const newVariants = [...currentVariants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    formik.setFieldValue("variants", newVariants);
  };

  const addVariant = () => {
    const currentVariants = formik.values.variants || [];
    const newVariant = {
      sku: "",
      price: 0,
      wt: formik.values.productType === "normal" ? undefined : 0,
      unit: formik.values.productType === "normal" ? undefined : "grams",
      isActive: true,
    };
    formik.setFieldValue("variants", [...currentVariants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const currentVariants = formik.values.variants || [];
    const newVariants = currentVariants.filter((_, i) => i !== index);
    formik.setFieldValue("variants", newVariants);
  };

  const updateStone = (index: number, field: string, value: any) => {
    const currentStones = formik.values.stones || [];
    const newStones = [...currentStones];
    newStones[index] = { ...newStones[index], [field]: value };
    formik.setFieldValue("stones", newStones);
  };

  const addStone = () => {
    const currentStones = formik.values.stones || [];
    const newStone = {
      name: "",
      weight: 0,
      price: 0,
      color: "",
    };
    formik.setFieldValue("stones", [...currentStones, newStone]);
  };

  const removeStone = (index: number) => {
    const currentStones = formik.values.stones || [];
    const newStones = currentStones.filter((_, i) => i !== index);
    formik.setFieldValue("stones", newStones);
  };

  const updateOtherCharge = (index: number, field: string, value: any) => {
    const currentCharges = formik.values.otherCharges || [];
    const newCharges = [...currentCharges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    formik.setFieldValue("otherCharges", newCharges);
  };

  const addOtherCharge = () => {
    const currentCharges = formik.values.otherCharges || [];
    const newCharge = {
      name: "",
      price: 0,
    };
    formik.setFieldValue("otherCharges", [...currentCharges, newCharge]);
  };

  const removeOtherCharge = (index: number) => {
    const currentCharges = formik.values.otherCharges || [];
    const newCharges = currentCharges.filter((_, i) => i !== index);
    formik.setFieldValue("otherCharges", newCharges);
  };

  // Image handling functions for ProductMediaPage
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
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is handled by ProductMediaPage now
  };

  const removeImage = (index: number) => {
    // This is handled by ProductMediaPage now
  };
  console.log("errors", formik.errors);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Icon
                icon="material-symbols:refresh"
                className="w-6 h-6 text-[#DF8D28] animate-spin"
              />
              <p className="text-gray-900 font-medium">
                {isEdit ? "Updating product..." : "Creating product..."}
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
                <Icon
                  icon="material-symbols:inventory"
                  className="w-5 h-5 text-[#DF8D28]"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {isEdit ? "Edit Product" : "Create New Product"}
                </h1>
                <p className="text-xs text-gray-600">
                  Complete product information form
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormikProvider value={formik}>
        <Form
          onSubmit={formik.handleSubmit}
          className="max-w-7xl mx-auto md:px-0 px-2 py-2"
        >
          <div className="space-y-4 pb-16">
            {/* Basic Information */}
            <FormSection title="Basic Information" icon="material-symbols:info">
              <FieldGroup columns={3}>
                <div>
                  <InputField
                    label="Product Name"
                    placeholder="Enter product name"
                    required
                    value={formik.values.name}
                    onChange={(e) => {
                      formik.setFieldValue("name", e.target.value);
                    }}
                  />
                  {formik.errors.name && formik.touched.name && (
                    <ErrorDisplay errors={[formik.errors.name as string]} />
                  )}
                </div>
                <div>
                  <DropdownField
                    label="Product Type"
                    required
                    options={[
                      // { value: "", label: "Select Product Type" },
                      { value: "normal", label: "Normal" },
                      { value: "gold", label: "Gold" },
                      { value: "silver", label: "Silver" },
                      { value: "diamond", label: "Diamond" },
                    ]}
                    value={formik.values.productType || ""}
                    onChange={(e) => {
                      formik.setFieldValue("productType", e.target.value);
                    }}
                  />
                  {formik.errors.productType && formik.touched.productType && (
                    <ErrorDisplay
                      errors={[formik.errors.productType as string]}
                    />
                  )}
                </div>

                {/* Show additional fields only if product type is not 'normal' */}
                {formik.values.productType !== "normal" && (
                  <>
                    <div>
                      <DropdownField
                        label="Category"
                        required
                        options={[...categoryOptions]}
                        value={formik.values.category}
                        onChange={(e) => {
                          formik.setFieldValue("category", e.target.value);
                        }}
                      />
                      {formik.errors.category && formik.touched.category && (
                        <ErrorDisplay
                          errors={[formik.errors.category as string]}
                        />
                      )}
                    </div>

                    <div>
                      <DropdownField
                        label="Sub Category"
                        required
                        options={[...subCategoryOptions]}
                        value={formik.values.subCategory}
                        onChange={(e) => {
                          formik.setFieldValue("subCategory", e.target.value);
                        }}
                      />
                      {formik.errors.subCategory &&
                        formik.touched.subCategory && (
                          <ErrorDisplay
                            errors={[formik.errors.subCategory as string]}
                          />
                        )}
                    </div>

                    <div>
                      <DropdownField
                        label="Gender"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "unisex", label: "Unisex" },
                        ]}
                        value={formik.values.gender || ""}
                        onChange={(e) =>
                          formik.setFieldValue("gender", e.target.value)
                        }
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
                  value={formik.values.description}
                  onChange={(e) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                  showCharCount
                  maxLength={2000}
                />
                {formik.errors.description && formik.touched.description && (
                  <ErrorDisplay
                    errors={[formik.errors.description as string]}
                  />
                )}
              </div>
            </FormSection>

            {/* Product Specifications - Hide for normal products */}
            {formik.values.productType !== "normal" && (
              <FormSection
                title="Specifications"
                icon="material-symbols:straighten"
              >
                <FieldGroup columns={3}>
                  <div>
                    <InputField
                      label="Length (mm)"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      numberValue={formik.values.length || 0}
                      onNumberChange={(value) =>
                        formik.setFieldValue("length", value)
                      }
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                  </div>

                  <div>
                    <InputField
                      label="Width/Diameter (mm)"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      numberValue={formik.values.dimension || 0}
                      onNumberChange={(value) =>
                        formik.setFieldValue("dimension", value)
                      }
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                  </div>

                  <div>
                    <InputField
                      label="Making Charges"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      numberValue={formik.values.makingCharges || 0}
                      onNumberChange={(value) =>
                        formik.setFieldValue("makingCharges", value)
                      }
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                  </div>

                  <div>
                    <InputField
                      label="Color"
                      placeholder="Enter color"
                      value={formik.values.color || ""}
                      onChange={(e) =>
                        formik.setFieldValue("color", e.target.value)
                      }
                    />
                  </div>

                  {/* Show clarity only for diamond products */}
                  {formik.values.productType === "diamond" && (
                    <div>
                      <InputField
                        label="Clarity"
                        placeholder="Enter clarity"
                        value={formik.values.clarity}
                        onChange={(e) =>
                          formik.setFieldValue("clarity", e.target.value)
                        }
                      />
                    </div>
                  )}

                  <div>
                    <InputField
                      label="Total Karat"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      numberValue={formik.values.totalCarat || 0}
                      onNumberChange={(value) => {
                        formik.setFieldValue("totalCarat", value);
                      }}
                      allowNegative={false}
                      clearZeroOnFocus
                    />
                    {formik.errors.totalCarat && formik.touched.totalCarat && (
                      <ErrorDisplay
                        errors={[formik.errors.totalCarat as string]}
                      />
                    )}
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formik.values.rhodoumFinishes}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "rhodoumFinishes",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                      />
                      Rhodium Finishes
                    </label>
                  </div>
                </FieldGroup>

                {/* Wastage Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Wastage
                  </h4>
                  <FieldGroup columns={2}>
                    <div>
                      <DropdownField
                        required
                        label="Wastage Type"
                        options={[
                          { value: "per", label: "Percentage (%)" },
                          { value: "fixed", label: "Flat Amount" },
                        ]}
                        value={formik.values.wastage?.type || "per"}
                        onChange={(e) => {
                          const newWastage = {
                            type: e.target.value as "fixed" | "per",
                            value: formik.values.wastage?.value || 0,
                          };
                          formik.setFieldValue("wastage", newWastage);
                        }}
                      />
                    </div>

                    <div>
                      <InputField
                        label={
                          formik.values.wastage?.type === "per"
                            ? "Percentage (%)"
                            : "Amount"
                        }
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        numberValue={formik.values.wastage?.value || 0}
                        onNumberChange={(value) => {
                          const newWastage = {
                            type: formik.values.wastage?.type || "fixed",
                            value: value,
                          };
                          formik.setFieldValue("wastage", newWastage);
                        }}
                        allowNegative={false}
                        clearZeroOnFocus
                      />
                    </div>
                  </FieldGroup>
                  {formik.errors.wastage && formik.touched.wastage && (
                    <ErrorDisplay errors={[formik.errors.wastage as string]} />
                  )}
                </div>
              </FormSection>
            )}

            {/* Product Variants - Show simplified version for normal products */}
            <FormSection
              title={
                formik.values.productType === "normal"
                  ? "Pricing"
                  : "Variants & Pricing"
              }
              icon="material-symbols:inventory"
            >
              {formik.values.productType === "normal" ? (
                // Simplified pricing for normal products
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded p-3 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Product Price
                    </h4>
                    <div className="max-w-xs">
                      <InputField
                        label="Price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        numberValue={formik.values.variants[0]?.price || 0}
                        onNumberChange={(value) =>
                          updateVariant(0, "price", value)
                        }
                        allowNegative={false}
                        clearZeroOnFocus
                      />
                      {(formik.errors as any)["variants.0.price"] &&
                        formik.touched.variants?.[0]?.price && (
                          <ErrorDisplay
                            errors={[
                              (formik.errors as any)[
                                "variants.0.price"
                              ] as string,
                            ]}
                          />
                        )}
                    </div>
                  </div>
                </div>
              ) : (
                // Full variants for other product types
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-600">
                        Configure variants with pricing and inventory
                      </p>
                      <p className="text-xs text-gray-500">
                        {formik.values.variants.length} variant
                        {formik.values.variants.length !== 1 ? "s" : ""}
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
                    {formik.values.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#DF8D28] text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                Variant {index + 1}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {variant.price > 0
                                  ? `Rs.${variant.price}`
                                  : "No price"}
                                {formik.values.productType !== "normal" &&
                                  variant.wt > 0 &&
                                  variant.unit && (
                                    <>
                                      {" "}
                                      • {variant.wt} {variant.unit}
                                    </>
                                  )}
                              </p>
                            </div>
                          </div>
                          {formik.values.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="text-red hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Remove variant"
                            >
                              <Icon
                                icon="material-symbols:delete"
                                className="w-3 h-3"
                              />
                            </button>
                          )}
                        </div>

                        <FieldGroup
                          columns={
                            formik.values.productType === "normal" ? 1 : 3
                          }
                        >
                          {/* Show weight and unit only for non-normal products */}
                          {formik.values.productType !== "normal" && (
                            <>
                              <div>
                                <InputField
                                  label="Weight"
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  numberValue={variant.wt}
                                  onNumberChange={(value) =>
                                    updateVariant(index, "wt", value)
                                  }
                                  allowNegative={false}
                                  clearZeroOnFocus
                                />
                              </div>

                              <div>
                                <DropdownField
                                  label="Unit"
                                  options={[
                                    { value: "grams", label: "Grams" },
                                    { value: "kg", label: "Kilograms" },
                                    { value: "pieces", label: "Pieces" },
                                    { value: "carats", label: "Carats" },
                                  ]}
                                  value={variant.unit}
                                  onChange={(e) =>
                                    updateVariant(index, "unit", e.target.value)
                                  }
                                />
                              </div>
                            </>
                          )}

                          <div>
                            <InputField
                              label="Price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              numberValue={variant.price}
                              onNumberChange={(value) =>
                                updateVariant(index, "price", value)
                              }
                              allowNegative={false}
                              clearZeroOnFocus
                            />
                            {(formik.errors as any)[
                              `variants.${index}.price`
                            ] &&
                              formik.touched.variants?.[index]?.price && (
                                <ErrorDisplay
                                  errors={[
                                    (formik.errors as any)[
                                      `variants.${index}.price`
                                    ] as string,
                                  ]}
                                />
                              )}
                          </div>
                        </FieldGroup>

                        <div className="mt-2 flex items-center">
                          <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <input
                              type="checkbox"
                              checked={variant.isActive}
                              onChange={(e) =>
                                updateVariant(
                                  index,
                                  "isActive",
                                  e.target.checked
                                )
                              }
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
            {formik.values.productType !== "normal" && (
              <FormSection title="Gemstones" icon="material-symbols:diamond">
                <div className="space-y-3">
                  {formik.values.stones && formik.values.stones.length > 0 ? (
                    formik.values.stones.map((stone, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            Stone {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeStone(index)}
                            className="text-red hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove stone"
                          >
                            <Icon
                              icon="material-symbols:delete"
                              className="w-3 h-3"
                            />
                          </button>
                        </div>

                        <FieldGroup columns={4}>
                          <div>
                            <InputField
                              label="Stone Name"
                              placeholder="Enter stone name"
                              value={stone.name || ""}
                              onChange={(e) =>
                                updateStone(index, "name", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <InputField
                              label="Weight (Carats)"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              numberValue={stone.weight || 0}
                              onNumberChange={(value) =>
                                updateStone(index, "weight", value)
                              }
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
                              onNumberChange={(value) =>
                                updateStone(index, "price", value)
                              }
                              allowNegative={false}
                              clearZeroOnFocus
                            />
                          </div>

                          <div>
                            <InputField
                              label="Color"
                              placeholder="Enter color"
                              value={stone.color || ""}
                              onChange={(e) =>
                                updateStone(index, "color", e.target.value)
                              }
                            />
                          </div>
                        </FieldGroup>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">
                      No gemstones added yet
                    </p>
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
            {formik.values.productType !== "normal" && (
              <FormSection
                title="Other Charges"
                icon="material-symbols:receipt-long"
              >
                <div className="space-y-3">
                  {formik.values.otherCharges &&
                  formik.values.otherCharges.length > 0 ? (
                    formik.values.otherCharges.map((charge, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            Charge {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeOtherCharge(index)}
                            className="text-red hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove charge"
                          >
                            <Icon
                              icon="material-symbols:delete"
                              className="w-3 h-3"
                            />
                          </button>
                        </div>

                        <FieldGroup columns={2}>
                          <div>
                            <InputField
                              label="Charge Name"
                              placeholder="Enter charge name"
                              value={charge.name || ""}
                              onChange={(e) =>
                                updateOtherCharge(index, "name", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <InputField
                              label="Price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              numberValue={charge.price || 0}
                              onNumberChange={(value) =>
                                updateOtherCharge(index, "price", value)
                              }
                              allowNegative={false}
                              clearZeroOnFocus
                            />
                          </div>
                        </FieldGroup>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">
                      No additional charges added yet
                    </p>
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
              <ProductMediaPage
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                dragActive={dragActive}
                setDragActive={setDragActive}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                handleFileInputChange={handleFileInputChange}
                removeImage={removeImage}
                formik={formik}
                isEdit={isEdit}
                isLoading={isLoading}
              />
            </FormSection>

            {/* Tags - Required for all product types */}
            <FormSection title="Tags" icon="material-symbols:label">
              <div className="space-y-3">
                <p className="text-xs text-gray-600">
                  Add tags to help customers find your product (at least one
                  required)
                </p>
                <DropdownTagField
                  required
                  options={[
                    { value: "jewelry", label: "Jewelry" },
                    { value: "accessories", label: "Accessories" },
                    { value: "gifts", label: "Gifts" },
                    { value: "fashion", label: "Fashion" },
                    { value: "luxury", label: "Luxury" },
                    { value: "traditional", label: "Traditional" },
                    { value: "modern", label: "Modern" },
                    { value: "handmade", label: "Handmade" },
                    { value: "custom", label: "Custom" },
                    { value: "premium", label: "Premium" },
                  ]}
                  label="Product Tags"
                  values={formik.values.tags || []}
                  onChange={(newValues) => {
                    formik.setFieldValue("tags", newValues);
                  }}
                />
                {formik.errors.tags && formik.touched.tags && (
                  <ErrorDisplay errors={[formik.errors.tags as string]} />
                )}
              </div>
            </FormSection>

            {/* Status & Visibility Settings - Hide for normal products */}
            {formik.values.productType !== "normal" && (
              <FormSection
                title="Status & Visibility"
                icon="material-symbols:settings"
              >
                <FieldGroup columns={3}>
                  <div>
                    {/* <DropdownField
                      label="Visible As"
                      options={[
                        { value: "normal", label: "Normal" },
                        { value: "featured", label: "Featured" },
                        { value: "bestSellers", label: "Best Sellers" },
                        { value: "newArrivals", label: "New Arrivals" },
                        { value: "popular", label: "Popular" },
                        { value: "trending", label: "Trending" },
                      ]}
                      value={formik.values.visibleAs}
                      onChange={(e) =>
                        formik.setFieldValue("visibleAs", e.target.value)
                      }
                    /> */}
                    <DropdownTagField
                      required
                      options={[
                        { value: "normal", label: "Normal" },
                        { value: "featured", label: "Featured" },
                        { value: "bestSellers", label: "Best Sellers" },
                        { value: "newArrivals", label: "New Arrivals" },
                        { value: "popular", label: "Popular" },
                        { value: "trending", label: "Trending" },
                      ]}
                      label="Visible As"
                      values={formik.values.visibleAs}
                      onChange={(newValues) => {
                        formik.setFieldValue("visibleAs", newValues);
                      }}
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formik.values.isActive}
                        onChange={(e) =>
                          formik.setFieldValue("isActive", e.target.checked)
                        }
                        className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                      />
                      Active
                    </label>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formik.values.isFeatured}
                        onChange={(e) =>
                          formik.setFieldValue("isFeatured", e.target.checked)
                        }
                        className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28] w-3 h-3"
                      />
                      Featured
                    </label>
                  </div>
                </FieldGroup>
              </FormSection>
            )}

            {/* Submit Section */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Ready to {isEdit ? "update" : "create"} product?
                    </p>
                    <p className="text-xs text-gray-600">
                      Review all information before submitting
                    </p>
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
                      {isLoading && (
                        <Icon
                          icon="material-symbols:refresh"
                          className="w-3 h-3 animate-spin"
                        />
                      )}
                      <Icon
                        icon={
                          isEdit
                            ? "material-symbols:edit"
                            : "material-symbols:add"
                        }
                        className="w-3 h-3"
                      />
                      {isEdit ? "Update" : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

// Main Component with Provider
interface CompactProductFormProps {
  isLoading: boolean;
  onSubmit: (data: ProductFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ProductFormData>;
  isEdit?: boolean;
}

export const CompactProductForm: React.FC<CompactProductFormProps> = ({
  isLoading,
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}) => {
  return (
    <CompactFormContent
      isLoading={isLoading}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isEdit={isEdit}
      initialData={initialData}
    />
  );
};
