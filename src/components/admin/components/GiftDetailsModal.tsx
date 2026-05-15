import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { IFetchGift } from "../../../server/api/giftHooks";
import SafeImage from "../../ui/SafeImage";
import {
  calculateGiftPrices,
  formatPrice,
  getGiftPricingSummary,
} from "../../../utils/giftPriceCalculator";
import { resolveMediaUrl } from "../../../utils/media";
import {
  getGiftProductDisplayName,
  getGiftProductVariants,
  resolveRelationName,
} from "@/lib/gift-products";

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

  // Get calculated prices using utility function
  const calculatedPrices = calculateGiftPrices(gift);

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
    <div className="space-y-1">
      {/* Pricing Status Summary */}
      {!calculatedPrices.hasValidProducts && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-1.5 mb-1">
          <div className="flex items-center">
            <Icon
              icon="material-symbols:error"
              className="w-4 h-4 text-red-600 mr-2"
            />
            <div>
              <h4 className="text-xs font-medium text-red-800">
                Gift Pricing Issue
              </h4>
              <p className="text-red-700 mt-0.5 text-xs">
                This gift cannot display pricing information. Please check that
                all products are active and have valid pricing data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-1.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                gift.type === "gift" ? "bg-purple-100" : "bg-blue-100"
              }`}
            >
              {gift.type === "gift" ? (
                <Icon
                  icon="material-symbols:card-giftcard"
                  className="w-6 h-6 text-purple-600"
                />
              ) : (
                <Icon
                  icon="material-symbols:package-2"
                  className="w-6 h-6 text-blue-600"
                />
              )}
            </div>
            <div>
              <h2 className="text-base font-medium text-gray-900 mb-1.5">
                {gift?.name}
              </h2>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    gift?.isActive
                      ? "bg-green text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {gift?.isActive ? "Active" : "Inactive"}
                </span>
                <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-700 capitalize">
                  {gift?.type}
                </span>
                {gift?.occasion && (
                  <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-700 capitalize">
                    {gift?.occasion}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Icon icon="material-symbols:edit" className="w-4 h-4" />
            <span className="font-normal text-sm">Edit</span>
          </button>
        </div>
      </div>

      {/* Description */}
      {gift?.description && (
        <div className="bg-white rounded-lg border border-gray-200 p-1.5">
          <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <div className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></div>
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-xs">
            {gift?.description}
          </p>
        </div>
      )}

      {/* Pricing Information */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200 p-1.5">
        <h3 className="text-sm font-medium text-gray-900 mb-1.5 flex items-center">
          <div className="w-1.5 h-4 bg-green rounded-full mr-2"></div>
          Pricing
        </h3>

        {!calculatedPrices.hasValidProducts ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center">
              <Icon
                icon="material-symbols:warning"
                className="w-4 h-4 text-yellow-600 mr-2"
              />
              <div>
                <h4 className="text-xs font-medium text-yellow-800">
                  Price Calculation Issue
                </h4>
                <p className="text-yellow-700 mt-0.5 text-xs">
                  Unable to calculate gift price. This may be due to inactive
                  products or missing product data.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white rounded-md p-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Original Price
              </label>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(calculatedPrices.totalOriginalPrice)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Based on products</p>
            </div>
            <div className="bg-white rounded-md p-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Discount
              </label>
              <p className="text-xl font-bold text-orange-600">
                {gift.discountPercentage || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Applied</p>
            </div>
            <div className="bg-white rounded-md p-3 border-2 border-green-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Final Price
              </label>
              <p className="text-2xl font-bold text-green">
                {formatPrice(calculatedPrices.totalDiscountedPrice)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">After discount</p>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        {calculatedPrices.hasValidProducts && (
          <div className="mt-3 bg-white rounded-md p-3 border border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-2">
              Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Original:</span>
                <span className="font-medium">
                  {formatPrice(calculatedPrices.totalOriginalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-orange-600">
                  -{formatPrice(calculatedPrices.savings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium text-green-600">
                  {formatPrice(calculatedPrices.totalDiscountedPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Savings:</span>
                <span className="font-medium text-green-600">
                  {formatPrice(calculatedPrices.savings)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gift Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-4 bg-purple-500 rounded-full mr-2"></div>
            Info
          </h3>
          <div className="space-y-1.5">
            {gift?.setType && (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <Icon
                    icon="material-symbols:package-2"
                    className="w-4 h-4 text-purple-500"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    Set Type
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-900 capitalize px-2 py-0.5 bg-white rounded">
                  {gift?.setType.replace("_", " ")}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon
                  icon="material-symbols:star"
                  className="w-4 h-4 text-yellow-500"
                />
                <span className="text-xs font-medium text-gray-700">
                  Priority
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
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
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon
                  icon="material-symbols:calendar-today"
                  className="w-4 h-4 text-blue-500"
                />
                <span className="text-xs font-medium text-gray-700">
                  Created
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-900">
                {formatDate(gift.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon
                  icon="material-symbols:calendar-today"
                  className="w-4 h-4 text-green-500"
                />
                <span className="text-xs font-medium text-gray-700">
                  Updated
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-900">
                {formatDate(gift.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></div>
            Tags
          </h3>
          {gift.tags && gift.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {gift?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-medium rounded border border-blue-200 hover:shadow-sm transition-shadow"
                >
                  {/* <Icon
                    icon="material-symbols:tag"
                    className="w-3 h-3 mr-1.5"
                  /> */}
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Icon
                icon="material-symbols:tag"
                className="w-8 h-8 text-gray-300 mx-auto mb-2"
              />
              <p className="text-gray-500 text-xs">No tags</p>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <div className="w-1.5 h-4 bg-orange-500 rounded-full mr-2"></div>
            Products
          </h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-orange-50 rounded-md">
              <Icon
                icon="material-symbols:shopping-bag"
                className="w-4 h-4 text-orange-600"
              />
              <span className="text-sm font-bold text-orange-600">
                {gift.products?.length || 0}
              </span>
              <span className="text-xs text-orange-600">items</span>
            </div>
            {calculatedPrices.hasValidProducts && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 rounded-md border border-green-200">
                <Icon
                  icon="material-symbols:calculate"
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-xs text-green-600">Value:</span>
                <span className="text-sm font-bold text-green-600">
                  {formatPrice(calculatedPrices.totalOriginalPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3">
          {!calculatedPrices.hasValidProducts && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-center">
                <Icon
                  icon="material-symbols:error"
                  className="w-4 h-4 text-red-600 mr-2"
                />
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    No Valid Products
                  </h4>
                  <p className="text-red-700 mt-0.5 text-xs">
                    All products are inactive or missing pricing.
                  </p>
                </div>
              </div>
            </div>
          )}
          {gift.products?.map((giftProduct, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {getGiftProductDisplayName(giftProduct.product)}
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {typeof giftProduct.product === "object" &&
                    giftProduct.product?.description
                      ? String(giftProduct.product.description)
                      : "—"}
                  </p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 flex-wrap">
                    <span>
                      Cat:{" "}
                      {resolveRelationName(
                        typeof giftProduct.product === "object"
                          ? giftProduct.product?.category
                          : null
                      )}
                    </span>
                    <span>
                      Sub:{" "}
                      {resolveRelationName(
                        typeof giftProduct.product === "object"
                          ? giftProduct.product?.subCategory
                          : null
                      )}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        typeof giftProduct.product === "object" &&
                        giftProduct.product?.isActive !== false &&
                        getGiftProductVariants(giftProduct.product)[0]?.price
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {typeof giftProduct.product === "object" &&
                      giftProduct.product?.isActive !== false &&
                      getGiftProductVariants(giftProduct.product)[0]?.price
                        ? "Priced"
                        : "No Price"}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(
                      getGiftProductVariants(giftProduct.product)[0]?.price || 0
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {giftProduct.quantity}
                  </div>
                  <div className="text-xs font-medium text-green-600 mt-0.5">
                    Total:{" "}
                    {formatPrice(
                      (getGiftProductVariants(giftProduct.product)[0]?.price ||
                        0) * giftProduct.quantity
                    )}
                  </div>
                  {giftProduct.isOptional && (
                    <span className="inline-block px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded mt-0.5">
                      Optional
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <span className="ml-1 font-medium">
                    {getGiftProductVariants(giftProduct.product)[0]?.wt || 0}{" "}
                    {getGiftProductVariants(giftProduct.product)[0]?.unit || "g"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Making:</span>
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

              {/* Price Breakdown for this product */}
              {calculatedPrices.productBreakdown[index]?.status ===
                "calculated" && (
                <div className="mt-2 pt-2 border-t border-gray-100 bg-blue-50 rounded-md p-2">
                  <h5 className="text-xs font-medium text-blue-800 mb-1.5">
                    Breakdown:
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Base:</span>
                      <span className="font-medium">
                        {formatPrice(
                          calculatedPrices.productBreakdown[index].basePrice
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Making:</span>
                      <span className="font-medium">
                        {formatPrice(
                          calculatedPrices.productBreakdown[index].makingCharges
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Wastage:</span>
                      <span className="font-medium">
                        {formatPrice(
                          calculatedPrices.productBreakdown[index].wastageCost
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Stones:</span>
                      <span className="font-medium">
                        {formatPrice(
                          calculatedPrices.productBreakdown[index].stonesCost
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Others:</span>
                      <span className="font-medium">
                        {formatPrice(
                          calculatedPrices.productBreakdown[index].othersCost
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Unit:</span>
                      <span className="font-semibold">
                        {formatPrice(
                          calculatedPrices.productBreakdown[index].pricePerUnit
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Alternative Products */}
              {giftProduct.alternativeProducts &&
                giftProduct.alternativeProducts.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <h5 className="text-xs font-medium text-gray-700 mb-1.5">
                      Alternatives:
                    </h5>
                    <div className="space-y-1">
                      {giftProduct.alternativeProducts.map(
                        (altProduct, altIndex) => (
                          <div
                            key={altIndex}
                            className="flex items-center justify-between text-xs bg-gray-50 rounded p-1.5"
                          >
                            <span className="font-medium">
                              {altProduct.name}
                            </span>
                            <span className="text-gray-600">
                              {formatPrice(
                                getGiftProductVariants(altProduct)[0]?.price || 0
                              )}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Product Images */}
              {typeof giftProduct.product === "object" &&
                Array.isArray(giftProduct.product?.images) &&
                giftProduct.product.images.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <h5 className="text-xs font-medium text-gray-700 mb-1.5">
                      Images:
                    </h5>
                    <div className="flex space-x-1.5 overflow-x-auto">
                      {giftProduct.product.images
                        .slice(0, 3)
                        .map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={resolveMediaUrl(image)}
                            alt={`${getGiftProductDisplayName(giftProduct.product)} ${
                              imgIndex + 1
                            }`}
                            className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/no-image.png";
                            }}
                          />
                        ))}
                      {(giftProduct.product as { images: string[] }).images
                        .length > 3 && (
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                          +
                          {(giftProduct.product as { images: string[] }).images
                            .length - 3}
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Icon
              icon="material-symbols:image"
              className="w-4 h-4 text-[#DF8D28]"
            />
            <h3 className="text-sm font-semibold text-gray-900">Images</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {gift.images.length}{" "}
              {gift.images.length === 1 ? "image" : "images"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {gift.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded group cursor-pointer"
                onClick={() => openImageModal(index)}
              >
                <img
                  src={resolveMediaUrl(image)}
                  alt={`${gift.name} ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Icon
                    icon="material-symbols:zoom-in"
                    className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                {/* Image counter */}
                <div className="absolute bottom-1 right-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium text-sm"
        >
          Close
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
        >
          Edit
        </button>
      </div>

      {/* Image Modal/Lightbox */}
      {isImageModalOpen && gift?.images && gift?.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2">
          <div className="relative max-w-3xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <Icon icon="material-symbols:close" className="w-5 h-5" />
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
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <Icon
                    icon="material-symbols:chevron-left"
                    className="w-5 h-5"
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <Icon
                    icon="material-symbols:chevron-right"
                    className="w-5 h-5"
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
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="text-xs font-medium">
                  {selectedImageIndex + 1} of {gift.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {gift.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 bg-black/30 p-1.5 rounded backdrop-blur-sm max-w-full overflow-x-auto">
                {gift.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-10 h-10 rounded border-2 overflow-hidden transition-all duration-200 ${
                      index === selectedImageIndex
                        ? "border-white shadow-md"
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
