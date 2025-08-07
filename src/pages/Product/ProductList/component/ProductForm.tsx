import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import { FieldError } from "../../../auth/LoginPage";
import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductClaspsQuery,
  useGetAllProductSubCategoriesQuery,
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
import { cleanObject } from "../../../../utils/cleanObject";
import { useClearableNumberInput } from "../../../../utils/numberInputHelpers";

// Note: Using IFetchSubCategory interface from your existing types

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productData = useStore(productStore, (state) => state);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  // Only fetch subcategories when a category is selected and categories are successfully loaded
  const {
    data: subCategoriesData,
    isSuccess: subSuccess,
    isLoading: subLoading,
  } = useGetAllProductSubCategoriesQuery(
    selectedCategory && categorySuccess
      ? {
          categoryId: selectedCategory,
          category: selectedCategory,
          categoryID: selectedCategory,
        }
      : undefined
  );

  const { data: clasps, isSuccess: claspsSuccess } =
    useGetAllProductClaspsQuery();

  const subCategoriesArray = useMemo(() => {
    if (!subCategoriesData || !Array.isArray(subCategoriesData)) {
      console.log("No subcategories in response:", subCategoriesData);
      return [];
    }
    console.log("Extracted subCategories:", subCategoriesData);
    return subCategoriesData;
  }, [subCategoriesData]);

  const categoriesList = useMemo(() => {
    const list =
      categorySuccess && categories
        ? categories.map((item) => ({ label: item.name, value: item._id }))
        : [];
    console.log("Categories list:", list);
    return list;
  }, [categorySuccess, categories]);

  // Create subcategories list - only show when category is selected
  const subCategoriesList = useMemo(() => {
    // Don't show subcategories if no category is selected
    if (!selectedCategory || !categorySuccess) {
      return [];
    }

    if (!subSuccess || !Array.isArray(subCategoriesArray)) {
      console.log("No subcategories available due to:", {
        selectedCategory,
        categorySuccess,
        subSuccess,
        isArray: Array.isArray(subCategoriesArray),
        subCategoriesLength: subCategoriesArray?.length || 0,
      });
      return [];
    }

    const mapped = subCategoriesArray.map((item) => ({
      label: item.name,
      value: item._id,
    }));

    console.log("Mapped subcategories:", mapped);
    return mapped;
  }, [selectedCategory, categorySuccess, subCategoriesArray, subSuccess]);

  // Debug: Log relevant values
  useEffect(() => {
    console.log("=== Debug Info ===");
    console.log("categorySuccess:", categorySuccess);
    console.log("selectedCategory:", selectedCategory);
    console.log("subSuccess:", subSuccess);
    console.log("subLoading:", subLoading);
    console.log("subCategoriesData:", subCategoriesData);
    console.log("subCategoriesArray count:", subCategoriesArray?.length || 0);
    console.log("subCategoriesList:", subCategoriesList);
    console.log("==================");
  }, [
    categorySuccess,
    selectedCategory,
    subCategoriesData,
    subCategoriesArray,
    subSuccess,
    subLoading,
    subCategoriesList,
  ]);

  const claspsList = useMemo(
    () =>
      claspsSuccess && clasps
        ? clasps.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [claspsSuccess, clasps]
  );

  // Material options based on backend constants
  const materialOptions = [
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "platinum", label: "Platinum" },
    { value: "diamond", label: "Diamond" },
    { value: "ruby", label: "Ruby" },
    { value: "emerald", label: "Emerald" },
    { value: "sapphire", label: "Sapphire" },
    { value: "other", label: "Other" },
  ];

  const visibilityOptions = [
    { value: "featured", label: "Featured" },
    { value: "bestsellers", label: "Best Sellers" },
    { value: "popular", label: "Popular" },
    { value: "newarrivals", label: "New Arrivals" },
    { value: "recommended", label: "Recommended for you" },
  ];

  const weightUnitOptions = [
    { value: "gm", label: "gm" },
    { value: "kg", label: "kg" },
    { value: "mg", label: "mg" },
    { value: "oz", label: "oz" },
    { value: "ct", label: "ct" },
    { value: "dwt", label: "dwt" },
  ];

  const formstate = id ?? "add";

  const form = useForm({
    defaultValues: generateProductDefaultValue(
      formstate,
      productData
    ) as IProductFormValues,
    validators: {
      onSubmit: productFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        const formattedData = cleanObject(value);
        delete formattedData["existingImage"];
        formData.append("name", value.name);
        formData.append("description", value.description);
        formData.append("category", value.category);

        if (value.subCategory && value.subCategory.trim() !== "") {
          formData.append("subCategory", value.subCategory);
        }

        formData.append("material", value.material);

        value.variant.forEach((v, index: number) => {
          formData.append(`variant[${index}][price]`, String(v.price));
          formData.append(`variant[${index}][wt]`, v.wt.toString());
          formData.append(`variant[${index}][unit]`, v.unit ?? "gm");
        });

        formData.append("length", String(value.length));
        if (value.claspType) formData.append("claspType", value.claspType);
        formData.append("rhodoumFinishes", String(value.rhodoumFinishes));
        formData.append("shape", value.shape);
        if (value.clarity) formData.append("clarity", value.clarity);
        formData.append("dimension", String(value.dimension));
        formData.append("visibleAs", value.visibleAs);

        value.tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });

        if (value.images) {
          formData.append("images", value.images);
        } else if (formstate !== "add" && value.existingImage) {
          formData.append("existingImage", value.existingImage);
        }

        if (formstate !== "add") {
          updateProduct({ id: productData._id, body: formData });
        } else {
          createProduct(formData);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  // Initialize selectedCategory with form value if in edit mode
  useEffect(() => {
    if (productData && productData.category) {
      const categoryId =
        typeof productData.category === "string"
          ? productData.category
          : productData.category._id || "";

      console.log("Setting initial category from productData:", categoryId);
      setSelectedCategory(categoryId);
      form.setFieldValue("category", categoryId);

      // Initialize subCategory if available
      if (productData.subCategory) {
        const subCategoryId =
          typeof productData.subCategory === "string"
            ? productData.subCategory
            : productData.subCategory._id || "";
        form.setFieldValue("subCategory", subCategoryId);
        console.log("Initialized subCategoryId:", subCategoryId);
      }
    }
  }, [productData, form]);

  // Reset subCategory when category changes
  useEffect(() => {
    form.setFieldValue("subCategory", "");
  }, [selectedCategory, form]);

  useEffect(() => {
    if (productCreateSuccess || productUpdateSuccess) {
      form.reset();
      navigate("/product/product-list");
    }
  }, [productCreateSuccess, productUpdateSuccess, form, navigate]);

  const getFieldError = (_fieldPath: string) => {
    return [];
  };

  return (
    <div className="p-2">
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
                          Description <span className="text-red">*</span>
                        </label>
                        <textarea
                          placeholder="Enter short description"
                          className="p-2 border rounded-md focus:outline-none bg-[#f6f7f9] resize-none"
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <form.Field name="category">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Category"
                          required
                          firstInput="Select Category"
                          options={categoriesList}
                          value={field.state.value}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            console.log("Category field changed to:", newValue);
                            field.handleChange(newValue);
                            setSelectedCategory(newValue);
                          }}
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
                          firstInput={
                            !selectedCategory
                              ? "Select Category First"
                              : subLoading
                              ? "Loading Subcategories..."
                              : subCategoriesList.length === 0
                              ? "No Subcategories Available"
                              : "Select Sub Category"
                          }
                          options={subCategoriesList}
                          value={field.state.value}
                          onChange={(e) => {
                            console.log(
                              "Subcategory selected:",
                              e.target.value
                            );
                            field.handleChange(e.target.value);
                          }}
                          disabled={!selectedCategory}
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

                  <form.Field name="material">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Material"
                          required
                          firstInput="Select Material"
                          options={materialOptions}
                          value={field.state.value}
                          onChange={(e) => {
                            console.log("Material selected:", e.target.value);
                            field.handleChange(e.target.value);
                          }}
                        />
                        <FieldError field={field} />
                        {getFieldError("material").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("material").join(", ")}
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
                        className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2">
                        <Icon icon="ep:plus" width="18" height="18" />
                        Product Variant
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
                        className="border rounded-md p-3 mb-2">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <form.Field name={`variant[${i}].price`}>
                            {(subField) => {
                              const priceInput = useClearableNumberInput(
                                subField.state.value,
                                subField.handleChange
                              );
                              return (
                                <div>
                                  <PriceInputField
                                    label="Base Price"
                                    placeholder={
                                      priceInput.value === ""
                                        ? "0"
                                        : "Enter base price"
                                    }
                                    type="number"
                                    required
                                    min="0"
                                    {...priceInput}
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
                              );
                            }}
                          </form.Field>

                          <form.Field name={`variant[${i}].wt`}>
                            {(subField) => {
                              const weightInput = useClearableNumberInput(
                                subField.state.value,
                                subField.handleChange
                              );
                              return (
                                <div>
                                  <InputField
                                    label="Weight (wt)"
                                    type="number"
                                    required
                                    step="any"
                                    min="0"
                                    placeholder={
                                      weightInput.value === ""
                                        ? "0"
                                        : "Enter weight"
                                    }
                                    {...weightInput}
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
                              );
                            }}
                          </form.Field>

                          <form.Field name={`variant[${i}].unit`}>
                            {(subField) => (
                              <div>
                                <DropdownField
                                  label="Unit"
                                  required
                                  firstInput="Select unit"
                                  options={weightUnitOptions}
                                  value={subField.state.value || "gm"}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                                <FieldError field={subField} />
                                {getFieldError(`variant.${i}.unit`).length >
                                  0 && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {getFieldError(`variant.${i}.unit`).join(
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
                              className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md">
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
                  {(field) => {
                    const lengthInput = useClearableNumberInput(
                      field.state.value,
                      field.handleChange
                    );
                    return (
                      <div>
                        <InputField
                          label="Length"
                          required
                          type="number"
                          step="any"
                          placeholder={
                            lengthInput.value === "" ? "0" : "Enter length"
                          }
                          min="0"
                          {...lengthInput}
                        />
                        <FieldError field={field} />
                        {getFieldError("length").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("length").join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  }}
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
                        placeholder="Enter clarity"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="dimension">
                  {(field) => {
                    const dimensionInput = useClearableNumberInput(
                      field.state.value,
                      field.handleChange
                    );
                    return (
                      <div>
                        <InputField
                          label="Dimension"
                          required
                          type="number"
                          step="any"
                          placeholder={
                            dimensionInput.value === ""
                              ? "0"
                              : "Enter dimension"
                          }
                          min="0"
                          {...dimensionInput}
                        />
                        <FieldError field={field} />
                        {getFieldError("dimension").length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError("dimension").join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  }}
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

          {/* Image Upload Section */}
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
              className="px-6 py-2 text-white rounded-md min-w-32 bg-orange hover:bg-orange-600 disabled:opacity-50">
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
