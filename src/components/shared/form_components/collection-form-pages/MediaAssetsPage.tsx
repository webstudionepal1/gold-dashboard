// import React, { useState } from 'react';
// import { Icon } from '@iconify/react/dist/iconify.js';
// import FileDropInput from '../FileDropInput';
// import VideoUploadField from '../VideoUploadField';
// import { useMultiPageForm } from '../MultiPageFormContext';

// export const MediaAssetsPage: React.FC = () => {
//   const { formData, updateFormData, updateValidation, validationState } =
//     useMultiPageForm();

//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [bannerImage, setBannerImage] = useState<File | null>(null);
//   const [videoFile, setVideoFile] = useState<File | null>(null);

//   console.log(formData.images, 'existing images from formData');

//   console.log(selectedImages, 'selected images from state');

//   // Handle multiple image uploads for collection gallery
//   const handleImageUpload = (files: File[]) => {
//     console.log(files, 'files');
//     setSelectedImages((prevImages) => [...prevImages, ...files]);

//     // Validate images first
//     const errors: string[] = [];
//     if (files && files.length > 10) {
//       errors.push('Maximum 10 images allowed');
//       updateValidation('images', false, errors);
//       return;
//     }

//     if (files && files.length > 0) {
//       // Store actual File objects instead of uploading immediately
//       updateFormData({ images: files });
//       updateValidation('images', true, []);
//     } else {
//       updateFormData({ images: [] });
//       updateValidation('images', true, []);
//     }
//   };

//   // Handle banner image upload
//   const handleBannerImageUpload = (file: File | null) => {
//     setBannerImage(file);

//     if (file) {
//       // Store actual File object instead of uploading immediately
//       updateFormData({ bannerImage: file });
//       updateValidation('bannerImage', true, []);
//     } else {
//       updateFormData({ bannerImage: null });
//       updateValidation('bannerImage', true, []);
//     }
//   };

//   // Handle video upload
//   const handleVideoUpload = (file: File | null) => {
//     setVideoFile(file);

//     if (file) {
//       // Store actual File object instead of uploading immediately
//       updateFormData({ video: file });
//       updateValidation('video', true, []);
//     } else {
//       updateFormData({ video: null });
//       updateValidation('video', true, []);
//     }
//   };

//   // Handle video upload error
//   const handleVideoUploadError = (error: string) => {
//     updateValidation('video', false, [error]);
//   };

//   return (
//     <div className="w-full min-w-0 overflow-x-hidden">
//       <div className="space-y-6">
//         {/* Page Header */}
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-3 mb-3">
//             <Icon
//               icon="material-symbols:image"
//               className="w-6 h-6 text-customorange"
//             />
//             <h2 className="text-xl font-bold text-gray-900">Media & Assets</h2>
//           </div>
//           <p className="text-gray-600 text-sm max-w-md mx-auto">
//             Upload images and videos to showcase your collection.
//           </p>
//         </div>

//         {/* Form Fields */}
//         <div className="w-full space-y-6">
//           {/* Collection Images Gallery */}
//           <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <Icon
//                 icon="material-symbols:photo-library"
//                 className="w-5 h-5 text-customorange"
//               />
//               Collection Gallery Images
//             </h3>

//             <div className="space-y-4">
//               <p className="text-sm text-gray-600">
//                 Upload multiple images to create a beautiful gallery for your
//                 collection. These images will be displayed on the collection
//                 page.
//               </p>

//               {/* Multiple Image Upload */}
//               <div className="space-y-4">
//                 <FileDropInput
//                   multiple={true}
//                   label="Collection Images"
//                   value={selectedImages}
//                   onChange={handleImageUpload}
//                   existingFiles={
//                     typeof formData.images === 'object'
//                       ? (formData.images as unknown as string[])
//                       : []
//                   }
//                   maxFiles={10}
//                   placeholder="Drag and drop or click to select multiple images"
//                 />

