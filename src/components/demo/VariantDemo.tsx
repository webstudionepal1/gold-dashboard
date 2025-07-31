import React from 'react';

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

// Sample variant data for demonstration
const sampleVariants: ProductVariant[] = [
  {
    price: 2500,
    wt: 10.5,
    unit: 'grams',
    totalStock: 100,
    usedStock: 25,
    remainingStock: 75,
    reorderPoint: 20,
    sku: 'GOLD-10G-001'
  },
  {
    price: 4800,
    wt: 20,
    unit: 'grams',
    totalStock: 50,
    usedStock: 35,
    remainingStock: 15,
    reorderPoint: 20,
    sku: 'GOLD-20G-002'
  },
  {
    price: 1200,
    wt: 5,
    unit: 'grams',
    totalStock: 200,
    usedStock: 50,
    remainingStock: 150,
    reorderPoint: 30,
    sku: 'GOLD-5G-003'
  },
  {
    price: 7200,
    wt: 30,
    unit: 'grams',
    totalStock: 25,
    usedStock: 20,
    remainingStock: 5,
    reorderPoint: 10,
    sku: 'GOLD-30G-004'
  }
];

export const VariantDemo: React.FC = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Beautiful Product Variants UI Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Product Variants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleVariants.map((item: ProductVariant, index: number) => (
                <div
                  key={item?.sku || `variant-${index}`}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Price Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ${item?.price?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Variant #{index + 1}
                    </div>
                  </div>

                  {/* Weight Information */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Weight</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {item?.wt || 0} <span className="text-sm font-normal text-gray-600">{item?.unit || 'units'}</span>
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Stock:</span>
                      <span className="font-semibold text-gray-900">{item?.totalStock || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Used Stock:</span>
                      <span className="font-semibold text-red-600">{item?.usedStock || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Remaining:</span>
                      <span className={`font-semibold ${
                        (item?.remainingStock || 0) <= (item?.reorderPoint || 0) 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {item?.remainingStock || 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reorder Point:</span>
                      <span className="font-semibold text-orange-600">{item?.reorderPoint || 0}</span>
                    </div>
                  </div>

                  {/* Stock Status Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Stock Level</span>
                      <span>{Math.round(((item?.remainingStock || 0) / (item?.totalStock || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (item?.remainingStock || 0) <= (item?.reorderPoint || 0)
                            ? 'bg-red-500'
                            : (item?.remainingStock || 0) <= (item?.totalStock || 1) * 0.3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(((item?.remainingStock || 0) / (item?.totalStock || 1)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Low Stock Warning */}
                  {(item?.remainingStock || 0) <= (item?.reorderPoint || 0) && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                        <span className="text-red-700 text-xs font-medium">Low Stock Alert</span>
                      </div>
                    </div>
                  )}

                  {/* SKU Information */}
                  {item?.sku && (
                    <div className="mt-3 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded text-center">
                      SKU: {item.sku}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Description */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">UI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Visual Indicators</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Color-coded stock levels (Green: Good, Yellow: Medium, Red: Low)</li>
                <li>• Progress bars showing stock percentage</li>
                <li>• Low stock alerts with warning icons</li>
                <li>• Gradient backgrounds with hover effects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Information Display</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clear price display with currency formatting</li>
                <li>• Weight information with units</li>
                <li>• Complete stock breakdown (Total, Used, Remaining)</li>
                <li>• SKU identification for inventory tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantDemo;
