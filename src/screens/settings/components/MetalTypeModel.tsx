import { useForm } from "@tanstack/react-form";
import clsx from "clsx";
import { get } from "lodash";
import React, { useEffect } from "react";
import { z } from "zod";
import { InputField } from "../../../components/shared/form_components/InputField";
import { TextareaField } from "../../../components/shared/form_components/TextArea";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import {
  IFetchMetalType,
  useCreateMetalTypeMutation,
  useUpdateMetalTypeMutation,
} from "../../../server/api/productHooks";
import { FieldError } from "../../auth/LoginPage";

interface MetalTypeModelProps {
  onClose: () => void;
  data?: IFetchMetalType;
  edit?: boolean;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores"),
  description: z.string().optional(),
  sortOrder: z.number().min(0, "Sort order must be 0 or greater"),
  isActive: z.boolean(),
});

interface FormValues {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

const slugifyName = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

const MetalTypeModel: React.FC<MetalTypeModelProps> = ({
  onClose,
  data,
  edit = false,
}) => {
  const { mutate: createMetalType, isSuccess, isPending } =
    useCreateMetalTypeMutation();
  const {
    mutate: updateMetalType,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateMetalTypeMutation();

  const form = useForm({
    defaultValues: {
      name: edit ? get(data, "name", "") : "",
      slug: edit ? get(data, "slug", "") : "",
      description: edit ? get(data, "description", "") || "" : "",
      sortOrder: edit ? get(data, "sortOrder", 0) : 0,
      isActive: edit ? get(data, "isActive", true) : true,
    } as FormValues,
    validators: {
      onChange: schema,
      onBlur: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const body = {
        name: value.name.trim(),
        slug: value.slug.trim(),
        description: value.description.trim() || null,
        sortOrder: Number(value.sortOrder) || 0,
        isActive: value.isActive,
      };

      if (edit) updateMetalType({ id: data?._id ?? "", body });
      else createMetalType(body);
    },
  });

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      form.reset();
      onClose();
    }
  }, [isSuccess, updateSuccess, form, onClose]);

  return (
    <ScrollableModal classname="w-full max-w-lg px-4 py-4" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          {edit ? "Edit Metal Type" : "Add Metal Type"}
        </h2>

        <form.Field name="name">
          {(field) => (
            <div>
              <InputField
                label="Name"
                placeholder="e.g. Gold, Silver, Platinum"
                value={field.state.value}
                onChange={(e) => {
                  const name = e.target.value;
                  field.handleChange(name);
                  if (!edit) {
                    form.setFieldValue("slug", slugifyName(name));
                  }
                }}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="slug">
          {(field) => (
            <div>
              <InputField
                label="Slug"
                placeholder="e.g. gold, rose_gold"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(slugifyName(e.target.value))
                }
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div>
              <TextareaField
                label="Description"
                placeholder="Optional notes about this metal type"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="sortOrder">
          {(field) => (
            <div>
              <InputField
                label="Sort Order"
                type="number"
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(Number(e.target.value) || 0)
                }
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="isActive">
          {(field) => (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="rounded border-gray-300 text-[#DF8D28] focus:ring-[#DF8D28]"
              />
              Active
            </label>
          )}
        </form.Field>

        <div className="border-b border-[#dedde2] w-full mt-4 mb-4" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || updatePending}
            className={clsx(
              "flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl",
              (isPending || updatePending) && "cursor-not-allowed opacity-70"
            )}
          >
            {edit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </ScrollableModal>
  );
};

export default MetalTypeModel;
