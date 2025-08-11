import { get } from 'lodash';
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
}

interface ProductDetailsProps {
  product: IFetchProduct;
}
export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Add safety checks for product data
  if (!product) {
    return (
      <div className="p-4 text-center text-gray-500">
        Product data not available
      </div>
    );
  }

  const specifications = {
    Length: get(product, 'length', 0),
    'Clasp Type': get(product, 'claspType.name', '-'),
    'Rhodoum Finishes': get(product, 'rhodoumFinishes', 'false'),
  };
  const natural = {
    Shape: get(product, 'shape', '-'),
    Color: get(product, 'color', '-'),
    Quantity: get(product, 'quantity', '-'),
    Clarity: get(product, 'clarity', '-'),
  };

  return (
    <div className="space-y-3 col-span-2">
      {/* Compact Header Section */}
      <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-800 leading-tight">
                {get(product, 'name', '-')}
              </h1>
              <span className="px-2 py-0.5 text-xs text-white rounded bg-amber-500 flex-shrink-0">
                {get(product, 'status', '-')}
              </span>
            </div>
            <p className="text-sm font-medium text-amber-600">
              {get(product, 'category.name', '-')}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {get(product, 'description', '-')}
        </p>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-full"
              >
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
            {product.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-gray-500 bg-gray-50 rounded-full">
                +{product.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
      {/* Compact Variants Section */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Product Variants ({product.variants.length})
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {product.variants.map((item: ProductVariant, index: number) => (
              <div
                key={item?.sku || `variant-${index}`}
                className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
              >
                {/* Ultra Compact Layout */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-semibold">
                      RS. {item?.price?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {item?.wt || 0}{' '}
                      <span className="text-xs text-gray-500">
                        {item?.unit || 'units'}
                      </span>
                    </div>
                  </div>
                  {(item?.remainingStock || 0) <= (item?.reorderPoint || 0) && (
                    <div className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      ⚠ Low Stock
                    </div>
                  )}
                </div>

                {/* Single Row Stock Info */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-3">
                    <span>
                      Total:{' '}
                      <span className="font-semibold text-gray-900">
                        {item?.totalStock || 0}
                      </span>
                    </span>
                    <span>
                      Used:{' '}
                      <span className="font-semibold text-red-600">
                        {item?.usedStock || 0}
                      </span>
                    </span>
                    <span>
                      Left:{' '}
                      <span
                        className={`font-semibold ${
                          (item?.remainingStock || 0) <=
                          (item?.reorderPoint || 0)
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {item?.remainingStock || 0}
                      </span>
                    </span>
                  </div>
                  <span>Reorder: {item?.reorderPoint || 0}</span>
                </div>

                {/* Mini Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
                        (item?.remainingStock || 0) <= (item?.reorderPoint || 0)
                          ? 'bg-red-500'
                          : (item?.remainingStock || 0) <=
                            (item?.totalStock || 1) * 0.3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          ((item?.remainingStock || 0) /
                            (item?.totalStock || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 min-w-[30px]">
                    {Math.round(
                      ((item?.remainingStock || 0) / (item?.totalStock || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compact Specifications - Using Flex instead of Grid */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <DropdownSection title="Specifications" data={specifications} />
        </div>
        <div className="flex-1">
          <DropdownSection title="Natural Gold Information" data={natural} />
        </div>
      </div>
    </div>
  );
};
