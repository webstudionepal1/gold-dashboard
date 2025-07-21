import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { TextareaField } from "../../../components/shared/form_components/TextArea";
import { ConditionBuilder } from "../../../components/shared/form_components/ConditionBuilder";
import { FieldError } from "../../auth/LoginPage";
import * as z from "zod";
import {
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useGetCollectionByIdQuery,
  useCalculateCollectionPriceRangeMutation,
  IFetchCollection,
  ISmartCollectionConditions,
} from "../../../server/api/collectionHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import VideoUploadField from "../../../components/shared/form_components/VideoUploadField";

// Validation schema
const collectionSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Name cannot exceed 100 characters"),
  slug: z.string().min(1, "Slug is required"),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters"),
  shortDescription: z
    .string()
    .max(500, "Short description cannot exceed 500 characters")
    .optional(),
  collectionMode: z.enum(["manual", "automatic", "hybrid"]),
  materialType: z
    .enum([
      "gold",
      "silver",
      "platinum",
      "rose_gold",
      "white_gold",
      "mixed",
      "other",
    ])
    .optional(),
  gemstoneType: z
    .enum([
      "diamond",
      "ruby",
      "emerald",
      "sapphire",
      "pearl",
      "mixed",
      "none",
      "other",
    ])
    .optional(),
  styleCategory: z
    .enum([
      "vintage",
      "modern",
      "classic",
      "contemporary",
      "minimalist",
      "bohemian",
      "luxury",
      "other",
    ])
    .optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isLimitedEdition: z.boolean(),
  images: z.array(z.string()).optional(),
  bannerImage: z.string().optional(),
  video: z.string().optional(),
  availableFrom: z.string().optional(),
  availableUntil: z.string().optional(),
  metadata: z
    .object({
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      targetAudience: z.enum(["men", "women", "unisex", "children"]).optional(),
      seasonality: z
        .enum(["spring", "summer", "autumn", "winter", "year-round"])
        .optional(),
      popularity: z.number().min(0).max(100).optional(),
      trendingScore: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

// Dropdown options
const collectionModeOptions = [
  { label: "Manual", value: "manual" },
  { label: "Automatic", value: "automatic" },
  { label: "Hybrid", value: "hybrid" },
];

const materialTypeOptions = [
  { label: "Gold", value: "gold" },
  { label: "Silver", value: "silver" },
  { label: "Platinum", value: "platinum" },
  { label: "Rose Gold", value: "rose_gold" },
  { label: "White Gold", value: "white_gold" },
  { label: "Mixed", value: "mixed" },
  { label: "Other", value: "other" },
];

const gemstoneTypeOptions = [
  { label: "Diamond", value: "diamond" },
  { label: "Ruby", value: "ruby" },
  { label: "Emerald", value: "emerald" },
  { label: "Sapphire", value: "sapphire" },
  { label: "Pearl", value: "pearl" },
  { label: "Mixed", value: "mixed" },
  { label: "None", value: "none" },
  { label: "Other", value: "other" },
];

const styleCategoryOptions = [
  { label: "Vintage", value: "vintage" },
  { label: "Modern", value: "modern" },
  { label: "Classic", value: "classic" },
  { label: "Contemporary", value: "contemporary" },
  { label: "Minimalist", value: "minimalist" },
  { label: "Bohemian", value: "bohemian" },
  { label: "Luxury", value: "luxury" },
  { label: "Other", value: "other" },
];

const targetAudienceOptions = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
  { label: "Children", value: "children" },
];

const seasonalityOptions = [
  { label: "Spring", value: "spring" },
  { label: "Summer", value: "summer" },
  { label: "Autumn", value: "autumn" },
  { label: "Winter", value: "winter" },
  { label: "Year Round", value: "year-round" },
];

const CollectionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedBannerImage, setUploadedBannerImage] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<string>("");

  // Fetch collection data for editing
  const { data: collectionData, isLoading: isLoadingCollection } =
    useGetCollectionByIdQuery(id || "");

  // Mutations
  const createCollectionMutation = useCreateCollectionMutation();
  const updateCollectionMutation = useUpdateCollectionMutation();
  const calculatePriceRangeMutation =
    useCalculateCollectionPriceRangeMutation();

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Form setup
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      collectionMode: "manual",
      materialType: "",
      gemstoneType: "",
      styleCategory: "",
      isActive: true,
      isFeatured: false,
      isLimitedEdition: false,
      images: [] as string[],
      bannerImage: "",
      video: "",
      availableFrom: "",
      availableUntil: "",
      conditions: {
        groups: [],
        operator: "AND" as "AND" | "OR",
        isAutomatic: false,
        manualProductIds: [] as string[],
        excludedProductIds: [] as string[],
      } as ISmartCollectionConditions,
      metadata: {
        seoTitle: "",
        seoDescription: "",
        keywords: [] as string[],
        tags: [] as string[],
        targetAudience: "",
        seasonality: "year-round",
        popularity: 0,
        trendingScore: 0,
      },
    },
    onSubmit: async ({ value }) => {
      try {
        // Prepare conditions based on collection mode
        let conditions = undefined;
        if (
          value.collectionMode === "automatic" ||
          value.collectionMode === "hybrid"
        ) {
          conditions = {
            ...value.conditions,
            isAutomatic:
              value.collectionMode === "automatic" ||
              value.collectionMode === "hybrid",
          };
        }

        // Prepare the data for submission
        const submissionData = {
          ...value,
          images: uploadedImages,
          bannerImage: uploadedBannerImage,
          video: uploadedVideo,
          conditions,
          // Convert date strings to Date objects if they exist
          availableFrom: value.availableFrom
            ? new Date(value.availableFrom)
            : undefined,
          availableUntil: value.availableUntil
            ? new Date(value.availableUntil)
            : undefined,
        } as Partial<IFetchCollection>;

        if (isEdit && id) {
          await updateCollectionMutation.mutateAsync({
            id,
            body: submissionData,
          });
        } else {
          await createCollectionMutation.mutateAsync(submissionData);
        }

        navigate("/collection");
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  // Load collection data for editing
  useEffect(() => {
    if (isEdit && collectionData) {
      form.setFieldValue("name", collectionData.name);
      form.setFieldValue("slug", collectionData.slug);
      form.setFieldValue("description", collectionData.description);
      form.setFieldValue(
        "shortDescription",
        collectionData.shortDescription || ""
      );
      form.setFieldValue("collectionMode", collectionData.collectionMode);
      form.setFieldValue("materialType", collectionData.materialType || "");
      form.setFieldValue("gemstoneType", collectionData.gemstoneType || "");
      form.setFieldValue("styleCategory", collectionData.styleCategory || "");
      form.setFieldValue("isActive", collectionData.isActive);
      form.setFieldValue("isFeatured", collectionData.isFeatured);
      form.setFieldValue("isLimitedEdition", collectionData.isLimitedEdition);

      if (collectionData.availableFrom) {
        form.setFieldValue(
          "availableFrom",
          new Date(collectionData.availableFrom).toISOString().split("T")[0]
        );
      }

      if (collectionData.availableUntil) {
        form.setFieldValue(
          "availableUntil",
          new Date(collectionData.availableUntil).toISOString().split("T")[0]
        );
      }

      if (collectionData.metadata) {
        form.setFieldValue(
          "metadata.seoTitle",
          collectionData.metadata.seoTitle || ""
        );
        form.setFieldValue(
          "metadata.seoDescription",
          collectionData.metadata.seoDescription || ""
        );
        form.setFieldValue(
          "metadata.keywords",
          collectionData.metadata.keywords || []
        );
        form.setFieldValue("metadata.tags", collectionData.metadata.tags || []);
        form.setFieldValue(
          "metadata.targetAudience",
          collectionData.metadata.targetAudience || ""
        );
        form.setFieldValue(
          "metadata.seasonality",
          collectionData.metadata.seasonality || "year-round"
        );
        form.setFieldValue(
          "metadata.popularity",
          collectionData.metadata.popularity || 0
        );
        form.setFieldValue(
          "metadata.trendingScore",
          collectionData.metadata.trendingScore || 0
        );
      }

      // Load conditions if they exist
      if (collectionData.conditions) {
        form.setFieldValue("conditions", {
          groups: collectionData.conditions.groups || [],
          operator: collectionData.conditions.operator || "AND",
          isAutomatic: collectionData.conditions.isAutomatic || false,
          manualProductIds: collectionData.conditions.manualProductIds || [],
          excludedProductIds:
            collectionData.conditions.excludedProductIds || [],
        });
      }

      setUploadedImages(collectionData.images || []);
      setUploadedBannerImage(collectionData.bannerImage || "");
      setUploadedVideo(collectionData.video || "");
    }
  }, [collectionData, isEdit, form]);

  if (isEdit && isLoadingCollection) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon icon="eos-icons:loading" className="w-8 h-8 text-[#DF8D28]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-h-screen overflow-y-auto h-full p-6">
      <Breadcrumbs />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon
            icon="material-symbols:collections"
            className="w-6 h-6 text-[#DF8D28]"
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Edit Collection" : "Add New Collection"}
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="name"
              validators={{
                onChange: collectionSchema.shape.name,
              }}
            >
              {(field) => (
                <div>
                  <InputField
                    label="Collection Name"
                    placeholder="Enter collection name"
                    required
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      // Auto-generate slug
                      if (!isEdit) {
                        form.setFieldValue(
                          "slug",
                          generateSlug(e.target.value)
                        );
                      }
                    }}
                    onBlur={field.handleBlur}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field
              name="slug"
              validators={{
                onChange: collectionSchema.shape.slug,
              }}
            >
              {(field) => (
                <div>
                  <InputField
                    label="Slug"
                    placeholder="collection-slug"
                    required
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="description"
            validators={{
              onChange: collectionSchema.shape.description,
            }}
          >
            {(field) => (
              <div>
                <TextareaField
                  label="Description"
                  placeholder="Enter collection description"
                  rows={4}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="shortDescription">
            {(field) => (
              <div>
                <TextareaField
                  label="Short Description"
                  placeholder="Enter short description"
                  rows={2}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          {/* Collection Mode */}
          <div className="bg-gradient-to-r from-[#DF8D28]/5 to-[#DF8D28]/10 rounded-xl p-6 border border-[#DF8D28]/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="material-symbols:settings"
                className="w-5 h-5 text-[#DF8D28]"
              />
              Collection Management
            </h3>
            <form.Field
              name="collectionMode"
              validators={{
                onChange: collectionSchema.shape.collectionMode,
              }}
            >
              {(field) => (
                <div>
                  <DropdownField
                    label="Collection Mode"
                    firstInput="Select collection mode"
                    required
                    options={collectionModeOptions}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError field={field} />
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      <strong>Manual:</strong> Add products manually
                    </p>
                    <p>
                      <strong>Automatic:</strong> Products added based on
                      conditions
                    </p>
                    <p>
                      <strong>Hybrid:</strong> Combination of manual and
                      automatic
                    </p>
                  </div>
                </div>
              )}
            </form.Field>
          </div>

          {/* Collection Conditions - Show for automatic and hybrid modes */}
          <form.Field name="collectionMode">
            {(modeField) => (
              <>
                {(modeField.state.value === "automatic" ||
                  modeField.state.value === "hybrid") && (
                  <form.Field name="conditions">
                    {(conditionsField) => (
                      <ConditionBuilder
                        conditions={conditionsField.state.value}
                        onChange={(newConditions) =>
                          conditionsField.handleChange(newConditions)
                        }
                        collectionMode={
                          modeField.state.value as
                            | "manual"
                            | "automatic"
                            | "hybrid"
                        }
                        collectionId={isEdit ? id : undefined}
                        showMatchingProducts={true}
                      />
                    )}
                  </form.Field>
                )}
              </>
            )}
          </form.Field>

          {/* Material and Gemstone Properties */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="material-symbols:diamond"
                className="w-5 h-5 text-amber-600"
              />
              Collection Properties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form.Field name="materialType">
                {(field) => (
                  <div>
                    <DropdownField
                      label="Material Type"
                      firstInput="Select material type"
                      options={materialTypeOptions}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="gemstoneType">
                {(field) => (
                  <div>
                    <DropdownField
                      label="Gemstone Type"
                      firstInput="Select gemstone type"
                      options={gemstoneTypeOptions}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="styleCategory">
                {(field) => (
                  <div>
                    <DropdownField
                      label="Style Category"
                      firstInput="Select style category"
                      options={styleCategoryOptions}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Status and Settings */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="material-symbols:toggle-on"
                className="w-5 h-5 text-blue-600"
              />
              Collection Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form.Field name="isActive">
                {(field) => (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="w-5 h-5 text-[#DF8D28] border-gray-300 rounded focus:ring-[#DF8D28]"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Icon
                        icon="material-symbols:visibility"
                        className="w-4 h-4"
                      />
                      Active Collection
                    </label>
                  </div>
                )}
              </form.Field>

              <form.Field name="isFeatured">
                {(field) => (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="w-5 h-5 text-[#DF8D28] border-gray-300 rounded focus:ring-[#DF8D28]"
                    />
                    <label
                      htmlFor="isFeatured"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Icon icon="material-symbols:star" className="w-4 h-4" />
                      Featured Collection
                    </label>
                  </div>
                )}
              </form.Field>

              <form.Field name="isLimitedEdition">
                {(field) => (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <input
                      type="checkbox"
                      id="isLimitedEdition"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="w-5 h-5 text-[#DF8D28] border-gray-300 rounded focus:ring-[#DF8D28]"
                    />
                    <label
                      htmlFor="isLimitedEdition"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Icon
                        icon="material-symbols:schedule"
                        className="w-4 h-4"
                      />
                      Limited Edition
                    </label>
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Price Range - Auto-calculated */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="material-symbols:attach-money"
                className="w-5 h-5 text-green-600"
              />
              Price Range (Auto-calculated)
            </h3>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 flex-1">
                  <p className="mb-2">
                    Price range will be automatically calculated based on
                    products in this collection.
                  </p>
                  <p className="text-xs text-gray-500">
                    <Icon
                      icon="material-symbols:info"
                      className="w-4 h-4 inline mr-1"
                    />
                    After adding products, the system will calculate min/max
                    prices automatically.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {isEdit && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        Current Range:
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {collectionData?.priceRange
                          ? `$${collectionData.priceRange.min} - $${collectionData.priceRange.max}`
                          : "Not calculated"}
                      </div>
                    </div>
                  )}
                  {isEdit && (
                    <button
                      type="button"
                      onClick={() => calculatePriceRangeMutation.mutate(id!)}
                      disabled={calculatePriceRangeMutation.isPending}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {calculatePriceRangeMutation.isPending && (
                        <Icon icon="eos-icons:loading" className="w-4 h-4" />
                      )}
                      <Icon
                        icon="material-symbols:calculate"
                        className="w-4 h-4"
                      />
                      Calculate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field name="availableFrom">
              {(field) => (
                <div>
                  <InputField
                    label="Available From"
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <form.Field name="availableUntil">
              {(field) => (
                <div>
                  <InputField
                    label="Available Until"
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          {/* Media Upload */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="material-symbols:image"
                className="w-5 h-5 text-purple-600"
              />
              Media Assets
            </h3>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Icon
                    icon="material-symbols:collections"
                    className="w-4 h-4"
                  />
                  Collection Images
                </label>
                <FileDropInput
                  multiple={false}
                  label="Collection Images"
                  value={null}
                  onChange={(file: File | null) => {
                    if (file) {
                      // For multiple images, we'd need a different approach
                      // For now, treating as single image upload
                      setUploadedImages([file.name]);
                    }
                  }}
                  existingImageUrl={uploadedImages[0]}
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Icon icon="material-symbols:banner" className="w-4 h-4" />
                  Banner Image
                </label>
                <FileDropInput
                  multiple={false}
                  label="Banner Image"
                  value={null}
                  onChange={(file: File | null) => {
                    if (file) {
                      setUploadedBannerImage(file.name);
                    }
                  }}
                  existingImageUrl={uploadedBannerImage}
                />
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Icon
                    icon="material-symbols:video-library"
                    className="w-4 h-4"
                  />
                  Collection Video
                </label>
                <VideoUploadField
                  label="Collection Video"
                  value={null}
                  onChange={(_file) => {
                    // Handle file change if needed
                  }}
                  onUploadComplete={(url) => setUploadedVideo(url)}
                  existingVideoUrl={uploadedVideo}
                />
              </div>
            </div>
          </div>

          {/* SEO and Metadata */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              SEO & Metadata
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field name="metadata.seoTitle">
                  {(field) => (
                    <div>
                      <InputField
                        label="SEO Title"
                        placeholder="Enter SEO title"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="metadata.targetAudience">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Target Audience"
                        firstInput="Select target audience"
                        options={targetAudienceOptions}
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="metadata.seoDescription">
                {(field) => (
                  <div>
                    <TextareaField
                      label="SEO Description"
                      placeholder="Enter SEO description"
                      rows={3}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <form.Field name="metadata.seasonality">
                  {(field) => (
                    <div>
                      <DropdownField
                        label="Seasonality"
                        firstInput="Select seasonality"
                        options={seasonalityOptions}
                        value={field.state.value || "year-round"}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="metadata.popularity">
                  {(field) => (
                    <div>
                      <InputField
                        label="Popularity Score (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={field.state.value || 0}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="metadata.trendingScore">
                  {(field) => (
                    <div>
                      <InputField
                        label="Trending Score (0-100)"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        value={field.state.value || 0}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createCollectionMutation.isPending ||
                updateCollectionMutation.isPending
              }
              className="px-6 py-2 bg-[#DF8D28] text-white rounded-lg hover:bg-[#DF8D28]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(createCollectionMutation.isPending ||
                updateCollectionMutation.isPending) && (
                <Icon icon="eos-icons:loading" className="w-4 h-4" />
              )}
              {isEdit ? "Update Collection" : "Create Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionForm;
