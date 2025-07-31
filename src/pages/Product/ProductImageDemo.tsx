import React from "react";
import { ProductImage } from "./ProductList/[id]/components/ProductImage";
import Header from "../../components/shared/table_heading/Header";

// Sample images for testing the ProductImage component
const sampleImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
];

const singleImage = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
];

const ProductImageDemo: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <Header text="ProductImage Component Demo" />
      
      <div className="space-y-8">
        {/* Multiple Images Demo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Multiple Images with Custom Pagination
          </h2>
          <p className="text-gray-600 mb-4">
            This demo shows the ProductImage component with multiple images, 
            featuring custom thumbnail pagination, navigation arrows, and slide indicators.
          </p>
          <div className="max-w-md mx-auto">
            <ProductImage images={sampleImages} />
          </div>
        </div>

        {/* Single Image Demo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Single Image
          </h2>
          <p className="text-gray-600 mb-4">
            This demo shows how the component handles a single image 
            (no pagination or arrows should be visible).
          </p>
          <div className="max-w-md mx-auto">
            <ProductImage images={singleImage} />
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Features Implemented
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Custom Pagination</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Thumbnail-based navigation</li>
                <li>• Active thumbnail highlighting</li>
                <li>• Hover effects on thumbnails</li>
                <li>• Click to navigate functionality</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Navigation</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Previous/Next arrow buttons</li>
                <li>• Slide counter (1 / 5)</li>
                <li>• Smooth transitions</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Responsive Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-friendly layout</li>
                <li>• Scalable thumbnail grid</li>
                <li>• Touch/swipe support</li>
                <li>• Flexible container sizing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Accessibility</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Proper ARIA labels</li>
                <li>• Alt text for images</li>
                <li>• Keyboard navigation</li>
                <li>• Screen reader support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            How to Use
          </h2>
          <div className="space-y-4 text-blue-700">
            <div>
              <h3 className="font-medium mb-2">Basic Usage:</h3>
              <pre className="bg-blue-100 p-3 rounded text-sm overflow-x-auto">
{`import { ProductImage } from './components/ProductImage';

const images = [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg'
];

<ProductImage images={images} />`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Features:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Click thumbnails to navigate between images</li>
                <li>• Use arrow buttons for navigation</li>
                <li>• View current slide position in top-right corner</li>
                <li>• Automatic hiding of navigation for single images</li>
                <li>• Smooth transitions and hover effects</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageDemo;
