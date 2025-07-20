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
      // Transform form data to API format
      const apiData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        shortDescription: formData.shortDescription,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        materialType: formData.materialType,
        gemstoneType: formData.gemstoneType,
        styleCategory: formData.styleCategory,
        collectionMode: formData.collectionMode,
        conditions: formData.conditions,
        images: formData.images,
        bannerImage: formData.bannerImage,
        video: formData.video,
        metadata: formData.metadata,
        isLimitedEdition: formData.isLimitedEdition,
        availableFrom: formData.availableFrom
          ? new Date(formData.availableFrom)
          : undefined,
        availableUntil: formData.availableUntil
          ? new Date(formData.availableUntil)
          : undefined,
        sortOrder: formData.sortOrder,
      };

      if (isEdit && id) {
        await updateCollectionMutation.mutateAsync({ id, body: apiData });
        console.log("Collection updated successfully");
      } else {
        await createCollectionMutation.mutateAsync(apiData);
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
