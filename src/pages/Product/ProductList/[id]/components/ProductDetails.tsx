import { get } from 'lodash';
import { Icon } from '@iconify/react/dist/iconify.js';
import { IFetchProduct } from '../../../../../server/api/productHooks';
import { DropdownSection } from './DropDownSection';

// Type for product variant
interface ProductVariant {
  price: number;
  wt: number;
  unit: string;
  totalStock: number;
  usedStock: number;
  remainingStock: number;
  reorderPoint: number;
  sku?: string;
  isActive?: boolean;
}

// Type for stones
interface ProductStone {
  name: string;
  weight: string;
  price: string;
  color: string;
}

// Type for other charges
interface OtherCharge {
  name: string;
  value: number;
}

// Type for wastage
interface Wastage {
  type: "fixed" | "per";
  value: number;
}

interface ProductDetailsProps {
  product: IFetchProduct & {
    productType?: string;
    gender?: string;
    wastage?: Wastage;
    stones?: ProductStone[];
    others?: OtherCharge[];
    isFeatured?: boolean;
  };
}
export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Add safety checks for product data
  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
        <Icon icon="mdi:package-variant-closed" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Product data not available</h3>
        <p className="text-sm text-gray-500">Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // Organize data into logical sections
  const basicInfo = {
    'Product Type': get(product, 'productType', 'gold'),
    'Category': get(product, 'category.name', '-'),
    'Sub Category': get(product, 'subCategory.name', '-'),
    'Visible As': get(product, 'visibleAs', 'normal'),
  };

  // Get stones data first
  const stones = get(product, 'stones', []);

  // Check product type
  const productType = get(product, 'productType', 'gold').toLowerCase();
  const isNormalProduct = productType === 'normal';
  const isGoldOrSilver = productType === 'gold' || productType === 'silver';
  const hasGemstones = stones && stones.length > 0;
  const hasTotalCarat = get(product, 'totalCarat', 0) > 0;
  const isGemstoneProduct = hasGemstones || hasTotalCarat || get(product, 'color') || get(product, 'clarity');

  // For normal products, show simplified view
  if (isNormalProduct) {
    return (
      <div className="space-y-6 col-span-2">
        {/* Simple Header for Normal Products */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                  {get(product, 'name', 'Untitled Product')}
                </h1>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  get(product, 'isActive', true)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {get(product, 'isActive', true) ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-blue-600">
                  <Icon icon="mdi:package-variant" className="w-4 h-4 inline mr-1" />
                  Normal Product
                </span>
                <span className="text-gray-600">
                  <Icon icon="mdi:tag" className="w-4 h-4 inline mr-1" />
                  {get(product, 'category.name', 'Uncategorized')}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {get(product, 'description') && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {get(product, 'description')}
              </p>
            </div>
          )}
        </div>

        {/* Simple Price Display */}
        {product.variants && product.variants.length > 0 && (
          <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Pricing
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                </span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {product.variants.map((variant: ProductVariant, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-6 py-3 rounded-lg text-xl font-bold border border-green-200">
                        ₹{variant?.price?.toLocaleString() || 0}
                      </div>
                      {variant?.wt && (
                        <div className="text-base font-semibold text-gray-900">
                          {variant.wt}{' '}
                          <span className="text-sm text-gray-600 font-normal">
                            {variant?.unit || 'units'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      get(variant, 'isActive', true)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {get(variant, 'isActive', true) ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Build specifications conditionally
  const specifications: { [key: string]: string } = {
    'Making Charges': get(product, 'makingCharges', 0) ? `₹${get(product, 'makingCharges', 0).toLocaleString()}` : '₹0',
    'Rhodoum Finishes': get(product, 'rhodoumFinishes', false) ? 'Yes' : 'No',
  };

  // Add length if available
  if (get(product, 'length', 0)) {
    specifications['Length'] = `${get(product, 'length', 0)} mm`;
  }

  // Add dimension if available
  if (get(product, 'dimension', 0)) {
    specifications['Dimension'] = `${get(product, 'dimension', 0)} mm`;
  }

  // Add clasp type only for jewelry items (not for loose stones/gems)
  if (get(product, 'claspType.name') && !isGemstoneProduct) {
    specifications['Clasp Type'] = get(product, 'claspType.name', '-');
  }

  // Add shape only for gemstone products
  if (get(product, 'shape') && isGemstoneProduct) {
    specifications['Shape'] = get(product, 'shape', '-');
  }

  // Build gemstone info conditionally - only show if it's actually a gemstone product
  const gemstoneInfo: { [key: string]: string } = {};

  if (isGemstoneProduct) {
    if (isGoldOrSilver && hasTotalCarat) {
      // For gold/silver with gemstones, show karat
      gemstoneInfo['Total Karat'] = `${get(product, 'totalCarat', 0)} kt`;
    } else if (hasTotalCarat) {
      // For pure gemstones, show carat
      gemstoneInfo['Total Carat'] = `${get(product, 'totalCarat', 0)} ct`;
    }

    if (get(product, 'color')) {
      gemstoneInfo['Color'] = get(product, 'color', '-');
    }

    if (get(product, 'clarity')) {
      gemstoneInfo['Clarity'] = get(product, 'clarity', '-');
    }

    if (get(product, 'quantity', 0)) {
      gemstoneInfo['Quantity'] = get(product, 'quantity', 0).toString();
    }
  }

  // Get wastage info
  const wastageInfo = get(product, 'wastage');
  const wastageDisplay = wastageInfo
    ? `${wastageInfo.value}${wastageInfo.type === 'per' ? '%' : ' (flat)'}`
    : '-';

  // Get other charges
  const otherCharges = get(product, 'others', []);

  return (
    <div className="space-y-6 col-span-2">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                {get(product, 'name', 'Untitled Product')}
              </h1>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  get(product, 'isActive', true)
                    ? 'bg-green text-green-800'
                    : 'bg-red text-red-800'
                }`}>
                  {get(product, 'isActive', true) ? 'Active' : 'Inactive'}
                </span>
                {get(product, 'isFeatured', false) && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    <Icon icon="mdi:star" className="w-3 h-3 inline mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-amber-600">
                <Icon icon="mdi:tag" className="w-4 h-4 inline mr-1" />
                {get(product, 'category.name', 'Uncategorized')}
              </span>
              {get(product, 'subCategory.name') && (
                <span className="text-gray-600">
                  <Icon icon="mdi:tag-outline" className="w-4 h-4 inline mr-1" />
                  {get(product, 'subCategory.name')}
                </span>
              )}
              <span className="text-gray-600 capitalize">
                <Icon icon="mdi:account" className="w-4 h-4 inline mr-1" />
                {get(product, 'gender', 'unisex')}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {get(product, 'description') && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {get(product, 'description')}
            </p>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 6).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full border border-blue-200"
              >
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
            {product.tags.length > 6 && (
              <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                +{product.tags.length - 6} more
              </span>
            )}
          </div>
        )}

        {/* Wastage Info */}
        {wastageDisplay !== '-' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:information" className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Wastage: {wastageDisplay}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Enhanced Variants Section */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Product Variants
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {product.variants.length}
              </span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {product.variants.map((item: ProductVariant, index: number) => (
              <div
                key={item?.sku || `variant-${index}`}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
              >
                {/* Header with Price and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 px-4 py-2 rounded-lg text-lg font-bold border border-amber-200">
                      ₹{item?.price?.toLocaleString() || 0}
                    </div>
                    <div className="text-base font-semibold text-gray-900">
                      {item?.wt || 0}{' '}
                      <span className="text-sm text-gray-600 font-normal">
                        {item?.unit || 'units'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {get(item, 'isActive', true) ? (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                    {(item?.remainingStock || 0) <= (item?.reorderPoint || 0) && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        <Icon icon="mdi:alert" className="w-3 h-3 inline mr-1" />
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-lg font-bold text-blue-800">{item?.totalStock || 0}</div>
                    <div className="text-xs text-blue-600 font-medium">Total Stock</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-lg font-bold text-red-800">{item?.usedStock || 0}</div>
                    <div className="text-xs text-red-600 font-medium">Used Stock</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className={`text-lg font-bold ${
                      (item?.remainingStock || 0) <= (item?.reorderPoint || 0)
                        ? 'text-red-800'
                        : 'text-green-800'
                    }`}>
                      {item?.remainingStock || 0}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Remaining</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="text-lg font-bold text-yellow-800">{item?.reorderPoint || 0}</div>
                    <div className="text-xs text-yellow-600 font-medium">Reorder Point</div>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Stock Level</span>
                    <span className="font-medium">
                      {Math.round(((item?.remainingStock || 0) / (item?.totalStock || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (item?.remainingStock || 0) <= (item?.reorderPoint || 0)
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : (item?.remainingStock || 0) <= (item?.totalStock || 1) * 0.3
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{
                        width: `${Math.min(
                          ((item?.remainingStock || 0) / (item?.totalStock || 1)) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stones Section */}
      {stones && stones.length > 0 && (
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <Icon icon="mdi:diamond-stone" className="w-5 h-5 text-purple-600" />
              Stones & Gems
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                {stones.length}
              </span>
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stones.map((stone: ProductStone, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800 capitalize">{stone.name}</h4>
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {stone.color}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium text-gray-900">{stone.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-green-600">₹{stone.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other Charges Section */}
      {otherCharges && otherCharges.length > 0 && (
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
              <Icon icon="mdi:receipt" className="w-5 h-5 text-green-600" />
              Additional Charges
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {otherCharges.length}
              </span>
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherCharges.map((charge: OtherCharge, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 capitalize">{charge.name}</span>
                    <span className="font-bold text-green-600">₹{charge.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Total Additional Charges:</span>
                <span className="font-bold text-lg text-green-600">
                  ₹{otherCharges.reduce((sum, charge) => sum + charge.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Sections Grid */}
      <div className="grid grid-cols-1 gap-6">
        <DropdownSection title="Basic Information" data={basicInfo} className='' />
        <DropdownSection title="Specifications" data={specifications} />
      </div>

      {/* Gemstone Information - Only show if it's a gemstone product */}
      {isGemstoneProduct && Object.keys(gemstoneInfo).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <DropdownSection
            title={`${isGoldOrSilver ? 'Gold/Silver with Gemstone' : 'Gemstone'} Information`}
            data={gemstoneInfo}
          />
        </div>
      )}
    </div>
  );
};
