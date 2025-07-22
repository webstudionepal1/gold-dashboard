import { useForm } from "@tanstack/react-form";
import { get } from "lodash";
import { useEffect } from "react";
import { z } from "zod";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import MultiImageUploader from "../../../components/shared/form_components/FileDropInput";
import { InputField } from "../../../components/shared/form_components/InputField";
import {
  useCreateExpenseMutation,
  useGetExpenseCategoryQuery,
  useUpdateExpenseMutation,
} from "../../../server/api/expensesHook";
import { FieldError } from "../../auth/LoginPage";
interface propTypes {
  editData?: any;
  closeModal: () => void;
}

const addExpenseSchema = z.object({
  date: z.string(),
  expenseCategory: z.string().min(1, "Category is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
  description: z.string().min(1, "Description is required"),
  image: z.array(z.instanceof(File)),
  existingImages: z.array(z.string()),
});
interface IExpenseForm {
  date: string;
  expenseCategory: string;
  amount: number;
  description: string;
  image: File[];
  existingImages: string[];
}
const ExpenseForm = ({ editData, closeModal }: propTypes) => {
  {
  }
  const {
    mutate: createExpense,
    isPending: ExpensePending,
    isSuccess: ExpenseSuccess,
  } = useCreateExpenseMutation();

  const {
    mutate: updateExpense,
    isPending: updateExpensePending,
    isSuccess: updateExpenseSuccess,
  } = useUpdateExpenseMutation();
  const {
    data: expenseCategoryList,
    isLoading: expenseCategoryLoading,
    isSuccess: expenseCategorySuccess,
  } = useGetExpenseCategoryQuery();

  const form = useForm({
    defaultValues: {
      date: editData ? get(editData, "date", "") : "",
      expenseCategory: editData ? get(editData, "expenseCategory._id", "") : "",
      amount: editData ? get(editData, "amount", 0) : 0,
      description: editData ? get(editData, "description", "") : "",
      image: [],
      existingImages: get(editData, "images", []),
    } as IExpenseForm,
    validators: {
      onSubmit: addExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      formData.append("date", value.date);
      formData.append("expenseCategory", value.expenseCategory);
      formData.append("amount", `${value.amount}`);
      formData.append("description", value.description);

      // formData.append("images", value.image);
      if (Array.isArray(value.image)) {
        value.image.forEach((file: any) => {
          formData.append("images", file);
        });
      }

      if (editData) {
        updateExpense({ id: editData._id, body: formData });
      } else {
        createExpense(formData);
      }
    },
  });

  useEffect(() => {
    if (ExpenseSuccess) form.reset();
  }, [ExpenseSuccess]);
  return (
    <>
      <div className="bg-[#ffffff]">
        <form
          className="flex flex-col gap-4 mx-4 my-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
            closeModal();
          }}>
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
            <form.Field name="expenseCategory">
              {(field) => (
                <div className="w-full">
                  <DropdownField
                    label="Category"
                    required
                    options={expenseCategoryList?.map((item) => ({
                      label: item.name ?? "",
                      value: item._id ?? "",
                    }))}
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
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
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
              <MultiImageUploader
                existingFiles={form.getFieldValue("existingImages")}
                multiple={true}
                form={form}
                existingFileField="existingImages"
                label="Upload Receipts"
                value={field.state.value}
                onChange={(files) => field.handleChange(files)}
              />
            )}
          </form.Field>

          <div className="flex items-center w-full gap-5">
            <button
              onClick={() => closeModal()}
              className=" bg-[#c9c9c9] flex-1  px-7 py-2 rounded-xl ">
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-[#df8d29] flex-1 text-white px-7 py-2 rounded-xl ">
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ExpenseForm;
