import type React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

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

  const defaultPlaceholder = props.multiple
    ? "Drag 'n' drop files here, or click to select files"
    : "Drag 'n' drop a file here, or click to select a file";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (props.multiple) {
        // Multi-file mode
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
    if (props.multiple) {
      if (typeof index === "number") {
        const newFiles = [...props.value];
        newFiles.splice(index, 1);
        props.onChange(newFiles);
      }
    } else {
      props.onChange(null);
    }
  };

  const handleRemoveExistingFile = (index?: number) => {
    if (!form) return;

    if (props.multiple && "existingFiles" in props && props.existingFiles) {
      if (typeof index === "number" && props.existingFileField) {
        console.log("removeing", index);
        const newFiles = [
          ...props.existingFiles.slice(0, index),
          ...props.existingFiles.slice(index + 1),
        ];
        console.log("newFile", newFiles);
        form.setFieldValue(props.existingFileField, newFiles);
        console.log(form.getFieldValue(props.existingFileField));
      }
    } else if (
      !props.multiple &&
      "existingFile" in props &&
      props.existingFileField
    ) {
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
      previewUrl = isImage ? getFileUrl(file) : "/placeholder.svg";
      fileName = file.split("/").pop() || "File";
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
          <div className="w-full h-24 bg-gray-100 rounded-md border flex items-center justify-center">
            <span className="text-gray-500 text-xs text-center px-2">
              {fileName}
            </span>
          </div>
        )}
        <button
          onClick={() =>
            isExisting
              ? handleRemoveExistingFile(index)
              : handleRemoveFile(index)
          }
          type="button"
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
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
          form.getFieldValue(props.existingFileField);
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
      console.log("existingFiel", existingFiles);
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
