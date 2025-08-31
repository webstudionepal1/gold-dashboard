import React, { useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  getVideoStreamUrl,
  ensureStreamingUrl,
} from "../../../utils/videoUtils";

interface VideoUploaderProps {
  label?: string;
  value?: File | null;
  existingFile?: string | string[] | null;
  existingFileField?: string;
  onChange: (file: File | null) => void;
  onExistingFileChange?: (url: string | null) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  label = "Upload Video",
  value,
  existingFile,
  existingFileField,
  onChange,
  onExistingFileChange,
  accept = {
    "video/*": [".mp4", ".webm", ".ogg", ".avi", ".mov"],
  },
  multiple = false,
  maxSize = 200, // 200MB default
  className = "",
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL for selected file
  const generatePreview = useCallback((file: File) => {
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Generate thumbnail from video
      generateThumbnail(file);
    }
  }, []);

  // Generate thumbnail from video
  const generateThumbnail = useCallback((file: File) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.onloadedmetadata = () => {
      // Set canvas size
      canvas.width = 320;
      canvas.height = 180;

      // Seek to 1 second to get a good frame
      video.currentTime = 1;
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
        setThumbnailUrl(thumbnailUrl);
      }
    };

    video.src = URL.createObjectURL(file);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Validate file type
      const isValidType = Object.entries(accept).some(
        ([mimeType, extensions]) => {
          if (mimeType === "video/*") {
            return file.type.startsWith("video/");
          }
          return (
            file.type === mimeType ||
            extensions.some((ext) =>
              file.name.toLowerCase().endsWith(ext.toLowerCase())
            )
          );
        }
      );

      if (!isValidType) {
        alert("Invalid file type. Please select a video file.");
        return;
      }

      onChange(file);
      generatePreview(file);

      // Clear existing file if new file is selected
      if (onExistingFileChange) {
        onExistingFileChange(null);
      }
    },
    [accept, maxSize, onChange, onExistingFileChange, generatePreview]
  );

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  // Handle file input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  // Remove file
  const handleRemoveFile = useCallback(() => {
    onChange(null);
    setPreviewUrl(null);
    setThumbnailUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  // Remove existing file
  const handleRemoveExistingFile = useCallback(() => {
    if (onExistingFileChange) {
      onExistingFileChange(null);
    }
  }, [onExistingFileChange]);

  // Get streaming URL for existing file
  const getExistingFileUrl = useCallback(() => {
    if (!existingFile) return null;

    // Handle array case - take the first video
    const videoPath = Array.isArray(existingFile)
      ? existingFile[0]
      : existingFile;

    if (!videoPath || typeof videoPath !== "string") return null;

    // Clean the video path for streaming
    const cleanVideoPath = videoPath.startsWith("/ridisidi/")
      ? videoPath.substring("/ridisidi/".length)
      : videoPath.startsWith("/")
      ? videoPath.substring(1)
      : videoPath;

    const baseUrl =
      import.meta.env.VITE_API_LOCAL_URL || "http://localhost:8080/api/v1/en/";
    return `${baseUrl}video/stream/${cleanVideoPath}`;
  }, [existingFile]);

  const existingFileUrl = getExistingFileUrl();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={Object.entries(accept)
            .map(([mimeType, extensions]) =>
              extensions.map((ext) => `${mimeType}${ext}`).join(",")
            )
            .join(",")}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}>
          <Icon
            icon="material-symbols:video-library"
            className="mx-auto h-12 w-12 text-gray-400"
          />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              MP4, WebM, OGG, AVI, MOV up to {maxSize}MB
            </p>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}

        {/* Selected File Preview */}
        {value && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon
                  icon="material-symbols:video-file"
                  className="h-8 w-8 text-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {value.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(value.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700">
                <Icon icon="material-symbols:delete" className="h-5 w-5" />
              </button>
            </div>

            {/* Video Preview */}
            {previewUrl && (
              <div className="mt-3">
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-w-md rounded-lg"
                  preload="metadata"
                />
              </div>
            )}

            {/* Thumbnail Preview */}
            {thumbnailUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">
                  Generated Thumbnail:
                </p>
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        )}

        {/* Existing File Display */}
        {existingFile && existingFileUrl && (
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon
                  icon="material-symbols:video-file"
                  className="h-8 w-8 text-green-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Existing Video
                  </p>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const videoPath = Array.isArray(existingFile)
                        ? existingFile[0]
                        : existingFile;
                      return videoPath?.split("/").pop() || "Unknown file";
                    })()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveExistingFile}
                className="text-red-500 hover:text-red-700">
                <Icon icon="material-symbols:delete" className="h-5 w-5" />
              </button>
            </div>

            {/* Video Preview */}
            <div className="mt-3">
              <video
                src={existingFileUrl}
                controls
                className="w-full max-w-md rounded-lg"
                preload="metadata"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
