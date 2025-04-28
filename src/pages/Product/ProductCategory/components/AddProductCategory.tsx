import { useForm } from "@tanstack/react-form";
import get from "lodash/get";
import { useEffect } from "react";
import { Modal } from "../../../../components/shared";
import {
  useCreateProductCategoriesMutation,
  useUpdateProductCategoriesMutation,
} from "../../../../server/api/productHooks";
interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: any;
  closeModal: () => void;
}

const AddProductCategory = ({ modalRef, editData, closeModal }: propTypes) => {
  const { mutate: createCategory, isSuccess: createSuccess } =
    useCreateProductCategoriesMutation();
  const { mutate: updateCategory, isSuccess: updateSuccess } =
    useUpdateProductCategoriesMutation();
  const form = useForm({
    defaultValues: {
      name: editData ? get(editData, "name", "") : "",
      description: editData ? get(editData, "description", "") : "",
    },
    validators: {},

    onSubmit: async ({ value }) => {
      if (editData) updateCategory({ id: editData._id, body: value });
      else createCategory(value);
    },
  });

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      form.reset();
      closeModal();
    }
  }, [createSuccess, updateSuccess]);
  return (
    <Modal classname="w-[450px]" ref={modalRef}>
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h2 className="mb-6 text-xl font-semibold">
          {editData ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="category"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <form.Field name="name">
              {(field) => (
                <input
                  id="category"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500}`}
                  placeholder="Enter Category name"
                />
              )}
            </form.Field>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <form.Field name="description">
              {(field) => (
                <textarea
                  id="description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  rows={3}
                  placeholder="Enter short description"
                />
              )}
            </form.Field>
          </div>
        </div>
        <div className="flex justify-between gap-3 mt-6">
          <button
            type="button"
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

export default AddProductCategory;
