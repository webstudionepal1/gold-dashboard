import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react/dist/iconify.js";

interface InputFieldPropTypes
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: string;
  inputClassName?: string;
  step?: string | "any";
  defaultPadding?: boolean;
  border?: boolean;
  readonly?: boolean;
  icon?: string;
  helperText?: string;
  error?: string;
}

export const InputField = React.forwardRef<
  HTMLInputElement,
  InputFieldPropTypes
>(
  (
    {
      label,
      placeholder,
      type = "text",
      required = false,
      step,
      border = true,
      readonly = false,
      inputClassName,
      defaultPadding = true,
      icon,
      helperText,
      error,
      ...other
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="flex gap-1 text-nowrap">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Icon icon={icon} className="w-4 h-4 text-gray-400" />
            </div>
          )}

          <input
            ref={ref}
            step={step}
            type={type}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={twMerge(
              `w-full transition-all duration-200 ease-in-out`,
              `${border ? "border" : ""} ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : isFocused
                    ? "border-blue-400 focus:border-blue-500 focus:ring-blue-500/20"
                    : "border-gray-200 hover:border-gray-300"
              }`,
              `${defaultPadding ? (icon ? "py-2.5 pl-10 pr-3" : "py-2.5 px-3") : ""}`,
              `rounded-lg text-sm`,
              `${readonly
                ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-900"
              }`,
              `placeholder:text-gray-400`,
              `focus:outline-none focus:ring-2`,
              `shadow-sm`,
              inputClassName
            )}
            readOnly={readonly}
            {...other}
          />
        </div>

        {(helperText || error) && (
          <div className="flex items-center gap-1">
            {error && (
              <Icon icon="material-symbols:error" className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
            <span className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
              {error || helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

// Second iteration
// import React from "react";
// import { twMerge } from "tailwind-merge";

// interface InputFieldPropTypes
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   variant?: string;
//   inputClassName?: string;
//   step?: string | "any";
//   defaultPadding?: boolean;
//   border?: boolean;
//   readonly?: boolean;
// }

// export const InputField = React.forwardRef<
//   HTMLInputElement,
//   InputFieldPropTypes
// >(
//   (
//     {
//       label,
//       placeholder,
//       type = "text",
//       required = false,
//       step,
//       border = true,
//       readonly = false,
//       inputClassName,
//       defaultPadding = true,
//       ...other
//     },
//     ref
//   ) => (
//     <div className="flex flex-col gap-2 w-full">
//       <label className="flex gap-1">
//         <p className="text-[#95949a]">{label}</p>
//         {required && <span className="text-red">*</span>}
//       </label>
//       <input
//         ref={ref}
//         step={step}
//         type={type}
//         placeholder={placeholder}
//         className={twMerge(
//           `min-h-[44px] ${border && "border"} border-gray-200 ${
//             defaultPadding && "py-2 px-4"
//           } rounded-xl ${
//             readonly
//               ? "placeholder:text-[#95949a] cursor-auto"
//               : "text-[#86878d]"
//           } outline-none w-full ${inputClassName} bg-[#f6f7f9]`
//         )}
//         readOnly={readonly}
//         {...other}
//       />
//     </div>
//   )
// );

// InputField.displayName = "InputField";
