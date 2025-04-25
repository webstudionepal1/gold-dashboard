import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { z } from "zod";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import {
  useCreateBannerMutation,
  useGetAllBannerQuery,
} from "../../../server/api/bannerHook";
import {
  useGetAllProductCategoriesQuery,
  useGetAllProductsQuery,
  useGetAllProductSubCategoriesQuery,
} from "../../../server/api/productHooks";
import React from "react";
import { DropdownTagField } from "../../../components/shared/form_components/DropdownTags";
import Tags from "./Tags";

const AddBannerSchema = z.object({
  title: z.string().min(1, "Banner Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string(),
  sub_category: z.string(),
  priority: z.coerce.number().min(0, "Price must be a positive number"),
  location: z.array(z.string()).min(1, "Location is required"),

  image: z.instanceof(File, {
    message: "Web Image is required",
  }),
  mobImage: z.instanceof(File, {
    message: "Mobile Image is required",
  }),
});
const AddBannerForm = () => {
  const createBanner = useCreateBannerMutation();
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
    error: categoryError,
  } = useGetAllProductCategoriesQuery();

  const {
    data: subCategories,
    isLoading: isSubCategoryLoading,
    error: subCategoryError,
  } = useGetAllProductSubCategoriesQuery();

  console.log("CATEORIEEEEEEEEEEEEEEEEESSSSSSSSSSSSSSS", categories);

  const categoryOptions = categories?.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const subCategoryOptions = subCategories?.map((subCategory) => ({
    value: subCategory._id,
    label: subCategory.name,
  }));

  // const categoryOptions =
  //   products?.map((category) => ({
  //     value: category._id,
  //     label: category.name,
  //   })) || [];

  // const subCategoryOptions = products?.map((subCategory) => ({
  //   value: subCategory._id,
  //   label: subCategory.name,
  // }));

  // console.log("CATEGORY OPTIONS", categoryOptions);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      sub_category: "",
      priority: 0,
      location: ["homepage"],
      image: null as File | null,
      mobImage: null as File | null,
    },
    validators: {
      onSubmit: AddBannerSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("FORM DATA", value);
      const formData = new FormData();

      formData.append("title", value.title);
      formData.append("description", value.description);
      formData.append("category", value.category);
      formData.append("sub_category", value.sub_category);
      formData.append("priority", String(value.priority));
      value.location.forEach((item) => formData.append("locations", item));

      if (value.image) formData.append("image", value.image);

      if (value.mobImage) formData.append("mobImage", value.mobImage);
      // createBanner.mutate(formData);

      try {
        await createBanner.mutateAsync(formData);
        form.reset(); // Reset the form after successful submission
      } catch (error) {
        console.error("Failed to create banner", error);
      }
    },
  });
  return (
    <>
      <div className="mx-8 my-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Add New Banner</h1>
          <Breadcrumbs />
        </div>

        <div className="flex items-center justify-between my-2 gap-4">
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
            <form
              className="flex flex-col gap-4 mx-4 my-6 "
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
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

                <form.Field name="sub_category">
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
                          field.handleChange(e.target.value as any)
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="location">
                  {(field) => (
                    <div className="w-full">
                      {/* <DropdownField
                        label="Location"
                        options={[
                          { value: "homepage", label: "Home Page" },
                          { value: "category-page", label: "Category Page" },
                          { value: "product-page", label: "Product Page" },
                        ]}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      /> */}

                      {/* <DropdownTagField
                        required
                        values={field.state.value}
                        onChange={(e) => field.handleChange(value)}
                        options={[
                          { value: "homepage", label: "Home Page" },
                          { value: "category-page", label: "Category Page" },
                          { value: "product-page", label: "Product Page" },
                        ]}
                      /> */}

                      <Tags
                        field={field}
                        options={["homepage", "category-page", "product-page"]}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <button
                type="submit"
                disabled={createBanner.isPending}
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl"
              >
                {createBanner.isPending ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <div>
              <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
                <div className="mx-6 my-4">
                  <div>
                    <h1 className="text-xl font-semibold">Upload Web Image</h1>
                    <div className="border-b border-[#dedde2] w-full my-2  "></div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                  >
                    <form.Field name="image">
                      {(field) => (
                        <div className="w-full">
                          <FileDropInput
                            value={field.state.value as unknown as File}
                            onChange={(file) => {
                              field.handleChange(file); // store the file directly
                            }}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </form>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
                <div className="mx-6 my-4">
                  <div>
                    <h1 className="text-xl font-semibold">
                      Upload Mobile Image
                    </h1>
                    <div className="border-b border-[#dedde2] w-full my-2  "></div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                  >
                    <form.Field name="mobImage">
                      {(field) => (
                        <div className="w-full">
                          <FileDropInput
                            value={field.state.value as unknown as File}
                            onChange={(file) => {
                              field.handleChange(file); // store the file directly
                            }}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBannerForm;
