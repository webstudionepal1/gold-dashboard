import React from "react";
import { useField } from "formik";

export interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  options?: string[];
  important?: boolean;
  className?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  name,
  type,
  placeholder,
  important,
  options,
  className = "",
}) => {
  const [field, meta] = useField(name);

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-1 text-slate-600 font-semibold">
        {label} {important && <span className="text-red">*</span>}
      </label>
      {type === "select" ? (
        <div className="border border-slate-300 rounded-lg bg-[#d3dae3] opacity-40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <select
            {...field}
            className="w-full bg-transparent focus:outline-none"
          >
            <option value="">Select an option</option>
            {options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          className="border border-slate-400 rounded-lg bg-[#d3dae3] opacity-30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:font-semibold placeholder:text-slate-800"
        />
      )}
      {meta.touched && meta.error && (
        <span className="text-red-500 text-sm">{meta.error}</span>
      )}
    </div>
  );
};

export default Field;
