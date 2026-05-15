import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo } from "react";
import * as z from "zod";
import { Modal } from "../../../../components/shared";
import {
  IFetchSubCategory,
  useCreateProductSubCategoryMutation,
  useGetAllProductCategoriesQuery,
  useUpdateProductSubCategoryMutation,
} from "../../../../server/api/productHooks";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import { FieldError } from "../../../auth/LoginPage";
import { get } from "lodash";
import { InputField } from "../../../../components/shared/form_components/InputField";
interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: IFetchSubCategory | null;
  closeModal: () => void;
}

const validationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});
interface ISubCategorForm {
  name: string;
  category: string;
  description?: string;
}
export const AddProductSubCategory = ({
  modalRef,
  closeModal,
  editData,
}: propTypes) => {
  console.log(editData, 'editData');
  const { data: categories, isSuccess: categorySuccess } =
    useGetAllProductCategoriesQuery();
  const { mutate: createSubCategory, isSuccess } =
    useCreateProductSubCategoryMutation();
  const { mutate: updateSubCategory, isSuccess: isUpdateSuccess } =
    useUpdateProductSubCategoryMutation();

  const categoriesList = useMemo(
    () =>
      categorySuccess
        ? categories?.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [categorySuccess, categories]
  );
  const form = useForm({
    defaultValues: {
      name: editData ? get(editData, "name", "") : "",
      category: editData ? get(editData, "category", "") : "",
      description: editData ? get(editData, "rawDescription", "") : "",
    } as ISubCategorForm,
    validators: {
      onSubmit: validationSchema,
    },
    onSubmit: async ({ value }) => {
      if (editData) updateSubCategory({ id: editData._id, body: value });
      else createSubCategory(value);
    },
  });
  useEffect(() => {
    if (isSuccess || isUpdateSuccess) {
      form.reset();
      closeModal();
    }
  }, [isSuccess, isUpdateSuccess]);

  return (
    <Modal classname="w-[400px]  h-auto" ref={modalRef}>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h2 className="mb-6 text-xl font-semibold">
          {editData ? "Edit Subcategory" : "Add New Subcategory"}
        </h2>
        <div className="space-y-6">
          <div>

            <form.Field name="name">
              {(field) => (
                <div>
                  <InputField
                    label="Name"
                    required
                    placeholder="Enter Subcategory Name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>
          <form.Field name="category">
            {(field) => (
              <div>
                <DropdownField
                  label="Category"
                  required
                  firstInput="Select Parent Category"
                  options={categoriesList}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="description">
            {(field) => (
              <div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    Description 
                  </label>
                  <textarea
                    placeholder="Enter short description"
                    className="p-2 border rounded-md focus:outline-none bg-[#f6f7f9] resize-none"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                  />
                </div>
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </div>
        <div className="flex justify-between gap-3 mt-6">
          <button
            type="submit"
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-7 py-2 bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white rounded-md text-sm font-medium transition-colors duration-200"
          >
            {editData ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
