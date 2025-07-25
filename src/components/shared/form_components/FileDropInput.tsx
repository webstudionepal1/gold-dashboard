import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SingleFileProps {
  multiple: false;
  value: File | null;
  onChange: (file: File | null) => void;
  existingFile?: string;
  existingFileField?: string;
}

interface MultiFileProps {
  multiple: true;
  value: File[];
  onChange: (files: File[]) => void;
  existingFiles?: string[];
  existingFileField?: string;
}

type BaseProps = {
  label?: string;
  form?: any;
  accept?: Record<string, string[]>;
  placeholder?: string;
  maxFiles?: number;
};

type UniversalFileUploaderProps = BaseProps &
  (SingleFileProps | MultiFileProps);

const MultiImageUploader: React.FC<UniversalFileUploaderProps> = (props) => {
  const {
    label,
    form,
    accept = {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"],
    },
    placeholder,
    maxFiles = 10,
  } = props;

  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    console.log("Existing files changed, forcing re-render");
    setRenderKey((prev) => prev + 1);
  }, [props.multiple && "existingFiles" in props ? props.existingFiles : null]);

  const defaultPlaceholder = props.multiple
    ? "Drag 'n' drop files here, or click to select files"
    : "Drag 'n' drop a file here, or click to select a file";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (props.multiple) {
        const currentFiles = props.value || [];
        const newFiles = [...currentFiles, ...acceptedFiles];
        const limitedFiles = newFiles.slice(0, maxFiles);
        props.onChange(limitedFiles);
      } else {
        // Single file mode
        if (acceptedFiles.length > 0) {
          props.onChange(acceptedFiles[0]);
        }
      }
    },
    [props, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: props.multiple,
  });

  const handleRemoveFile = (index?: number) => {
    console.log("handleRemoveFile called with index:", index);
    console.log(
      "Current files:",
      props.multiple ? props.value : "single file mode"
    );

    if (props.multiple) {
      if (typeof index === "number") {
        const newFiles = [...props.value];
        console.log("Before removal:", newFiles);
        newFiles.splice(index, 1);
        console.log("After removal:", newFiles);
        props.onChange(newFiles);
      }
    } else {
      props.onChange(null);
    }
  };

  const handleRemoveExistingFile = (index?: number) => {
    console.log("Removing existing file at index:", index);

    if (!form) {
      console.log("No form available, returning");
      return;
    }

    if (props.multiple && "existingFiles" in props && props.existingFiles) {
      if (typeof index === "number" && props.existingFileField) {
        const currentFiles = [...props.existingFiles];
        console.log("Current existing files before removal:", currentFiles);

        const newFiles = [
          ...currentFiles.slice(0, index),
          ...currentFiles.slice(index + 1),
        ];

        console.log("New files after removal:", newFiles);

        // Update the form field value
        form.setFieldValue(props.existingFileField, newFiles);

        // Force a re-render by triggering the form's state update
        setTimeout(() => {
          console.log(
            "Form field value after update:",
            form.getFieldValue(props.existingFileField)
          );
        }, 0);
      }
    } else if (
      !props.multiple &&
      "existingFile" in props &&
      props.existingFileField
    ) {
      console.log("Removing single existing file");
      form.setFieldValue(props.existingFileField, null);
    }
  };

  const isImageFile = (file: File | string) => {
    if (file instanceof File) {
      return file.type.startsWith("image/");
    }
    if (typeof file === "string") {
      const imageExtensions = [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
      ];
      return imageExtensions.some((ext) => file.toLowerCase().endsWith(ext));
    }
    return false;
  };

  const getFileUrl = (file: string) => {
    return `${import.meta.env.VITE_API_IMAGE_BASE_URL}/${file}`;
  };

  const renderFilePreview = (
    file: File | string,
    index: number,
    isExisting: boolean
  ) => {
    const isImage = isImageFile(file);
    let previewUrl = "/placeholder.svg";
    let fileName = "";

    if (file instanceof File) {
      previewUrl = isImage ? URL.createObjectURL(file) : "/placeholder.svg";
      fileName = file.name;
    } else if (typeof file === "string") {
      previewUrl = `${import.meta.env.VITE_API_IMAGE_BASE_URL}${file}`;
    }

    return (
      <div
        key={`${isExisting ? "existing" : "new"}-${index}`}
        className="relative group"
      >
        {isImage ? (
          <img
            src={previewUrl}
            alt={`preview-${index}`}
            className="w-full h-24 object-cover rounded-md border"
          />
        ) : (
          <img
            src={previewUrl}
            alt={`preview-${index}`}
            className="w-full h-24 object-cover rounded-md border"
          />
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Remove button clicked:", { isExisting, index });
            if (isExisting) {
              handleRemoveExistingFile(index);
            } else {
              handleRemoveFile(index);
            }
          }}
          type="button"
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 z-10 cursor-pointer shadow-md"
        >
          ✕
        </button>
      </div>
    );
  };

  const renderSingleFileMode = () => {
    if (!props.multiple) {
      const singleProps = props as SingleFileProps & BaseProps;

      return (
        <div>
          {/* Existing file preview */}
          {singleProps.existingFile && !singleProps.value && (
            <div className="mb-4">
              {renderFilePreview(singleProps.existingFile, 0, true)}
            </div>
          )}
          {/* Selected file preview */}
          {singleProps.value && (
            <div className="mb-4">
              {renderFilePreview(singleProps.value, 0, false)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderMultiFileMode = () => {
    if (props.multiple) {
      const multiProps = props as MultiFileProps & BaseProps;
      const existingFiles = multiProps.existingFiles || [];
      const selectedFiles = multiProps.value || [];

      if (existingFiles.length === 0 && selectedFiles.length === 0) {
        return null;
      }

      return (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Existing files */}
          {existingFiles.map((file, index) =>
            renderFilePreview(file, index, true)
          )}

          {/* Selected files */}
          {selectedFiles.map((file, index) =>
            renderFilePreview(file, index, false)
          )}
        </div>
      );
    }
    return null;
  };

  const getCurrentFileCount = () => {
    if (props.multiple) {
      const multiProps = props as MultiFileProps & BaseProps;
      const existingCount = multiProps.existingFiles?.length || 0;
      const selectedCount = multiProps.value?.length || 0;
      return existingCount + selectedCount;
    }
    return 0;
  };

  const isMaxFilesReached = props.multiple && getCurrentFileCount() >= maxFiles;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Single file previews */}
      {renderSingleFileMode()}

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`flex justify-center items-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer ${
          isDragActive ? "bg-gray-100" : "bg-white"
        } ${isMaxFilesReached ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} disabled={isMaxFilesReached} />
        <div className="text-center px-4">
          {isMaxFilesReached ? (
            <p className="text-gray-400">Maximum files reached ({maxFiles})</p>
          ) : isDragActive ? (
            <p className="text-gray-500">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">{placeholder || defaultPlaceholder}</p>
          )}
          {props.multiple && !isMaxFilesReached && (
            <p className="text-xs text-gray-400 mt-1">
              {getCurrentFileCount()}/{maxFiles} files
            </p>
          )}
        </div>
      </div>

      {/* Multi file previews */}
      {renderMultiFileMode()}
    </div>
  );
};

export default MultiImageUploader;
