import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { z } from "zod";

const HomePageBannerSchema = z.object({
  banner_title: z.string().min(1, "Banner Title is required"),
  description: z.string().min(1, "Description is required"),
  select_by: z.string().min(1, "Select Category is required"),
  priority: z
    .number({ invalid_type_error: "Priority must be a positive number" })
    .min(0, "Priority must be a positive number"),
  web_image: z
    .instanceof(File, { message: "Web Image is required" })
    .refine((file) => file.size > 0, { message: "Web Image is required" }),
  mobile_image: z
    .instanceof(File, { message: "Mobile Image is required" })
    .refine((file) => file.size > 0, { message: "Mobile Image is required" }),
});

interface Iinitial {
  banner_title?: string;
  description?: string;
  select_by?: string;
  priority?: number;
  web_image?: File;
  mobile_image?: File;
}

interface HomePageBannerFormProps {
  closeModal: () => void;
  initialValues?: Iinitial;
  onSubmit: (data: Iinitial) => void;
}

export const HomePageBannerForm: React.FC<HomePageBannerFormProps> = ({
  closeModal,
  initialValues = {
    banner_title: "",
    description: "",
    select_by: "",
    priority: 0,
    web_image: undefined,
    mobile_image: undefined,
  },
  onSubmit,
}) => {
  const {
    banner_title,
    description,
    select_by,
    priority,
    web_image,
    mobile_image,
  } = initialValues;
  const form = useForm({
    defaultValues: initialValues,

    validators: {
      onSubmit: HomePageBannerSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      closeModal();
    },
  });

  console.log("Tanstack React form", form);
  useEffect(() => {
    form.reset();
  }, [banner_title, description, select_by, priority, web_image, mobile_image]);

  const isEditing =
    initialValues.banner_title !== "" ||
    initialValues.description !== "" ||
    initialValues.select_by !== "" ||
    initialValues.priority !== 0 ||
    initialValues.web_image !== undefined ||
    initialValues.mobile_image !== undefined;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-10 p-10"
    >
      <p className="text-lg font-bold text-center text-black">
        {isEditing ? "Edit Home Page Banner" : "Add Home Page Banner"}
      </p>

      <section className="flex flex-col gap-6">
        {/* Title Input */}
        <div className="flex items-center gap-2">
          <form.Field
            name="banner_title"
            validators={{
              onChange: ({ value }) => {
                const result =
                  HomePageBannerSchema.shape.banner_title.safeParse(
                    String(value || "")
                  );
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <InputField
                  label="Banner Title"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter Banner Title"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Description Input */}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const result =
                  HomePageBannerSchema.shape.description.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <InputField
                  label="Description"
                  value={field.state.value}
                  required
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Add Description"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="select_by"
            validators={{
              onChange: ({ value }) => {
                const result =
                  HomePageBannerSchema.shape.select_by.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <DropdownField
                  label="Select By"
                  options={[
                    { value: "Shape", label: "Shape" },
                    { value: "Size", label: "Size" },
                    { value: "Color", label: "Color" },
                  ]}
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.handleChange(e.target.value)
                  }
                  required
                  inputClassname="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field> */}

          <form.Field
            name="select_by"
            validators={{
              onChange: ({ value }) => {
                const result = HomePageBannerSchema.shape.select_by.safeParse(
                  String(value || "")
                );
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <DropdownField
                  label="Select By"
                  options={[
                    { value: "Shape", label: "Shape" },
                    { value: "Size", label: "Size" },
                    { value: "Color", label: "Color" },
                  ]}
                  value={field.state.value}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    field.handleChange(e.target.value)
                  }
                  required
                  inputClassname="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>


        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg">Priority</h1>
          <div className="border-b border-[#dedde2] w-full"></div>
        </div>
        <form.Field
          name="priority"
          validators={{
            onChange: ({ value }) => {
              const parsedValue =
                typeof value === "string" ? Number(value) : value;

              const result =
                HomePageBannerSchema.shape.priority.safeParse(parsedValue);

              return result.success
                ? undefined
                : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="w-full">
              <InputField
                label="Level"
                type="number"
                value={field.state.value || 0}
                required
                min={0}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val === "" ? undefined : Number(val));
                }}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red">
                  {typeof field.state.meta.errors[0] === "string"
                    ? field.state.meta.errors[0]
                    : (field.state.meta.errors[0] as any)?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <div className="flex flex-col gap-2">
          <h1 className="text-lg">Images</h1>
          <div className="border-b border-[#dedde2] w-full"></div>
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-2">
          <form.Field
            name="web_image"
            validators={{
              onChange: ({ value }) => {
                const result =
                  HomePageBannerSchema.shape.web_image.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Upload Web Image"
                  type="file"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.handleChange(file);
                    }
                  }}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field
            name="mobile_image"
            validators={{
              onChange: ({ value }) => {
                const result =
                  HomePageBannerSchema.shape.mobile_image.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Upload Mobile Image"
                  type="file"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.handleChange(file);
                    }
                  }}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-sm text-red">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="bg-[#c9c9c9] py-2 px-6 rounded w-full text-base self-start hover:scale-105 transition-transform"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-[#df8d29] text-white py-2 px-6 rounded w-full text-base self-start hover:scale-105 transition-transform"
          >
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </section>
    </form>
  );
};
