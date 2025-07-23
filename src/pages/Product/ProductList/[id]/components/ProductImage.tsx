import { useEffect, useState } from "react";
import Slider from "react-slick";

interface ProductImageProps {
  images: string[];
}

const baseURL = import.meta.env.VITE_API_IMAGE_BASE_URL;

export const ProductImage: React.FC<ProductImageProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(0);
    }
  }, [images]);

  const settings = {
    dots: false,
    infinite: images.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  // Safe helper function
  const getImageUrl = (path?: string) => {
    if (!path) return "";
    return `${baseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  const selectedImagePath = images[selectedImage];
  console.log(selectedImagePath);

  return (
    <div className="flex flex-col">
      {/* Main Image Preview */}
      <div className="relative flex justify-center rounded-md shadow-sm">
        <div className="absolute px-2 py-1 text-xs text-white rounded left-2 top-2 bg-amber-500">
          24 Carat
        </div>
        {selectedImagePath ? (
          <img
            src={getImageUrl(selectedImagePath)}
            alt="Selected Product"
            className="object-center w-full h-auto rounded-md"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-md">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Thumbnail Slider */}
      <div className="my-2 slider-container">
        <Slider {...settings}>
          {images.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 rounded cursor-pointer transition-all ${
                index === selectedImage
                  ? "border border-blue-500"
                  : "border border-gray-200 hover:border-blue-300"
              }`}
            >
              <img
                src={`https://gold-api.webstudiomatrix.com/${item}`}
                alt={`Thumbnail ${index}`}
                className="object-cover w-16 h-16"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
