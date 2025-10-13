import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCollectionByIdQuery } from '../../../server/api/collectionHooks';
import Breadcrumbs from '../../../components/shared/Breadcrumb';
import { format } from 'date-fns';
import SafeImage from '../../../components/ui/SafeImage';
import { getSafeProductCount } from '@/utils/numberUtils';

const CollectionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: collection,
    isLoading,
    error,
  } = useGetCollectionByIdQuery(id || '');

  console.log(collection, 'collection');

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
          <p className="text-gray-600 mb-6">
            The collection you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-2 bg-[#DF8D28] text-white rounded-lg hover:bg-[#DF8D28]/90 transition-colors"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Breadcrumbs />

      <div className="mt-4 space-y-4">
        {/* Compact Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {collection.bannerImage && (
                  <div className="relative">
                    <SafeImage
                      src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                        collection.bannerImage || `/no-image.png`
                      }`}
                      alt={collection.name}
                      className="w-20 h-20 rounded-xl object-cover shadow-md"
                    />
                    <div className="absolute -top-1 -right-1">
                      {collection.isActive && (
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {collection.name}
                    </h1>
                    <div className="flex gap-1.5">
                      {collection.isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          <Icon
                            icon="material-symbols:check-circle"
                            className="w-3 h-3 mr-1"
                          />
                          Active
                        </span>
                      )}
                      {collection.isFeatured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                          <Icon
                            icon="material-symbols:star"
                            className="w-3 h-3 mr-1"
                          />
                          Featured
                        </span>
                      )}
                      {collection.isLimitedEdition && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                          <Icon
                            icon="material-symbols:limited-edition"
                            className="w-3 h-3 mr-1"
                          />
                          Limited
                        </span>
                      )}
                    </div>
                  </div>
                  {collection.shortDescription && (
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {collection.shortDescription}
                    </p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:link"
                        className="w-4 h-4 text-gray-400"
                      />
                      <span className="text-gray-500">Slug:</span>
                      <span className="font-medium text-gray-700">
                        {collection.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:inventory"
                        className="w-4 h-4 text-gray-400"
                      />
                      <span className="text-gray-500">Products:</span>
                      <span className="font-medium text-gray-700">
                        {getSafeProductCount(collection.totalProducts)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:sort"
                        className="w-4 h-4 text-gray-400"
                      />
                      <span className="text-gray-500">Sort Order:</span>
                      <span className="font-medium text-gray-700">
                        {collection.sortOrder ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:category"
                        className="w-4 h-4 text-gray-400"
                      />
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-700 capitalize">
                        {collection.collectionType?.replace('_', ' ') ||
                          'Custom'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/collection/edit/${collection._id}`)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <Icon icon="material-symbols:edit" className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => navigate('/collection')}
                  className="px-3 py-2 bg-[#DF8D28] text-white rounded-lg hover:bg-[#DF8D28]/90 transition-colors text-sm"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Left Column - Primary Information */}
          <div className="xl:col-span-3 space-y-4">
            {/* Top Row - Description and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Description */}
              {collection.description && (
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon
                      icon="material-symbols:description"
                      className="w-5 h-5 text-[#DF8D28]"
                    />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Description
                    </h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {collection.description}
                  </p>
                </div>
              )}

              {/* Quick Stats Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Icon
                    icon="material-symbols:analytics"
                    className="w-5 h-5 text-[#DF8D28]"
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Quick Stats
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      Total Products
                    </span>
                    <span className="font-bold text-lg text-[#DF8D28]">
                      {collection.totalProducts || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">
                      Collection Mode
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        collection.collectionMode === 'automatic'
                          ? 'bg-green-100 text-green-700'
                          : collection.collectionMode === 'hybrid'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {collection.collectionMode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Sort Order</span>
                    <span className="font-medium text-sm">
                      {collection.sortOrder ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Properties - Full Width */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="material-symbols:settings"
                  className="w-5 h-5 text-[#DF8D28]"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  Properties
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Icon
                        icon="material-symbols:toggle-on"
                        className="w-4 h-4 text-gray-400"
                      />
                      Mode:
                    </span>
                    <span className="font-medium text-sm capitalize bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                      {collection.collectionMode}
                    </span>
                  </div>
                  {collection.materialType && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm flex items-center gap-2">
                        <Icon
                          icon="material-symbols:diamond"
                          className="w-4 h-4 text-gray-400"
                        />
                        Material:
                      </span>
                      <span className="font-medium text-sm capitalize">
                        {collection.materialType?.replace('_', ' ') ||
                          collection.materialType}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {collection.gemstoneType &&
                    collection.gemstoneType !== 'none' && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm flex items-center gap-2">
                          <Icon
                            icon="material-symbols:diamond"
                            className="w-4 h-4 text-gray-400"
                          />
                          Gemstone:
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {collection.gemstoneType}
                        </span>
                      </div>
                    )}
                  {collection.styleCategory && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm flex items-center gap-2">
                        <Icon
                          icon="material-symbols:palette"
                          className="w-4 h-4 text-gray-400"
                        />
                        Style:
                      </span>
                      <span className="font-medium text-sm capitalize">
                        {collection.styleCategory}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {collection.priceRange && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm flex items-center gap-2">
                          <Icon
                            icon="material-symbols:attach-money"
                            className="w-4 h-4 text-gray-400"
                          />
                          Price Range:
                        </span>
                        <span className="font-medium text-sm">
                          {collection.priceRange.currency}{' '}
                          {collection.priceRange.min} -{' '}
                          {collection.priceRange.max}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {/* Additional properties can go here */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Timeline & Availability */}
          <div className="space-y-4">
            {/* Audit Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="material-symbols:history"
                  className="w-5 h-5 text-[#DF8D28]"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  Timeline
                </h2>
              </div>
              <div className="space-y-3">
                {collection.createdAt && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Icon
                        icon="material-symbols:add-circle"
                        className="w-4 h-4 text-green-500"
                      />
                      Created:
                    </span>
                    <span className="font-medium text-sm">
                      {format(new Date(collection.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {collection.updatedAt && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 text-sm flex items-center gap-2">
                      <Icon
                        icon="material-symbols:edit"
                        className="w-4 h-4 text-blue-500"
                      />
                      Updated:
                    </span>
                    <span className="font-medium text-sm">
                      {format(new Date(collection.updatedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {(collection.availableFrom || collection.availableUntil) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Icon
                    icon="material-symbols:schedule"
                    className="w-5 h-5 text-[#DF8D28]"
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Availability
                  </h2>
                </div>
                <div className="space-y-3">
                  {collection.availableFrom && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm flex items-center gap-2">
                        <Icon
                          icon="material-symbols:play-arrow"
                          className="w-4 h-4 text-green-500"
                        />
                        Available From:
                      </span>
                      <span className="font-medium text-sm">
                        {format(
                          new Date(collection.availableFrom),
                          'MMM dd, yyyy'
                        )}
                      </span>
                    </div>
                  )}
                  {collection.availableUntil && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600 text-sm flex items-center gap-2">
                        <Icon
                          icon="material-symbols:stop"
                          className="w-4 h-4 text-red-500"
                        />
                        Available Until:
                      </span>
                      <span className="font-medium text-sm">
                        {format(
                          new Date(collection.availableUntil),
                          'MMM dd, yyyy'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media Section - Full Width */}
        {(collection.images?.length > 0 || collection.video) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon
                icon="material-symbols:image"
                className="w-5 h-5 text-[#DF8D28]"
              />
              <h2 className="text-lg font-semibold text-gray-900">
                Media Gallery
              </h2>
              {collection.images && collection.images.length > 0 && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {collection.images.length}{' '}
                  {collection.images.length === 1 ? 'image' : 'images'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Images */}
              {collection.images && collection.images.length > 0 && (
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {collection.images.slice(0, 16).map((image, index) => (
                      <SafeImage
                        key={`${collection._id}-image-${index}`}
                        src={`https://ridhisiddhi-api.webstudiomatrix.com${
                          image || `/no-image.png`
                        }`}
                        alt={`${collection.name} ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                        showLoadingPlaceholder={isLoading}
                      />
                    ))}
                    {collection.images.length > 16 && (
                      <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow cursor-pointer">
                        <span className="text-xs text-gray-600 font-medium">
                          +{collection.images.length - 16}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video */}
              {collection.video && (
                <div
                  className={
                    collection.images?.length > 0 ? '' : 'lg:col-span-3'
                  }
                >
                  <div className="relative">
                    <video
                      src={collection.video}
                      controls
                      className="w-full max-h-48 rounded-lg border border-gray-200 shadow-sm"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
                      Video
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Smart Collection Rules */}
        <div>
          {/* Smart Collection Conditions */}
          {collection.conditions && collection.conditions.isAutomatic && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="material-symbols:auto-mode"
                  className="w-5 h-5 text-[#DF8D28]"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  Smart Collection Rules
                </h2>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <Icon
                    icon="material-symbols:check-circle"
                    className="w-3 h-3 mr-1"
                  />
                  Automatic
                </span>
              </div>
              <div className="space-y-4">
                {collection.conditions.groups &&
                  collection.conditions.groups.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <Icon
                          icon="material-symbols:info"
                          className="w-4 h-4 text-blue-500"
                        />
                        <span>Groups are combined with: </span>
                        <span className="font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-md uppercase text-xs">
                          {collection.conditions.operator}
                        </span>
                      </div>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {collection.conditions.groups.map(
                          (group, groupIndex) => (
                            <div
                              key={groupIndex}
                              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Icon
                                  icon="material-symbols:folder"
                                  className="w-4 h-4 text-gray-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  Group {groupIndex + 1}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                                  Rules combined with:{' '}
                                  {group.operator.toUpperCase()}
                                </span>
                              </div>
                              <div className="space-y-2">
                                {group.rules.map((rule, ruleIndex) => (
                                  <div
                                    key={ruleIndex}
                                    className="text-sm bg-white p-3 rounded-md border border-gray-200 flex items-center gap-2"
                                  >
                                    <Icon
                                      icon="material-symbols:rule"
                                      className="w-4 h-4 text-gray-400"
                                    />
                                    <span className="font-medium text-gray-700">
                                      {rule.field}
                                    </span>
                                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                                      {rule.operator}
                                    </span>
                                    <span className="font-medium text-gray-800 bg-yellow-50 px-2 py-1 rounded text-xs">
                                      {Array.isArray(rule.value)
                                        ? rule.value.join(', ')
                                        : rule.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetails;
