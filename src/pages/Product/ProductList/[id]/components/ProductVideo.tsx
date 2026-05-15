import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { IFetchProduct } from "@/server/api/productHooks";
import { resolveMediaUrl } from "@/utils/media";

interface ProductVideoProps {
  product?: IFetchProduct;
}

export const ProductVideo: React.FC<ProductVideoProps> = ({ product }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = product?.video || [];
  const videoThumbnails = product?.videoThumbnail || [];

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300">
        <Icon icon="mdi:video-off" className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-500 font-medium">No videos available</p>
        <p className="text-sm text-gray-400 mt-1">
          Product videos will appear here
        </p>
      </div>
    );
  }

  const getVideoUrl = (videoPath: string) => resolveMediaUrl(videoPath);

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  const nextVideo = () => handleVideoChange((currentVideoIndex + 1) % videos.length);
  const prevVideo = () =>
    handleVideoChange(currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1);

  const currentVideo = videos[currentVideoIndex];
  const currentThumbnail = videoThumbnails[currentVideoIndex];

  return (
    <div className="space-y-4">
      <div className="relative group">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 text-xs rounded-3xl font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1">
              <Icon icon="mdi:video" className="w-4 h-4" />
              Product Video
            </div>
          </div>

          {/* Navigation Arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevVideo}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              >
                <Icon icon="mdi:chevron-left" className="w-6 h-6" />
              </button>
              <button
                onClick={nextVideo}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              >
                <Icon icon="mdi:chevron-right" className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Video Player */}
          <video
            className="w-full h-full object-cover object-center"
            src={getVideoUrl(currentVideo)}
            controls
            preload="metadata"
            poster={
              currentThumbnail
                ? resolveMediaUrl(currentThumbnail)
                : undefined
            }
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Video Counter */}
          {videos.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentVideoIndex + 1} / {videos.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
