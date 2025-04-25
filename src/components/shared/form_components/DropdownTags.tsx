// import React, { useRef, useEffect, useState } from "react";
// import { twMerge } from "tailwind-merge";

// interface Option {
//   value: string;
//   label: string;
// }

// interface CustomDropdownProps {
//   label?: string;
//   required?: boolean;
//   options?: Option[];
//   inputClassname?: string;
//   placeholder?: string;
//   values?: string[]; // multiple values
//   onChange?: (values: string[]) => void;
// }

// export const DropdownTagField: React.FC<CustomDropdownProps> = ({
//   label,
//   required = false,
//   options = [],
//   inputClassname,
//   placeholder,
//   values = [],
//   onChange,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const selectedOptions = options.filter((opt) => values.includes(opt.value));

//   const handleSelect = (option: Option) => {
//     if (!values.includes(option.value)) {
//       onChange?.([...values, option.value]);
//     }
//     setShowDropdown(false);
//   };

//   const handleRemove = (value: string) => {
//     onChange?.(values.filter((v) => v !== value));
//   };

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div className="flex flex-col gap-2" ref={dropdownRef}>
//       {label && (
//         <label className="flex gap-1">
//           <p className="text-[#95949a]">{label}</p>
//           {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <div className="relative">
//         <div
//           onClick={() => setShowDropdown((prev) => !prev)}
//           className={twMerge(
//             `w-full min-h-[44px] border border-grey-200 py-2 px-4 rounded-xl text-[#3b3a40] bg-[#f6f8f8] cursor-pointer flex flex-wrap items-center gap-2 relative ${inputClassname}`
//           )}
//         >
//           <div className="flex flex-wrap gap-2 flex-1">
//             {selectedOptions.length > 0 ? (
//               selectedOptions.map((opt) => (
//                 <span
//                   key={opt.value}
//                   className="flex items-center gap-1 bg-[#d58523] text-white text-sm px-2 py-1 rounded-full"
//                 >
//                   {opt.label}
//                   <button
//                     className="ml-1 text-white hover:text-red-500"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRemove(opt.value);
//                     }}
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))
//             ) : (
//               <span className="text-[#95949a]">
//                 {placeholder || (label ? `Select ${label}` : "Select option")}
//               </span>
//             )}
//           </div>

//           {/* Dropdown Icon */}
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className={`w-4 h-4 text-[#95949a] transition-transform duration-200 ${
//               showDropdown ? "rotate-180" : ""
//             }`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </div>

//         {showDropdown && (
//           <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-md max-h-60 overflow-y-auto">
//             {options
//               .filter((opt) => !values.includes(opt.value))
//               .map((option) => (
//                 <li
//                   key={option.value}
//                   onClick={() => handleSelect(option)}
//                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {option.label}
//                 </li>
//               ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label?: string;
  required?: boolean;
  options?: Option[];
  inputClassname?: string;
  placeholder?: string;
  values?: string[]; // multiple values
  onChange?: (values: string[]) => void;
}

export const DropdownTagField: React.FC<CustomDropdownProps> = ({
  label,
  required = false,
  options = [],
  inputClassname,
  placeholder,
  values = [],
  onChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => values.includes(opt.value));

  const handleSelect = (option: Option) => {
    if (!values.includes(option.value)) {
      const updatedValues = [...values, option.value];
      onChange?.(updatedValues);
    }
    setShowDropdown(false);
  };

  const handleRemove = (value: string) => {
    const updatedValues = values.filter((v) => v !== value);
    onChange?.(updatedValues);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      {label && (
        <label className="flex gap-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => setShowDropdown((prev) => !prev)}
          className={twMerge(
            `w-full min-h-[44px] border border-grey-200 py-2 px-4 rounded-xl bg-[#f6f8f8] cursor-pointer flex flex-wrap items-center gap-2 ${inputClassname}`
          )}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="flex items-center gap-1 bg-[#d58523] text-white text-sm px-2 py-1 rounded-full"
                >
                  {opt.label}
                  <button
                    className="ml-1 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(opt.value);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-[#95949a]">
                {placeholder || `Select ${label || "option"}`}
              </span>
            )}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-[#95949a] transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {showDropdown && (
          <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-md max-h-60 overflow-y-auto">
            {options
              .filter((opt) => !values.includes(opt.value))
              .map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {option.label}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
