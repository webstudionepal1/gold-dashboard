import { useEffect, useState } from "react";
import Slider from "react-slick";
const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
};
interface ProductImageProps {
  images: string[];
}
export const ProductImage: React.FC<ProductImageProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(0);
    }
  }, []);
  const settings = {
    dots: false,
    infinite: images.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };
  return (
    <div className="flex flex-col">
      <div className="relative flex justify-center rounded-md shadow-sm">
        <div className="absolute px-2 py-1 text-xs text-white rounded left-2 top-2 bg-amber-500">
          24 Carat
        </div>
        <img
          src={images[selectedImage]}
          alt={"img"}
          className="object-center w-full h-auto rounded-md"
        />
      </div>
      <div className="my-2 slider-container">
        <Slider {...settings}>
          {images.map((item, index: number) => (
            <div
              key={index.toString()}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 rounded  cursor-pointer transition-all ${
                index === selectedImage
                  ? "border border-blue-500 "
                  : "border border-gray-200 hover:border-blue-300"
              }`}
            >
              <img src={item} alt="hello" className="object-cover w-16 h-16" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
