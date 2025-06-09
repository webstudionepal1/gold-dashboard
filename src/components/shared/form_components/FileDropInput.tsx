import type React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface MultiImageUploaderProps {
  label?: string;
  value: File[];
  onChange: (files: File[]) => void;
  form: any;
  existingImages?: string[];
  existingImagefield?: string;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  label,
  value,
  onChange,
  existingImages,
  existingImagefield,
  form,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange([...value, ...acceptedFiles]);
    },
    [onChange, value]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"],
    },
  });

  const handleRemoveImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const previews = value.map((item) => {
    if (item instanceof File) {
      return {
        file: item,
        previewUrl: URL.createObjectURL(item),
        isFile: true,
      };
    } else {
      return {
        file: null,
        previewUrl:
          typeof item === "string" && item
            ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}/${item}`
            : "/placeholder.svg",
        isFile: false,
      };
    }
  });
  console.log(existingImages, "existingImages");
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div
        {...getRootProps()}
        className={`flex justify-center items-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer ${
          isDragActive ? "bg-gray-100" : "bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-500">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {existingImages?.map((img, idx) => (
          <div key={idx} className="relative group">
            <img
              src={`${import.meta.env.VITE_API_IMAGE_BASE_URL}${img}`}
              alt={`preview-${idx}`}
              className="w-full h-24 object-cover rounded-md border"
            />
            <button
              onClick={() =>
                form.setFieldValue(existingImagefield, [
                  ...existingImages.slice(0, idx),
                  ...existingImages.slice(idx + 1),
                ])
              }
              type="button"
              className="absolute top-1 right-1 bg-red text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
        {previews.map((img, idx) => (
          <div key={idx} className="relative group">
            <img
              src={img.previewUrl || "/placeholder.svg"}
              alt={`preview-${idx}`}
              className="w-full h-24 object-cover rounded-md border"
            />
            <button
              onClick={() => handleRemoveImage(idx)}
              type="button"
              className="absolute top-1 right-1 bg-red text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUploader;
