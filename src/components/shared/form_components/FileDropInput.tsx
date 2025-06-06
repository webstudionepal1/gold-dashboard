// import React, { useCallback, useState, useEffect } from "react";
// import { useDropzone } from "react-dropzone";

// interface FileDropInputProps {
//   label?: string;
//   value?: File | File[] | null;
//   onChange?: (files: File | File[] | null) => void;
//   multiple?: boolean;
// }

// const FileDropInput: React.FC<FileDropInputProps> = ({
//   label,
//   value,
//   onChange,
//   multiple = false,
// }) => {
//   // State to store file previews
//   const [previews, setPreviews] = useState<string[]>([]);

//   // Handle file drop
//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       if (acceptedFiles.length === 0) return;

//       // Create preview URLs
//       const previewUrls = acceptedFiles.map((file) =>
//         URL.createObjectURL(file)
//       );
//       setPreviews(previewUrls);

//       // Call onChange with the appropriate value
//       if (onChange) {
//         onChange(multiple ? acceptedFiles : acceptedFiles[0]);
//       }
//     },
//     [onChange, multiple]
//   );

//   // Setup dropzone
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple,
//   });

//   // Clean up object URLs on unmount or when files change
//   useEffect(() => {
//     return () => {
//       previews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [previews]);

//   // Determine what to display
//   const displayName = (): string => {
//     if (!value) return "";

//     if (Array.isArray(value)) {
//       return `${value.length} file${value.length !== 1 ? "s" : ""} selected`;
//     }

//     return value.name;
//   };

//   return (
//     <div className="flex flex-col space-y-2">
//       {label && (
//         <label className="text-sm font-medium text-gray-400">{label}</label>
//       )}

//       <div
//         {...getRootProps()}
//         className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer hover:border-orange-400 transition duration-200"
//       >
//         <input {...getInputProps()} />
//         <div className="flex flex-col items-center justify-center space-y-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//           >
//             <path
//               fill="currentColor"
//               d="M22 12.698c-.002 1.47-.013 2.718-.096 3.743c-.097 1.19-.296 2.184-.74 3.009a4.2 4.2 0 0 1-.73.983c-.833.833-1.893 1.21-3.237 1.39C15.884 22 14.2 22 12.053 22h-.106c-2.148 0-3.83 0-5.144-.177c-1.343-.18-2.404-.557-3.236-1.39c-.738-.738-1.12-1.656-1.322-2.795c-.2-1.12-.236-2.512-.243-4.241Q1.999 12.737 2 12v-.054c0-2.148 0-3.83.177-5.144c.18-1.343.557-2.404 1.39-3.236s1.893-1.21 3.236-1.39c1.168-.157 2.67-.175 4.499-.177a.697.697 0 1 1 0 1.396c-1.855.002-3.234.018-4.313.163c-1.189.16-1.906.464-2.436.994S3.72 5.8 3.56 6.99C3.397 8.2 3.395 9.788 3.395 12v.784l.932-.814a2.14 2.14 0 0 1 2.922.097l3.99 3.99a1.86 1.86 0 0 0 2.385.207l.278-.195a2.79 2.79 0 0 1 3.471.209l2.633 2.37c.265-.557.423-1.288.507-2.32c.079-.972.09-2.152.091-3.63a.698.698 0 0 1 1.396 0"
//             />
//             <path
//               fill="currentColor"
//               fillRule="evenodd"
//               d="M17.5 11c-2.121 0-3.182 0-3.841-.659S13 8.621 13 6.5s0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11m.75-6.5a.75.75 0 0 0-1.5 0v1.25H15.5a.75.75 0 0 0 0 1.5h1.25V8.5a.75.75 0 0 0 1.5 0V7.25h1.25a.75.75 0 0 0 0-1.5h-1.25z"
//               clipRule="evenodd"
//             />
//           </svg>
//           {isDragActive ? (
//             <p className="text-blue-600">Drop the file here...</p>
//           ) : value ? (
//             <p className="text-gray-600">{displayName()}</p>
//           ) : (
//             <p className="text-gray-500">
//               Drag and drop {multiple ? "files" : "a file"} here to upload
//             </p>
//           )}
//         </div>
//       </div>

