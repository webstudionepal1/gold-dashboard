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

import React from "react";
import { twMerge } from "tailwind-merge";

interface dropDownFieldPropTypes
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  firstInput?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  inputClassname?: string;
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
      placeholder,
      inputClassname,
      ...other
    },
    ref
  ) => (
    <div className="flex flex-col gap-2">
      <label className="flex gap-1">
        <p className="text-[#95949a]">{label}</p>
        {required && <span className="text-red">*</span>}
      </label>
      <select
        ref={ref}
        // className={twMerge(
        //   `border border-grey-200 py-3 px-4 rounded-xl text-[#95949a] bg-[#f6f8f8] outline-none ${inputClassname}`
        // )}
        className={twMerge(
          `border border-grey-200 py-3 px-4 rounded-xl text-gray-800 bg-[#f6f8f8] outline-none ${inputClassname}`
        )}
        {...other}>
        <option value="" disabled>
          {firstInput ?? placeholder ?? label}
        </option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
);

DropdownField.displayName = "DropdownField";
