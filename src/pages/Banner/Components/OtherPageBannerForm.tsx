import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";

interface OtherPageBannerFormProps {
  closeModal: () => void;
  initialValues?: {
    image: string;
    title: string;
    link: string;
    description: string;
  };
  onSubmit: (data: {
    image: string;
    title: string;
    link: string;
    description: string;
  }) => void;
}

export const OtherPageBannerForm: React.FC<OtherPageBannerFormProps> = ({
  closeModal,
  initialValues = {
    category: "",
    level: "",
    image: "",
    title: "",
    link: "",
    description: "",
  },
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      closeModal();
    },
  });

  useEffect(() => {
    form.reset();
  }, [
    initialValues.image,
    initialValues.title,
    initialValues.link,
    initialValues.description,
  ]);

  const isEditing =
    initialValues.image !== "" ||
    initialValues.title !== "" ||
    initialValues.link !== "" ||
    initialValues.description !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="p-10 flex flex-col gap-10"
    >
      <p className="text-lg font-bold text-black text-center">
        {isEditing ? "Edit Other Page Banner" : "Add Other Page Banner"}
      </p>

      <section className="flex flex-col gap-6">
        {/* Title Input */}
        <div className="flex items-center gap-2">
          <form.Field name="title">
            {(field) => (
              <InputField
                label="Banner Title"
                required
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter Banner Title"
              />
            )}
          </form.Field>

          {/* Description Input */}
          <form.Field name="description">
            {(field) => (
              <InputField
                label="Description"
                value={field.state.value}
                required
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Add Description"
              />
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="category">
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  inputClassname="w-full"
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-lg">Priority</h1>
          <div className="border-b border-[#dedde2] w-full"></div>
        </div>
        <form.Field name="level">
          {(field) => (
            <InputField
              label="Level"
              type="number"
              value={field.state.value || 0}
              required
              min={0}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
        <div className="flex flex-col gap-2">
          <h1 className="text-lg">Images</h1>
          <div className="border-b border-[#dedde2] w-full"></div>
        </div>

        {/* Image Upload */}
        <div className="flex gap-2 items-center">
          <form.Field name="image">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Upload Web Image"
                  type="file"
                  required
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0]?.name || "")
                  }
                />
              </div>
            )}
          </form.Field>
          <form.Field name="image">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Upload Mobile Image"
                  type="file"
                  required
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0]?.name || "")
                  }
                />
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
