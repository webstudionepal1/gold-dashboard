import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MultiPageCollectionForm } from "../../../components/shared/form_components/MultiPageCollectionForm";
import {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useGetCollectionByIdQuery,
} from "../../../server/api/collectionHooks";

const NewCollectionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // API hooks
  const createCollectionMutation = useCreateCollectionMutation();
  const updateCollectionMutation = useUpdateCollectionMutation();
  const { data: existingCollection, isLoading: isLoadingCollection } =
    useGetCollectionByIdQuery(id || "");

  // Transform existing collection data for the form
  const getInitialData = () => {
    if (!isEdit || !existingCollection) return undefined;

    return {
      name: existingCollection.name || "",
      slug: existingCollection.slug || "",
      description: existingCollection.description || "",
      shortDescription: existingCollection.shortDescription || "",
      isActive: existingCollection.isActive ?? true,
      isFeatured: existingCollection.isFeatured ?? false,
      materialType: existingCollection.materialType || "",
      gemstoneType: existingCollection.gemstoneType || "",
      styleCategory: existingCollection.styleCategory || "",
      collectionMode: existingCollection.collectionMode || "manual",
      conditions: existingCollection.conditions || {
        groups: [],
        operator: "AND",
        isAutomatic: false,
        manualProductIds: [],
        excludedProductIds: [],
      },
      images: existingCollection.images || [],
      bannerImage: existingCollection.bannerImage || "",
      video: existingCollection.video || "",
      metadata: {
        seoTitle: existingCollection.metadata?.seoTitle || "",
        seoDescription: existingCollection.metadata?.seoDescription || "",
        keywords: existingCollection.metadata?.keywords || [],
        tags: existingCollection.metadata?.tags || [],
        targetAudience: existingCollection.metadata?.targetAudience || "",
        seasonality: existingCollection.metadata?.seasonality || "year-round",
        popularity: existingCollection.metadata?.popularity || 0,
        trendingScore: existingCollection.metadata?.trendingScore || 0,
      },
      isLimitedEdition: existingCollection.isLimitedEdition ?? false,
      availableFrom: existingCollection.availableFrom
        ? new Date(existingCollection.availableFrom).toISOString().split("T")[0]
        : "",
      availableUntil: existingCollection.availableUntil
        ? new Date(existingCollection.availableUntil)
            .toISOString()
            .split("T")[0]
        : "",
      sortOrder: existingCollection.sortOrder || 0,
    };
  };

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    try {
      // Create FormData object for multipart/form-data submission
      const formDataObj = new FormData();

      // Append basic fields
      formDataObj.append("name", formData.name);
      if (formData.slug) formDataObj.append("slug", formData.slug);
      formDataObj.append("description", formData.description);
      if (formData.shortDescription)
        formDataObj.append("shortDescription", formData.shortDescription);
      formDataObj.append("isActive", String(formData.isActive));
      formDataObj.append("isFeatured", String(formData.isFeatured));

      if (formData.materialType)
        formDataObj.append("materialType", formData.materialType);
      if (formData.gemstoneType)
        formDataObj.append("gemstoneType", formData.gemstoneType);
      if (formData.styleCategory)
        formDataObj.append("styleCategory", formData.styleCategory);
      if (formData.collectionMode)
        formDataObj.append("collectionMode", formData.collectionMode);

      // Handle conditions array
      if (formData.conditions && Array.isArray(formData.conditions)) {
        formData.conditions.forEach((condition: string, index: number) => {
          formDataObj.append(`conditions[${index}]`, condition);
        });
      }

      // Handle metadata object
      if (formData.metadata) {
        formDataObj.append("metadata", JSON.stringify(formData.metadata));
      }

      formDataObj.append("isLimitedEdition", String(formData.isLimitedEdition));

      if (formData.availableFrom) {
        formDataObj.append(
          "availableFrom",
          new Date(formData.availableFrom).toISOString()
        );
      }
      if (formData.availableUntil) {
        formDataObj.append(
          "availableUntil",
          new Date(formData.availableUntil).toISOString()
        );
      }

      formDataObj.append("sortOrder", String(formData.sortOrder));

      // Handle media files - append actual File objects instead of URLs
      if (formData.images && Array.isArray(formData.images)) {
        formData.images.forEach((image: File | string, index: number) => {
          if (image instanceof File) {
            formDataObj.append(`images`, image);
          } else if (typeof image === "string" && image.trim() !== "") {
            // For existing images (URLs), append as string
            formDataObj.append(`existingImages[${index}]`, image);
          }
        });
      }

      if (formData.bannerImage) {
        if (formData.bannerImage instanceof File) {
          formDataObj.append("bannerImage", formData.bannerImage);
        } else if (
          typeof formData.bannerImage === "string" &&
          formData.bannerImage.trim() !== ""
        ) {
          formDataObj.append("existingBannerImage", formData.bannerImage);
        }
      }

      if (formData.video) {
        if (formData.video instanceof File) {
          formDataObj.append("video", formData.video);
        } else if (
          typeof formData.video === "string" &&
          formData.video.trim() !== ""
        ) {
          formDataObj.append("existingVideo", formData.video);
        }
      }

      if (isEdit && id) {
        await updateCollectionMutation.mutateAsync({ id, body: formDataObj });
        console.log("Collection updated successfully");
      } else {
        await createCollectionMutation.mutateAsync(formDataObj);
        console.log("Collection created successfully");
      }

      // Navigate back to collections list
      navigate("/collection");
    } catch (error) {
      console.error("Error saving collection:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    navigate("/collection");
  };

  // Show loading state while fetching existing collection data
  if (isEdit && isLoadingCollection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DF8D28] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collection data...</p>
        </div>
      </div>
    );
  }

  return (
    <MultiPageCollectionForm
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
      initialData={getInitialData()}
      isEdit={isEdit}
    />
  );
};

export default NewCollectionForm;
