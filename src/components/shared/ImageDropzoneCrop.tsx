"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: any
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");
        resolve(new File([blob], "cropped.png", { type: "image/png" }));
      }, "image/png");
    };
    image.onerror = () => reject("Failed to load image");
  });
};

interface ImageDropzoneCropProps {
  multiple?: boolean;
  aspect?: number;
  existing?: string | string[];
  onChange: (filesOrUrls: (File | string)[]) => void;
}

const ImageDropzoneCrop: React.FC<ImageDropzoneCropProps> = ({
  multiple = false,
  aspect = 16 / 9,
  existing,
  onChange,
}) => {
  const [images, setImages] = useState<(File | string)[]>([]);
  const [cropIndex, setCropIndex] = useState<number>(0);
  const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Initialize with existing images
  useEffect(() => {
    if (existing) {
      if (multiple && Array.isArray(existing)) setImages(existing);
      else if (!multiple && typeof existing === "string") setImages([existing]);
    }
  }, [existing, multiple]);

  // Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setFilesToCrop(acceptedFiles);
    setCropIndex(0);
    setPendingFile(acceptedFiles[0]);
    setCurrentImage(URL.createObjectURL(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
  });

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Save cropped image
  const handleCropSave = async () => {
    if (!currentImage || !croppedAreaPixels || !pendingFile) return;

    const croppedFile = await getCroppedImg(currentImage, croppedAreaPixels);
    let updatedImages: (File | string)[] = [];

    // If recropping existing File
    if (cropIndex < images.length && images[cropIndex] instanceof File) {
      updatedImages = [...images];
      updatedImages[cropIndex] = croppedFile;
    } else {
      updatedImages = multiple ? [...images, croppedFile] : [croppedFile];
    }

    setImages(updatedImages);
    onChange(updatedImages);

    // Crop next file if multiple
    if (filesToCrop.length && cropIndex + 1 < filesToCrop.length) {
      const nextIndex = cropIndex + 1;
      setCropIndex(nextIndex);
      setPendingFile(filesToCrop[nextIndex]);
      setCurrentImage(URL.createObjectURL(filesToCrop[nextIndex]));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } else {
      setCurrentImage(null);
      setFilesToCrop([]);
      setCropIndex(0);
      setPendingFile(null);
      setCroppedAreaPixels(null);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  // Recrop image
  const handleRecropImage = (index: number) => {
    const img = images[index];
    if (img instanceof File) {
      setCropIndex(index);
      setPendingFile(img);
      setCurrentImage(URL.createObjectURL(img));
    } else if (typeof img === "string") {
      fetch(img)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "image.png", { type: blob.type });
          const updatedImages = [...images];
          updatedImages[index] = file;
          setImages(updatedImages);
          setCropIndex(index);
          setPendingFile(file);
          setCurrentImage(URL.createObjectURL(file));
        });
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 h-24 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 shadow-lg"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }
        `}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 text-center text-sm">
          {isDragActive
            ? "Drop the images here..."
            : multiple
            ? "Drag & drop images here, or click to select multiple"
            : "Drag & drop an image here, or click to select"}
        </p>
      </div>

      {/* Cropper Modal */}
      {currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 h-96 flex flex-col">
            <div className="relative flex-1 rounded-lg overflow-hidden border">
              <Cropper
                image={currentImage}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            {/* Zoom Slider */}
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-3 w-full "
            />

            <div className="flex justify-end mt-4 space-x-3">
              <button
                type="button"
                onClick={() => setCurrentImage(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview List */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-gray-300 cursor-pointer transform transition hover:scale-105"
              style={{
                aspectRatio: `${aspect}`,
                width: "120px",
              }}
              onClick={() => handleRecropImage(idx)}
            >
              <img
                src={img instanceof File ? URL.createObjectURL(img) : img}
                alt={`uploaded-${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(idx);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropzoneCrop;
