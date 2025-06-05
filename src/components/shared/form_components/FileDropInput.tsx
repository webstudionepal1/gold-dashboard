import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropInputProps {
  label?: string;
  value?: File | File[] | null;
  onChange?: (files: File | File[] | null) => void;
  multiple?: boolean;
}

const FileDropInput: React.FC<FileDropInputProps> = ({
  label,
  value,
  onChange,
  multiple = false,
}) => {
  // State to store file previews
  const [previews, setPreviews] = useState<string[]>([]);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Create preview URLs
      const previewUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(previewUrls);

      // Call onChange with the appropriate value
      if (onChange) {
        onChange(multiple ? acceptedFiles : acceptedFiles[0]);
      }
    },
    [onChange, multiple]
  );

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });

  // Clean up object URLs on unmount or when files change
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Determine what to display
  const displayName = (): string => {
    if (!value) return "";

    if (Array.isArray(value)) {
      return `${value.length} file${value.length !== 1 ? "s" : ""} selected`;
    }

    return value.name;
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-400">{label}</label>
      )}

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center cursor-pointer hover:border-orange-400 transition duration-200"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
            <p className="text-blue-600">Drop the file here...</p>
          ) : value ? (
            <p className="text-gray-600">{displayName()}</p>
          ) : (
            <p className="text-gray-500">
              Drag and drop {multiple ? "files" : "a file"} here to upload
            </p>
          )}
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-6 gap-2 border-2 p-4 rounded-md">
          {previews.map((preview, index) => (
            <img
              key={`preview-${index}`}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-10 h-10 object-cover rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropInput;
