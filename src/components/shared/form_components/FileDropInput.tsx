import React, { useRef } from "react";

interface MultiImageUploaderProps {
  label?: string;
  value: File[];
  onChange: (files: File[]) => void;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  label = "Upload Images",
  value,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    onChange([...value, ...Array.from(files)]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    onChange([...value, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const previews = value.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }));

  return (
    <div className="p-4 border rounded-md w-full max-w-md">
      {label && <h2 className="text-lg font-semibold mb-2">{label}</h2>}

      <div
        className="mb-4 flex items-center justify-center h-32 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition"
        onClick={openFilePicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <span className="text-gray-600">Click or drag & drop images here</span>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleImageSelect}
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img.previewUrl}
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
      )}
    </div>
  );
};

export default MultiImageUploader;
