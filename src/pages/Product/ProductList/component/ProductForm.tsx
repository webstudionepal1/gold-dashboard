import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import { FieldError } from "../../../auth/LoginPage";
import * as z from "zod";
import {
  useCreateProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductClaspsQuery,
  useGetAllProductSubCategoriesQuery,
  useGetAllProductOccasionsQuery,
  useGetAllStonesQuery,
  useUpdateProductsMutation,
  useValidateSKUQuery,
} from "../../../../server/api/productHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PriceInputField } from "../../../OrderManagement/Order/components/PriceInputField";
import ChipInputInside from "../../ProductCategory/components/ChipInputInside";
import { useParams } from "react-router-dom";
import Header from "../../../../components/shared/table_heading/Header";
import { productStore } from "../../../../store/productStore";
import {
  generateProductDefaultValue,
  IProductFormValues,
  productFormSchema,
  UploadedImage,
} from "../../productObj";

const ProductForm = () => {
  const { id } = useParams();
  const productData = useStore(productStore, (state) => state);

  const {
    mutate: createProduct,
    isPending: pendingAddition,
    isSuccess: productCreateSuccess,
  } = useCreateProductsMutation();
  const {
    mutate: updateProduct,
    isPending: pendingUpdate,
    isSuccess: productUpdateSuccess,
  } = useUpdateProductsMutation();
  const { data: categories, isSuccess: categorySuccess } =
    useGetAllProductCategoriesQuery();
  const { data: subCategories, isSuccess: subSuccess } =
    useGetAllProductSubCategoriesQuery();
  const { data: clasps, isSuccess: claspsSuccess } =
    useGetAllProductClaspsQuery();
  const { data: occasions, isSuccess: occasionsSuccess } =
    useGetAllProductOccasionsQuery();
  const {
    data: stones,
    isSuccess: stonesSuccess,
    isLoading: stonesLoading,
    error: stonesError,
  } = useGetAllStonesQuery();

  const categoriesList = useMemo(
    () =>
      categorySuccess
        ? categories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [categorySuccess, categories]
  );

  const subCategoriesList = useMemo(
    () =>
      subSuccess
        ? subCategories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [subSuccess, subCategories]
  );

  const claspsList = useMemo(
    () =>
      claspsSuccess
        ? clasps.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [claspsSuccess, clasps]
  );

  const occasionsList = useMemo(
    () =>
      occasionsSuccess && Array.isArray(occasions)
        ? occasions.map((occasion) => ({
            value: occasion._id,
            label: occasion.name,
          }))
        : [],
    [occasionsSuccess, occasions]
  );

  const stonesList = useMemo(() => {
    console.log("Stones data:", {
      stones,
      stonesSuccess,
      stonesLoading,
      stonesError,
    });

    if (stonesSuccess && Array.isArray(stones)) {
      return stones.map((stone) => ({
        value: stone._id,
        label: `${stone.name} (${stone.carat}ct - ${stone.color})`,
      }));
    }
    return [];
  }, [stonesSuccess, stones, stonesLoading, stonesError]);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [skuValidationStates, setSKUValidationStates] = useState<{
    [key: string]: string;
  }>({});
  const visibilityOptions = [
    { value: "featured", label: "Featured" },
    { value: "bestsellers", label: "Best Sellers" },
    { value: "newarrivals", label: "New Arrivals" },
    { value: "recommended", label: "Recommended for you" },
  ];
  const formstate = id ?? "add";
  const form = useForm({
    defaultValues: generateProductDefaultValue(
      formstate,
      productData
    ) as IProductFormValues,
    validators: {
      onChange: productFormSchema,
      onSubmit: productFormSchema,
      onBlur: productFormSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      // Object.entries(value).forEach(([key, value]) => {
      //   if (key === "variant") {
      //     value.forEach((v, index: number) => {
      //       formData.append(`variant[${index}][price]`, String(v.price));
      //       formData.append(`variant[${index}][size]`, v.size);
      //       formData.append(`variant[${index}][unit]`, v.unit);
      //     });
      //   } else if (Array.isArray(value)) {
      //     value.forEach((item, index: number) => {
      //       formData.append(`${key}[${index}]`, item);
      //     });
      //   } else if (uploadedImages.some((img) => img.name === key)) {
      //     uploadedImages.find((img) => img.name === key)?.file &&
      //       formData.append(key, uploadedImages.find((img) => img.name === key)?.file);
      //   } else {
      //     formData.append(key, value);
      //   }
      // });
      formData.append("name", value.name);
      formData.append("description", value.description);
      formData.append("category", value.category);
      formData.append("subCategory", value.subCategory);

      value.variants.forEach((v, index: number) => {
        formData.append(`variants[${index}][sku]`, v.sku || "");
        formData.append(`variants[${index}][price]`, String(v.price));
        formData.append(`variants[${index}][wt]`, String(v.wt));
        formData.append(`variants[${index}][unit]`, v.unit);
        formData.append(`variants[${index}][totalStock]`, String(v.totalStock));
        formData.append(`variants[${index}][usedStock]`, String(v.usedStock));
        formData.append(
          `variants[${index}][remainingStock]`,
          String(v.remainingStock)
        );
        formData.append(
          `variants[${index}][reorderPoint]`,
          String(v.reorderPoint)
        );
        if (v.costPrice)
          formData.append(`variants[${index}][costPrice]`, String(v.costPrice));
        formData.append(`variants[${index}][isActive]`, String(v.isActive));
      });

      // Making charges
      formData.append("makingCharges", String(value.makingCharges));

      // Physical properties
      formData.append("length", String(value.length));
      if (value.claspType) formData.append("claspType", value.claspType);
      formData.append("rhodoumFinishes", String(value.rhodoumFinishes));
      formData.append("shape", value.shape);
      formData.append("quantity", String(value.quantity));
      if (value.totalCarat)
        formData.append("totalCarat", String(value.totalCarat));
      if (value.color) formData.append("color", value.color);
      formData.append("clarity", value.clarity);
      formData.append("dimension", String(value.dimension));

      // SEO and marketing
      formData.append("visibleAs", value.visibleAs);

      // Status flags
      formData.append("isActive", String(value.isActive));
      formData.append("isFeatured", String(value.isFeatured));

      // Metadata (if provided)
      if (value.metadata) {
        if (value.metadata.seoTitle)
          formData.append("metadata[seoTitle]", value.metadata.seoTitle);
        if (value.metadata.seoDescription)
          formData.append(
            "metadata[seoDescription]",
            value.metadata.seoDescription
          );
        if (value.metadata.keywords) {
          value.metadata.keywords.forEach((keyword, index) => {
            formData.append(`metadata[keywords][${index}]`, keyword);
          });
        }
        if (value.metadata.vendor)
          formData.append("metadata[vendor]", value.metadata.vendor);
        if (value.metadata.barcode)
          formData.append("metadata[barcode]", value.metadata.barcode);
        if (value.metadata.compareAtPrice)
          formData.append(
            "metadata[compareAtPrice]",
            String(value.metadata.compareAtPrice)
          );
      }

      value.tags.forEach((tag: string, index: number) => {
        formData.append(`tags[${index}]`, tag);
      });

      uploadedImages.forEach((img) => {
        formData.append(`images`, img.file);
      });
      if (id == "add") createProduct(formData);
      else updateProduct({ id: productData._id, body: formData });
    },
  });

  useEffect(() => {
    if (productCreateSuccess || productUpdateSuccess) form.reset();
  }, [productCreateSuccess, productUpdateSuccess]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file: File) => ({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      }));
      setUploadedImages([...uploadedImages, ...newImages].slice(0, 4));
    }
  };

  return (
    <div className="max-w-6xl p-2 mx-auto">
      <Header text={id === "add" ? "Add Product" : "Edit Product"} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column */}
        <div className="col-span-2 bg-white border rounded-md">
          <div className="col-span-2">
            {/* General Information Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                General Information
              </h2>

              <div className="space-y-4">
                <form.Field name="name">
                  {(field) => (
                    <div>
                      <InputField
                        label="Product Name"
                        required
                        placeholder="Enter product name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Enter short description"
                          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="category">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Category"
                          required
                          firstInput="Select Category"
                          options={categoriesList}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError field={field} />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="subCategory">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Sub-Category"
                          required
                          firstInput="Select Sub Category"
                          options={subCategoriesList}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError field={field} />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-lg">
              <form.Field name="variants" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between w-full py-2 mb-2 text-sm border-b">
                      <h2 className="text-base font-semibold text-gray-700 ">
                        Product Variants
                      </h2>
                      <button
                        onClick={() =>
                          field.pushValue({
                            sku: "", // Optional - will be auto-generated
                            price: 0,
                            wt: 0,
                            unit: "grams",
                            totalStock: 0,
                            usedStock: 0,
                            remainingStock: 0,
                            reorderPoint: 10,
                            isActive: true,
                          })
                        }
                        type="button"
                        className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2">
                        <Icon icon="ep:plus" width="18" height="18" />
                        Add Variant
                      </button>
                    </div>
                    {field.state.value.map((_, i: number) => (
                      <div
                        key={i.toString()}
                        className="border rounded-lg p-4 mb-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-700">
                            Variant {i + 1}
                          </h3>
                          {field.state.value.length > 1 && (
                            <button
                              type="button"
                              onClick={() => field.removeValue(i)}
                              className="text-red-500 hover:text-red-700">
                              <Icon icon="ep:delete" width="18" height="18" />
                            </button>
                          )}
                        </div>

                        {/* SKU and Basic Info */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                          <form.Field name={`variants[${i}].sku`}>
                            {(subField) => {
                              const skuKey = `variant-${i}-sku`;
                              const currentSKU = subField.state.value || "";

                              return (
                                <div>
                                  <InputField
                                    label="SKU"
                                    placeholder="Enter unique SKU (optional - auto-generated if empty)"
                                    value={currentSKU}
                                    onChange={(e) => {
                                      subField.handleChange(e.target.value);
                                      // Clear validation state when typing
                                      if (skuValidationStates[skuKey]) {
                                        setSKUValidationStates((prev) => ({
                                          ...prev,
                                          [skuKey]: "",
                                        }));
                                      }
                                    }}
                                    onBlur={async (e) => {
                                      const skuValue = e.target.value.trim();
                                      if (skuValue) {
                                        setSKUValidationStates((prev) => ({
                                          ...prev,
                                          [skuKey]: "validating",
                                        }));

                                        try {
                                          const response = await fetch(
                                            `/api/v1/en/validate-sku/${encodeURIComponent(
                                              skuValue
                                            )}`
                                          );
                                          const result = await response.json();

                                          setSKUValidationStates((prev) => ({
                                            ...prev,
                                            [skuKey]: result.success
                                              ? "valid"
                                              : "invalid",
                                          }));
                                        } catch (error) {
                                          setSKUValidationStates((prev) => ({
                                            ...prev,
                                            [skuKey]: "error",
                                          }));
                                        }
                                      } else {
                                        setSKUValidationStates((prev) => ({
                                          ...prev,
                                          [skuKey]: "",
                                        }));
                                      }
                                    }}
                                  />
                                  <FieldError field={subField} />

                                  {/* SKU Validation Status */}
                                  {currentSKU &&
                                    skuValidationStates[skuKey] && (
                                      <div className="mt-1">
                                        {skuValidationStates[skuKey] ===
                                          "validating" && (
                                          <p className="text-xs text-blue-500">
                                            <Icon
                                              icon="eos-icons:loading"
                                              className="inline mr-1"
                                            />
                                            Checking SKU availability...
                                          </p>
                                        )}
                                        {skuValidationStates[skuKey] ===
                                          "valid" && (
                                          <p className="text-xs text-green-600">
                                            <Icon
                                              icon="mdi:check-circle"
                                              className="inline mr-1"
                                            />
                                            SKU is available
                                          </p>
                                        )}
                                        {skuValidationStates[skuKey] ===
                                          "invalid" && (
                                          <p className="text-xs text-red-600">
                                            <Icon
                                              icon="mdi:alert-circle"
                                              className="inline mr-1"
                                            />
                                            SKU already exists
                                          </p>
                                        )}
                                        {skuValidationStates[skuKey] ===
                                          "error" && (
                                          <p className="text-xs text-red-600">
                                            <Icon
                                              icon="mdi:alert-circle"
                                              className="inline mr-1"
                                            />
                                            Error validating SKU
                                          </p>
                                        )}
                                      </div>
                                    )}

                                  <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to auto-generate SKU
                                  </p>
                                </div>
                              );
                            }}
                          </form.Field>
                          <form.Field name={`variants[${i}].unit`}>
                            {(subField) => (
                              <div>
                                <DropdownField
                                  label="Unit"
                                  required
                                  firstInput="Select Unit"
                                  options={[
                                    { value: "grams", label: "Grams" },
                                    { value: "kg", label: "Kilograms" },
                                    { value: "pieces", label: "Pieces" },
                                    { value: "carats", label: "Carats" },
                                  ]}
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Price and Weight */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                          <form.Field name={`variants[${i}].price`}>
                            {(subField) => (
                              <div>
                                <PriceInputField
                                  label="Price"
                                  placeholder="Enter price"
                                  type="number"
                                  required
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`variants[${i}].wt`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Weight"
                                  required
                                  type="number"
                                  placeholder="Enter weight"
                                  value={String(subField.state.value)}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Stock Management */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-4">
                          <form.Field name={`variants[${i}].totalStock`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Total Stock"
                                  required
                                  type="number"
                                  placeholder="0"
                                  value={String(subField.state.value)}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`variants[${i}].remainingStock`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Remaining Stock"
                                  required
                                  type="number"
                                  placeholder="0"
                                  value={String(subField.state.value)}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`variants[${i}].reorderPoint`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Reorder Point"
                                  required
                                  type="number"
                                  placeholder="10"
                                  value={String(subField.state.value)}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                        </div>

                        {/* Optional Fields */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`variants[${i}].costPrice`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Cost Price (Optional)"
                                  type="number"
                                  placeholder="Enter cost price"
                                  value={String(subField.state.value || "")}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                              </div>
                            )}
                          </form.Field>
                          <form.Field name={`variants[${i}].isActive`}>
                            {(subField) => (
                              <div className="flex items-center space-x-2 mt-6">
                                <input
                                  type="checkbox"
                                  id={`variant-active-${i}`}
                                  checked={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.checked)
                                  }
                                  className="rounded border-gray-300"
                                />
                                <label
                                  htmlFor={`variant-active-${i}`}
                                  className="text-sm font-medium text-gray-700">
                                  Active Variant
                                </label>
                              </div>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Product Specification */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Product Specification
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <form.Field name="length">
                  {(field) => (
                    <div>
                      <InputField
                        label="Length"
                        required
                        type="number"
                        placeholder="0"
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="claspType">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Clasp Type"
                        required
                        firstInput="Select clasp type"
                        options={claspsList}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="rhodoumFinishes">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Rhodoum Finishes"
                        required
                        firstInput="Select finish"
                        options={[
                          { value: "true", label: "Yes" },
                          { value: "false", label: "No" },
                        ]}
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(e.target.value === "true")
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Material Information */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Material Information
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <form.Field name="shape">
                  {(field) => (
                    <div>
                      <InputField
                        label="Shape"
                        required
                        placeholder="Enter shape"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="clarity">
                  {(field) => (
                    <div>
                      <InputField
                        label="Clarity"
                        required
                        placeholder="Enter clarity"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="dimension">
                  {(field) => (
                    <div>
                      <InputField
                        label="Dimension"
                        required
                        type="number"
                        placeholder="0"
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Occasions Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Occasions (Optional)
              </h2>

              <form.Field name="occasions" mode="array">
                {(field) => (
                  <div>
                    <DropdownField
                      label="Select Occasions"
                      firstInput="Select occasions for this product"
                      options={occasionsList}
                      value={field.state.value?.[0] || ""}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (
                          selectedValue &&
                          !field.state.value?.includes(selectedValue)
                        ) {
                          field.pushValue(selectedValue);
                        }
                      }}
                    />

                    {/* Display selected occasions */}
                    {field.state.value && field.state.value.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">
                          Selected occasions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.state.value.map(
                            (occasionId: string, index: number) => {
                              const occasion = occasions?.find(
                                (o) => o._id === occasionId
                              );
                              return (
                                <span
                                  key={occasionId}
                                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  {occasion?.name || occasionId}
                                  <button
                                    type="button"
                                    onClick={() => field.removeValue(index)}
                                    className="ml-1 text-blue-600 hover:text-blue-800">
                                    <Icon
                                      icon="mdi:close"
                                      className="w-3 h-3"
                                    />
                                  </button>
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Stones Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Stones (Optional)
                {stonesLoading && (
                  <span className="text-sm text-blue-500 ml-2">
                    Loading stones...
                  </span>
                )}
                {stonesError && (
                  <span className="text-sm text-red-500 ml-2">
                    Error loading stones
                  </span>
                )}
              </h2>

              <form.Field name="stones" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        Add stones to this product
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          field.pushValue({
                            stone: "",
                            quantity: 1,
                            totalPrice: 0,
                            isOptional: true,
                            isDefault: false,
                          })
                        }
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        <Icon icon="mdi:plus" className="inline mr-1" />
                        Add Stone
                      </button>
                    </div>

                    {field.state.value &&
                      field.state.value.map((stone: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded p-3 mb-3 bg-gray-50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-700">
                              Stone {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => field.removeValue(index)}
                              className="text-red-500 hover:text-red-700">
                              <Icon icon="mdi:delete" className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <form.Field name={`stones[${index}].stone`}>
                              {(subField) => (
                                <div>
                                  <DropdownField
                                    label="Stone"
                                    required
                                    firstInput={
                                      stonesList.length > 0
                                        ? "Select stone"
                                        : "No stones available"
                                    }
                                    options={stonesList}
                                    value={String(subField.state.value || "")}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                  <FieldError field={subField} />
                                  {stonesList.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      No stones available. Please add stones
                                      first.
                                    </p>
                                  )}
                                </div>
                              )}
                            </form.Field>

                            <form.Field name={`stones[${index}].quantity`}>
                              {(subField) => (
                                <div>
                                  <InputField
                                    label="Quantity"
                                    required
                                    type="number"
                                    placeholder="1"
                                    value={String(subField.state.value)}
                                    onChange={(e) =>
                                      subField.handleChange(
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                  <FieldError field={subField} />
                                </div>
                              )}
                            </form.Field>

                            <form.Field name={`stones[${index}].totalPrice`}>
                              {(subField) => (
                                <div>
                                  <PriceInputField
                                    label="Total Price"
                                    required
                                    type="number"
                                    placeholder="0"
                                    value={String(subField.state.value || "")}
                                    onChange={(e) =>
                                      subField.handleChange(
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                  <FieldError field={subField} />
                                </div>
                              )}
                            </form.Field>

                            <div className="flex gap-4">
                              <form.Field name={`stones[${index}].isOptional`}>
                                {(subField) => (
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(subField.state.value)}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.checked)
                                      }
                                      className="mr-2"
                                    />
                                    <span className="text-sm">Optional</span>
                                  </label>
                                )}
                              </form.Field>

                              <form.Field name={`stones[${index}].isDefault`}>
                                {(subField) => (
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(subField.state.value)}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.checked)
                                      }
                                      className="mr-2"
                                    />
                                    <span className="text-sm">Default</span>
                                  </label>
                                )}
                              </form.Field>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 ">
          {/* Visibility Options - Radio Buttons */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Visible as</h2>

            <form.Field name="visibleAs">
              {(field) => (
                <div className="space-y-2">
                  {visibilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`visibility-${option.value}`}
                        value={option.value}
                        checked={field.state.value === option.value}
                        // onChange={() => field.setValue(() => option.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`visibility-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          {/* Product Tags */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Product Tags</h2>

            <form.Field name="tags">
              {(field) => (
                <div>
                  <ChipInputInside field={field} />
                  {/* <div className="flex flex-wrap gap-2">
                 
                  </div> */}
                </div>
              )}
            </form.Field>
          </div>

          {/* Upload Photos */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Upload Photos</h2>

            <div className="p-8 mb-4 text-center border-2 border-dashed rounded-lg">
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                JPEG, PNG, SVG or JPG
              </p>
              <p className="mt-1 text-xs text-gray-400">
                (Max file size 800 KB)
              </p>

              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block px-4 py-2 mt-4 text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                Browse File
              </label>
            </div>

            {/* Preview of uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="overflow-hidden border rounded">
                    <img
                      src={img.url}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-16"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-md bg-orange hover:bg-orange-600">
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
