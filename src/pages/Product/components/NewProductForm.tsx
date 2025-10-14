import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompactProductForm } from './CompactProductForm';
import get from 'lodash/get';
import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useGetProductByIdQuery,
} from '../../../server/api/productHooks';
import {
  ProductFormData,
  ProductStone,
} from '../../../components/shared/form_components/ProductFormContext';
import { FormLoader } from '@/components/shared/FormLoader.component';

const NewProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // API hooks
  const { mutateAsync: createProductMutation, isPending: createPending } =
    useCreateProductsMutation();
  const { mutateAsync: updateProductMutation, isPending } =
    useUpdateProductsMutation();
  const { data: existingProduct, isLoading: isLoadingProduct } =
    useGetProductByIdQuery(id || '', { enabled: isEdit });

  // Transform API data to form data format
  const getInitialData = (): Partial<ProductFormData> => {
    if (!isEdit || !existingProduct?.data) {
      return {};
    }

    const product = existingProduct.data;

    return {
      // Basic Information
      name: get(product, 'name', ''),
      slug: '',
      description: get(product, 'description', ''),
      productType: get(product, 'productType', 'gold'),
      dimension: get(product, 'dimension', 0),
      category: get(product, 'category._id', ''),
      tags: get(product, 'tags', []),

      // Specifications
      length: get(product, 'length', 0),
      rhodoumFinishes: get(product, 'rhodoumFinishes', false),
      totalCarat: get(product, 'totalCarat', 0),
      color: get(product, 'color', ''),
      clarity: get(product, 'clarity', ''),
      gender: get(product, 'gender', 'male') as
        | 'male'
        | 'female'
        | 'unisex'
        | undefined,
      // makingCharges: Number(get(product, 'makingCharges', 0)),
      makingChargesPercentage: Number(get(product, 'makingChargesPercentage', 0)),

      wastage: get(product, 'wastage'), // Will be set by user

      variants: get(product, 'variant', [
        {
          price: 0,
          wt: 0,
          unit: 'grams' as 'grams' | 'kg' | 'pieces' | 'carats',
          isActive: true,
        },
      ]),

      // Stones and Occasions
      stones: get(product, 'stones', []).map(
        (
          stone: ProductStone
        ): {
          name: string;
          weight: number;
          price: number;
          color: string;
        } => ({
          name: stone.name,
          weight: Number(stone.weight),
          price: Number(stone.price),
          color: stone.color,
        })
      ),
      otherCharges: get(product, 'others', []).map(
        (item: { name: string; value: number }) => ({
          name: item.name,
          price: item.value,
        })
      ),
      existingImages: get(product, 'images', []),
      // Media
      images: [],

      // SEO & Marketing
      visibleAs: Array.isArray(product.visibleAs)
        ? product.visibleAs
        : product.visibleAs
        ? [product.visibleAs]
        : [],
      // Status
      isActive: get(product, 'isActive', true),
      isFeatured: get(product, 'isFeatured', false),
    };
  };

  // Handle form submission
  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);

      if (isEdit && id) {
        await updateProductMutation({
          id,
          body: apiData,
        });
      } else {
        await createProductMutation(apiData);
      }

      // Navigate back to products list on success
      navigate('/product/product-list');
    } catch (error) {
      console.error('Error saving product:', error);
      // Handle error (show toast, etc.)
    }
  };

  // Transform form data to API format
  const transformFormDataToAPI = (formData: ProductFormData) => {
    const formDataObj = new FormData();

    // Basic Information - Always present
    formDataObj.append('name', formData.name);
    formDataObj.append('description', formData.description);
    if (formData.productType)
      formDataObj.append('productType', formData.productType);

    // Only add these fields if product type is not 'normal'
    if (formData.productType !== 'normal') {
      if (formData.category) formDataObj.append('category', formData.category);
      if (formData.gender) formDataObj.append('gender', formData.gender);

      // Specifications - only for non-normal products
      if (formData.length)
        formDataObj.append('length', formData.length.toString());
      if (formData.dimension)
        formDataObj.append('dimension', formData.dimension.toString());
      // if (formData.makingCharges)
      //   formDataObj.append('makingCharges', formData.makingCharges.toString());
      if (formData.makingChargesPercentage)
        formDataObj.append('makingChargesPercentage', formData.makingChargesPercentage.toString());
      if (formData.color) formDataObj.append('color', formData.color);
      if (formData.clarity) formDataObj.append('clarity', formData.clarity);
      if (formData.totalCarat)
        formDataObj.append('totalCarat', formData.totalCarat.toString());
      if (formData.rhodoumFinishes)
        formDataObj.append(
          'rhodoumFinishes',
          formData.rhodoumFinishes.toString()
        );

      // Wastage - only for non-normal products (commented out)
      // if (formData.wastage) {
      //   formDataObj.append('wastage[type]', formData.wastage.type);
      //   formDataObj.append('wastage[value]', formData.wastage.value.toString());
      // }
    }

    // Variants - Only send fields that are actually used in the form
    formData.variants.forEach((variant, index) => {
      formDataObj.append(`variant[${index}][price]`, variant.price.toString());

      // Only add weight and unit for non-normal products
      if (formData.productType !== 'normal') {
        formDataObj.append(`variant[${index}][wt]`, variant.wt.toString());
        formDataObj.append(`variant[${index}][unit]`, variant.unit);
        formDataObj.append(
          `variant[${index}][isActive]`,
          variant.isActive.toString()
        );
      }
    });

    formData.tags.forEach((tag, index) => {
      formDataObj.append(`tags[${index}]`, tag);
    });

    // Stones - Only for non-normal products
    if (formData.productType !== 'normal' && formData.stones) {
      formData.stones.forEach((stone, index) => {
        formDataObj.append(`stones[${index}][name]`, stone.name);
        formDataObj.append(`stones[${index}][weight]`, stone.weight.toString());
        formDataObj.append(`stones[${index}][price]`, stone.price.toString());
        formDataObj.append(`stones[${index}][color]`, stone.color);
      });
    }

    // Other Charges - Only for non-normal products
    if (formData.productType !== 'normal' && formData.otherCharges) {
      formData.otherCharges.forEach((charge, index) => {
        formDataObj.append(`others[${index}][name]`, charge.name);
        formDataObj.append(`others[${index}][value]`, charge.price.toString());
      });
    }

    // Status & Visibility - Only for non-normal products
    if (formData.productType !== 'normal') {
      if (formData.visibleAs)
        formData.visibleAs.forEach((element, index) => {
          formDataObj.append(`visibleAs[${index}]`, element);
        });
      if (formData.isActive !== undefined)
        formDataObj.append('isActive', formData.isActive.toString());
      if (formData.isFeatured !== undefined)
        formDataObj.append('isFeatured', formData.isFeatured.toString());
    }

    // Handle images - All product types can have images
    if (formData.images && Array.isArray(formData.images)) {
      formData.images.forEach((image: File | string, index: number) => {
        if (image instanceof File) {
          formDataObj.append(`images`, image);
        } else if (typeof image === 'string' && image.trim() !== '') {
          // For existing images (URLs), append as string
          formDataObj.append(`existingImages[${index}]`, image);
        }
      });
    }

    return formDataObj;
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    navigate('/product/product-list');
  };

  // Show loading state while fetching existing product data
  if (isEdit && isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DF8D28] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (isPending || createPending) {
    return <FormLoader variant="overlay" />;
  }

  return (
    <CompactProductForm
      isLoading={createPending || isPending}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      initialData={getInitialData()}
      isEdit={isEdit}
    />
  );
};

export default NewProductForm;