//                 {/* Image Preview Grid */}
//                 {/* {selectedImages.length > 0 && (
//                   <div className="w-full min-w-0">
//                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
//                       {selectedImages.map((file, index) => (
//                         <div
//                           key={index}
//                           className="relative group aspect-square min-w-0"
//                         >
//                           <img
//                             src={URL.createObjectURL(file)}
//                             alt={`Gallery ${index + 1}`}
//                             className="w-full h-full object-cover rounded-lg border border-gray-200"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               const newImages = selectedImages.filter(
//                                 (_, i) => i !== index
//                               );
//                               handleImageUpload(newImages);
//                             }}
//                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs"
//                           >
//                             ×
//                           </button>
//                           <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
//                             {index + 1}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )} */}

//                 {/* Validation Errors */}
//                 {validationState.images?.errors.map((error, index) => (
//                   <p
//                     key={index}
//                     className="text-red-500 text-sm flex items-center gap-1"
//                   >
//                     <Icon icon="material-symbols:error" className="w-4 h-4" />
//                     {error}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Banner Image */}
//           <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <Icon
//                 icon="basil:image-outline"
//                 className="h-5 w-5 text-customorange"
//               />
//               Collection Banner Image
//             </h3>

//             <div className="space-y-4">
//               <p className="text-sm text-gray-600">
//                 Upload a hero banner image that will be prominently displayed at
//                 the top of your collection page. This should be your best, most
//                 eye-catching image.
//               </p>

//               <FileDropInput
//                 multiple={false}
//                 label="Banner Image"
//                 value={bannerImage}
//                 onChange={handleBannerImageUpload}
//                 existingImageUrl={
//                   typeof formData.bannerImage === 'string'
//                     ? formData.bannerImage
//                     : undefined
//                 }
//               />

//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <h4 className="font-medium text-gray-900 mb-2">
//                   Banner Image Guidelines:
//                 </h4>
//                 <ul className="text-sm text-gray-600 space-y-1 mx-2">
//                   <li>Recommended size: 1920x600 pixels (16:5 aspect ratio)</li>
//                   <li>High resolution for crisp display on all devices</li>
//                   <li>
//                     Avoid text overlay as it may not be readable on mobile
//                   </li>
//                   <li>Use your most compelling product or lifestyle image</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Video Upload */}
//           <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <Icon
//                 icon="material-symbols:video-library"
//                 className="w-5 h-5 text-customorange"
//               />
//               Collection Video (Optional)
//             </h3>

//             <div className="space-y-4">
//               <p className="text-sm text-gray-600">
//                 Add a video to bring your collection to life. Videos can
//                 showcase the craftsmanship, styling options, or the story behind
//                 your collection.
//               </p>

//               <VideoUploadField
//                 label="Collection Video"
//                 value={videoFile}
//                 onChange={handleVideoUpload}
//                 onUploadError={handleVideoUploadError}
//                 maxFileSize={200}
//                 existingVideoUrl={
//                   typeof formData.video === 'string'
//                     ? formData.video
//                     : undefined
//                 }
//               />

//               <div className="bg-white rounded-lg p-4 border border-gray-200">
//                 <h4 className="font-medium text-gray-900 mb-2">
//                   Video Guidelines:
//                 </h4>
//                 <ul className="text-sm text-gray-600 space-y-1 mx-2">
//                   <li>Maximum file size: 200MB</li>
//                   <li>Recommended duration: 30-90 seconds</li>
//                   <li>Supported formats: MP4, WebM, AVI, MOV</li>
//                   <li>Landscape orientation (16:9) works best</li>
//                   <li>Consider adding captions for accessibility</li>
//                 </ul>
//               </div>

//               {/* Validation Errors */}
//               {validationState.video?.errors.map((error, index) => (
//                 <p
//                   key={index}
//                   className="text-red-500 text-sm flex items-center gap-1"
//                 >
//                   <Icon icon="material-symbols:error" className="w-4 h-4" />
//                   {error}
//                 </p>
//               ))}
//             </div>
//           </div>