//       {previews.length > 0 && (
//         <div className="grid grid-cols-6 gap-2 border-2 p-4 rounded-md">
//           {previews.map((preview, index) => (
//             <img
//               key={`preview-${index}`}
//               src={preview}
//               alt={`Preview ${index + 1}`}
//               className="w-10 h-10 object-cover rounded"
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileDropInput;

// Second iteration

// import type React from "react";
// import { useCallback, useState, useEffect } from "react";
// import { useDropzone } from "react-dropzone";

// interface FileDropInputProps {
//   label?: string;
//   value?: File | File[] | string | string[] | null;
//   onChange?: (files: File | File[] | null) => void;
//   multiple?: boolean;
//   existingImages?: string | string[]; // URLs of existing images
// }

// const FileDropInput: React.FC<FileDropInputProps> = ({
//   label,
//   value,
//   onChange,
//   multiple = false,
//   existingImages,
// }) => {
//   // State to store file previews (both new files and existing images)
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [objectUrls, setObjectUrls] = useState<string[]>([]); // Track object URLs for cleanup

//   // Handle file drop
//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       if (acceptedFiles.length === 0) return;

//       // Clean up previous object URLs
//       objectUrls.forEach((url) => URL.revokeObjectURL(url));

//       // Create preview URLs for new files
//       const previewUrls = acceptedFiles.map((file) =>
//         URL.createObjectURL(file)
//       );

//       setPreviews(previewUrls);
//       setObjectUrls(previewUrls);

//       // Call onChange with the appropriate value
//       if (onChange) {
//         onChange(multiple ? acceptedFiles : acceptedFiles[0]);
//       }
//     },
//     [onChange, multiple, objectUrls]
//   );

//   // Setup dropzone
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple,
//     accept: {
//       "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
//     },
//   });

//   // Initialize previews with existing images
//   useEffect(() => {
//     if (existingImages && !value) {
//       const imageUrls = Array.isArray(existingImages)
//         ? existingImages
//         : [existingImages];
//       setPreviews(imageUrls);
//       setObjectUrls([]); // No object URLs to clean up for existing images
//     }
//   }, [existingImages, value]);

//   // Clean up object URLs on unmount or when files change
//   useEffect(() => {
//     return () => {
//       objectUrls.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [objectUrls]);

//   // Determine what to display
//   const displayName = (): string => {
//     if (!value && !existingImages) return "";

//     // If we have new files
//     if (value) {
//       if (Array.isArray(value)) {
//         return `${value.length} file${value.length !== 1 ? "s" : ""} selected`;
//       }
//       if (value instanceof File) {
//         return value.name;
//       }
//     }

//     // If we have existing images but no new files
//     if (existingImages) {
//       if (Array.isArray(existingImages)) {
//         return `${existingImages.length} existing image${
//           existingImages.length !== 1 ? "s" : ""
//         }`;
//       }
//       return "1 existing image";
//     }

//     return "";
//   };

//   const hasContent = value || existingImages;

//   return (
//     <div className="flex flex-col space-y-2">
//       {label && (
//         <label className="text-sm font-medium text-gray-400">{label}</label>
//       )}

