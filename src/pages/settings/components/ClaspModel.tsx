import { useForm } from "@tanstack/react-form";
import clsx from "clsx";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { InputField } from "../../../components/shared/form_components/InputField";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import {
  IFetchClasps,
  useCreateProductClaspsMutation,
  useUpdateProductClaspsMutation,
} from "../../../server/api/productHooks";
import { UploadedImage } from "../../Product/productObj";
import { FieldError } from "../../auth/LoginPage";
import { z } from "zod";
interface IClaspProps {
  onClose: () => void;
  data?: IFetchClasps;
  edit?: boolean;
}

// Define a proper form values interface

const schema = z.object({
  name: z.string().min(1, "**Name is Required"),
});
const ClaspModel: React.FC<IClaspProps> = ({ onClose, data, edit = false }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const {
    mutate: createClasps,
    isSuccess,
    isPending,
  } = useCreateProductClaspsMutation();
  const {
    mutate: updateClasps,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateProductClaspsMutation();
  const form = useForm({
    defaultValues: {
      name: edit ? get(data, "name", "") : "",
      validators: {
        onChange: schema,
        onBlur: schema,
        onSubmit: schema,
      },
    },
    onSubmit: async ({ value }) => {
      const formdata = new FormData();
      formdata.append("name", value.name);
      uploadedImages.forEach((img) => {
        formdata.append("images", img.file);
      });
      if (edit) updateClasps({ id: data?._id ?? "", body: formdata });
      else createClasps(formdata);
      onClose();
    },
  });
  useEffect(() => {
    if (isSuccess || updateSuccess) {
      form.reset();
      onClose();
    }
  }, [isSuccess, updateSuccess]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file: File) => ({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
      }));
      setUploadedImages([...uploadedImages, ...newImages].slice(0, 4));
    }
  };
  return (
    <ScrollableModal classname="w-full max-w-lg px-4 py-4" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="name">
          {(field) => (
            <div>
              <InputField
                label="Name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError field={field} />
            </div>
          )}
        </form.Field>

        {/* Upload Photos */}
        <div className="p-4 bg-white border rounded-lg">
          <h2 className="mb-4 font-medium text-gray-700">Upload Photos</h2>

          <div className="p-8 mb-4 text-center border-2 border-dashed rounded-lg">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="mt-2 text-sm text-gray-500">JPEG, PNG, SVG or JPG</p>
            <p className="mt-1 text-xs text-gray-400">(Max file size 800 KB)</p>

            <input
              type="file"
              id="photo-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="photo-upload"
              className="inline-block px-4 py-2 mt-4 text-gray-700 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            >
              Browse File
            </label>
          </div>

          {/* Preview of uploaded images */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {uploadedImages.map((img, index) => (
                <div key={index} className="overflow-hidden border rounded">
                  <img
                    src={img.url}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-16"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-[#dedde2] w-full mt-4 mb-4" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || updatePending}
            className={clsx(
              "flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl",
              (isPending || updatePending) && "cursor-pending"
            )}
          >
            {edit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </ScrollableModal>
  );
};

export default ClaspModel;
