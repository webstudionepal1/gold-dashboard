import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useParams } from "react-router-dom";
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
import {
  generateBannerFormDefaultValue,
  type IBannerFormData,
} from "./bannerobj";
import MultiImageUploader from "../../../components/shared/form_components/FileDropInput";

const AddBannerSchema = z.object({
  title: z.string().min(1, "Banner Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),
  priority: z.number().min(0, "Price must be a positive number"),
  locations: z.array(z.string()).min(1, "Location is required"),

  image: z
    .array(z.instanceof(File))
    .nonempty({ message: "At least one image is required" }),

  mobImage: z
    .array(z.instanceof(File))
    .nonempty({ message: "At least one image is required" }),
});

const AddBannerForm = () => {
  const { id } = useParams();
  const bannerData = useStore(bannerStore, (state) => state);
  const [selectedTagItems, setSelectedTagItems] = useState<string[]>([]);

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

  const { data: banners = [], isLoading, error } = useGetAllBannerQuery();

  const {
    data: categories,
    isLoading: isCategoryLoading,
    isSuccess: categorySuccess,
    error: categoryError,
  } = useGetAllProductCategoriesQuery();

  const {
    data: subCategories,
    isLoading: isSubCategoryLoading,
    isSuccess: subCategorySuccess,
    error: subCategoryError,
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
  const isEditMode = id !== "add";

  const form = useForm({
    defaultValues: generateBannerFormDefaultValue(
      formState,
      bannerData
    ) as IBannerFormData,
    validators: {
      onSubmit: AddBannerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();

        formData.append("title", value.title);
        formData.append("description", value.description);
        formData.append("category", value.category);
        formData.append("subCategory", value.subCategory);
        formData.append("priority", `${value.priority}`);
        value.locations.forEach((item: string) =>
          formData.append("locations", item)
        );

        // if (value.image) formData.append("image", value.image);
        // if (value.mobImage) formData.append("mobImage", value.mobImage);

        if (value.image && value.image.length > 0) {
          value.image.forEach((file) => formData.append("image", file));
        }

        if (value.mobImage && value.mobImage.length > 0) {
          value.mobImage.forEach((file) => formData.append("mobImage", file));
        }
        if (id === "add") createBanner(formData);
        else updateBanner({ id: bannerData._id, body: formData });
      } catch (error) {
        console.error("Failed to create banner", error);
      }
    },
  });

  const FieldError = ({ field }: { field: any }) => {
    if (field.state.meta.errors.length > 0) {
      const error = field.state.meta.errors[0];
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || JSON.stringify(error);

      return (
        <div className="min-h-[20px]">
          <span className="text-xs text-red">{errorMessage}</span>
        </div>
      );
    }
  };

  useEffect(() => {
    if (bannerSuccess || bannerUpdateSuccess) form.reset();
  }, [bannerSuccess, bannerUpdateSuccess]);

  return (
    <div className="mx-8 my-3">
      <div className="flex items-center justify-between">
        <Header text={id === "add" ? "Add New Banner" : "Edit Banner"} />
        <Breadcrumbs />
      </div>

      <div className="flex items-center justify-between my-2 gap-4">
        <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
          <form
            className="flex flex-col gap-4 mx-4 my-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
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
                      values={selectedTagItems}
                      onChange={(newValues) => {
                        setSelectedTagItems(newValues);
                        field.handleChange(newValues);
                      }}
                      options={[
                        { value: "homepage", label: "Home Page" },
                        { value: "category-page", label: "Category Page" },
                        { value: "product-page", label: "Product Page" },
                      ]}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <button
              type="submit"
              disabled={bannerPending || bannerUpdatePending}
              className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:opacity-50"
            >
              {bannerPending || bannerUpdatePending ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-2 mt-8 w-[50%]">
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">Upload Web Image</h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>

              <form.Field name="image">
                {(field) => (
                  <MultiImageUploader
                    multiple
                    form={form}
                    label=""
                    value={field.state.value as File[]}
                    onChange={(files: File[]) => field.handleChange(files)}
                  />
                )}
              </form.Field>
            </div>
          </div>

          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">Upload Mobile Image</h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>

              <form.Field name="mobImage">
                {(field) => (
                  <MultiImageUploader
                    multiple
                    form={form}
                    label=""
                    value={field.state.value as File[]}
                    onChange={(files: File[]) => field.handleChange(files)}
                  />
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
