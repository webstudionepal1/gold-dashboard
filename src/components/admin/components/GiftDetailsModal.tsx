import React from "react";
import { Edit, Package, Gift, Tag, Calendar, Star, Users, ShoppingBag, Zap, Award } from "lucide-react";
import { IFetchGift } from "../../../server/api/giftHooks";

interface GiftDetailsModalProps {
  gift: IFetchGift;
  onEdit: () => void;
  onClose: () => void;
}

const GiftDetailsModal: React.FC<GiftDetailsModalProps> = ({ gift, onEdit, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              gift.type === "gift" ? "bg-purple-100" : "bg-blue-100"
            }`}>
              {gift.type === "gift" ? (
                <Gift className="w-8 h-8 text-purple-600" />
              ) : (
                <Package className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{gift.name}</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  gift.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {gift.isActive ? "✓ Active" : "⚠ Inactive"}
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 capitalize">
                  {gift.type}
                </span>
                {gift.occasion && (
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 capitalize">
                    {gift.occasion}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Edit className="w-5 h-5" />
            <span className="font-medium">Edit Gift</span>
          </button>
        </div>
      </div>

      {/* Description */}
      {gift.description && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">{gift.description}</p>
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
            <label className="block text-sm font-medium text-gray-500 mb-2">Total Price</label>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(gift.totalPrice || 0)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-500 mb-2">Discount</label>
            <p className="text-2xl font-bold text-orange-600">{gift.discountPercentage || 0}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
            <label className="block text-sm font-medium text-gray-500 mb-2">Final Price</label>
            <p className="text-3xl font-bold text-green-600">{formatPrice(gift.finalPrice || 0)}</p>
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
            {gift.setType && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Set Type</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 capitalize px-3 py-1 bg-white rounded-md">
                  {gift.setType.replace('_', ' ')}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Priority</span>
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-md ${
                (gift.priority || 0) >= 8 ? 'bg-red-100 text-red-700' :
                (gift.priority || 0) >= 5 ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {gift.priority || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Created</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatDate(gift.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Updated</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatDate(gift.updatedAt)}</span>
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
              {gift.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <span className="text-lg font-bold text-orange-600">{gift.products?.length || 0}</span>
            <span className="text-sm text-orange-600">items</span>
          </div>
        </div>
        <div className="space-y-6">
          {gift.products?.map((giftProduct, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{giftProduct.product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{giftProduct.product.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Category: {giftProduct.product.category.name}</span>
                    <span>Subcategory: {giftProduct.product.subCategory.name}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatPrice(giftProduct.product.variant[0]?.price || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: {giftProduct.quantity}
                  </div>
                  {giftProduct.isOptional && (
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
                  <span className="ml-1 font-medium">{giftProduct.product.variant[0]?.wt || 0} {giftProduct.product.variant[0]?.unit || 'grams'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Making Charges:</span>
                  <span className="ml-1 font-medium">{formatPrice(giftProduct.product.makingCharges || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Color:</span>
                  <span className="ml-1 font-medium capitalize">{giftProduct.product.color || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Clarity:</span>
                  <span className="ml-1 font-medium">{giftProduct.product.clarity || 'N/A'}</span>
                </div>
              </div>

              {/* Alternative Products */}
              {giftProduct.alternativeProducts && giftProduct.alternativeProducts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Alternative Products:</h5>
                  <div className="space-y-2">
                    {giftProduct.alternativeProducts.map((altProduct, altIndex) => (
                      <div key={altIndex} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                        <span className="font-medium">{altProduct.name}</span>
                        <span className="text-gray-600">{formatPrice(altProduct.variant[0]?.price || 0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Images */}
              {giftProduct.product.images && giftProduct.product.images.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Product Images:</h5>
                  <div className="flex space-x-2 overflow-x-auto">
                    {giftProduct.product.images.slice(0, 3).map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${giftProduct.product.name} ${imgIndex + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/no-image.png';
                        }}
                      />
                    ))}
                    {giftProduct.product.images.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                        +{giftProduct.product.images.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gift Images */}
      {gift.images && gift.images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gift Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gift.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${gift.name} ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/no-image.png';
                }}
              />
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
    </div>
  );
};

export default GiftDetailsModal;