//           {/* Media Summary */}
//           {(selectedImages.length > 0 || bannerImage || videoFile) && (
//             <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//               <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                 <Icon
//                   icon="material-symbols:summarize"
//                   className="w-5 h-5 text-gray-600"
//                 />
//                 Media Summary
//               </h4>
//               <div className="w-full min-w-0">
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
//                   <div className="bg-white rounded-lg p-3 border border-gray-200 min-w-0">
//                     <p className="font-medium text-gray-700 truncate">
//                       Gallery Images
//                     </p>
//                     <p className="text-gray-600 truncate">
//                       {selectedImages.length} images selected
//                     </p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3 border border-gray-200 min-w-0">
//                     <p className="font-medium text-gray-700 truncate">
//                       Banner Image
//                     </p>
//                     <p className="text-gray-600 truncate">
//                       {bannerImage ? '✓ Uploaded' : 'Not uploaded'}
//                     </p>
//                   </div>
//                   <div className="bg-white rounded-lg p-3 border border-gray-200 min-w-0">
//                     <p className="font-medium text-gray-700 truncate">
//                       Collection Video
//                     </p>
//                     <p className="text-gray-600 truncate">
//                       {videoFile ? '✓ Uploaded' : 'Not uploaded'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Help Section */}
//           <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
//             <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <Icon
//                 icon="material-symbols:help"
//                 className="w-5 h-5 text-customorange"
//               />
//               Media Best Practices
//             </h4>
//             <div className="space-y-2 text-sm text-gray-600">
//               <p>
//                 • <strong>Quality over quantity:</strong> Use high-resolution,
//                 well-lit images that showcase your products beautifully
//               </p>
//               <p>
//                 • <strong>Consistent style:</strong> Maintain a consistent
//                 photography style across all images for a professional look
//               </p>
//               <p>
//                 • <strong>Multiple angles:</strong> Include various angles and
//                 close-up details to give customers a complete view
//               </p>
//               <p>
//                 • <strong>Lifestyle shots:</strong> Mix product shots with
//                 lifestyle images showing items being worn or used
//               </p>
//               <p>
//                 • <strong>Mobile optimization:</strong> Ensure images look great
//                 on mobile devices where most customers browse
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import FileDropInput from '../FileDropInput';
import VideoUploadField from '../VideoUploadField';
import { useMultiPageForm } from '../MultiPageFormContext';

