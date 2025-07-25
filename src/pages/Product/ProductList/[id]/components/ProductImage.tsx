import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ProductImageProps {
  images: string[];
  productName?: string;
  carat?: string | number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  images,
  productName = "Product",
  carat = "24",
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(0);
    }
  }, [images]);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  // Slider settings with responsive breakpoints
  const sliderSettings = {
    dots: false,
    infinite: images.length > 4,
    speed: 300,
    slidesToShow: Math.min(4, images.length),
    slidesToScroll: 1,
    arrows: images.length > 4,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(3, images.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(2, images.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Handle empty images
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="relative flex items-center justify-center bg-gray-100 rounded-lg aspect-square">
          <Icon icon="mdi:image-outline" className="w-16 h-16 text-gray-400" />
          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white bg-gray-400 rounded">
            No Image
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-3">
      {/* Main Image Display */}
      <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden group">
        {/* Carat Badge */}
        <div className="absolute top-3 left-3 z-10 px-2 py-1 text-xs font-medium text-white bg-amber-500 rounded-full shadow-sm">
          {carat} Carat
        </div>

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <Icon icon="mdi:magnify" className="w-4 h-4 text-gray-700" />
        </button>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Icon
              icon="mdi:loading"
              className="w-8 h-8 text-gray-400 animate-spin"
            />
          </div>
        )}

        {/* Main Image */}
        <div className="aspect-square bg-gray-50 flex items-center justify-center">
          <img
            src={images[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? "scale-110" : "scale-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Slider */}
      {images.length > 1 && (
        <div className="thumbnail-slider">
          <Slider {...sliderSettings}>
            {images.map((item, index: number) => (
              <div key={index} className="px-1">
                <div
                  onClick={() => setSelectedImage(index)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                    index === selectedImage
                      ? "ring-2 ring-amber-500 ring-offset-2"
                      : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }`}
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={item}
                      alt={`${productName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {index === selectedImage && (
                    <div className="absolute inset-0 bg-amber-500/20"></div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};
