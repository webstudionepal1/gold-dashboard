"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import { FieldError } from "../../../auth/LoginPage";
import {
  useCreateProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductClaspsQuery,
  useGetAllProductSubCategoriesQuery,
  useUpdateProductsMutation,
} from "../../../../server/api/productHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PriceInputField } from "../../../OrderManagement/Order/components/PriceInputField";
import ChipInputInside from "../../ProductCategory/components/ChipInputInside";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../../components/shared/table_heading/Header";
import { productStore } from "../../../../store/productStore";
import {
  generateProductDefaultValue,
  type IProductFormValues,
  productFormSchema,
  type VisibilityType,
} from "../../productObj";
import MultiImageUploader from "../../../../components/shared/form_components/FileDropInput";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productData = useStore(productStore, (state) => state);
  console.log("productData", productData);

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

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const visibilityOptions = [
    { value: "featured", label: "Featured" },
    { value: "bestsellers", label: "Best Sellers" },
    { value: "popular", label: "Popular" },
    { value: "newarrivals", label: "New Arrivals" },
    { value: "recommended", label: "Recommended for you" },
  ];

  const formstate = id ?? "add";

  // Custom validation function
  const validateForm = (values: IProductFormValues) => {
    try {
      productFormSchema.parse(values);
      setFormErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string[]> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
      }
      setFormErrors(errors);
      console.log("Validation errors:", errors);
      return false;
    }
  };

  const form = useForm({
    defaultValues: generateProductDefaultValue(
      formstate,
      productData
    ) as IProductFormValues,
    validators: {
      onSubmit: productFormSchema, // Re-enabled validation
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);

      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("description", value.description);
        formData.append("category", value.category);

        if (value.subCategory && value.subCategory.trim() !== "") {
          formData.append("subCategory", value.subCategory);
        }

        value.variant.forEach((v, index: number) => {
          formData.append(`variant[${index}][price]`, String(v.price));
          formData.append(`variant[${index}][wt]`, v.wt.toString());
          formData.append(`variant[${index}][unit]`, v.unit ?? "gm");
        });

        formData.append("length", String(value.length));
        if (value.claspType) formData.append("claspType", value.claspType);
        formData.append("rhodoumFinishes", String(value.rhodoumFinishes));
        formData.append("shape", value.shape);
        formData.append("clarity", value.clarity);
        formData.append("dimension", String(value.dimension));
        formData.append("visibleAs", value.visibleAs);

        value.tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });

        // Handle image upload - Fix the field name mismatch
        if (value.images) {
          formData.append("images", value.images);
        }

        if (formstate !== "add") {
          // Handle existing images for update
          if (productData.images && productData.images.length > 0) {
            productData.images.forEach((img) =>
              formData.append(`existingImages`, img)
            );
          }
          updateProduct({ id: productData._id, body: formData });
        } else {
          createProduct(formData);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  useEffect(() => {
    if (productCreateSuccess || productUpdateSuccess) {
      form.reset();
      navigate("/product/product-list");
    }
  }, [productCreateSuccess, productUpdateSuccess]);

  // Helper function to get field errors
  const getFieldError = (fieldPath: string) => {
    return formErrors[fieldPath] || [];
  };

  // Debug: Log form state
  console.log("Form state:", form.state);
  console.log("Form values:", form.state.values);
  console.log("Form errors:", formErrors);

  return (
    <div className="p-2">
      <Header text={id === "add" ? "Add Product" : "Edit Product"} />

      {/* Debug Panel - Remove in production */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Form Submitting: {form.state.isSubmitting ? "Yes" : "No"}</p>
        <p>Form Mode: {formstate}</p>
        <p>Product Data Images: {JSON.stringify(productData?.images)}</p>
        <p>Existing Image: {form.getFieldValue("existingImage")}</p>
        <p>
          Current Image Value:{" "}
          {form.state.values.images ? "File selected" : "No file"}
        </p>
        <p>Form Errors: {JSON.stringify(formErrors, null, 2)}</p>
      </div> */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Form submit triggered");
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
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
                      {getFieldError("name").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("name").join(", ")}
                        </div>
                      )}
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
                          className="p-2 border rounded-md focus:outline-none resize-none"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <FieldError field={field} />
                      {getFieldError("description").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("description").join(", ")}
                        </div>
                      )}
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
                        {getFieldError("category").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("category").join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="subCategory">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Sub-Category"
                          firstInput="Select Sub Category"
                          options={subCategoriesList}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError field={field} />
                        {getFieldError("subCategory").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("subCategory").join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-lg">
              <form.Field name="variant" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between w-full py-2 mb-2 text-sm border-b">
                      <h2 className="text-base font-semibold text-gray-700">
                        Pricing
                      </h2>
                      <button
                        onClick={() =>
                          field.pushValue({ price: 0, wt: 0, unit: "gm" })
                        }
                        type="button"
                        className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2"
                      >
                        <Icon icon="ep:plus" width="18" height="18" />
                        Product Size
                      </button>
                    </div>
                    {getFieldError("variant").length > 0 && (
                      <div className="text-red-500 text-sm mb-2">
                        {getFieldError("variant").join(", ")}
                      </div>
                    )}
                    {field.state.value.map((_, i: number) => (
                      <div
                        key={i.toString()}
                        className="border rounded-md p-3 mb-2"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`variant[${i}].price`}>
                            {(subField) => (
                              <div>
                                <PriceInputField
                                  label="Base Price"
                                  placeholder="Enter base price"
                                  type="number"
                                  required
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value)
                                    )
                                  }
                                />
                                {getFieldError(`variant.${i}.price`).length >
                                  0 && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {getFieldError(`variant.${i}.price`).join(
                                      ", "
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </form.Field>

                          <form.Field name={`variant[${i}].wt`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="Size"
                                  type="number"
                                  required
                                  step="any"
                                  min="0"
                                  placeholder="Enter in gram"
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(
                                      Number(e.target.value) || 0
                                    )
                                  }
                                />
                                <FieldError field={subField} />
                                {getFieldError(`variant.${i}.wt`).length >
                                  0 && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {getFieldError(`variant.${i}.wt`).join(
                                      ", "
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </form.Field>
                        </div>
                        {i > 0 && (
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => field.removeValue(i)}
                              className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md"
                            >
                              <Icon
                                icon="mdi:delete"
                                className="text-red"
                                width="18"
                                height="18"
                              />
                              Remove
                            </button>
                          </div>
                        )}
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
                      {getFieldError("length").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("length").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="claspType">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Clasp Type"
                        firstInput="Select clasp type"
                        options={claspsList}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError("claspType").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("claspType").join(", ")}
                        </div>
                      )}
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
                      {getFieldError("rhodoumFinishes").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("rhodoumFinishes").join(", ")}
                        </div>
                      )}
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
                      {getFieldError("shape").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("shape").join(", ")}
                        </div>
                      )}
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
                      {getFieldError("clarity").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("clarity").join(", ")}
                        </div>
                      )}
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
                      {getFieldError("dimension").length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError("dimension").join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
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
                        onChange={() =>
                          field.handleChange(option.value as VisibilityType)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`visibility-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                  {getFieldError("visibleAs").length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {getFieldError("visibleAs").join(", ")}
                    </div>
                  )}
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
                  {getFieldError("tags").length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {getFieldError("tags").join(", ")}
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Image Upload Section - Fixed to match banner form exactly */}
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">Upload Product Image</h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>
              <form.Field name="images">
                {(field) => (
                  <MultiImageUploader
                    multiple={false}
                    form={form}
                    label=""
                    value={field.state.value}
                    existingFileField="existingImage"
                    accept={{
                      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
                    }}
                    existingFile={form.getFieldValue("existingImage")}
                    onChange={(file) => field.handleChange(file)}
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={pendingAddition || pendingUpdate}
              className="px-6 py-2 text-white rounded-md min-w-32 bg-orange hover:bg-orange-600 disabled:opacity-50"
            >
              {pendingAddition || pendingUpdate ? (
                <Icon icon="nrk:spinner" width={18} height={18} />
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
