import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Icon } from "@iconify/react";
import { IFetchProduct } from "@/server/api/productHooks";

interface ProductImageProps {
  images: string[];
  product?: IFetchProduct;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  images,
  product,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(0);
    }
  }, [images]);

  const settings = {
    dots: false,
    infinite: images.length > 5,
    speed: 500,
    slidesToShow: Math.min(5, images.length),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(4, images.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(3, images.length),
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageChange = (index: number) => {
    setIsLoading(true);
    setSelectedImage(index);
  };

  const nextImage = () => {
    const nextIndex = (selectedImage + 1) % images.length;
    handleImageChange(nextIndex);
  };

  const prevImage = () => {
    const prevIndex =
      selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    handleImageChange(prevIndex);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
        <Icon icon="mdi:image-off" className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-500 font-medium">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Premium Badge */}
          {product?.totalCarat && (
            <div className="absolute top-1 left-1 z-10">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1.5 text-xs rounded-3xl font-semibold shadow-lg backdrop-blur-sm">
                <Icon icon="mdi:star" className="w-4 h-4 inline mr-1" />
                {product.totalCarat.toString().concat(" Karat")}
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <Icon icon="mdi:chevron-left" className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <Icon icon="mdi:chevron-right" className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
            <Icon
              icon={isZoomed ? "mdi:magnify-minus" : "mdi:magnify-plus"}
              className="w-5 h-5"
            />
          </button>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          )}

          {/* Main Image */}
          <div
            className={`relative overflow-hidden transition-all duration-500 ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}>
            <img
              src={images[selectedImage]}
              alt={`Product image ${selectedImage + 1}`}
              className={`w-full h-auto object-cover transition-all duration-500 ${
                isZoomed ? "scale-150" : "scale-100 hover:scale-105"
              } ${isLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={handleImageLoad}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Slider */}
      {images.length > 1 && (
        <div className="thumbnail-slider">
          <Slider {...settings}>
            {images.map((item, index: number) => (
              <div key={index} className="px-1">
                <div
                  onClick={() => handleImageChange(index)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden ${
                    index === selectedImage
                      ? "ring-2 ring-amber-500 ring-offset-2 shadow-lg scale-105"
                      : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 hover:scale-102"
                  }`}>
                  <img
                    src={item}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  {/* Overlay for non-selected images */}
                  {index !== selectedImage && (
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300"></div>
                  )}
                  {/* Selected indicator */}
                  {index === selectedImage && (
                    <div className="absolute top-1 right-1">
                      <div className="bg-amber-500 text-white rounded-full p-1">
                        <Icon icon="mdi:check" className="w-3 h-3" />
                      </div>
                    </div>
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
