"use client";

import { useRef } from "react";
import { useFormikContext } from "formik";
import { UploadCloud, X } from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import { resolveMediaUrl } from "@/utils/media";

interface ProductFormData {
  video: File | null;
  existingVideo: string | null;
}

const PRODUCT_VIDEO_MAX_SIZE_MB = 30;
const PRODUCT_VIDEO_MAX_SIZE_BYTES = PRODUCT_VIDEO_MAX_SIZE_MB * 1024 * 1024;

export default function CompactProductVideoSection() {
  const { values, setFieldValue } = useFormikContext<ProductFormData>();
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const validateVideoFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return false;
    }
    if (file.size > PRODUCT_VIDEO_MAX_SIZE_BYTES) {
      toast.error(`Video size must be ${PRODUCT_VIDEO_MAX_SIZE_MB}MB or less.`);
      return false;
    }
    return true;
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateVideoFile(file)) {
      setFieldValue("video", file);
      setFieldValue("existingVideo", null);
    } else if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleRemoveVideo = () => {
    setFieldValue("video", null);
    setFieldValue("existingVideo", null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateVideoFile(file)) {
      setFieldValue("video", file);
      setFieldValue("existingVideo", null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const existingVideoUrl =
    values.existingVideo && resolveMediaUrl(values.existingVideo);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Icon
          icon="material-symbols:photo-library"
          className="w-5 h-5 text-customorange"
        />
        Product Video
      </h3>
      <div className="space-y-4">
        {/* Dropzone box */}
        {!values.video && !values.existingVideo && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed h-28 border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition"
            onClick={() => videoInputRef.current?.click()}
          >
            <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop a product video here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max size: {PRODUCT_VIDEO_MAX_SIZE_MB}MB per video
            </p>
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>
        )}

        {/* New Video Preview */}
        {values.video && (
          <div className="relative">
            <video
              src={URL.createObjectURL(values.video)}
              controls
              className="w-full  rounded-lg border"
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Existing Video Preview */}
        {!values.video && existingVideoUrl && (
          <div className="relative">
            <video
              src={existingVideoUrl}
              controls
              className="w-full h-64 rounded-lg border"
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
