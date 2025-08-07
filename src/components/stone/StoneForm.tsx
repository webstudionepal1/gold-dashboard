import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { InputField } from '../shared/form_components/InputField';
import { DropdownField } from '../shared/form_components/Dropdown';
import {
  IFetchStone,
  IStoneFormData,
  STONE_TYPES,
  STONE_CUTS,
  STONE_SHAPES,
  DIAMOND_CLARITY_GRADES,
  STONE_COLORS,
} from '../../types/Stone.interface';

interface StoneFormProps {
  stone?: IFetchStone;
  onSubmit: (data: IStoneFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const StoneForm: React.FC<StoneFormProps> = ({
  stone,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<IStoneFormData>({
    name: '',
    type: 'diamond',
    color: '',
    clarity: '',
    cut: '',
    carat: 0,
    pricePerCarat: 0,
    shape: '',
    certification: '',
    description: '',
    images: [],
  });

  interface StoneFormErrors {
    name?: string;
    type?: string;
    color?: string;
    clarity?: string;
    cut?: string;
    carat?: string;
    pricePerCarat?: string;
    shape?: string;
    certification?: string;
    description?: string;
    images?: string;
  }

  const [errors, setErrors] = useState<StoneFormErrors>({});

  // Initialize form with stone data if editing
  useEffect(() => {
    if (stone) {
      setFormData({
        name: stone.name,
        type: stone.type,
        color: stone.color,
        clarity: stone.clarity,
        cut: stone.cut,
        carat: stone.carat,
        pricePerCarat: stone.pricePerCarat,
        shape: stone.shape,
        certification: stone.certification || '',
        description: stone.description || '',
        images: stone.images || [],
      });
    }
  }, [stone]);

  const handleInputChange = (field: keyof IStoneFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: StoneFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (!formData.clarity.trim()) {
      newErrors.clarity = 'Clarity is required';
    }

    if (!formData.cut.trim()) {
      newErrors.cut = 'Cut is required';
    }

    if (!formData.shape.trim()) {
      newErrors.shape = 'Shape is required';
    }

    if (formData.carat <= 0) {
      newErrors.carat = 'Carat must be greater than 0';
    }

    if (formData.pricePerCarat <= 0) {
      newErrors.pricePerCarat = 'Price per carat must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const totalPrice = formData.carat * formData.pricePerCarat;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Icon
              icon="material-symbols:diamond"
              className="w-6 h-6 text-purple-600"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {stone ? 'Edit Stone' : 'Add New Stone'}
            </h2>
            <p className="text-sm text-gray-500">
              {stone ? 'Update stone information' : 'Create a new stone entry'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon icon="material-symbols:info" className="w-5 h-5" />
              Basic Information
            </h3>

            <InputField
              label="Stone Name"
              placeholder="Enter stone name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}

            <DropdownField
              label="Stone Type"
              firstInput="Select stone type"
              options={STONE_TYPES.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              required
            />

            <DropdownField
              label="Color"
              firstInput="Select color"
              options={STONE_COLORS.map((color) => ({
                value: color.value,
                label: color.label,
              }))}
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              required
            />

            <DropdownField
              label="Clarity"
              firstInput="Select clarity grade"
              options={DIAMOND_CLARITY_GRADES.map((clarity) => ({
                value: clarity.value,
                label: clarity.label,
              }))}
              value={formData.clarity}
              onChange={(e) => handleInputChange('clarity', e.target.value)}
              required
            />
            {errors.clarity && (
              <p className="text-sm text-red-600 mt-1">{errors.clarity}</p>
            )}
          </div>

          {/* Physical Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon icon="material-symbols:straighten" className="w-5 h-5" />
              Physical Properties
            </h3>

            <DropdownField
              label="Cut"
              firstInput="Select cut"
              options={STONE_CUTS.map((cut) => ({
                value: cut.value,
                label: cut.label,
              }))}
              value={formData.cut}
              onChange={(e) => handleInputChange('cut', e.target.value)}
              required
            />
            {errors.cut && (
              <p className="text-sm text-red-600 mt-1">{errors.cut}</p>
            )}

            <DropdownField
              label="Shape"
              firstInput="Select shape"
              options={STONE_SHAPES.map((shape) => ({
                value: shape.value,
                label: shape.label,
              }))}
              value={formData.shape}
              onChange={(e) => handleInputChange('shape', e.target.value)}
              required
            />
            {errors.shape && (
              <p className="text-sm text-red-600 mt-1">{errors.shape}</p>
            )}

            <InputField
              label="Carat Weight"
              type="number"
              step="0.01"
              placeholder="0.00"
              numberValue={formData.carat || 0}
              onNumberChange={(value) => handleInputChange('carat', value)}
              allowNegative={false}
              clearZeroOnFocus={true}
              required
            />
            {errors.carat && (
              <p className="text-sm text-red-600 mt-1">{errors.carat}</p>
            )}

            <InputField
              label="Price per Carat (NPR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              numberValue={formData.pricePerCarat || 0}
              onNumberChange={(value) =>
                handleInputChange('pricePerCarat', value)
              }
              allowNegative={false}
              clearZeroOnFocus={true}
              required
            />
            {errors.pricePerCarat && (
              <p className="text-sm text-red-600 mt-1">
                {errors.pricePerCarat}
              </p>
            )}

            {/* Total Price Display */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Price (Auto-calculated)
              </label>
              <div className="text-lg font-semibold text-green-600">
                NPR {totalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {formData.carat} ct × NPR{' '}
                {formData.pricePerCarat.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Icon icon="material-symbols:description" className="w-5 h-5" />
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Certification"
              placeholder="e.g., GIA, AGS, EGL"
              value={formData.certification}
              onChange={(e) =>
                handleInputChange('certification', e.target.value)
              }
            />
            {errors.certification && (
              <p className="text-sm text-red-600 mt-1">
                {errors.certification}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              placeholder="Enter stone description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon
                  icon="material-symbols:hourglass-empty"
                  className="w-4 h-4 animate-spin"
                />
                {stone ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Icon icon="material-symbols:save" className="w-4 h-4" />
                {stone ? 'Update Stone' : 'Create Stone'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoneForm;