//       <div
//         {...getRootProps()}
//         className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition duration-200 ${
//           isDragActive
//             ? "border-orange-400 bg-orange-50"
//             : hasContent
//             ? "border-green-300 hover:border-orange-400"
//             : "border-gray-300 hover:border-orange-400"
//         }`}
//       >
//         <input {...getInputProps()} />
//         <div className="flex flex-col items-center justify-center space-y-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             className={hasContent ? "text-green-600" : "text-gray-400"}
//           >
//             <path
//               fill="currentColor"
//               d="M22 12.698c-.002 1.47-.013 2.718-.096 3.743c-.097 1.19-.296 2.184-.74 3.009a4.2 4.2 0 0 1-.73.983c-.833.833-1.893 1.21-3.237 1.39C15.884 22 14.2 22 12.053 22h-.106c-2.148 0-3.83 0-5.144-.177c-1.343-.18-2.404-.557-3.236-1.39c-.738-.738-1.12-1.656-1.322-2.795c-.2-1.12-.236-2.512-.243-4.241Q1.999 12.737 2 12v-.054c0-2.148 0-3.83.177-5.144c.18-1.343.557-2.404 1.39-3.236s1.893-1.21 3.236-1.39c1.168-.157 2.67-.175 4.499-.177a.697.697 0 1 1 0 1.396c-1.855.002-3.234.018-4.313.163c-1.189.16-1.906.464-2.436.994S3.72 5.8 3.56 6.99C3.397 8.2 3.395 9.788 3.395 12v.784l.932-.814a2.14 2.14 0 0 1 2.922.097l3.99 3.99a1.86 1.86 0 0 0 2.385.207l.278-.195a2.79 2.79 0 0 1 3.471.209l2.633 2.37c.265-.557.423-1.288.507-2.32c.079-.972.09-2.152.091-3.63a.698.698 0 0 1 1.396 0"
//             />
//             <path
//               fill="currentColor"
//               fillRule="evenodd"
//               d="M17.5 11c-2.121 0-3.182 0-3.841-.659S13 8.621 13 6.5s0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11m.75-6.5a.75.75 0 0 0-1.5 0v1.25H15.5a.75.75 0 0 0 0 1.5h1.25V8.5a.75.75 0 0 0 1.5 0V7.25h1.25a.75.75 0 0 0 0-1.5h-1.25z"
//               clipRule="evenodd"
//             />
//           </svg>
//           {isDragActive ? (
//             <p className="text-orange-600">Drop the file here...</p>
//           ) : hasContent ? (
//             <div className="space-y-1">
//               <p className="text-gray-600">{displayName()}</p>
//               <p className="text-sm text-gray-400">
//                 Drop {multiple ? "new files" : "a new file"} here to replace
//               </p>
//             </div>
//           ) : (
//             <p className="text-gray-500">
//               Drag and drop {multiple ? "files" : "a file"} here to upload
//             </p>
//           )}
//         </div>
//       </div>

//       {previews.length > 0 && (
//         <div className="grid grid-cols-6 gap-2 border-2 p-4 rounded-md bg-gray-50">
//           <div className="col-span-6 mb-2">
//             <p className="text-sm font-medium text-gray-600">
//               {value ? "New Upload Preview:" : "Current Images:"}
//             </p>
//           </div>
//           {previews.map((preview, index) => (
//             <div key={`preview-${index}`} className="relative group">
//               <img
//                 src={preview || "/placeholder.svg"}
//                 alt={`Preview ${index + 1}`}
//                 className="w-16 h-16 object-cover rounded border-2 border-gray-200"
//                 crossOrigin="anonymous"
//               />
//               {!value && existingImages && (
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
//                   <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     Current
//                   </span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileDropInput;

"use client";

import type { FC } from "react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropInputProps {
  label?: string;
  value?: File | File[] | string | string[] | null;
  onChange?: (files: File | File[] | null) => void;
  multiple?: boolean;
  existingImages?: string | string[]; // URLs of existing images
}

