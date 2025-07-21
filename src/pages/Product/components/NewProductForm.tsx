import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MultiPageProductForm } from "../../../components/shared/form_components/MultiPageProductForm";
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
  const createProductMutation = useCreateProductsMutation();
  const updateProductMutation = useUpdateProductsMutation();
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
      name: product.name || "",
      slug: "",
      description: product.description || "",
      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category || "",
      subCategory:
        typeof product.subCategory === "object"
          ? product.subCategory._id
          : product.subCategory || "",

      // Specifications
      length: product.length || 0,
      claspType:
        typeof product.claspType === "object"
          ? product.claspType._id
          : product.claspType || "",
      rhodoumFinishes: product.rhodoumFinishes || false,
      shape: product.shape || "",
      quantity: product.quantity || 0,
      totalCarat: product.totalCarat || 0,
      color: product.color || "",
      clarity: product.clarity || "",
      dimension: product.dimension || 0,
      makingCharges: product.makingCharges || 0,

      // Variants
      variants: [
        {
          sku: "",
          price: 0,
          wt: 0,
          unit: "grams" as "grams" | "kg" | "pieces" | "carats",
          totalStock: 0,
          usedStock: 0,
          remainingStock: 0,
          reorderPoint: 10,
          isActive: true,
        },
      ],

      // Stones and Occasions
      stones: [],
      occasions: [],

      // Media
      images: product.images || [],

      // SEO & Marketing
      tags: product.tags || [],
      visibleAs:
        (product.visibleAs as
          | "featured"
          | "bestSellers"
          | "newArrivals"
          | "normal") || "normal",
      // metadata: {
      //   seoTitle: "",
      //   seoDescription: "",
      //   keywords: [],
      //   vendor: "",
      //   barcode: "",
      //   compareAtPrice: 0,
      // },

      // Status
      isActive: true,
      isFeatured: false,
    };
  };

  // Handle form submission
  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);

      if (isEdit && id) {
        await updateProductMutation.mutateAsync({
          id,
          body: apiData,
        });
      } else {
        await createProductMutation.mutateAsync(apiData);
      }

      // Navigate back to products list on success
      navigate("/product/product-list");
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error (show toast, etc.)
    }
  };

  // Transform form data to API format
  const transformFormDataToAPI = (formData: ProductFormData) => {
    const formDataObj = new FormData();

    // Basic Information
    formDataObj.append("name", formData.name);
    if (formData.slug) formDataObj.append("slug", formData.slug);
    formDataObj.append("description", formData.description);
    formDataObj.append("category", formData.category);
    formDataObj.append("subCategory", formData.subCategory);

    // Specifications
    formDataObj.append("length", formData.length.toString());
    if (formData.claspType) formDataObj.append("claspType", formData.claspType);
    formDataObj.append("rhodoumFinishes", formData.rhodoumFinishes.toString());
    formDataObj.append("shape", formData.shape);
    formDataObj.append("quantity", formData.quantity.toString());
    if (formData.totalCarat)
      formDataObj.append("totalCarat", formData.totalCarat.toString());
    if (formData.color) formDataObj.append("color", formData.color);
    formDataObj.append("clarity", formData.clarity);
    formDataObj.append("dimension", formData.dimension.toString());
    formDataObj.append("makingCharges", formData.makingCharges.toString());

    // Variants
    formData.variants.forEach((variant, index) => {
      if (variant.sku)
        formDataObj.append(`variants[${index}][sku]`, variant.sku);
      formDataObj.append(`variants[${index}][price]`, variant.price.toString());
      formDataObj.append(`variants[${index}][wt]`, variant.wt.toString());
      formDataObj.append(`variants[${index}][unit]`, variant.unit);
      formDataObj.append(
        `variants[${index}][totalStock]`,
        variant.totalStock.toString()
      );
      formDataObj.append(
        `variants[${index}][usedStock]`,
        variant.usedStock.toString()
      );
      formDataObj.append(
        `variants[${index}][remainingStock]`,
        variant.remainingStock.toString()
      );
      formDataObj.append(
        `variants[${index}][reorderPoint]`,
        variant.reorderPoint.toString()
      );
      if (variant.costPrice)
        formDataObj.append(
          `variants[${index}][costPrice]`,
          variant.costPrice.toString()
        );
      formDataObj.append(
        `variants[${index}][isActive]`,
        variant.isActive.toString()
      );
    });

    // Stones
    if (formData.stones) {
      formData.stones.forEach((stone, index) => {
        formDataObj.append(`stones[${index}][stone]`, stone.stone);
        formDataObj.append(
          `stones[${index}][quantity]`,
          stone.quantity.toString()
        );
        formDataObj.append(
          `stones[${index}][totalPrice]`,
          stone.totalPrice.toString()
        );
        formDataObj.append(
          `stones[${index}][isOptional]`,
          stone.isOptional.toString()
        );
        formDataObj.append(
          `stones[${index}][isDefault]`,
          stone.isDefault.toString()
        );
      });
    }

    // Occasions
    if (formData.occasions) {
      formData.occasions.forEach((occasion, index) => {
        formDataObj.append(`occasions[${index}]`, occasion);
      });
    }

    // Tags
    formData.tags.forEach((tag, index) => {
      formDataObj.append(`tags[${index}]`, tag);
    });

    // Visibility
    formDataObj.append("visibleAs", formData.visibleAs);

    // Status
    formDataObj.append("isActive", formData.isActive.toString());
    formDataObj.append("isFeatured", formData.isFeatured.toString());

    // Metadata
    // if (formData.metadata) {
    //   if (formData.metadata.seoTitle) {
    //     formDataObj.append("metadata[seoTitle]", formData.metadata.seoTitle);
    //   }
    //   if (formData.metadata.seoDescription) {
    //     formDataObj.append(
    //       "metadata[seoDescription]",
    //       formData.metadata.seoDescription
    //     );
    //   }
    //   if (formData.metadata.keywords) {
    //     formData.metadata.keywords.forEach((keyword, index) => {
    //       formDataObj.append(`metadata[keywords][${index}]`, keyword);
    //     });
    //   }
    //   if (formData.metadata.vendor) {
    //     formDataObj.append("metadata[vendor]", formData.metadata.vendor);
    //   }
    //   if (formData.metadata.barcode) {
    //     formDataObj.append("metadata[barcode]", formData.metadata.barcode);
    //   }
    //   if (formData.metadata.compareAtPrice) {
    //     formDataObj.append(
    //       "metadata[compareAtPrice]",
    //       formData.metadata.compareAtPrice.toString()
    //     );
    //   }
    // }

    // Note: Images would need to be handled separately if they are File objects
    // For now, assuming images are URLs from the existing product

    return formDataObj;
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

  return (
    <MultiPageProductForm
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      initialData={getInitialData()}
      isEdit={isEdit}
    />
  );
};

export default NewProductForm;
