import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import { Modal } from '../../../../components/shared';
import {
  IFetchOccasion,
  useCreateProductOccasionMutation,
  useUpdateProductOccasionMutation,
} from '../../../../server/api/productHooks';
import { InputField } from '../../../../components/shared/form_components/InputField';
import { DropdownField } from '../../../../components/shared/form_components/Dropdown';
import { FieldError } from '../../../auth/LoginPage';
import FileDropInput from '../../../../components/shared/form_components/FileDropInput';
import VideoUploadField from '../../../../components/shared/form_components/VideoUploadField';

interface PropTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: IFetchOccasion | null;
  closeModal: () => void;
}

// Helper function to generate SEO data and slug automatically
const generateSEOData = (
  name: string,
  description: string = '',
  seasonality: string = 'year-round'
) => {
  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  const seoTitle = `${name} Jewelry Collection | Premium ${name} Designs`;
  const seoDescription = description
    ? `${description.substring(0, 150)}...`
    : `Discover our exquisite ${name.toLowerCase()} jewelry collection. Perfect for special occasions with premium quality and elegant designs.`;

  const baseKeywords = [
    name.toLowerCase(),
    `${name.toLowerCase()} jewelry`,
    `${name.toLowerCase()} collection`,
    'jewelry',
    'premium jewelry',
    'elegant designs',
  ];

  if (seasonality !== 'year-round') {
    baseKeywords.push(`${seasonality} jewelry`, `${seasonality} collection`);
  }

  return {
    slug,
    seoTitle,
    seoDescription,
    keywords: baseKeywords,
  };
};

const seasonalityOptions = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Autumn', value: 'autumn' },
  { label: 'Winter', value: 'winter' },
  { label: 'Year Round', value: 'year-round' },
];

const statusOptions = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

const AddProductOccasion = ({ modalRef, closeModal, editData }: PropTypes) => {
  const { mutate: createOccasion, isSuccess } =
    useCreateProductOccasionMutation();
  const { mutate: updateOccasion, isSuccess: isUpdateSuccess } =
    useUpdateProductOccasionMutation();

  const form = useForm({
    defaultValues: {
      name: editData?.name ?? '',
      description: editData?.description ?? '',
      isActive: editData?.isActive ?? true,
      image: null as File | null, // Will be handled by FileDropInput
      video: null as File | null, // Will be handled by VideoUploadField
      seasonality: editData?.metadata?.seasonality ?? 'year-round',
    },

    onSubmit: async ({ value }) => {
      // Generate SEO data and slug automatically
      const seoData = generateSEOData(
        value.name,
        value.description || '',
        value.seasonality || 'year-round'
      );

      const formData = new FormData();

      // Append basic fields
      formData.append('name', value.name);
      formData.append('slug', editData?.slug || seoData.slug);
      formData.append('description', value.description || '');
      formData.append('isActive', String(value.isActive));

      // Handle metadata as JSON string
      const metadata = {
        seasonality: value.seasonality || 'year-round',
        seoTitle: seoData.seoTitle,
        seoDescription: seoData.seoDescription,
        keywords: seoData.keywords,
      };
      formData.append('metadata', JSON.stringify(metadata));

      // Handle image file
      if (value.image instanceof File) {
        formData.append('image', value.image);
      } else if (editData?.image) {
        formData.append('existingImage', editData.image);
      }

      // Handle video file
      if (value.video instanceof File) {
        formData.append('video', value.video);
      } else if (editData?.video) {
        formData.append('existingVideo', editData.video);
      }

      if (editData) {
        updateOccasion({ id: editData._id, body: formData });
      } else {
        createOccasion(formData);
      }
    },
  });

  useEffect(() => {
    if (isSuccess || isUpdateSuccess) {
      form.reset();
      closeModal();
    }
  }, [isSuccess, isUpdateSuccess]);

  return (
    <Modal
      classname="max-w-3xl w-full h-auto max-h-[90vh] overflow-y-auto"
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
          {editData ? 'Edit Occasion' : 'Add New Occasion'}
        </h2>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <form.Field name="name">
              {(field) => (
                <div>
                  <InputField
                    label="Occasion Name *"
                    placeholder="Enter occasion name"
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
            {/* Status Setting */}
            <form.Field name="isActive">
              {(field) => (
                <div>
                  <DropdownField
                    label="Status"
                    options={statusOptions}
                    value={field.state.value ? 'true' : 'false'}
                    onChange={(e) =>
                      field.handleChange(e.target.value === 'true')
                    }
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          {/* Media Settings */}
          <div className="gap-4 grid  grid-cols-1">
            <form.Field name="image">
              {(field) => (
                <div>
                  <FileDropInput
                    multiple={false}
                    label="Occasion Image"
                    value={field.state.value}
                    onChange={(file: File | null) => field.handleChange(file)}
                    existingImageUrl={editData?.image}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="video">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occasion Video
                  </label>
                  <VideoUploadField
                    onChange={(file: File | null) => field.handleChange(file)}
                    maxFileSize={200} // 200MB as per user preference
                    existingVideoUrl={editData?.video}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          {/* Metadata */}
          {/* <form.Field name="seasonality">
            {(field) => (
              <div>
                <DropdownField
                  label="Seasonality"
                  options={seasonalityOptions}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as
                        | 'spring'
                        | 'summer'
                        | 'autumn'
                        | 'winter'
                        | 'year-round'
                    )
                  }
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field> */}

          {/* Information about automatic features */}
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>SEO:</strong> Title, description, and keywords are
                automatically generated based on the occasion name & description
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Media:</strong> Images up to 5MB and videos up to 200MB
                are supported. Files are securely stored and optimized
                automatically.
              </p>
            </div>
          </div>
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
            {editData ? 'Update' : 'Create'} Occasion
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductOccasion;
