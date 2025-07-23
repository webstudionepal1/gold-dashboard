import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCollectionByIdQuery } from "../../../server/api/collectionHooks";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { format } from "date-fns";
import SafeImage from "../../../components/ui/SafeImage";

const CollectionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: collection,
    isLoading,
    error,
  } = useGetCollectionByIdQuery(id || "");

  console.log(collection, "collection single");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icon icon="eos-icons:loading" className="w-8 h-8 text-[#DF8D28]" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Icon
            icon="material-symbols:error"
            className="w-16 h-16 text-red-500 mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Collection Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The collection you're looking for doesn't exist or has been removed.
          </p>
          {/* Debug information */}
          <div className="text-left bg-gray-100 p-4 rounded-lg mb-6 max-w-md mx-auto">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Debug Info:</strong>
            </p>
            <p className="text-sm text-gray-600">
              ID: {id || "No ID provided"}
            </p>
            <p className="text-sm text-gray-600">
              Error: {error ? JSON.stringify(error) : "No error"}
            </p>
            <p className="text-sm text-gray-600">
              Collection: {collection ? "Found" : "Not found"}
            </p>
          </div>
          <button
            onClick={() => navigate("/collection")}
            className="px-6 py-2 bg-[#DF8D28] text-white rounded-lg hover:bg-[#DF8D28]/90 transition-colors"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Breadcrumbs />

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {collection.bannerImage && (
                <SafeImage
                  src={collection.bannerImage}
                  alt={collection.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {collection.name}
                  </h1>
                  <div className="flex gap-2">
                    {collection.isActive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                    {collection.isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                    {collection.isLimitedEdition && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Limited Edition
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  {collection.shortDescription}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Slug: {collection.slug}</span>
                  <span>•</span>
                  <span>Products: {collection.totalProducts}</span>
                  <span>•</span>
                  <span>Sort Order: {collection.sortOrder ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/collection/edit/${collection._id}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Icon icon="material-symbols:edit" className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => navigate("/collection")}
                className="px-4 py-2 bg-[#DF8D28] text-white rounded-lg hover:bg-[#DF8D28]/90 transition-colors"
              >
                Back to Collections
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {collection.description && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {collection.description}
            </p>
          </div>
        )}

        {/* Collection Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Properties */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Collection Properties
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">
                  {collection.collectionType?.replace("_", " ") || "Custom"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className="font-medium capitalize">
                  {collection.collectionMode}
                </span>
              </div>
              {collection.materialType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium capitalize">
                    {collection.materialType?.replace("_", " ") ||
                      collection.materialType}
                  </span>
                </div>
              )}
              {collection.gemstoneType &&
                collection.gemstoneType !== "none" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gemstone:</span>
                    <span className="font-medium capitalize">
                      {collection.gemstoneType}
                    </span>
                  </div>
                )}
              {collection.styleCategory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Style:</span>
                  <span className="font-medium capitalize">
                    {collection.styleCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Price Range */}
          {collection.priceRange && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Price Range
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum:</span>
                  <span className="font-medium">
                    {collection.priceRange.currency} {collection.priceRange.min}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum:</span>
                  <span className="font-medium">
                    {collection.priceRange.currency} {collection.priceRange.max}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">
                    {collection.priceRange.currency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        {(collection.availableFrom || collection.availableUntil) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Availability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collection.availableFrom && (
                <div>
                  <span className="text-gray-600">Available From:</span>
                  <p className="font-medium">
                    {format(new Date(collection.availableFrom), "PPP")}
                  </p>
                </div>
              )}
              {collection.availableUntil && (
                <div>
                  <span className="text-gray-600">Available Until:</span>
                  <p className="font-medium">
                    {format(new Date(collection.availableUntil), "PPP")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images */}
        {collection.images && collection.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Collection Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collection.images.map((image, index) => (
                <SafeImage
                  key={`${collection._id}-image-${index}`}
                  src={image}
                  alt={`${collection.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  showLoadingPlaceholder={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {collection.video && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Collection Video
            </h2>
            <video
              src={collection.video}
              controls
              className="w-full max-w-2xl rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* SEO & Metadata */}
        {collection.metadata && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              SEO & Metadata
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {collection.metadata.seoTitle && (
                  <div>
                    <span className="text-gray-600">SEO Title:</span>
                    <p className="font-medium">
                      {collection.metadata.seoTitle}
                    </p>
                  </div>
                )}
                {collection.metadata.seoDescription && (
                  <div>
                    <span className="text-gray-600">SEO Description:</span>
                    <p className="font-medium">
                      {collection.metadata.seoDescription}
                    </p>
                  </div>
                )}
                {collection.metadata.targetAudience && (
                  <div>
                    <span className="text-gray-600">Target Audience:</span>
                    <p className="font-medium capitalize">
                      {collection.metadata.targetAudience}
                    </p>
                  </div>
                )}
                {collection.metadata.seasonality && (
                  <div>
                    <span className="text-gray-600">Seasonality:</span>
                    <p className="font-medium capitalize">
                      {collection.metadata.seasonality}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {collection.metadata.popularity !== undefined && (
                  <div>
                    <span className="text-gray-600">Popularity Score:</span>
                    <p className="font-medium">
                      {collection.metadata.popularity}/100
                    </p>
                  </div>
                )}
                {collection.metadata.trendingScore !== undefined && (
                  <div>
                    <span className="text-gray-600">Trending Score:</span>
                    <p className="font-medium">
                      {collection.metadata.trendingScore}/100
                    </p>
                  </div>
                )}
                {collection.metadata.keywords &&
                  collection.metadata.keywords.length > 0 && (
                    <div>
                      <span className="text-gray-600">Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {collection.metadata.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {collection.metadata.tags &&
                  collection.metadata.tags.length > 0 && (
                    <div>
                      <span className="text-gray-600">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {collection.metadata.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Smart Collection Conditions */}
        {collection.conditions && collection.conditions.isAutomatic && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Smart Collection Conditions
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:auto-mode"
                  className="w-5 h-5 text-green-600"
                />
                <span className="font-medium text-green-600">
                  Automatic Collection
                </span>
              </div>
              {collection.conditions.groups &&
                collection.conditions.groups.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Groups combined with:{" "}
                      <span className="font-medium">
                        {collection.conditions.operator}
                      </span>
                    </p>
                    {collection.conditions.groups.map((group, groupIndex) => (
                      <div
                        key={groupIndex}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Group {groupIndex + 1} (Rules combined with:{" "}
                          {group.operator})
                        </p>
                        <div className="space-y-2">
                          {group.rules.map((rule, ruleIndex) => (
                            <div
                              key={ruleIndex}
                              className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                            >
                              <span className="font-medium">{rule.field}</span>{" "}
                              {rule.operator}{" "}
                              <span className="font-medium">
                                {Array.isArray(rule.value)
                                  ? rule.value.join(", ")
                                  : rule.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Audit Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Audit Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {collection.createdAt && (
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium">
                    {format(new Date(collection.createdAt), "PPP 'at' p")}
                  </p>
                </div>
              )}
              {collection.updatedAt && (
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium">
                    {format(new Date(collection.updatedAt), "PPP 'at' p")}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {collection.createdBy && (
                <div>
                  <span className="text-gray-600">Created By:</span>
                  <p className="font-medium">{collection.createdBy}</p>
                </div>
              )}
              {collection.updatedBy && (
                <div>
                  <span className="text-gray-600">Updated By:</span>
                  <p className="font-medium">{collection.updatedBy}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetails;
