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
  useUpdateProductsMutation,
} from "../../../../server/api/productHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PriceInputField } from "../../../OrderManagement/Order/components/PriceInputField";
import ChipInputInside from "../../ProductCategory/components/ChipInputInside";
import { useParams } from "react-router-dom";
import Header from "../../../../components/shared/table_heading/Header";
import { productStore } from "../../../../store/productStore";
import { generateProductDefaultValue } from "./productobj";

// Define types for the form
type VisibilityType =
  | "featured"
  | "bestsellers"
  | "newarrivals"
  | "recommended"
  | "";

type ProductVariant = {
  price: number;
  size: string;
  unit: string;
};

type ProductFormValues = {
  // General Information
  name: string;
  description: string;
  category: string;
  subCategory: string;

  // Price and Variants
  variant: ProductVariant[];

  // Product Specification
  length: number; // Changed to number
  claspType: string | undefined;
  rhodoumFinishes: boolean; // Changed to boolean

  // Material Information
  shape: string;
  clarity: string;
  dimension: number; // Changed to number

  // Visibility Option (single selection)
  visibleAs: VisibilityType;

  // Tags
  tags: string[];
};

// Define types for image uploads
type UploadedImage = {
  name: string;
  url: string;
  file: File;
};
const validationSchema = z.object({
  // General Information
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),

  // Price
  variant: z
    .array(
      z.object({ price: z.number().min(1), size: z.string(), unit: z.string() })
    )
    .min(1, "At least one variant is required"),

  // Product Specification
  length: z.number().min(1, "Length is required"),
  claspType: z.string().optional(),
  rhodoumFinishes: z.boolean(),

  // Material Information
  shape: z.string().min(1, "Shape is required"),
  clarity: z.string().min(1, "Clarity is required"),
  dimension: z.number().min(1, "Dimension is required"),

  // Visibility Option (single selection)
  visibleAs: z.enum([
    "",
    "featured",
    "bestsellers",
    "newarrivals",
    "recommended",
  ]),

  // Tags
  tags: z.array(z.string()).min(1, "At least one tag is required"),
});

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

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const visibilityOptions = [
    { value: "featured", label: "Featured" },
    { value: "bestsellers", label: "Best Sellers" },
    { value: "newarrivals", label: "New Arrivals" },
    { value: "recommended", label: "Recommended for you" },
  ];
  const formstate = id ?? "add";
  const form = useForm({
    defaultValues: generateProductDefaultValue(formstate, productData),
    // validators: {
    //   onChange: validationSchema,
    // },
    validators: {
      onChange: validationSchema.parse,
    },
    onSubmit: async ({ value }) => {
      try {
        // Create a proper data object to send to the server (avoid FormData issues with complex objects)

        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("description", value.description);
        formData.append("category", value.category);
        formData.append("subCategory", value.subCategory);

        value.variant.forEach((v: ProductVariant, index: number) => {
          formData.append(`variant[${index}][price]`, String(v.price));
          formData.append(`variant[${index}][size]`, v.size);
          formData.append(`variant[${index}][unit]`, v.unit);
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

        uploadedImages.forEach((img) => {
          formData.append(`images`, img.file);
        });
        if (id == "add") createProduct(formData);
        else updateProduct({ id: productData._id, body: formData });
      } catch (error) {
        console.error("Form submission error:", error);
      }
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
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <div className="col-span-2 bg-white rounded-md">
          {/* Left Column - Main Form */}
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
              <form.Field name="variant" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between w-full py-2 mb-2 text-sm border-b">
                      <h2 className="text-base font-semibold text-gray-700 ">
                        Pricing
                      </h2>
                      <button
                        onClick={() =>
                          field.pushValue({ price: 0, size: "", unit: "gm" })
                        }
                        type="button"
                        className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2"
                      >
                        <Icon icon="ep:plus" width="18" height="18" />
                        Product Size
                      </button>
                    </div>
                    {field.state.value.map((_: void, i: number) => (
                      <div key={i}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`variant.${i}.price`}>
                            {(subField) => (
                              <div>
                                <PriceInputField
                                  label="Base Price"
                                  placeholder="Enter base price"
                                  type="number"
                                  required
                                  value={subField.state.value as string}
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
                          <form.Field name={`variant.${i}.size`}>
                            {(subField) => (
                              <div>
                                <InputField
                                  label="size"
                                  required
                                  placeholder="Enter in gram"
                                  value={subField.state.value as string}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                />
                                <FieldError field={subField} />
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
          </div>
        </div>

        {/* Right Column - Sidebar */}
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
                        onChange={() => field.handleChange(option.value)}
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
                  stroke="currentColor"
                >
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
                className="inline-block px-4 py-2 mt-4 text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
              >
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
              className="px-6 py-2 text-white rounded-md bg-orange hover:bg-orange-600"
            >
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
