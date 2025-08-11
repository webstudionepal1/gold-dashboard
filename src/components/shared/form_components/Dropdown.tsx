// import React from "react";

// import { twMerge } from "tailwind-merge";

// interface dropDownFieldPropTypes
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   label?: string;
//   firstInput?: string;
//   options?: { value: string; label: string }[];
//   required?: boolean;
//   inputClassname?: string;
// }

// export const DropdownField = React.forwardRef<
//   HTMLOptionElement,
//   dropDownFieldPropTypes
// >(
//   (
//     { label, options, required = false, firstInput, inputClassname, ...other },
//     ref
//   ) => (
//     <div className="flex flex-col gap-2">
//       <label className="flex gap-1">
//         <p>{label}</p>

//         {required && <span className="text-red">*</span>}
//       </label>
//       <select
//         className={twMerge(
//           ` border border-grey-200 py-3 px-4 rounded text-black outline-none ${inputClassname}`
//         )}
//         {...other}
//       >
//         <option value="" disabled>
//           Select {firstInput ?? label}
//         </option>
//         {options?.map((option) => (
//           <option key={option.value} value={option.value} ref={ref}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// );

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@iconify/react/dist/iconify.js";

interface dropDownFieldPropTypes
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  firstInput?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  inputClassname?: string;
  icon?: string;
  helperText?: string;
  error?: string;
}

export const DropdownField = React.forwardRef<
  HTMLSelectElement,
  dropDownFieldPropTypes
>(
  (
    {
      label,
      options,
      required = false,
      firstInput,
      inputClassname,
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
            {required && <span className="text-red">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Icon icon={icon} className="w-4 h-4 text-gray-400" />
            </div>
          )}

          <select
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={twMerge(
              `w-full transition-all duration-200 ease-in-out appearance-none`,
              `border ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : isFocused
                    ? "border-blue-400 focus:border-blue-500 focus:ring-blue-500/20"
                    : "border-gray-200 hover:border-gray-300"
              }`,
              `${icon ? "py-2.5 pl-10 pr-10" : "py-2.5 px-3 pr-10"}`,
              `rounded-lg text-sm bg-white text-gray-900`,
              `focus:outline-none focus:ring-2`,
              `shadow-sm`,
              `cursor-pointer`,
              inputClassname
            )}
            {...other}
          >
            <option value="" disabled className="text-gray-400">
              {firstInput ?? `Select ${label?.toLowerCase() || 'option'}`}
            </option>
            {options?.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Icon
              icon="material-symbols:keyboard-arrow-down"
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isFocused ? 'rotate-180' : ''
              }`}
            />
          </div>
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

DropdownField.displayName = "DropdownField";
