import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { useForm, useStore } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import * as z from "zod";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import VideoUploadField from "../../../components/shared/form_components/VideoUploadField";
import {
  useCreateBannerMutation,
  useGetAllBannerQuery,
  useUpdateBannerMutation,
} from "../../../server/api/bannerHook";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductsQuery,
  useGetAllProductSubCategoriesQuery,
} from "../../../server/api/productHooks";
import React, { useEffect, useMemo, useState } from "react";
import { DropdownTagField } from "../../../components/shared/form_components/DropdownTags";
import Tags from "./Tags";
import { useParams } from "react-router-dom";
import { bannerStore } from "./bannerStore";
import { generateBannerFormDefaultValue, IBannerFormData } from "./bannerobj";
import Header from "../../../components/shared/table_heading/Header";
import { ensureStreamingUrl } from "../../../utils/videoUtils";

// const AddBannerSchema = z.object({
//   title: z.string().min(1, "Banner Title is required"),
//   description: z.string().min(1, "Description is required"),
//   category: z.string(),
//   subCategory: z.string(),
//   priority: z.number().min(0, "Price must be a positive number"),
//   location: z.array(z.string()).min(1, "Location is required"),

//   image: z.instanceof(File, {
//     message: "Web Image is required",
//   }),
//   mobImage: z.instanceof(File, {
//     message: "Mobile Image is required",
//   }),
// });

const AddBannerSchema = z.object({
  title: z.string().min(1, "Banner Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub Category is required"),
  priority: z.number().min(0, "Price must be a positive number"),
  locations: z.array(z.string()).min(1, "Location is required"),

  // Make file validations conditional based on whether it's a new record or update
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: "Web Image is required" }),
  video: z.union([z.instanceof(File), z.string()]).nullable(), // Video can be File or URL string
});
const AddBannerForm = () => {
  const { id } = useParams();
  const bannerData = useStore(bannerStore, (state) => state);
  console.log("BANNER DATA", bannerData);
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
  const FieldError = ({ field }: { field: any }) => {
    if (field.state.meta.errors.length > 0) {
      const error = field.state.meta.errors[0];
      // Handle the case where the error is an object
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
    return <div className="min-h-[20px]"></div>; // Return empty div when no errors
  };

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

  console.log("CATEORIEEEEEEEEEEEEEEEEESSSSSSSSSSSSSSS", categories);

  // const categoryOptions = categories?.map((category) => ({
  //   value: category._id,
  //   label: category.name,
  // }));

  const categoryOptions = useMemo(
    () =>
      categorySuccess
        ? categories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [categorySuccess, categories]
  );

  // const subCategoryOptions = subCategories?.map((subCategory) => ({
  //   value: subCategory._id,
  //   label: subCategory.name,
  // }));

  const subCategoryOptions = useMemo(
    () =>
      subCategorySuccess
        ? subCategories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [subCategorySuccess, subCategories]
  );

  const formState = id ?? "add";
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
        console.log("FORM DATA", value);
        const formData = new FormData();

        formData.append("title", value.title);
        formData.append("description", value.description);
        formData.append("category", value.category);
        formData.append("subCategory", value.subCategory);
        formData.append("priority", `${value.priority}`);
        value.locations.forEach((item: string) =>
          formData.append("locations", item)
        );

        if (value.image) formData.append("image", value.image);

        // Handle video URL (not file) since it's uploaded via enhanced upload API
        if (value.video && typeof value.video === "string") {
          formData.append("video", value.video);
        }
        // createBanner.mutate(formData);

        if (id == "add") createBanner(formData);
        else updateBanner({ id: bannerData._id, body: formData });
        // Reset the form after successful submission
      } catch (error) {
        console.error("Failed to create banner", error);
      }
    },
  });

  useEffect(() => {
    if (bannerSuccess || bannerUpdateSuccess) form.reset();
  }, [bannerSuccess, bannerUpdateSuccess]);
  return (
    <>
      <div className="mx-8 my-3">
        <div className="flex items-center justify-between">
          <Header text={id === "add" ? "Add New Banner" : "Edit Banner"} />
          <Breadcrumbs />
        </div>

        <div className="my-2">
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
            <form
              className="flex flex-col gap-4 mx-4 my-6 "
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}>
              <div>
                <h1 className="text-xl font-semibold">General Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center w-full gap-4">
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

                {/* <form.Field name="category">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Product"
                        firstInput="Product"
                        options={[
                          { value: "samsung", label: "Samsung" },
                          { value: "asus", label: "Asus" },
                          { value: "dell", label: "Dell" },
                          { value: "acer", label: "Acer" },
                        ]}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field> */}
              </div>
              <div>
                <h1 className="text-xl font-semibold">Priority</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 w-full">
                <form.Field name="priority">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Level"
                        type="number"
                        min={0}
                        required
                        placeholder="0"
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
                    <div className="w-full ">
                      <DropdownTagField
                        required
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

              {/* Upload Section */}
              <div className="mt-6">
                <h1 className="text-xl font-semibold">Upload Files</h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>

                {/* Web Image Upload */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Web Image</h2>
                  <form.Field name="image">
                    {(field) => (
                      <div className="w-full">
                        <FileDropInput
                          value={field.state.value as unknown as File}
                          onChange={(file) => {
                            field.handleChange(file); // store the file directly
                          }}
                          existingImageUrl={
                            id !== "add" && bannerData.image?.[0]
                              ? `https://gold-api.webstudiomatrix.com/${bannerData.image[0]}`
                              : undefined
                          }
                        />
                        <FieldError field={field} />
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Video Upload */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-3">Video (Optional)</h2>
                  <form.Field name="video">
                    {(field) => (
                      <div className="w-full">
                        <VideoUploadField
                          label="Select Video File"
                          value={field.state.value as unknown as File}
                          onChange={(file) => {
                            field.handleChange(file); // store the file directly
                          }}
                          onUploadComplete={(url) => {
                            console.log("Video uploaded successfully:", url);
                            // Store the video URL in the form data instead of the file
                            field.handleChange(url);
                          }}
                          onUploadError={(error) => {
                            console.error("Video upload failed:", error);
                            // You can add error handling here if needed
                          }}
                          maxFileSize={200} // 200MB limit
                          existingVideoUrl={
                            id !== "add" && bannerData.video
                              ? ensureStreamingUrl(bannerData.video)
                              : undefined
                          }
                        />
                        <FieldError field={field} />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>

              <button
                type="submit"
                disabled={bannerPending}
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl">
                {bannerPending ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBannerForm;
