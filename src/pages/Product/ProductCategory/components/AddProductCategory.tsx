import { useForm } from "@tanstack/react-form";
import get from "lodash/get";
import { useEffect } from "react";
import { Modal } from "../../../../components/shared";
import {
  useCreateProductCategoriesMutation,
  useUpdateProductCategoriesMutation,
  IFetchCategory,
} from "../../../../server/api/productHooks";
import { z } from "zod";
import { FieldError } from "../../../auth/LoginPage";
import FileDropInput from "../../../../components/shared/form_components/FileDropInput";
interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: IFetchCategory & { rawDescription?: string; image?: string };
  closeModal: () => void;
}

const schema = z.object({
  name: z.string().min(1, "**Name is required"),
  description: z.string().max(500, "**Description must be less than 500 characters").optional(),
  image: z.instanceof(File).nullable().optional(),
});
interface ICategoryValue {
  name: string;
  description?: string;
  image?: File | null;
}
const AddProductCategory = ({ modalRef, editData, closeModal }: propTypes) => {
  const { mutate: createCategory, isSuccess: createSuccess } =
    useCreateProductCategoriesMutation();
  const { mutate: updateCategory, isSuccess: updateSuccess } =
    useUpdateProductCategoriesMutation();
  const form = useForm({
    defaultValues: {
      name: editData ? get(editData, "name", "") : "",
      description: editData ? get(editData, "rawDescription", "") : "",
      image: null,
    } as ICategoryValue,
    validators: {
      onChange: schema,
      onSubmit: schema,
      onBlur: schema,
    },

    onSubmit: async ({ value }) => {
      // Create FormData if there's an image, otherwise send regular JSON
      if (value.image) {
        const formData = new FormData();
        formData.append("name", value.name);
        if (value.description) {
          formData.append("description", value.description);
        }
        formData.append("image", value.image);

        if (editData) updateCategory({ id: editData._id, body: formData });
        else createCategory(formData);
      } else {
        // Send regular JSON data when no image
        const jsonData = {
          name: value.name,
          description: value.description,
        };
        if (editData) updateCategory({ id: editData._id, body: jsonData });
        else createCategory(jsonData);
      }
    },
  });

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      form.reset();
      closeModal();
    }
  }, [createSuccess, updateSuccess]);
  return (
    <Modal classname="max-w-md w-full" ref={modalRef}>
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
                <div>
                  <input
                    id="category"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 bg-[#f6f7f9] focus:ring-blue-500 focus:border-blue-500}`}
                    placeholder="Enter Category name"
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

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
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${(field.state.value?.length || 0) > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                      {field.state.value?.length || 0}/500
                    </span>
                  </div>
                </div>
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="image">
            {(field) => (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Category Image
                </label>
                <FileDropInput
                  multiple={false}
                  label=""
                  value={field.state.value || null}
                  onChange={(file: File | null) => field.handleChange(file)}
                  existingImageUrl={editData?.image}
                  accept={{
                    "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
                  }}
                  placeholder="Upload category image (optional)"
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
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
