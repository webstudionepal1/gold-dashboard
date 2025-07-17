// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";

// const FileDropInput: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       setFile(acceptedFiles[0]);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: false,
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer hover:border-blue-500 transition duration-200"
//     >
//       <input {...getInputProps()} />
//       <div className="flex flex-col items-center justify-center space-y-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//         >
//           <path
//             fill="currentColor"
//             d="M22 12.698c-.002 1.47-.013 2.718-.096 3.743c-.097 1.19-.296 2.184-.74 3.009a4.2 4.2 0 0 1-.73.983c-.833.833-1.893 1.21-3.237 1.39C15.884 22 14.2 22 12.053 22h-.106c-2.148 0-3.83 0-5.144-.177c-1.343-.18-2.404-.557-3.236-1.39c-.738-.738-1.12-1.656-1.322-2.795c-.2-1.12-.236-2.512-.243-4.241Q1.999 12.737 2 12v-.054c0-2.148 0-3.83.177-5.144c.18-1.343.557-2.404 1.39-3.236s1.893-1.21 3.236-1.39c1.168-.157 2.67-.175 4.499-.177a.697.697 0 1 1 0 1.396c-1.855.002-3.234.018-4.313.163c-1.189.16-1.906.464-2.436.994S3.72 5.8 3.56 6.99C3.397 8.2 3.395 9.788 3.395 12v.784l.932-.814a2.14 2.14 0 0 1 2.922.097l3.99 3.99a1.86 1.86 0 0 0 2.385.207l.278-.195a2.79 2.79 0 0 1 3.471.209l2.633 2.37c.265-.557.423-1.288.507-2.32c.079-.972.09-2.152.091-3.63a.698.698 0 0 1 1.396 0"
//           />
//           <path
//             fill="currentColor"
//             fill-rule="evenodd"
//             d="M17.5 11c-2.121 0-3.182 0-3.841-.659S13 8.621 13 6.5s0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11m.75-6.5a.75.75 0 0 0-1.5 0v1.25H15.5a.75.75 0 0 0 0 1.5h1.25V8.5a.75.75 0 0 0 1.5 0V7.25h1.25a.75.75 0 0 0 0-1.5h-1.25z"
//             clip-rule="evenodd"
//           />
//         </svg>
//         {isDragActive ? (
//           <p className="text-blue-600">Drop the file here...</p>
//         ) : file ? (
//           <p className="text-gray-600">{file.name}</p>
//         ) : (
//           <p className="text-gray-500">Drag and drop a file here to upload</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileDropInput;

// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";

// interface FileDropInputProps {
//   label?: string;
// }

// const FileDropInput: React.FC<FileDropInputProps> = ({ label }) => {
//   const [file, setFile] = useState<File | null>(null);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       setFile(acceptedFiles[0]);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: false,
//   });

//   return (
//     <div className="flex flex-col space-y-2">
//       {label && (
//         <label className="text-sm font-medium text-[#b7b7b7]">{label}</label>
//       )}

//       <div
//         {...getRootProps()}
//         className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer hover:border-[#e08c28] transition duration-200"
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
//               fill-rule="evenodd"
//               d="M17.5 11c-2.121 0-3.182 0-3.841-.659S13 8.621 13 6.5s0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11m.75-6.5a.75.75 0 0 0-1.5 0v1.25H15.5a.75.75 0 0 0 0 1.5h1.25V8.5a.75.75 0 0 0 1.5 0V7.25h1.25a.75.75 0 0 0 0-1.5h-1.25z"
//               clip-rule="evenodd"
//             />
//           </svg>
//           {isDragActive ? (
//             <p className="text-blue-600">Drop the file here...</p>
//           ) : file ? (
//             <p className="text-gray-600">{file.name}</p>
//           ) : (
//             <p className="text-gray-500">Drag and drop a file here to upload</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileDropInput;

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropInputProps {
  label?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  existingImageUrl?: string; // For editing existing banners
}

const FileDropInput: React.FC<FileDropInputProps> = ({
  label,
  value,
  onChange,
  existingImageUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create preview URL when file changes
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (existingImageUrl) {
      setPreviewUrl(existingImageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [value, existingImageUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);

        if (onChange) {
          onChange(file);
        }
      }
    },
    [onChange]
  );

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (onChange) {
      onChange(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
  });

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-[#b7b7b7]">{label}</label>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors">
            ×
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition duration-200 ${
          previewUrl
            ? "border-green-300 bg-green-50 p-6"
            : "border-gray-300 hover:border-[#e08c28]"
        }`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={previewUrl ? "text-green-600" : "text-gray-600"}>
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
            <p className="text-blue-600">Drop the image here...</p>
          ) : previewUrl ? (
            <div className="text-center">
              <p className="text-green-600 font-medium">Image Selected</p>
              <p className="text-sm text-gray-500">
                {value?.name || "Existing image"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Click to change image
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">
                Drag and drop an image here to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supported: JPEG, PNG, GIF, WebP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDropInput;
