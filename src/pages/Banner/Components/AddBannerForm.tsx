import { useEffect, useMemo } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { DropdownTagField } from "../../../components/shared/form_components/DropdownTags";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import Header from "../../../components/shared/table_heading/Header";
import {
  useCreateBannerMutation,
  useGetAllBannerQuery,
  useUpdateBannerMutation,
} from "../../../server/api/bannerHook";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductSubCategoriesQuery,
} from "../../../server/api/productHooks";
import { bannerStore } from "./bannerStore";
import { generateBannerFormDefaultValue } from "./bannerobj";
import MultiImageUploader from "../../../components/shared/form_components/FileDropInput";
import { cleanObject } from "../../../utils/cleanObject";

const AddBannerSchema = z
  .object({
    title: z.string().min(1, "Banner Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "Sub Category is required"),
    priority: z.number().min(0, "Price must be a positive number"),
    locations: z.array(z.string()).min(1, "Location is required"),
    image: z.instanceof(File).nullable(),
    mobImage: z.instanceof(File).nullable(), // Mobile image is optional
    existingImage: z.string().optional(), // Track existing image
    existingMobImage: z.string().optional(), // Track existing mobile image
  })
  .refine(
    (data) => {
      // Custom validation: require either a new image file or an existing image
      return data.image !== null || data.existingImage;
    },
    {
      message: "Web image is required",
      path: ["image"], // Show error on the image field
    }
  );

const AddBannerForm = () => {
  const { id } = useParams();
  const bannerData = useStore(bannerStore, (state) => state);
  const router = useNavigate();
  const {
    mutate: createBanner,
    isPending: bannerPending,
    isSuccess: bannerSuccess,
  } = useCreateBannerMutation();

  const {
    mutate: updateBanner,
    isPending: bannerUpdatePending,
    isSuccess: bannerUpdateSuccess,
  } = useUpdateBannerMutation();

  const {
    data: _banners = [],
    isLoading: _isLoading,
    error: _error,
  } = useGetAllBannerQuery();

  const {
    data: categories,
    isLoading: _isCategoryLoading,
    isSuccess: categorySuccess,
    error: _categoryError,
  } = useGetAllProductCategoriesQuery();

  const {
    data: subCategories,
    isLoading: _isSubCategoryLoading,
    isSuccess: subCategorySuccess,
    error: _subCategoryError,
  } = useGetAllProductSubCategoriesQuery();

  const categoryOptions = useMemo(
    () =>
      categorySuccess
        ? categories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [categorySuccess, categories]
  );

  const subCategoryOptions = useMemo(
    () =>
      subCategorySuccess
        ? subCategories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [subCategorySuccess, subCategories]
  );

  const formState = id ?? "add";

  // UseForm with inferred types from defaultValues
  const form = useForm({
    defaultValues: generateBannerFormDefaultValue(formState, bannerData),
    validators: {
      onSubmit: AddBannerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        const formattedData = cleanObject(value);

        delete formattedData["image"];
        delete formattedData["existingImage"];
        delete formattedData["mobImage"];
        delete formattedData["existingMobImage"];

        formData.append("title", value.title);
        formData.append("description", value.description);
        formData.append("category", value.category);
        formData.append("subCategory", value.subCategory);
        formData.append("priority", `${value.priority}`);
        value.locations.forEach((item: string) =>
          formData.append("locations", item)
        );

        // Handle image uploads
        if (value.image) {
          formData.append("image", value.image);
        }

        if (value.mobImage) {
          formData.append("mobImage", value.mobImage);
        }

        // Handle existing images for edit mode
        if (id !== "add") {
          if (value.existingImage) {
            formData.append("existingImage", value.existingImage);
          }
          if (value.existingMobImage) {
            formData.append("existingMobImage", value.existingMobImage);
          }
        }

        if (id === "add") createBanner(formData);
        else updateBanner({ id: bannerData._id, body: formData });
      } catch (error) {
        console.error("Failed to create banner", error);
      }
    },
  });

  const FieldError = ({
    field,
  }: {
    field: { state: { meta: { errors: unknown[] } } };
  }) => {
    if (field.state.meta.errors.length > 0) {
      const error = field.state.meta.errors[0];
      const errorMessage =
        typeof error === "string"
          ? error
          : (error as { message?: string })?.message || JSON.stringify(error);

      return (
        <div className="min-h-[20px] mt-1">
          <span className="text-xs font-medium" style={{ color: "#ef4444" }}>
            {errorMessage}
          </span>
        </div>
      );
    }
    return <div className="min-h-[20px]"></div>; // Maintain consistent spacing
  };

  useEffect(() => {
    if (bannerSuccess || bannerUpdateSuccess) {
      form.reset();
      // router.replace("/banner");
      router("/banner", { replace: true });
    }
  }, [bannerSuccess, bannerUpdateSuccess]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <Header text={id === "add" ? "Add New Banner" : "Edit Banner"} />
        <Breadcrumbs />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:space-y-0 lg:space-x-4 space-x-0 space-y-4 ">
        <div className="bg-[#ffffff] col-span-3 border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
          <form
            className="flex flex-col gap-4 mx-4 my-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}>
            <div>
              <h1 className="text-xl font-semibold">General Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="flex items-center gap-4 w-full">
              <form.Field name="title">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Banner Title"
                      required
                      type="text"
                      placeholder="Enter Banner Title"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Description"
                      required
                      placeholder="Add Description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            <div className="flex items-center gap-4 w-full">
              <form.Field name="category">
                {(field) => (
                  <div className="w-full">
                    <DropdownField
                      label="Category"
                      firstInput="Category"
                      options={categoryOptions}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="subCategory">
                {(field) => (
                  <div className="w-full">
                    <DropdownField
                      label="Sub Category"
                      firstInput="Sub Category"
                      options={subCategoryOptions}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Priority</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="flex items-center gap-4 w-full">
              <form.Field name="priority">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Level"
                      type="number"
                      min="0"
                      required
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="locations">
                {(field) => (
                  <div className="w-full">
                    <DropdownTagField
                      required
                      label="Locations"
                      values={field.state.value || []}
                      onChange={(newValues) => {
                        field.handleChange(newValues);
                      }}
                      options={[
                        { value: "homepage", label: "Home Page" },
                        { value: "category-page", label: "Category Page" },
                        { value: "marketing", label: "Marketing Section" },
                        { value: "advertisement", label: "Advertisement" },
                        { value: "product-page", label: "Product Page" },
                      ]}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            pnpm
            <button
              type="submit"
              disabled={bannerPending || bannerUpdatePending}
              className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:opacity-50">
              {bannerPending || bannerUpdatePending ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        <div className="grid gap-2">
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">
                  Upload Web Image <span style={{ color: "#ef4444" }}>*</span>
                </h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>

              <form.Field name="image">
                {(field) => (
                  <div>
                    <MultiImageUploader
                      multiple={false}
                      form={form}
                      label=""
                      value={field.state.value}
                      existingFileField="existingImage"
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".svg"],
                      }}
                      existingFile={form.getFieldValue("existingImage")}
                      onChange={(file) => {
                        field.handleChange(file);
                        // When a new image is selected, clear the existing image
                        if (file) {
                          form.setFieldValue("existingImage", null);
                        }
                      }}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">
                  Upload Mobile Image{" "}
                  <span className="text-gray-500 text-sm">(Optional)</span>
                </h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>

              <form.Field name="mobImage">
                {(field) => (
                  <div>
                    <MultiImageUploader
                      multiple={false}
                      form={form}
                      label=""
                      value={field.state.value}
                      existingFileField="existingMobImage"
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
                      }}
                      existingFile={form.getFieldValue("existingMobImage")}
                      onChange={(file) => {
                        field.handleChange(file);
                        // When a new image is selected, clear the existing image
                        if (file) {
                          form.setFieldValue("existingMobImage", null);
                        }
                      }}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBannerForm;
