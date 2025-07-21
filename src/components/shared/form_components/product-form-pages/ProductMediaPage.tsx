import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useProductForm } from "../ProductFormContext";

export const ProductMediaPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useProductForm();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Handle multiple image uploads
  const handleImageUpload = (files: File[]) => {
    // Limit to 10 images total
    const maxImages = 10;
    const currentImageCount = selectedImages.length;
    const availableSlots = maxImages - currentImageCount;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length < files.length) {
      updateValidation("images", false, [
        `Maximum ${maxImages} images allowed. Only ${filesToAdd.length} images were added.`,
      ]);
    } else {
      updateValidation("images", true, []);
    }

    const newImages = [...selectedImages, ...filesToAdd];
    setSelectedImages(newImages);

    // Convert files to URLs for form data (in real app, upload to server first)
    const imageUrls = newImages.map((file) => URL.createObjectURL(file));
    updateFormData({ images: imageUrls });
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleImageUpload(files);
    }
  };

  // Handle drag and drop
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleImageUpload(files);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    const imageUrls = newImages.map((file) => URL.createObjectURL(file));
    updateFormData({ images: imageUrls });

    // Clear validation errors if we're now within limits
    if (newImages.length <= 10) {
      updateValidation("images", true, []);
    }
  };

  // Reorder images
  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...selectedImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setSelectedImages(newImages);

    const imageUrls = newImages.map((file) => URL.createObjectURL(file));
    updateFormData({ images: imageUrls });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Icon
            icon="material-symbols:image"
            className="w-6 h-6 text-customorange"
          />
          <h2 className="text-xl font-bold text-gray-900">Product Media</h2>
        </div>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Upload high-quality images to showcase your product from different
          angles.
        </p>
      </div>

      {/* Form Fields */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Image Upload Section */}
        <div className=" bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:photo-library"
              className="w-5 h-5 text-customorange"
            />
            Product Images ({selectedImages.length}/10)
          </h3>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-customorange bg-blue-50"
                : "border-customorange hover:border-customorangedark"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              id="product-images"
              disabled={selectedImages.length >= 10}
            />
            <label
              htmlFor="product-images"
              className={`cursor-pointer ${
                selectedImages.length >= 10
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Icon
                  icon="material-symbols:add-photo-alternate"
                  className="w-12 h-12 text-customorange"
                />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {selectedImages.length >= 10
                      ? "Maximum images reached"
                      : "Upload Product Images"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedImages.length >= 10
                      ? "Remove some images to add more"
                      : "Click to select or drag and drop images here"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 10 images • JPG, PNG, WebP • Max 5MB each
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Image Preview Grid */}
          {selectedImages.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />

                      {/* Primary Image Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-[#DF8D28] text-white text-xs px-2 py-1 rounded-md font-medium">
                          Primary
                        </div>
                      )}

                      {/* Image Controls */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          {/* Move Left */}
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Icon
                                icon="material-symbols:chevron-left"
                                className="w-4 h-4"
                              />
                            </button>
                          )}

                          {/* Move Right */}
                          {index < selectedImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              className="bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Icon
                                icon="material-symbols:chevron-right"
                                className="w-4 h-4"
                              />
                            </button>
                          )}

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <Icon
                              icon="material-symbols:close"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-500 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Order Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <Icon icon="material-symbols:info" className="w-4 h-4" />
                  The first image will be used as the primary product image.
                  Drag images to reorder them.
                </p>
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationState.images?.errors.map((error, index) => (
            <div
              key={index}
              className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
            >
              <p className="text-red-600 text-sm flex items-center gap-2">
                <Icon icon="material-symbols:error" className="w-4 h-4" />
                {error}
              </p>
            </div>
          ))}
        </div>

        {/* Image Guidelines */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon
              icon="material-symbols:photo-camera"
              className="w-5 h-5 text-customorange"
            />
            Photography Guidelines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Essential Shots
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Front view (primary image)</li>
                <li>Back view</li>
                <li>Side profiles</li>
                <li>Close-up details</li>
                <li>Lifestyle/wearing shots</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quality Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Use natural lighting when possible</li>
                <li>Maintain consistent background</li>
                <li>Ensure sharp focus</li>
                <li>Show true colors</li>
                <li>Include scale references</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Icon
              icon="material-symbols:help"
              className="w-5 h-5 text-customorange"
            />
            Image Best Practices
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Primary Image:</strong> Use your best, most
              representative image as the first one
            </p>
            <p>
              • <strong>Multiple Angles:</strong> Show your product from
              different perspectives to give customers a complete view
            </p>
            <p>
              • <strong>Detail Shots:</strong> Include close-ups of important
              features, textures, or craftsmanship
            </p>
            <p>
              • <strong>Consistent Style:</strong> Maintain similar lighting and
              background across all images
            </p>
            <p>
              • <strong>File Size:</strong> Optimize images for web while
              maintaining quality (recommended: under 2MB each)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
