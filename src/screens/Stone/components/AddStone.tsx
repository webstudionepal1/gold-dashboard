import { useForm } from '@tanstack/react-form';
import get from 'lodash/get';
import { useEffect, useState } from 'react';
import { Modal } from '../../../components/shared';
import {
  useCreateStoneMutation,
  useUpdateStoneMutation,
} from '../../../server/api/productHooks';
import { InputField } from '../../../components/shared/form_components/InputField';
import { DropdownField } from '../../../components/shared/form_components/Dropdown';
import { FieldError } from '../../auth/LoginPage';
import MultiImageUploader from '@/components/shared/form_components/FileDropInput';
interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: any;
  closeModal: () => void;
}

// Stone type options
const stoneTypeOptions = [
  { label: 'Diamond', value: 'diamond' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Emerald', value: 'emerald' },
  { label: 'Sapphire', value: 'sapphire' },
  { label: 'Pearl', value: 'pearl' },
  { label: 'Other', value: 'other' },
];

const AddStone = ({ modalRef, editData, closeModal }: propTypes) => {
  const { mutate: createStone, isSuccess: createSuccess } =
    useCreateStoneMutation();
  const { mutate: updateStone, isSuccess: updateSuccess } =
    useUpdateStoneMutation();

  // State for image handling
  const form = useForm({
    defaultValues: {
      name: editData ? get(editData, 'name', '') : '',
      type: editData ? get(editData, 'type', 'diamond') : 'diamond',
      color: editData ? get(editData, 'color', '') : '',
      clarity: editData ? get(editData, 'clarity', '') : '',
      cut: editData ? get(editData, 'cut', '') : '',
      carat: editData ? get(editData, 'carat', 0) : 0,
      pricePerCarat: editData ? get(editData, 'pricePerCarat', 0) : 0,
      shape: editData ? get(editData, 'shape', '') : '',
      certification: editData ? get(editData, 'certification', '') : '',
      description: editData ? get(editData, 'description', '') : '',
      images: [] as any, // Array of image URLs
      existingImages: editData ? get(editData, 'images', []) : [], // Array of image URLs
    },
    validators: {},

    onSubmit: async ({ value }) => {
      console.log('Form values:', value);

      // Separate files from other data
      const { images, existingImages, ...otherFields } = value;

      const formData = new FormData();

      // Add all non-file fields
      Object.entries(otherFields).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          formData.append(key, String(val));
        }
      });

      // Add new image files
      if (Array.isArray(images)) {
        images.forEach((file: File) => {
          formData.append('images', file);
        });
      }

      // Add existing images to keep
      if (Array.isArray(existingImages) && existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      // Submit
      try {
        if (editData) {
          await updateStone({ id: editData._id, body: formData });
        } else {
          await createStone(formData);
        }

        form.reset();
        closeModal();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

  // Handle image file selection

  return (
    <Modal
      classname="w-full max-w-4xl h-auto max-h-[90vh] overflow-y-auto"
      ref={modalRef}
    >
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editData ? 'Edit Stone' : 'Add New Stone'}
        </h2>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <form.Field name="name">
              {(field) => (
                <div>
                  <InputField
                    label="Stone Name *"
                    placeholder="Enter stone name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <div>
                  <DropdownField
                    label="Stone Type *"
                    options={stoneTypeOptions}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="color">
              {(field) => (
                <div>
                  <InputField
                    label="Color *"
                    placeholder="Enter color"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="clarity">
              {(field) => (
                <div>
                  <InputField
                    label="Clarity *"
                    placeholder="Enter clarity"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="cut">
              {(field) => (
                <div>
                  <InputField
                    label="Cut *"
                    placeholder="Enter cut"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="carat">
              {(field) => (
                <div>
                  <InputField
                    label="Carat Weight *"
                    type="number"
                    step="0.01"
                    placeholder="Enter carat weight"
                    numberValue={field.state.value} // ✅ Use numberValue instead of value
                    onNumberChange={field.handleChange} // ✅ Use onNumberChange instead of onChange
                    allowNegative={false} // ✅ Optional: prevent negative values
                    clearZeroOnFocus={true} // ✅ Optional: enable zero clearing (default)
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="pricePerCarat">
              {(field) => (
                <div>
                  <InputField
                    label="Price Per Carat *"
                    type="number"
                    step="0.01"
                    placeholder="Enter price per carat"
                    numberValue={field.state.value}
                    onNumberChange={field.handleChange}
                    allowNegative={false}
                    clearZeroOnFocus={true}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="shape">
              {(field) => (
                <div>
                  <InputField
                    label="Shape *"
                    placeholder="Enter shape"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="certification">
              {(field) => (
                <div>
                  <InputField
                    label="Certification"
                    placeholder="Enter certification (optional)"
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
                  <InputField
                    label="Description"
                    placeholder="Enter description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="images">
            {(field) => (
              <div>
                <MultiImageUploader
                  multiple={true}
                  form={form}
                  value={field.state.value}
                  onChange={(files) => field.handleChange(files)}
                  existingFiles={form.getFieldValue('existingImages')}
                  existingFileField="existingImages"
                />
              </div>
            )}
          </form.Field>

          {/* Media Section */}
          {/* <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stone Images
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="stone-images"
                />
                <label htmlFor="stone-images" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Click to select images or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB each
                    </p>
                  </div>
                </label>
              </div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {editData?.images?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Current images: {editData.images.length} file(s)
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Images:</strong> Upload high-quality images up to 5MB.
                Images are automatically optimized and securely stored.
              </p>
            </div>
          </div> */}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#DF8D28] text-white rounded-lg hover:bg-[#DF8D28]/90"
          >
            {editData ? 'Update' : 'Create'} Stone
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStone;
