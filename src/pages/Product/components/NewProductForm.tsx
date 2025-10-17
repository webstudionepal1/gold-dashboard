import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CompactProductForm } from "./CompactProductForm";
import get from "lodash/get";
import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useGetProductByIdQuery,
} from "../../../server/api/productHooks";
import { ProductFormData } from "../../../components/shared/form_components/ProductFormContext";

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
    useGetProductByIdQuery(id || "", { enabled: isEdit });

  // Transform API data to form data format
  const getInitialData = (): Partial<ProductFormData> => {
    if (!isEdit || !existingProduct?.data) {
      return {};
    }

    const product = existingProduct.data;

    return {
      // Basic Information
      name: get(product, "name", ""),
      slug: "",
      description: get(product, "description", ""),
      productType: get(product, "productType", "gold") as
        | "normal"
        | "diamond"
        | "gold"
        | "silver",
      karat: get(product, "karat", ""), // Add karat
      dimension: get(product, "dimension", 0),
      category: get(product, "category._id", ""),
      subCategory: get(product, "subCategory._id", ""),

      // Specifications
      length: get(product, "length", 0),
      rhodoumFinishes: get(product, "rhodoumFinishes", false),
      totalCarat: get(product, "totalCarat", 0),
      color: get(product, "color", ""),
      clarity: get(product, "clarity", ""),
      gender: get(product, "gender", "male") as
        | "male"
        | "female"
        | "unisex"
        | undefined,
      makingCharges: get(product, "makingCharges.value", 0),
      makingChargesType: get(product, "makingCharges.type", "fixed") as
        | "fixed"
        | "per",

      wastage: get(product, "wastage"), // Will be set by user

      variants: get(product, "variant", [
        {
          price: 0,
          wt: 0,
          unit: "grams" as "grams" | "kg" | "pieces" | "carats",
          isActive: true,
        },
      ]).map((item) => ({ ...item, price: item.price ?? 0 })),

      // Stones and Occasions
      stones: get(product, "stones", []).map(
        (stone: {
          name: string;
          weight: string;
          price: string;
          color: string;
        }) => ({
          name: stone.name,
          weight: parseFloat(stone.weight) || 0,
          price: parseFloat(stone.price) || 0,
          color: stone.color,
        })
      ),
      occasions: get(product, "occasions", []).map(
        (occasion: any) => occasion._id || occasion
      ),
      tags: get(product, "tags", []),
      otherCharges: get(product, "others", []).map(
        (item: { name: string; value: number }) => ({
          name: item.name,
          price: item.value,
        })
      ),
      // Media
      images: get(product, "images", []).map(
        (item) => `${import.meta.env.VITE_API_IMAGE_BASE_URL}${item}`
      ),
      video: null,
      existingVideo: get(product, "video", null),

      visibleAs: Array.isArray(product.visibleAs)
        ? product.visibleAs
        : typeof product.visibleAs === "string"
        ? [product.visibleAs]
        : [],
      isActive: get(product, "isActive", true),
      isFeatured: get(product, "isFeatured", false),
    };
  };

  // Transform form data to API format
  const transformFormDataToAPI = (formData: ProductFormData) => {
    const formDataObj = new FormData();

    // Basic Information - Always present
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    if (formData.productType)
      formDataObj.append("productType", formData.productType);

    // Only add these fields if product type is not 'normal'
    if (formData.productType !== "normal") {
      if (formData.category) formDataObj.append("category", formData.category);
      if (formData.subCategory)
        formDataObj.append("subCategory", formData.subCategory);
      if (formData.gender) formDataObj.append("gender", formData.gender);

      // Specifications - only for non-normal products
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
        // Add karat for gold products
        formDataObj.append("karat", formData.karat);

      // Wastage - only for non-normal products
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

    // Variants - Only send fields that are actually used in the form
    formData.variants.forEach((variant, index) => {
      formDataObj.append(`variant[${index}][price]`, variant.price.toString());

      // Only add weight and unit for non-normal products
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

    // Stones - Only for non-normal products
    if (formData.productType !== "normal" && formData.stones) {
      formData.stones.forEach((stone, index) => {
        formDataObj.append(`stones[${index}][name]`, stone.name);
        formDataObj.append(`stones[${index}][weight]`, stone.weight.toString());
        formDataObj.append(`stones[${index}][price]`, stone.price.toString());
        formDataObj.append(`stones[${index}][color]`, stone.color);
      });
    }

    // Other Charges - Only for non-normal products
    if (formData.productType !== "normal" && formData.otherCharges) {
      formData.otherCharges.forEach((charge, index) => {
        formDataObj.append(`others[${index}][name]`, charge.name);
        formDataObj.append(`others[${index}][value]`, charge.price.toString());
      });
    }

    // Handle occasions - All product types can have occasions
    if (formData.occasions && formData.occasions.length > 0) {
      formData.occasions.forEach((occasion, index) => {
        formDataObj.append(`occasions[${index}]`, occasion);
      });
    }

    // Handle tags - All product types can have tags
    if (formData.tags && formData.tags.length > 0) {
      formData.tags.forEach((tag, index) => {
        formDataObj.append(`tags[${index}]`, tag);
      });
    }

    // Status & Visibility - Only for non-normal products
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

    console.log("formiDAaa", formData.images);
    formData.images.forEach((img, idx) => {
      if (img instanceof File) {
        formDataObj.append("images", img); // new files
      } else {
        const baseUrl = import.meta.env.VITE_API_IMAGE_BASE_URL;
        const relativePath = img.startsWith(baseUrl)
          ? img.replace(baseUrl, "")
          : img;

        formDataObj.append(`existingImages[${idx}]`, relativePath);
      }
    });

    // Handle video - All product types can have videos
    if (formData.video) {
      // New video selected - this replaces any existing video
      formDataObj.append("video", formData.video);
    } else if (isEdit && formData.existingVideo) {
      // For updates without new video, keep existing video
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

  // Handle form submission
  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);
      console.log("Payload sent to backend:", apiData); // Debug log

      // Log FormData contents
      const formDataEntries: { [key: string]: any } = {};
      for (const [key, value] of apiData.entries()) {
        formDataEntries[key] = value;
      }
      console.log("FormData entries:", formDataEntries);

      if (isEdit && id) {
        await updateProductMutation({
          id,
          body: apiData,
        });
      } else {
        await createProductMutation(apiData);
      }

      // Navigate back to products list on success
      navigate("/product/product-list");
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error (show toast, etc.)
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    navigate("/product/product-list");
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

  console.log("getInitialData", getInitialData());
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
