"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UploadCloud } from "lucide-react";

interface ImageDropzoneCropProps {
  onChange: (filesOrUrls: (File | string)[]) => void;
  aspect?: number;
  multiple?: boolean;
  existing?: (File | string)[];
}

export default function ImageDropzoneCrop({
  onChange,
  aspect = 4 / 5,
  multiple = false,
  existing = [],
}: ImageDropzoneCropProps) {
  const [dragActive, setDragActive] = useState(false);
  const [images, setImages] = useState<(File | string)[]>(existing || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const updatedImages = multiple ? [...images, ...newFiles] : newFiles;
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  const getImageUrl = (image: File | string): string => {
    if (typeof image === "string") {
      return image;
    }
    return URL.createObjectURL(image);
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed h-28 rounded-lg px-8 py-4 text-center transition-colors ${
          dragActive
            ? "border-[#DF8D28] bg-[#DF8D28]/10"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400" />

          <div className="flex items-center gap-1">
            <p className="text-sm font-normal text-gray-700">
              Drag and drop images here
            </p>
            <p className="text-xs text-gray-600 mr-2">
              <button
                type="button"
                className="text-[#DF8D28] hover:underline font-medium"
              >
                or click to browse
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                style={{ aspectRatio: aspect }}
              >
                <img
                  src={getImageUrl(image) || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  title="Remove image"
                >
                  <Icon
                    icon="material-symbols:delete"
                    className="w-6 h-6 text-white"
                  />
                </button>

                {/* Image Counter */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}

            {/* Add More Button inside grid */}
            {multiple && (
              <button
                type="button"
                onClick={handleAddMore}
                className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#DF8D28] text-[#DF8D28] hover:bg-[#DF8D28]/10 transition-colors"
                style={{ aspectRatio: aspect }}
              >
                <Icon icon="material-symbols:add" className="w-5 h-5 mb-1" />
                <span className="text-sm font-normal">Add More</span>
              </button>
            )}
          </div>

          {/* Image Count */}
          {/* <p className="text-xs text-gray-600 text-center">
            {images.length} image{images.length !== 1 ? "s" : ""} selected
          </p> */}
        </div>
      )}
    </div>
  );
}
