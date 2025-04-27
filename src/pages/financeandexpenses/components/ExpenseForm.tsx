import { useForm } from "@tanstack/react-form";
import { get } from "lodash";
import React from "react";
import { z } from "zod";
interface propTypes {
  editData?: any;
  closeModal: () => void;
}
import { FieldError } from "../../auth/LoginPage";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import { useCreateExpenseMutation } from "../../../server/api/expensesHook";

const addExpenseSchema = z.object({
  date: z.coerce
    .date()
    .refine((date) => date.getFullYear() >= 1950, {
      message: "The year cannot be lower than 1950",
    })
    .refine((date) => date <= new Date(), {
      message: "The year cannot be above the present date.",
    }),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
  description: z.string().min(1, "Description is required"),
  image: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: "Image is required" }),
});
const ExpenseForm = ({ editData, closeModal }: propTypes) => {
  const {
    mutate: createExpense,
    isPending: ExpensePending,
    isSuccess: ExpenseSuccess,
  } = useCreateExpenseMutation();
  const form = useForm({
    defaultValues: {
      date: editData ? get(editData, "name", "") : "",
      category: editData ? get(editData, "category", "") : "",
      amount: editData ? get(editData, "amount", 0) : 0,
      description: editData ? get(editData, "description", "") : "",
      image: editData ? get(editData, "image", null) : null,
    },
    validators: {
      onSubmit: addExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted", value);

      try {
        const formData = new FormData();

        formData.append("date", value.date),
          formData.append("category", value.category),
          formData.append("amount", value.amount),
          formData.append("description", value.description),
          formData.append("image", value.image);

        // createExpense(formData);
      } catch (error) {
        console.error("Failed to create Expense", error);
      }
    },
  });
  return (
    <>
      <div className="bg-[#ffffff]">
        <form
          className="flex flex-col gap-4 mx-4 my-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <h1 className="flex items-center justify-center text-xl font-semibold">
            Add Expenses
          </h1>
          <div>
            <form.Field name="date">
              {(field) => (
                <div className="w-full">
                  <InputField
                    type="date"
                    label="Date"
                    required
                    min="1950-01-01"
                    max={new Date().toISOString().split("T")[0]}
                    placeholder="2023-01-10"
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
                    required
                    options={[
                      { value: "fixed", label: "Fixed" },
                      { value: "percentage", label: "Percentage" },
                    ]}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    inputClassname="w-full"
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="amount">
              {(field) => (
                <div className="w-full">
                  <InputField
                    type="number"
                    label="Amount"
                    required
                    min={0}
                    placeholder="Enter Discount"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Description"
                  required
                  placeholder="Enter Description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="image">
            {(field) => (
              <div className="w-full">
                <FileDropInput
                  label="Invoice"
                  value={field.state.value as unknown as File}
                  onChange={(file) => {
                    field.handleChange(file); // store the file directly
                  }}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <div className="flex items-center w-full gap-5">
            <button
              onClick={() => closeModal()}
              className=" bg-[#c9c9c9] flex-1  px-7 py-2 rounded-xl "
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-[#df8d29] flex-1 text-white px-7 py-2 rounded-xl "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ExpenseForm;
