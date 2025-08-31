import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { IFetchProduct } from "@/server/api/productHooks";

interface ProductVideoProps {
  product?: IFetchProduct;
}

export const ProductVideo: React.FC<ProductVideoProps> = ({ product }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Get videos from product
  const videos = product?.video || [];
  const videoThumbnails = product?.videoThumbnail || [];

  if (!videos || videos.length === 0) {
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

  // Clean video path for streaming
  const getVideoUrl = (videoPath: string) => {
    const cleanVideoPath = videoPath.startsWith("/ridisidi/")
      ? videoPath.substring("/ridisidi/".length)
      : videoPath.startsWith("/")
      ? videoPath.substring(1)
      : videoPath;

    const baseUrl =
      import.meta.env.VITE_API_LOCAL_URL || "http://localhost:8080/api/v1/en/";
    return `${baseUrl}video/stream/${cleanVideoPath}`;
  };

  const currentVideo = videos[currentVideoIndex];
  const currentThumbnail = videoThumbnails[currentVideoIndex];

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  const nextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    handleVideoChange(nextIndex);
  };

  const prevVideo = () => {
    const prevIndex =
      currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1;
    handleVideoChange(prevIndex);
  };

  return (
    <div className="space-y-4">
      {/* Main Video Display */}
      <div className="relative group">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Video Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 text-xs rounded-3xl font-semibold shadow-lg backdrop-blur-sm">
              <Icon icon="mdi:video" className="w-4 h-4 inline mr-1" />
              Product Video
            </div>
          </div>

          {/* Navigation Arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevVideo}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <Icon icon="mdi:chevron-left" className="w-6 h-6" />
              </button>
              <button
                onClick={nextVideo}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                <Icon icon="mdi:chevron-right" className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Video Player */}
          <div className="relative">
            <video
              src={getVideoUrl(currentVideo)}
              className="w-full h-auto object-cover"
              controls
              preload="metadata"
              poster={
                currentThumbnail
                  ? `${
                      import.meta.env.VITE_API_IMAGE_BASE_URL
                    }${currentThumbnail}`
                  : undefined
              }
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>

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
