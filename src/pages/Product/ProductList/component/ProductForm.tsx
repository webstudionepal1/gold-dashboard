import { Icon } from '@iconify/react/dist/iconify.js';
import { useForm, useStore } from '@tanstack/react-form';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DropdownField } from '../../../../components/shared/form_components/Dropdown';
import MultiImageUploader from '../../../../components/shared/form_components/FileDropInput';
import { InputField } from '../../../../components/shared/form_components/InputField';
import Header from '../../../../components/shared/table_heading/Header';
import {
  useCreateProductsMutation,
  useGetAllProductCategoriesQuery,
  useGetAllProductClaspsQuery,
  useGetAllProductOccasionsQuery,
  useGetAllProductSubCategoriesQuery,
  useGetAllStonesQuery,
  useUpdateProductsMutation
} from '../../../../server/api/productHooks';
import { productStore } from '../../../../store/productStore';
import { cleanObject } from '../../../../utils/cleanObject';
import { useClearableNumberInput } from '../../../../utils/numberInputHelpers';
import { FieldError } from '../../../auth/LoginPage';
import { PriceInputField } from '../../../OrderManagement/Order/components/PriceInputField';
import ChipInputInside from '../../ProductCategory/components/ChipInputInside';
import {
  generateProductDefaultValue,
  type IProductFormValues
} from '../../productObj';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productData = useStore(productStore, (state) => state);

  const {
    mutate: createProduct,
    isPending: pendingAddition,
    isSuccess: productCreateSuccess,
  } = useCreateProductsMutation();

  const {
    mutate: updateProduct,
    isPending: pendingUpdate,
    isSuccess: productUpdateSuccess,
  } = useUpdateProductsMutation();

  const { data: categories, isSuccess: categorySuccess } =
    useGetAllProductCategoriesQuery();
  const { data: subCategories, isSuccess: subSuccess } =
    useGetAllProductSubCategoriesQuery();
  const { data: clasps, isSuccess: claspsSuccess } =
    useGetAllProductClaspsQuery();
  const { data: occasions, isSuccess: occasionsSuccess } =
    useGetAllProductOccasionsQuery();
  const {
    data: stones,
    isSuccess: stonesSuccess,
    isLoading: stonesLoading,
    error: stonesError,
  } = useGetAllStonesQuery();

  const categoriesList = useMemo(
    () =>
      categorySuccess
        ? categories.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [categorySuccess, categories]
  );

  // Get current category value from form state
  const [currentCategory, setCurrentCategory] = useState('');

  const subCategoriesList = useMemo(
    () =>
      subSuccess
        ? subCategories
            .filter(
              (item) => !currentCategory || item.category === currentCategory
            )
            .map((item) => ({ label: item.name, value: item._id }))
        : [],
    [subSuccess, subCategories, currentCategory]
  );

  const claspsList = useMemo(
    () =>
      claspsSuccess
        ? clasps.map((item) => ({ label: item.name, value: item._id }))
        : [],
    [claspsSuccess, clasps]
  );

  const visibilityOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'bestsellers', label: 'Best Sellers' },
    { value: 'popular', label: 'Popular' },
    { value: 'newarrivals', label: 'New Arrivals' },
    { value: 'recommended', label: 'Recommended for you' },
  ];

  const formstate = id ?? 'add';

  const form = useForm({
    defaultValues: generateProductDefaultValue(
      formstate,
      productData
    ) as IProductFormValues,
    // validators: {
    //   onSubmit: productFormSchema, // Re-enabled validation
    // },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        const formattedData = cleanObject(value);
        // delete formattedData["image"];
        delete formattedData['existingImage'];
        formData.append('name', value.name);
        formData.append('description', value.description);
        formData.append('category', value.category);

        if (value.subCategory && value.subCategory.trim() !== '') {
          formData.append('subCategory', value.subCategory);
        }

        value.variant.forEach((v, index: number) => {
          formData.append(`variant[${index}][price]`, String(v.price));
          formData.append(`variant[${index}][wt]`, v.wt.toString());
          formData.append(`variant[${index}][unit]`, v.unit ?? 'gm');
        });

        formData.append('length', String(value.length));
        if (value.claspType) formData.append('claspType', value.claspType);
        formData.append('rhodoumFinishes', String(value.rhodoumFinishes));
        formData.append('shape', value.shape);
        formData.append('clarity', value.clarity);
        formData.append('dimension', String(value.dimension));
        // formData.append("visibleAs", value.visibleAs);

        value.tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });

        // Handle image upload - Fix the field name mismatch
        if (value.images) {
          // New image selected - this replaces any existing image
          formData.append('images', value.images);
        } else if (formstate !== 'add' && value.existingImage) {
          // For updates without new image, keep existing image
          formData.append('existingImage', value.existingImage);
        }

        if (formstate !== 'add') {
          updateProduct({ id: productData._id, body: formData });
        } else {
          createProduct(formData);
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
  });

  useEffect(() => {
    if (productCreateSuccess || productUpdateSuccess) {
      form.reset();
      navigate('/product/product-list');
    }
  }, [productCreateSuccess, productUpdateSuccess]);

  // Helper function to get field errors
  const getFieldError = (_fieldPath: string) => {
    return [];
  };

  // Debug: Log form state

  return (
    <div className="p-2">
      <Header text={id === 'add' ? 'Add Product' : 'Edit Product'} />

      {/* Debug Panel - Remove in production */}
      {/* <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Form Submitting: {form.state.isSubmitting ? "Yes" : "No"}</p>
        <p>Form Mode: {formstate}</p>
        <p>Product Data Images: {JSON.stringify(productData?.images)}</p>
        <p>Existing Image: {form.getFieldValue("existingImage")}</p>
        <p>
          Current Image Value:{" "}
          {form.state.values.images ? "File selected" : "No file"}
        </p>
        <p>Form Errors: {JSON.stringify(formErrors, null, 2)}</p>
      </div> */}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Left Column */}
        <div className="col-span-2 bg-white border rounded-md">
          <div className="col-span-2">
            {/* General Information Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                General Information
              </h2>
              <div className="space-y-4">
                <form.Field name="name">
                  {(field) => (
                    <div>
                      <InputField
                        label="Product Name"
                        required
                        placeholder="Enter product name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError('name').length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError('name').join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">
                          Description <span className="text-red">*</span>
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
                      {getFieldError('description').length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError('description').join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name="category">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Category"
                          required
                          firstInput="Select Category"
                          options={categoriesList}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            // Reset subcategory when category changes
                            form.setFieldValue('subCategory', '');
                          }}
                        />
                        <FieldError field={field} />
                        {getFieldError('category').length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError('category').join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="subCategory">
                    {(field) => (
                      <div>
                        <DropdownField
                          label="Product Sub-Category"
                          firstInput="Select Sub Category"
                          options={subCategoriesList}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={!currentCategory}
                        />
                        <FieldError field={field} />
                        {getFieldError('subCategory').length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError('subCategory').join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-lg">
              <form.Field name="variant" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between w-full py-2 mb-2 text-sm border-b">
                      <h2 className="text-base font-semibold text-gray-700">
                        Pricing
                      </h2>
                      <button
                        onClick={() =>
                          field.pushValue({
                            price: 0,
                            wt: 0,
                            unit: 'grams',
                          })
                        }
                        type="button"
                        className="flex bg-[#DF8D28] rounded-md text-white items-center gap-2 px-3 py-2"
                      >
                        <Icon icon="ep:plus" width="18" height="18" />
                        Add Variant
                      </button>
                    </div>
                    {getFieldError('variant').length > 0 && (
                      <div className="text-red-500 text-sm mb-2">
                        {getFieldError('variant').join(', ')}
                      </div>
                    )}
                    {(field.state.value as any[]).map((_, i: number) => (
                      <div
                        key={i.toString()}
                        className="border rounded-md p-3 mb-2"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`variant[${i}].price`}>
                            {(subField) => {
                              const priceInput = useClearableNumberInput(
                                subField.state.value,
                                subField.handleChange
                              );
                              return (
                                <div>
                                  <PriceInputField
                                    label="Base Price"
                                    placeholder="Enter base price"
                                    type="number"
                                    required
                                    min="0"
                                    {...priceInput}
                                  />
                                  {getFieldError(`variant.${i}.price`).length >
                                    0 && (
                                    <div className="text-red-500 text-sm mt-1">
                                      {getFieldError(`variant.${i}.price`).join(
                                        ', '
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }}
                          </form.Field>

                          <form.Field name={`variant[${i}].wt`}>
                            {(subField) => {
                              const weightInput = useClearableNumberInput(
                                subField.state.value,
                                subField.handleChange
                              );
                              return (
                                <div>
                                  <InputField
                                    label="Size"
                                    type="number"
                                    required
                                    step="any"
                                    min="0"
                                    placeholder="Enter in gram"
                                    {...weightInput}
                                  />
                                  <FieldError field={subField} />
                                  {getFieldError(`variant.${i}.wt`).length >
                                    0 && (
                                    <div className="text-red-500 text-sm mt-1">
                                      {getFieldError(`variant.${i}.wt`).join(
                                        ', '
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }}
                          </form.Field>
                        </div>
                        {i > 0 && (
                          <div className="flex justify-end mt-2">
                            <button
                              type="button"
                              onClick={() => field.removeValue(i)}
                              className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md"
                            >
                              <Icon
                                icon="mdi:delete"
                                className="text-red"
                                width="18"
                                height="18"
                              />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Product Specification */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Product Specification
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <form.Field name="length">
                  {(field) => {
                    const lengthInput = useClearableNumberInput(
                      field.state.value,
                      field.handleChange
                    );
                    return (
                      <div>
                        <InputField
                          label="Length"
                          required
                          type="number"
                          placeholder="Enter length"
                          min="0"
                          {...lengthInput}
                        />
                        <FieldError field={field} />
                        {getFieldError('length').length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError('length').join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  }}
                </form.Field>

                <form.Field name="claspType">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Clasp Type"
                        firstInput="Select clasp type"
                        options={claspsList}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError('claspType').length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError('claspType').join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="rhodoumFinishes">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Rhodoum Finishes"
                        required
                        firstInput="Select finish"
                        options={[
                          { value: 'true', label: 'Yes' },
                          { value: 'false', label: 'No' },
                        ]}
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(e.target.value === 'true')
                        }
                      />
                      <FieldError field={field} />
                      {getFieldError('rhodoumFinishes').length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError('rhodoumFinishes').join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Material Information */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Material Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <form.Field name="shape">
                  {(field) => (
                    <div>
                      <InputField
                        label="Shape"
                        required
                        placeholder="Enter shape"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError('shape').length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError('shape').join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="clarity">
                  {(field) => (
                    <div>
                      <InputField
                        label="Clarity"
                        required
                        placeholder="Enter clarity"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                      {getFieldError('clarity').length > 0 && (
                        <div className="text-red-500 text-sm mt-1">
                          {getFieldError('clarity').join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="dimension">
                  {(field) => {
                    const dimensionInput = useClearableNumberInput(
                      field.state.value,
                      field.handleChange
                    );
                    return (
                      <div>
                        <InputField
                          label="Dimension"
                          required
                          type="number"
                          placeholder="Enter dimension"
                          min="0"
                          {...dimensionInput}
                        />
                        <FieldError field={field} />
                        {getFieldError('dimension').length > 0 && (
                          <div className="text-red-500 text-sm mt-1">
                            {getFieldError('dimension').join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              </div>
            </div>

            {/* Occasions Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Occasions (Optional)
              </h2>

              <form.Field name="occasions" mode="array">
                {(field) => (
                  <div>
                    <DropdownField
                      label="Select Occasions"
                      firstInput="Select occasions for this product"
                      options={(occasions || []).map((occasion) => ({
                        value: occasion._id,
                        label: occasion.name,
                      }))}
                      value={field.state.value?.[0] || ''}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (
                          selectedValue &&
                          !field.state.value?.includes(selectedValue)
                        ) {
                          field.pushValue(selectedValue);
                        }
                      }}
                    />

                    {/* Display selected occasions */}
                    {field.state.value && field.state.value.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">
                          Selected occasions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.state.value.map(
                            (occasionId: string, index: number) => {
                              const occasion = occasions?.find(
                                (o) => o._id === occasionId
                              );
                              return (
                                <span
                                  key={occasionId}
                                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {occasion?.name || occasionId}
                                  <button
                                    type="button"
                                    onClick={() => field.removeValue(index)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                  >
                                    <Icon
                                      icon="mdi:close"
                                      className="w-3 h-3"
                                    />
                                  </button>
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Stones Section */}
            <div className="p-4 rounded-lg">
              <h2 className="py-2 mb-2 font-semibold text-gray-700 border-b">
                Stones (Optional)
                {stonesLoading && (
                  <span className="text-sm text-blue-500 ml-2">
                    Loading stones...
                  </span>
                )}
                {stonesError && (
                  <span className="text-sm text-red-500 ml-2">
                    Error loading stones
                  </span>
                )}
              </h2>

              <form.Field name="stones" mode="array">
                {(field) => (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">
                        Add stones to this product
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          field.pushValue({
                            stone: '',
                            quantity: 1,
                            totalPrice: 0,
                            isOptional: true,
                            isDefault: false,
                          })
                        }
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Icon icon="mdi:plus" className="inline mr-1" />
                        Add Stone
                      </button>
                    </div>

                    {field.state.value &&
                      field.state.value.map((stone: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded p-3 mb-3 bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-700">
                              Stone {index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => field.removeValue(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Icon icon="mdi:delete" className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <form.Field name={`stones[${index}].stone`}>
                              {(subField) => (
                                <div>
                                  <DropdownField
                                    label="Stone"
                                    required
                                    firstInput={
                                      (stones || []).length > 0
                                        ? 'Select stone'
                                        : 'No stones available'
                                    }
                                    options={(stones || []).map((stone) => ({
                                      value: stone._id,
                                      label: stone.name,
                                    }))}
                                    value={String(subField.state.value || '')}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                  <FieldError field={subField} />
                                  {(stones || []).length === 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      No stones available. Please add stones
                                      first.
                                    </p>
                                  )}
                                </div>
                              )}
                            </form.Field>

                            <form.Field name={`stones[${index}].quantity`}>
                              {(subField) => (
                                <div>
                                  <InputField
                                    label="Quantity"
                                    required
                                    type="number"
                                    placeholder="1"
                                    numberValue={
                                      Number(subField.state.value) || 0
                                    }
                                    onNumberChange={subField.handleChange}
                                    allowNegative={false}
                                    clearZeroOnFocus={true}
                                  />
                                  <FieldError field={subField} />
                                </div>
                              )}
                            </form.Field>

                            <form.Field name={`stones[${index}].totalPrice`}>
                              {(subField) => (
                                <div>
                                  <InputField
                                    label="Total Price (Rs.)"
                                    required
                                    type="number"
                                    placeholder="0"
                                    step="0.01"
                                    numberValue={
                                      Number(subField.state.value) || 0
                                    }
                                    onNumberChange={subField.handleChange}
                                    allowNegative={false}
                                    clearZeroOnFocus={true}
                                  />
                                  <FieldError field={subField} />
                                </div>
                              )}
                            </form.Field>

                            <div className="flex gap-4">
                              <form.Field name={`stones[${index}].isOptional`}>
                                {(subField) => (
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(subField.state.value)}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.checked)
                                      }
                                      className="mr-2"
                                    />
                                    <span className="text-sm">Optional</span>
                                  </label>
                                )}
                              </form.Field>

                              <form.Field name={`stones[${index}].isDefault`}>
                                {(subField) => (
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(subField.state.value)}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.checked)
                                      }
                                      className="mr-2"
                                    />
                                    <span className="text-sm">Default</span>
                                  </label>
                                )}
                              </form.Field>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Visibility Options - Radio Buttons */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Visible as</h2>
            {/* <form.Field name="visibleAs">
              {(field) => (
                <div className="space-y-2">
                  {visibilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`visibility-${option.value}`}
                        value={option.value}
                        checked={field.state.value === option.value}
                        onChange={() =>
                          field.handleChange(option.value as VisibilityType)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={`visibility-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                  {getFieldError("visibleAs").length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {getFieldError("visibleAs").join(", ")}
                    </div>
                  )}
                </div>
              )}
            </form.Field> */}
          </div>

          {/* Product Tags */}
          <div className="p-4 bg-white border rounded-lg">
            <h2 className="mb-4 font-medium text-gray-700">Product Tags</h2>
            <form.Field name="tags">
              {(field) => (
                <div>
                  <ChipInputInside field={field} />
                  {getFieldError('tags').length > 0 && (
                    <div className="text-red-500 text-sm mt-1">
                      {getFieldError('tags').join(', ')}
                    </div>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Image Upload Section - Fixed to match banner form exactly */}
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
            <div className="mx-6 my-4">
              <div>
                <h1 className="text-xl font-semibold">Upload Product Image</h1>
                <div className="border-b border-[#dedde2] w-full my-2"></div>
              </div>
              <form.Field name="images">
                {(field) => (
                  <MultiImageUploader
                    multiple={false}
                    form={form}
                    label=""
                    value={field.state.value}
                    existingFileField="existingImage"
                    accept={{
                      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
                    }}
                    existingFile={form.getFieldValue('existingImage')}
                    onChange={(file) => {
                      field.handleChange(file);
                      // When a new image is selected, clear the existing image
                      if (file) {
                        form.setFieldValue('existingImage', undefined);
                      }
                    }}
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={pendingAddition || pendingUpdate}
              className="px-6 py-2 text-white rounded-md min-w-32 bg-orange hover:bg-orange-600 disabled:opacity-50"
            >
              {pendingAddition || pendingUpdate ? (
                <Icon icon="nrk:spinner" width={18} height={18} />
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
