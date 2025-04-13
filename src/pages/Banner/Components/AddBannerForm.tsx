import React from "react";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { z } from "zod";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";

const AddBannerSchema = z.object({
  banner_title: z.string().min(1, "Banner Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category  is required"),
  priority: z.coerce.number().min(0, "Price must be a positive number"),

  web_image: z.instanceof(File, {
    message: "Web Image is required",
  }),
  mobile_image: z.instanceof(File, {
    message: "Mobile Image is required",
  }),
});
const AddBannerForm = () => {
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

  const form = useForm({
    defaultValues: {
      banner_title: "",
      description: "",
      category: "",
      priority: 0,
      web_image: null as File | null,
      mobile_image: null as File | null,
    },
    validators: {
      onSubmit: AddBannerSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted:", value);
      // Submit to backend or API
    },
  });
  return (
    <>
      <div className="mx-8 my-2">
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
                <form.Field name="banner_title">
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

              <div>
                <form.Field name="category">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Select By"
                        required
                        firstInput="Category"
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
                </form.Field>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Priority</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div>
                <form.Field name="priority">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Level"
                        type="number"
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
              </div>

              <button
                type="submit"
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl"
              >
                Save
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
                    <form.Field name="web_image">
                      {(field) => (
                        <div className="w-full">
                          <FileDropInput
                            label="Upload Web Image"
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
                    <form.Field name="mobile_image">
                      {(field) => (
                        <div className="w-full">
                          <FileDropInput
                            label="Upload Mobile Image"
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
