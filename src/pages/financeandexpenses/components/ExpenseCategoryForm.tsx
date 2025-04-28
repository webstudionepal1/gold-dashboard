import { useForm } from "@tanstack/react-form";
import { get } from "lodash";
import React, { useEffect } from "react";
import { z } from "zod";
interface propTypes {
  editData?: any;
  closeModal: () => void;
}
import { FieldError } from "../../auth/LoginPage";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import { TextareaField } from "../../../components/shared/form_components/TextArea";
import {
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
} from "../../../server/api/expensesHook";

const addExpenseCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
});
const ExpenseCategoryForm = ({ editData, closeModal }: propTypes) => {
  {
    console.log("CAT#EROERE EIDT ", editData);
  }
  const {
    mutate: createExpenseCategory,
    isPending: createExpenseCatPending,
    isSuccess: createExpenseCatSuccess,
  } = useCreateExpenseCategoryMutation();

  const {
    mutate: updateExpenseCategory,
    isPending: updateExpenseCatPending,
    isSuccess: updateExpenseCatSuccess,
  } = useUpdateExpenseCategoryMutation();
  const form = useForm({
    defaultValues: {
      name: editData ? get(editData, "name", "") : "",
      description: editData ? get(editData, "description", "") : "",
    },
    validators: {
      onSubmit: addExpenseCategorySchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted", value);
      if (editData) {
        updateExpenseCategory({ id: editData._id, body: value });
      } else {
        createExpenseCategory(value);
      }
    },
  });

  useEffect(() => {
    if (createExpenseCatSuccess) {
      form.reset();
      closeModal();
    }
  }, [createExpenseCatSuccess, closeModal]);
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

          <form.Field name="name">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Category"
                  required
                  min={0}
                  placeholder="eg. Inventory"
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
                <TextareaField
                  label="Description"
                  placeholder="Enter description"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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

export default ExpenseCategoryForm;
