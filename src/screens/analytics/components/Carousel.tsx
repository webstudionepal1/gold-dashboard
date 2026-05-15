// components/Carousel.tsx
import React, { useState } from "react";
import { StatCard } from "./iconCard";
import { cn } from "../../../lib/utils";

interface CarouselProps {
  data: Array<{
    category: string;

    percentageShare: number;
  }>;
}

const ITEMS_PER_SLIDE = 4;

export const Carousel: React.FC<CarouselProps> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handlers for next/prev buttons
  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(data.length / ITEMS_PER_SLIDE)
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(data.length / ITEMS_PER_SLIDE) - 1 : prev - 1
    );
  };

  // Swipe logic (optional, for touch devices)
  const handleTouchStart = (e: React.TouchEvent) => {
    // Track swipe start position
    e.stopPropagation();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Track swipe move position
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Compare swipe start and end to determine swipe direction
    e.stopPropagation();
  };

  const displayedItems = data.slice(
    currentSlide * ITEMS_PER_SLIDE,
    (currentSlide + 1) * ITEMS_PER_SLIDE
  );

  return (
    <div className="relative">
      {/* Carousel items */}
      <div
        className="flex overflow-hidden gap-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayedItems.map((item, index) => (
          <StatCard
            key={index}
            label={item.category}
            percentage={item.percentageShare}
            className="w-full flex-shrink-0"
          />
        ))}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Array.from({ length: Math.ceil(data.length / ITEMS_PER_SLIDE) }).map(
          (_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full cursor-pointer",
                index === currentSlide ? "bg-gray-600" : "bg-gray-300"
              )}
              onClick={() => setCurrentSlide(index)}
            />
          )
        )}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-gray-600 p-2 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-gray-600 p-2 rounded-full"
      >
        &gt;
      </button>
    </div>
  );
};
