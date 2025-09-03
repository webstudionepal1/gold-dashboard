import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface SingleFileProps {
  multiple: false;
  value: File | null | string;
  onChange: (file: File | null) => void;
  existingFile?: string | null;
  existingFileField?: string;
  removeExistingFile?: (index?: number, isExisting?: boolean) => void;
  existingImageUrl?: string;
  showPreview?: boolean;
}

interface MultiFileProps {
  multiple: true;
  value: File[] | string[];
  onChange: (files: File[]) => void;
  existingFiles?: string[];
  removeExistingFile?: (index?: number, isExisting?: boolean) => void;
  existingFileField?: string;
  showPreview?: boolean;
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
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'],
    },
    placeholder,
    maxFiles = 10,
    showPreview = true,
    removeExistingFile,
  } = props;

  const defaultPlaceholder = props.multiple
    ? "Drag 'n' drop files here, or click to select files"
    : "Drag 'n' drop a file here, or click to select a file";

  const [localExistingFiles, setLocalExistingFiles] = useState<string[]>([]);

  // Update local state when existingFiles prop changes
  useEffect(() => {
    if (props.multiple && 'existingFiles' in props) {
      setLocalExistingFiles(props.existingFiles || []);
    }
  }, [props.multiple, 'existingFiles' in props ? props.existingFiles : []]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (props.multiple) {
        // Multi-file mode - only pass new files, parent will handle merging
        console.log('Dropping files:', acceptedFiles);
        props.onChange(acceptedFiles);
      } else {
        // Single file mode - replace existing file
        if (acceptedFiles.length > 0) {
          props.onChange(acceptedFiles[0]);
          // Clear existing file when new file is selected
          if (form && props.existingFileField && !props.multiple) {
            form.setFieldValue(props.existingFileField, null);
          }
        }
      }
    },
    [props, form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: props.multiple,
  });

  const handleRemoveFile = (index?: number) => {
    if (props.multiple) {
      if (typeof index === 'number') {
        const newFiles = [...(props.value as File[])];
        newFiles.splice(index, 1);
        props.onChange(newFiles);
      }
    } else {
      props.onChange(null);
      removeExistingFile?.(index, true);
    }
  };

  const handleRemoveExistingFile = (index?: number) => {
    if (!form) return;

    if (props.multiple && 'existingFiles' in props && props.existingFiles) {
      if (typeof index === 'number' && props.existingFileField) {
        const newFiles = [
          ...props.existingFiles.slice(0, index),
          ...props.existingFiles.slice(index + 1),
        ];

        form.setFieldValue(props.existingFileField, newFiles);
        setLocalExistingFiles(newFiles);
      }
    } else if (!props.multiple && props.existingFileField) {
      removeExistingFile?.(index, true);
      form?.setFieldValue(props.existingFileField, '');
      console.log('here');
    }
  };

  const isImageFile = (file: File | string) => {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    }
    if (typeof file === 'string') {
      const imageExtensions = [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.webp',
        '.bmp',
        '.svg',
      ];
      return imageExtensions.some((ext) => file.toLowerCase().endsWith(ext));
    }
    return false;
  };

  const renderFilePreview = (
    file: File | string,
    index: number,
    isExisting: boolean
  ) => {
    const isImage = isImageFile(file);
    let previewUrl = '/placeholder.svg';

    if (file instanceof File) {
      previewUrl = isImage ? URL.createObjectURL(file) : '/placeholder.svg';
    } else if (typeof file === 'string') {
      if (file.includes('http')) {
        previewUrl = file;
      } else {
        previewUrl = `${import.meta.env.VITE_API_IMAGE_BASE_URL}${file}`;
      }
    }

    return (
      <div
        key={`${isExisting ? 'existing' : 'new'}-${index}`}
        className="relative group"
      >
        <img
          src={previewUrl}
          alt={`preview-${index}`}
          className="w-full h-24 object-cover rounded-md border"
        />

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

        {/* Label to distinguish existing vs new */}
        <div
          className={`absolute bottom-1 left-1 text-white text-xs px-1.5 py-0.5 rounded ${
            isExisting
              ? 'bg-blue-500 bg-opacity-70'
              : 'bg-green-500 bg-opacity-70'
          }`}
        >
          {isExisting ? 'E' : 'N'}
          {index + 1}
        </div>
      </div>
    );
  };

  const renderSingleFileMode = () => {
    if (!props.multiple) {
      const singleProps = props as SingleFileProps & BaseProps;
      let existingImage =
        singleProps.existingFile || singleProps.existingImageUrl;

      console.log(singleProps, 'single props');
      console.log(existingImage, 'existing image');

      if (
        existingImage &&
        typeof existingImage === 'object' &&
        (existingImage as { props?: { src: string } })?.props &&
        (existingImage as any)?.props.src
      ) {
        existingImage = (existingImage as any).props.src;
      }

      return (
        <div>
          {/* Show existing file preview only if no new file is selected */}
          {existingImage && !singleProps.value && (
            <div className="mb-4">
              {renderFilePreview(existingImage, 0, true)}
            </div>
          )}
          {/* Show selected file preview - this replaces existing file */}
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
      // Use local state for existing files
      const existingFiles = localExistingFiles;
      const selectedFiles = (multiProps.value || []).filter(
        (file) => file instanceof File
      ) as File[];

      if (existingFiles.length === 0 && selectedFiles.length === 0) {
        return null;
      }

      return (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Existing files */}
          {existingFiles.length > 0 &&
            existingFiles.map((file, index) =>
              renderFilePreview(file, index, true)
            )}

          {/* Selected files - only show File objects, not URLs */}
          {selectedFiles.length > 0 &&
            selectedFiles.map((file, index) =>
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
      // Count existing files plus new File objects only
      const existingCount = localExistingFiles.length;
      const selectedFileCount = (multiProps.value || []).filter(
        (file) => file instanceof File
      ).length;
      return existingCount + selectedFileCount;
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
      {!props.multiple && renderSingleFileMode()}

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`flex justify-center items-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer ${
          isDragActive ? 'bg-gray-100' : 'bg-white'
        } ${isMaxFilesReached ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      {props.multiple && showPreview && renderMultiFileMode()}
    </div>
  );
};

export default MultiImageUploader;
