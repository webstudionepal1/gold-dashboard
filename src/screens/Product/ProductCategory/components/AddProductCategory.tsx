import { useForm } from '@tanstack/react-form';
import get from 'lodash/get';
import { useEffect } from 'react';
import { Modal } from '../../../../components/shared';
import {
  useCreateProductCategoriesMutation,
  useUpdateProductCategoriesMutation,
  IFetchCategory,
} from '../../../../server/api/productHooks';
import { z } from 'zod';
import { FieldError } from '../../../auth/LoginPage';
import MultiImageUploader from '../../../../components/shared/form_components/FileDropInput';
interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: IFetchCategory & { rawDescription?: string; image?: string };
  closeModal: () => void;
}

const schema = z
  .object({
    name: z.string().min(1, '**Name is required'),
    description: z
      .string()
      .max(500, '**Description must be less than 500 characters')
      .optional(),
    image: z.instanceof(File).nullable().optional(),
    existingImage: z.string().optional().nullable(),
  })
  .refine(
    (_data) => {
      // In edit mode, allow either new image or existing image
      // In create mode, image is optional
      return true; // Image is always optional for categories
    },
    {
      message: 'Image is required',
      path: ['image'],
    }
  );

interface ICategoryValue {
  name: string;
  description?: string;
  image?: File | null;
  existingImage?: string | null;
}
const AddProductCategory = ({ modalRef, editData, closeModal }: propTypes) => {
  console.log(editData, 'editdata');
  const {
    mutate: createCategory,
    isSuccess: createSuccess,
    isPending: createPending,
  } = useCreateProductCategoriesMutation();
  const {
    mutate: updateCategory,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateProductCategoriesMutation();
  const form = useForm({
    defaultValues: {
      name: editData ? get(editData, 'name', '') : '',
      description: editData
        ? typeof editData?.description === 'object'
          ? (editData?.description as any)?.props?.children
          : get(editData, 'description', '')
        : '',
      image: null,
      existingImage: editData ? get(editData, 'image', '') : '',
    } as ICategoryValue,
    validators: {
      onChange: schema,
      onSubmit: schema,
      onBlur: schema,
    },

    onSubmit: async ({ value }) => {
      // Always use FormData for consistency with backend expectations
      const formData = new FormData();
      formData.append('name', value.name);
      if (value.description) {
        formData.append('description', value.description);
      }

      // Handle new image upload
      if (value.image) {
        // Backend expects `image` for Category (single image)
        formData.append('image', value.image);
      }

      // Handle existing image in edit mode (only if not removed)
      if (editData && value.existingImage) {
        // Keep previous image if user didn't upload a new one
        formData.append('image', value.existingImage);
      }

      if (editData) {
        updateCategory({ id: editData._id, body: formData });
      } else {
        createCategory(formData);
      }
    },
  });

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      form.reset();
      closeModal();
    }
  }, [createSuccess, updateSuccess]);
  console.log('form', form.state.errors);
  return (
    <Modal classname="max-w-sm w-full" ref={modalRef}>
      <form
        className="p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h2 className="mb-4 text-lg font-semibold">
          {editData ? 'Edit Category' : 'Add New Category'}
        </h2>
        <div className="space-y-4">
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
                    className={`border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 bg-[#f6f7f9] focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter Category Name"
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter short description"
                  className="px-3 py-2 border rounded-md focus:outline-none bg-[#f6f7f9] resize-none w-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={2}
                  maxLength={500}
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      (field.state.value?.length || 0) > 450
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {field.state.value?.length || 0}/500
                  </span>
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
                <p className="text-xs text-gray-500 mb-2">
                  Recommended: square image (1:1), at least 800×800 (ideal 1200×1200), JPG/PNG/WEBP.
                </p>
                <MultiImageUploader
                  multiple={false}
                  form={form}
                  label=""
                  value={field.state.value || null}
                  onChange={(file: File | null) => {
                    field.handleChange(file);
                    // When a new image is selected, clear the existing image
                    if (file) {
                      form.setFieldValue('existingImage', undefined);
                    }
                  }}
                  existingFile={form.getFieldValue('existingImage') as string}
                  existingFileField="existingImage" 
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
                  }}
                  placeholder="Upload image (optional)"
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          {/* Hidden field to track existing image */}
          <form.Field name="existingImage">
            {(field) => (
              <input
                type="hidden"
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        </div>
        <div className="flex justify-between gap-2 mt-4 pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={closeModal}
            disabled={createPending || updatePending}
            className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createPending || updatePending}
            className="px-3 py-2 bg-[#DF8D28] hover:bg-[#DF8D28]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors duration-200 flex-1 flex items-center justify-center gap-2"
          >
            {(createPending || updatePending) && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {createPending
              ? 'Creating...'
              : updatePending
              ? 'Updating...'
              : editData
              ? 'Update'
              : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductCategory;
