import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";

import { z } from "zod";
const MIN_DATE = new Date("1970-01-01");

const voucherSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.string().min(1, "Type is required"),
  discount: z.string().min(1, "Discount is required"),
  startDate: z
    .string()
    .min(1, "Start Date is required")
    .refine((val) => new Date(val) >= MIN_DATE, {
      message: "Start Date cannot be earlier than 1970-01-01",
    }),
  endDate: z
    .string()
    .min(1, "End Date is required")
    .refine((val) => new Date(val) >= MIN_DATE, {
      message: "End Date cannot be earlier than 1970-01-01",
    }),
});

interface VoucherFormProps {
  closeModal: () => void;
  initialValues?: {
    code: string;
    type: string;
    discount: string;
    startDate: string;
    endDate: string;
  };
  onSubmit: (data: {
    code: string;
    type: string;
    discount: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({
  closeModal,
  initialValues = {
    code: "",
    type: "",
    discount: "",
    startDate: "",
    endDate: "",
  },
  onSubmit,
}) => {
  const { code, discount, type, startDate, endDate } = initialValues;
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: voucherSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      closeModal();
    },
  });

  useEffect(() => {
    form.reset();
  }, [code, discount, type, startDate, endDate]);

  const isEditing =
    initialValues.code !== "" ||
    initialValues.type !== "" ||
    initialValues.discount !== "" ||
    initialValues.startDate !== "" ||
    initialValues.endDate !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="p-10 flex flex-col gap-10"
    >
      <p className="text-lg font-bold text-black text-center">
        {isEditing ? "Edit Voucher" : "Add Voucher"}
      </p>

      <section className="flex flex-col gap-6">
        <form.Field
          name="code"
          validators={{
            onChange: ({ value }) => {
              const result = voucherSchema.shape.code.safeParse(value);
              return result.success
                ? undefined
                : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="w-full">
              <InputField
                label="Code"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g Christmas Sale"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red  mt-1">
                  {typeof field.state.meta.errors[0] === "string"
                    ? field.state.meta.errors[0]
                    : (field.state.meta.errors[0] as any)?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <div className="border-b border-[#dedde2] w-full mb-2 "></div>

        {/* Dropdown Row */}
        <div className="flex gap-4 w-full">
          <form.Field
            name="type"
            validators={{
              onChange: ({ value }) => {
                const result = voucherSchema.shape.type.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-1/2">
                <DropdownField
                  label="Type"
                  options={[
                    { value: "fixed", label: "Fixed" },
                    { value: "percentage", label: "Percentage" },
                  ]}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="discount"
            validators={{
              onChange: ({ value }) => {
                const result = voucherSchema.shape.discount.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-1/2">
                <DropdownField
                  label="Discount"
                  options={[
                    { value: "shipping", label: "Shipping" },
                    { value: "product", label: "Product" },
                  ]}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="border-b border-[#dedde2] w-full mb-2 "></div>

        {/* Date Inputs Row */}
        <div className="flex gap-4 w-full">
          <form.Field
            name="startDate"
            validators={{
              onChange: ({ value }) => {
                const result = voucherSchema.shape.startDate.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-1/2">
                <InputField
                  label="Start Date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="endDate"
            validators={{
              onChange: ({ value }) => {
                const result = voucherSchema.shape.endDate.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0].message;
              },
            }}
          >
            {(field) => (
              <div className="w-1/2">
                <InputField
                  label="End Date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red  mt-1">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : (field.state.meta.errors[0] as any)?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div className="border-b border-[#dedde2] w-full mb-2 "></div>

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
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </section>
    </form>
  );
};