const FileDropInput: FC<FileDropInputProps> = ({
  label,
  value,
  onChange,
  multiple = false,
  existingImages,
}) => {
  // State to store file previews (both new files and existing images)
  const [previews, setPreviews] = useState<string[]>([]);
  const [objectUrls, setObjectUrls] = useState<string[]>([]); // Track object URLs for cleanup

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Clean up previous object URLs
      objectUrls.forEach((url) => URL.revokeObjectURL(url));

      // Create preview URLs for new files
      const newPreviewUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setPreviews(newPreviewUrls);
      setObjectUrls(newPreviewUrls);

      // Call onChange with the appropriate value
      if (onChange) {
        onChange(multiple ? acceptedFiles : acceptedFiles[0]);
      }
    },
    [onChange, multiple, objectUrls]
  );

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
  });

  // Generate previews when value changes
  useEffect(() => {
    // Clean up previous object URLs
    objectUrls.forEach((url) => URL.revokeObjectURL(url));

    let newPreviews: string[] = [];
    let newObjectUrls: string[] = [];

    // Handle File objects in value
    if (value) {
      if (value instanceof File) {
        // Single file
        const objectUrl = URL.createObjectURL(value);
        newPreviews = [objectUrl];
        newObjectUrls = [objectUrl];
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        value[0] instanceof File
      ) {
        // Array of files
        const urls = value
          .map((file) => {
            if (file instanceof File) {
              const url = URL.createObjectURL(file);
              newObjectUrls.push(url);
              return url;
            }
            return "";
          })
          .filter(Boolean);
        newPreviews = urls;
      } else if (typeof value === "string") {
        // String URL
        newPreviews = [value];
      } else if (Array.isArray(value) && typeof value[0] === "string") {
        // Array of string URLs
        newPreviews = value as string[];
      }
    }
    // If no new value but we have existing images
    else if (existingImages && !value) {
      if (typeof existingImages === "string") {
        newPreviews = [existingImages];
      } else {
        newPreviews = existingImages;
      }
    }

    setPreviews(newPreviews);
    setObjectUrls(newObjectUrls);
  }, [value, existingImages]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Determine what to display
  const displayName = (): string => {
    if (!value && !existingImages) return "";

    // If we have new files
    if (value) {
      if (Array.isArray(value)) {
        return `${value.length} file${value.length !== 1 ? "s" : ""} selected`;
      }
      if (value instanceof File) {
        return value.name;
      }
    }

    // If we have existing images but no new files
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        return `${existingImages.length} existing image${
          existingImages.length !== 1 ? "s" : ""
        }`;
      }
      return "1 existing image";
    }

    return "";
  };

  const hasContent = value || existingImages;

  return (
    <div className="flex flex-col space-y-4">
      {label && (
        <label className="text-sm font-medium text-gray-400">{label}</label>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition duration-200 ${
          isDragActive
            ? "border-orange-400 bg-orange-50"
            : hasContent
            ? "border-green-300 hover:border-orange-400"
            : "border-gray-300 hover:border-orange-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={hasContent ? "text-green-600" : "text-gray-400"}
          >
            <path
              fill="currentColor"
              d="M22 12.698c-.002 1.47-.013 2.718-.096 3.743c-.097 1.19-.296 2.184-.74 3.009a4.2 4.2 0 0 1-.73.983c-.833.833-1.893 1.21-3.237 1.39C15.884 22 14.2 22 12.053 22h-.106c-2.148 0-3.83 0-5.144-.177c-1.343-.18-2.404-.557-3.236-1.39c-.738-.738-1.12-1.656-1.322-2.795c-.2-1.12-.236-2.512-.243-4.241Q1.999 12.737 2 12v-.054c0-2.148 0-3.83.177-5.144c.18-1.343.557-2.404 1.39-3.236s1.893-1.21 3.236-1.39c1.168-.157 2.67-.175 4.499-.177a.697.697 0 1 1 0 1.396c-1.855.002-3.234.018-4.313.163c-1.189.16-1.906.464-2.436.994S3.72 5.8 3.56 6.99C3.397 8.2 3.395 9.788 3.395 12v.784l.932-.814a2.14 2.14 0 0 1 2.922.097l3.99 3.99a1.86 1.86 0 0 0 2.385.207l.278-.195a2.79 2.79 0 0 1 3.471.209l2.633 2.37c.265-.557.423-1.288.507-2.32c.079-.972.09-2.152.091-3.63a.698.698 0 0 1 1.396 0"
            />
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M17.5 11c-2.121 0-3.182 0-3.841-.659S13 8.621 13 6.5s0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11m.75-6.5a.75.75 0 0 0-1.5 0v1.25H15.5a.75.75 0 0 0 0 1.5h1.25V8.5a.75.75 0 0 0 1.5 0V7.25h1.25a.75.75 0 0 0 0-1.5h-1.25z"
              clipRule="evenodd"
            />
          </svg>
          {isDragActive ? (
            <p className="text-orange-600">Drop the file here...</p>
          ) : hasContent ? (
            <div className="space-y-1">
              <p className="text-gray-600">{displayName()}</p>
              <p className="text-sm text-gray-400">
                Drop {multiple ? "new files" : "a new file"} here to replace
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Drag and drop {multiple ? "files" : "a file"} here to upload
            </p>
          )}
        </div>
      </div>

      {/* Preview section - enhanced for better visibility */}
      {previews.length > 0 && (
        <div className="border-2 p-4 rounded-md bg-gray-50">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-600">
              {value ? "Preview:" : "Current Images:"}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {previews.map((preview, index) => (
              <div
                key={`preview-${index}`}
                className="relative group aspect-square"
              >
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded border-2 border-gray-200"
                  crossOrigin="anonymous"
                />
                {!value && existingImages && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Current
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropInput;
