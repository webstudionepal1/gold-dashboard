import { Field, useForm } from "@tanstack/react-form";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { useEffect } from "react";

import { z } from "zod";

const attributeSchema = z.object({
  category: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
});

interface AttributeFormProps {
  closeModal: () => void;
  initialValues?: {
    category: string;
    value: string;
  };
  onSubmit: (data: { category: string; value: string }) => void;
}
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

  return <div className="min-h-[20px]"></div>;
};

export const AttributeForm: React.FC<AttributeFormProps> = ({
  closeModal,
  initialValues = { category: "", value: "" },
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: {
      category: "",
      value: "",
    },
    validators: {
      onSubmit: attributeSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Attribute form submitted", value);
      closeModal();
    },
  });

  const isEditing = initialValues.category !== "" || initialValues.value !== "";

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-10 py-6 flex flex-col gap-8"
        >
          <p className="text-lg font-bold text-center text-[#1a1336]">
            {isEditing ? "Edit Attribute" : "Add Attribute"}{" "}
          </p>
          <section className="flex flex-col gap-6 w-full">
            <div className="flex gap-4 w-full">
              <form.Field name="category">
                {(field) => (
                  <div className="w-full">
                    <DropdownField
                      label="Attribute Category"
                      options={[
                        { value: "Shape", label: "Shape" },
                        { value: "Size", label: "Size" },
                        { value: "Color", label: "Color" },
                      ]}
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      inputClassname="w-full"
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="value">
                {(field) => (
                  <div className="w-full">
                    <DropdownField
                      label="Value"
                      required
                      options={[
                        { value: "Round", label: "Round" },
                        { value: "Square", label: "Square" },
                        { value: "Oval", label: "Oval" },
                      ]}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      inputClassname="w-full"
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="border-b border-[#dedde2] w-full"></div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="w-full bg-[#c9c9c9] text-[#1a1336] font-semibold py-2 rounded-md hover:scale-105 transition-transform"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-[#d49327] text-white font-semibold py-2 rounded-md hover:scale-105 transition-transform"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};
