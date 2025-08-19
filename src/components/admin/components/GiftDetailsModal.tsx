import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IFetchGift } from "../../../server/api/giftHooks";
import SafeImage from "../../ui/SafeImage";

interface GiftDetailsModalProps {
  gift: IFetchGift;
  onEdit: () => void;
  onClose: () => void;
}

const GiftDetailsModal: React.FC<GiftDetailsModalProps> = ({
  gift,
  onEdit,
  onClose,
}) => {
  // State for image modal
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle image modal
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-xl ${
                gift.type === "gift" ? "bg-purple-100" : "bg-blue-100"
              }`}
            >
              {gift.type === "gift" ? (
                <Icon
                  icon="material-symbols:card-giftcard"
                  className="w-8 h-8 text-purple-600"
                />
              ) : (
                <Icon
                  icon="material-symbols:package-2"
                  className="w-8 h-8 text-blue-600"
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {gift?.name}
              </h2>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gift?.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {gift?.isActive ? "✓ Active" : "⚠ Inactive"}
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 capitalize">
                  {gift?.type}
                </span>
                {gift?.occasion && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 capitalize">
                    {gift?.occasion}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Icon icon="material-symbols:edit" className="w-5 h-5" />
            <span className="font-medium">Edit Gift</span>
          </button>
        </div>
      </div>

      {/* Description */}
      {gift?.description && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {gift?.description}
          </p>
        </div>
      )}

      {/* Pricing Information */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
          Pricing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Total Price
            </label>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(gift?.totalPrice || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Discount
            </label>
            <p className="text-2xl font-bold text-orange-600">
              {gift?.discountPercentage || 0}%
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Final Price
            </label>
            <p className="text-3xl font-bold text-green-600">
              {formatPrice(gift.finalPrice || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Gift Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
            Gift Information
          </h3>
          <div className="space-y-4">
            {gift?.setType && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="material-symbols:package-2"
                    className="w-5 h-5 text-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Set Type
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 capitalize px-3 py-1 bg-white rounded-md">
                  {gift?.setType.replace("_", " ")}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon
                  icon="material-symbols:star"
                  className="w-5 h-5 text-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Priority
                </span>
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-md ${
                  (gift?.priority || 0) >= 8
                    ? "bg-red-100 text-red-700"
                    : (gift?.priority || 0) >= 5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {gift?.priority || "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon
                  icon="material-symbols:calendar-today"
                  className="w-5 h-5 text-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Created
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatDate(gift.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon
                  icon="material-symbols:calendar-today"
                  className="w-5 h-5 text-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Updated
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatDate(gift.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
            Tags & Categories
          </h3>
          {gift.tags && gift.tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {gift?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <Icon icon="material-symbols:tag" className="w-4 h-4 mr-2" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon
                icon="material-symbols:tag"
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
              />
              <p className="text-gray-500">No tags assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
            Products
          </h3>
          <div className="flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-lg">
            <Icon
              icon="material-symbols:shopping-bag"
              className="w-5 h-5 text-orange-600"
            />
            <span className="text-lg font-bold text-orange-600">
              {gift?.products?.length || 0}
            </span>
            <span className="text-sm text-orange-600">items</span>
          </div>
        </div>
        <div className="space-y-6">
          {gift.products?.map((giftProduct, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-gray-50 to-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {giftProduct?.product?.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {giftProduct.product.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Category: {giftProduct?.product?.category?.name}</span>
                    <span>
                      Subcategory: {giftProduct?.product?.subCategory?.name}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(giftProduct?.product?.variant[0]?.price || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: {giftProduct?.quantity}
                  </div>
                  {giftProduct?.isOptional && (
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md mt-1">
                      Optional
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <span className="ml-1 font-medium">
                    {giftProduct?.product?.variant[0]?.wt || 0}{" "}
                    {giftProduct?.product?.variant[0]?.unit || "grams"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Making Charges:</span>
                  <span className="ml-1 font-medium">
                    {formatPrice(giftProduct?.product?.makingCharges || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-1 font-medium capitalize">
                    {giftProduct?.product?.color || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Clarity:</span>
                  <span className="ml-1 font-medium">
                    {giftProduct?.product?.clarity || "N/A"}
                  </span>
                </div>
              </div>

              {/* Alternative Products */}
              {giftProduct.alternativeProducts &&
                giftProduct.alternativeProducts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Alternative Products:
                    </h5>
                    <div className="space-y-2">
                      {giftProduct.alternativeProducts.map(
                        (altProduct, altIndex) => (
                          <div
                            key={altIndex}
                            className="flex items-center justify-between text-sm bg-gray-50 rounded p-2"
                          >
                            <span className="font-medium">
                              {altProduct?.name}
                            </span>
                            <span className="text-gray-600">
                              {formatPrice(altProduct?.variant[0]?.price || 0)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Product Images */}
              {giftProduct.product.images &&
                giftProduct.product.images.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Product Images:
                    </h5>
                    <div className="flex space-x-2 overflow-x-auto">
                      {giftProduct.product.images
                        .slice(0, 3)
                        .map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={import.meta.env.VITE_API_IMAGE_BASE_URL.toString().concat(
                              image
                            )}
                            alt={`${giftProduct?.product?.name} ${imgIndex + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/no-image.png";
                            }}
                          />
                        ))}
                      {giftProduct.product.images.length > 3 && (
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                          +{giftProduct?.product?.images?.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Gift Images Gallery */}
      {gift?.images && gift?.images?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon
              icon="material-symbols:image"
              className="w-5 h-5 text-[#DF8D28]"
            />
            <h3 className="text-lg font-semibold text-gray-900">Gift Images</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              {gift.images.length}{" "}
              {gift.images.length === 1 ? "image" : "images"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gift.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                onClick={() => openImageModal(index)}
              >
                <img
                  src={import.meta.env.VITE_API_IMAGE_BASE_URL.toString().concat(
                    image
                  )}
                  alt={`${gift.name} ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  // showLoadingPlaceholder={true}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Icon
                    icon="material-symbols:zoom-in"
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                {/* Image counter */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
        >
          Close
        </button>
        <button
          onClick={onEdit}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          Edit Gift
        </button>
      </div>

      {/* Image Modal/Lightbox */}
      {isImageModalOpen && gift?.images && gift?.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <Icon icon="material-symbols:close" className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {gift.images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const newIndex =
                      selectedImageIndex > 0
                        ? selectedImageIndex - 1
                        : gift.images!.length - 1;
                    setSelectedImageIndex(newIndex);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <Icon
                    icon="material-symbols:chevron-left"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() => {
                    const newIndex =
                      selectedImageIndex < gift.images!.length - 1
                        ? selectedImageIndex + 1
                        : 0;
                    setSelectedImageIndex(newIndex);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <Icon
                    icon="material-symbols:chevron-right"
                    className="w-6 h-6"
                  />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative max-w-full max-h-full">
              <SafeImage
                src={gift.images[selectedImageIndex]}
                alt={`${gift.name} ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                showLoadingPlaceholder={true}
              />

              {/* Image Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium">
                  {selectedImageIndex + 1} of {gift.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {gift.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 p-2 rounded-lg backdrop-blur-sm max-w-full overflow-x-auto">
                {gift.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all duration-200 ${
                      index === selectedImageIndex
                        ? "border-white shadow-lg"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <SafeImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      showLoadingPlaceholder={true}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftDetailsModal;
