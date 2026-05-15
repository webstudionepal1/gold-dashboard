import React, { useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { CompactProductForm } from "./CompactProductForm";
import get from "lodash/get";
import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useGetProductByIdQuery,
} from "../../../server/api/productHooks";
import { ProductFormData } from "../../../components/shared/form_components/ProductFormContext";
import { toStoragePath } from "../../../utils/media";
import { mapProductToFormData } from "../../../utils/productForm";

const NewProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { mutateAsync: createProductMutation, isPending: createPending } =
    useCreateProductsMutation();
  const { mutateAsync: updateProductMutation, isPending } =
    useUpdateProductsMutation();
  const {
    data: existingProduct,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useGetProductByIdQuery(id || "", { enabled: isEdit });

  const initialFormData = useMemo(() => {
    if (!isEdit || !existingProduct) return undefined;
    return mapProductToFormData(
      existingProduct as unknown as Record<string, unknown>
    );
  }, [isEdit, existingProduct]);

  const transformFormDataToAPI = (formData: ProductFormData) => {
    const formDataObj = new FormData();

    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    if (formData.productType)
      formDataObj.append("productType", formData.productType);

    if (formData.productType !== "normal") {
      if (formData.category) formDataObj.append("category", formData.category);
      if (formData.subCategory)
        formDataObj.append("subCategory", formData.subCategory);
      if (formData.gender) formDataObj.append("gender", formData.gender);

      if (formData.length)
        formDataObj.append("length", formData.length.toString());
      if (formData.dimension)
        formDataObj.append("dimension", formData.dimension.toString());
      if (formData.color) formDataObj.append("color", formData.color);
      if (formData.clarity) formDataObj.append("clarity", formData.clarity);
      if (formData.totalCarat)
        formDataObj.append("totalCarat", formData.totalCarat.toString());
      if (formData.rhodoumFinishes)
        formDataObj.append(
          "rhodoumFinishes",
          formData.rhodoumFinishes.toString()
        );
      if (formData.karat && formData.productType === "gold")
        formDataObj.append("karat", formData.karat);

      if (formData.makingCharges) {
        formDataObj.append("makingCharges[type]", formData.makingChargesType);
        formDataObj.append(
          "makingCharges[value]",
          formData.makingCharges.toString()
        );
      }
      if (formData.wastage) {
        formDataObj.append("wastage[type]", formData.wastage.type);
        formDataObj.append("wastage[value]", formData.wastage.value.toString());
      }
    }

    formData.variants.forEach((variant, index) => {
      formDataObj.append(`variant[${index}][price]`, variant.price.toString());

      if (formData.productType !== "normal") {
        formDataObj.append(`variant[${index}][name]`, get(variant, "name", ""));
        if (variant.wt !== undefined && variant.wt > 0) {
          formDataObj.append(`variant[${index}][wt]`, variant.wt.toString());
        }
        if (variant.unit) {
          formDataObj.append(`variant[${index}][unit]`, variant.unit);
        }
        formDataObj.append(
          `variant[${index}][isActive]`,
          variant.isActive.toString()
        );
      }
    });

    if (formData.productType !== "normal" && formData.stones) {
      formData.stones.forEach((stone, index) => {
        formDataObj.append(`stones[${index}][name]`, stone.name);
        formDataObj.append(`stones[${index}][weight]`, stone.weight.toString());
        formDataObj.append(`stones[${index}][price]`, stone.price.toString());
        formDataObj.append(`stones[${index}][color]`, stone.color);
      });
    }

    if (formData.productType !== "normal" && formData.otherCharges) {
      formData.otherCharges.forEach((charge, index) => {
        formDataObj.append(`others[${index}][name]`, charge.name);
        formDataObj.append(`others[${index}][value]`, charge.price.toString());
      });
    }

    if (formData.occasions && formData.occasions.length > 0) {
      formData.occasions.forEach((occasion, index) => {
        formDataObj.append(`occasions[${index}]`, occasion);
      });
    }

    if (formData.tags && formData.tags.length > 0) {
      formData.tags.forEach((tag, index) => {
        formDataObj.append(`tags[${index}]`, tag);
      });
    }

    if (formData.productType !== "normal") {
      if (formData.visibleAs)
        formData.visibleAs.forEach((element, index) => {
          formDataObj.append(`visibleAs[${index}]`, element);
        });
      if (formData.isActive !== undefined)
        formDataObj.append("isActive", formData.isActive.toString());
      if (formData.isFeatured !== undefined)
        formDataObj.append("isFeatured", formData.isFeatured.toString());
    }

    (formData.images || []).forEach((img, idx) => {
      if (img instanceof File) {
        formDataObj.append("images", img);
      } else {
        formDataObj.append(`existingImages[${idx}]`, toStoragePath(String(img)));
      }
    });

    if (formData.video) {
      formDataObj.append("video", formData.video);
    } else if (isEdit && formData.existingVideo) {
      if (Array.isArray(formData.existingVideo)) {
        formData.existingVideo.forEach((video, index) => {
          formDataObj.append(`existingVideo[${index}]`, video);
        });
      } else {
        formDataObj.append("existingVideo", formData.existingVideo as string);
      }
    }

    return formDataObj;
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      const apiData = transformFormDataToAPI(formData);

      if (isEdit && id) {
        await updateProductMutation({
          id,
          body: apiData,
        });
      } else {
        await createProductMutation(apiData);
      }

      navigate("/product/product-list");
    } catch (error) {
      console.error("Error saving product:", error);
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to save product";
      toast.error(message);
    }
  };

  const handleFormCancel = () => {
    navigate("/product/product-list");
  };

  if (isEdit && isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DF8D28] mx-auto mb-4" />
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (isEdit && (isProductError || !initialFormData)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Could not load product data.</p>
          <button
            type="button"
            onClick={handleFormCancel}
            className="px-4 py-2 bg-[#DF8D28] text-white rounded-lg"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <CompactProductForm
      key={isEdit ? `edit-${id}` : "create"}
      isLoading={createPending || isPending}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      initialData={initialFormData ?? {}}
      isEdit={isEdit}
    />
  );
};

export default NewProductForm;