export const MediaAssetsPage: React.FC = () => {
  const { formData, updateFormData, updateValidation, validationState } =
    useMultiPageForm();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Initialize local state from formData on component mount
  useEffect(() => {
    if (formData.images && Array.isArray(formData.images)) {
      // Only set if they are File objects (not URLs)
      const fileObjects = formData.images.filter((img) => img instanceof File);
      setSelectedImages(fileObjects);
    }

    if (formData.bannerImage && formData.bannerImage instanceof File) {
      setBannerImage(formData.bannerImage);
    }

    if (formData.video && formData.video instanceof File) {
      setVideoFile(formData.video);
    }
  }, []); // Only run once on mount

  // Handle multiple image uploads for collection gallery
  const handleImageUpload = (files: File[]) => {
    console.log('New files received:', files);

    // Get existing images from formData (these could be URLs or File objects)
    const existingImages = Array.isArray(formData.images)
      ? formData.images
      : [];

    // Combine existing images with new files
    const allImages = [...existingImages, ...files];

    // Validate total count
    const errors: string[] = [];
    if (allImages.length > 10) {
      errors.push('Maximum 10 images allowed');
      updateValidation('images', false, errors);
      return;
    }

    // Update local state with only new File objects
    setSelectedImages((prev) => [...prev, ...files]);

    // Update form data with all images (existing + new)
    updateFormData({ images: allImages });
    updateValidation('images', true, []);
  };

  // Handle removing a specific image
  const handleRemoveImage = (index: number, isExisting: boolean) => {
    console.log('hello');
    const existingImages = Array.isArray(formData.images)
      ? formData.images
      : [];

    if (isExisting) {
      // Remove from existing images (these are URLs)
      const existingUrls = existingImages.filter(
        (img) => typeof img === 'string'
      );
      const newExistingUrls = existingUrls.filter((_, i) => i !== index);

      // Keep all File objects and update with remaining URLs
      const fileObjects = existingImages.filter((img) => img instanceof File);
      const updatedImages = [...newExistingUrls, ...fileObjects];

      updateFormData({ images: updatedImages });
    } else {
      // Remove from newly selected files
      const newSelectedImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(newSelectedImages);

      // Update formData - keep existing URLs but update File objects
      const existingUrls = existingImages.filter(
        (img) => typeof img === 'string'
      );
      const updatedImages = [...existingUrls, ...newSelectedImages];

      updateFormData({ images: updatedImages });
    }
  };

  // Handle banner image upload
  const handleBannerImageUpload = (file: File | null) => {
    setBannerImage(file);
    updateFormData({ bannerImage: file });
    updateValidation('bannerImage', true, []);
  };

  // Handle video upload
  const handleVideoUpload = (file: File | null) => {
    setVideoFile(file);
    updateFormData({ video: file });
    updateValidation('video', true, []);
  };

  // Handle video upload error
  const handleVideoUploadError = (error: string) => {
    updateValidation('video', false, [error]);
  };

  // Get existing image URLs for display
  const getExistingImageUrls = (): string[] => {
    if (!Array.isArray(formData.images)) return [];
    return formData.images.filter((img) => typeof img === 'string') as string[];
  };

  // Get total image count for display
  const getTotalImageCount = () => {
    const existingCount = getExistingImageUrls().length;
    const selectedCount = selectedImages.length;
    return existingCount + selectedCount;
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Icon
              icon="material-symbols:image"
              className="w-6 h-6 text-customorange"
            />
            <h2 className="text-xl font-bold text-gray-900">Media & Assets</h2>
          </div>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Upload images and videos to showcase your collection.
          </p>
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-6">
          {/* Collection Images Gallery */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon
                icon="material-symbols:photo-library"
                className="w-5 h-5 text-customorange"
              />
              Collection Gallery Images ({getTotalImageCount()}/10)
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload multiple images to create a beautiful gallery for your
                collection. These images will be displayed on the collection
                page.
              </p>

              {/* Multiple Image Upload */}
              <div className="space-y-4">
                <FileDropInput
                  multiple={true}
                  label="Collection Images"
                  value={selectedImages}
                  onChange={handleImageUpload}
                  existingFiles={getExistingImageUrls()}
                  maxFiles={10}
                  showPreview={false}
                  placeholder="Drag and drop or click to select multiple images"
                />

                {/* Image Preview Grid */}
                {(getExistingImageUrls().length > 0 ||
                  selectedImages.length > 0) && (
                  <div className="w-full min-w-0">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Images ({getTotalImageCount()})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                      {/* Existing Images */}
                      {getExistingImageUrls().map((imageUrl, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative group aspect-square min-w-0"
                        >
                          <img
                            src={`${
                              import.meta.env.VITE_API_IMAGE_BASE_URL
                            }${imageUrl}`}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, true)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-blue-500 bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                            E{index + 1}
                          </div>
                        </div>
                      ))}

                      {/* New Selected Images */}
                      {selectedImages.map((file, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative group aspect-square min-w-0"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, false)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 text-xs"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-500 bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                            N{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {validationState.images?.errors.map((error, index) => (
                  <p
                    key={index}
                    className="text-red-500 text-sm flex items-center gap-1"
                  >
                    <Icon icon="material-symbols:error" className="w-4 h-4" />
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Banner Image */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="basil:image-outline"
                className="h-5 w-5 text-customorange"
              />
              Collection Banner Image
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload a hero banner image that will be prominently displayed at
                the top of your collection page. This should be your best, most
                eye-catching image.
              </p>

              <FileDropInput
                multiple={false}
                label="Banner Image"
                value={bannerImage}
                onChange={handleBannerImageUpload}
                existingImageUrl={
                  typeof formData.bannerImage === 'string'
                    ? formData.bannerImage
                    : undefined
                }
              />

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Banner Image Guidelines:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 mx-2">
                  <li>Recommended size: 1920x600 pixels (16:5 aspect ratio)</li>
                  <li>High resolution for crisp display on all devices</li>
                  <li>
                    Avoid text overlay as it may not be readable on mobile
                  </li>
                  <li>Use your most compelling product or lifestyle image</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon
                icon="material-symbols:video-library"
                className="w-5 h-5 text-customorange"
              />
              Collection Video (Optional)
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add a video to bring your collection to life. Videos can
                showcase the craftsmanship, styling options, or the story behind
                your collection.
              </p>

              <VideoUploadField
                label="Collection Video"
                value={videoFile}
                onChange={handleVideoUpload}
                onUploadError={handleVideoUploadError}
                maxFileSize={200}
                existingVideoUrl={
                  typeof formData.video === 'string'
                    ? formData.video
                    : undefined
                }
              />

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Video Guidelines:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 mx-2">
                  <li>Maximum file size: 200MB</li>
                  <li>Recommended duration: 30-90 seconds</li>
                  <li>Supported formats: MP4, WebM, AVI, MOV</li>
                  <li>Landscape orientation (16:9) works best</li>
                  <li>Consider adding captions for accessibility</li>
                </ul>
              </div>

              {/* Validation Errors */}
              {validationState.video?.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-red-500 text-sm flex items-center gap-1"
                >
                  <Icon icon="material-symbols:error" className="w-4 h-4" />
                  {error}
                </p>
              ))}
            </div>
          </div>

          {/* Media Summary */}
          {(getTotalImageCount() > 0 || bannerImage || videoFile) && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon
                  icon="material-symbols:summarize"
                  className="w-5 h-5 text-gray-600"
                />
                Media Summary
              </h4>
              <div className="w-full min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-gray-200 min-w-0">
                    <p className="font-medium text-gray-700 truncate">
                      Gallery Images
                    </p>
                    <p className="text-gray-600 truncate">
                      {getTotalImageCount()} images selected
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 min-w-0">
                    <p className="font-medium text-gray-700 truncate">
                      Banner Image
                    </p>
                    <p className="text-gray-600 truncate">
                      {bannerImage ||
                      (typeof formData.bannerImage === 'string' &&
                        formData.bannerImage)
                        ? '✓ Uploaded'
                        : 'Not uploaded'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 min-w-0">
                    <p className="font-medium text-gray-700 truncate">
                      Collection Video
                    </p>
                    <p className="text-gray-600 truncate">
                      {videoFile ||
                      (typeof formData.video === 'string' && formData.video)
                        ? '✓ Uploaded'
                        : 'Not uploaded'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon
                icon="material-symbols:help"
                className="w-5 h-5 text-customorange"
              />
              Media Best Practices
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • <strong>Quality over quantity:</strong> Use high-resolution,
                well-lit images that showcase your products beautifully
              </p>
              <p>
                • <strong>Consistent style:</strong> Maintain a consistent
                photography style across all images for a professional look
              </p>
              <p>
                • <strong>Multiple angles:</strong> Include various angles and
                close-up details to give customers a complete view
              </p>
              <p>
                • <strong>Lifestyle shots:</strong> Mix product shots with
                lifestyle images showing items being worn or used
              </p>
              <p>
                • <strong>Mobile optimization:</strong> Ensure images look great
                on mobile devices where most customers browse
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
