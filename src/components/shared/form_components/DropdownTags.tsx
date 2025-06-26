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
//       const updatedValues = [...values, option.value];
//       onChange?.(updatedValues);
//     }
//     setShowDropdown(false);
//   };

//   const handleRemove = (value: string) => {
//     const updatedValues = values.filter((v) => v !== value);
//     onChange?.(updatedValues);
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
//         <label className="flex gap-1 text-sm font-medium text-gray-700">
//           {label}
//           {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <div className="relative">
//         <div
//           onClick={() => setShowDropdown((prev) => !prev)}
//           className={twMerge(
//             `w-full min-h-[44px] border border-grey-200 py-2 px-4 rounded-xl bg-[#f6f8f8] cursor-pointer flex flex-wrap items-center gap-2 ${inputClassname}`
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
//                     className="ml-1 hover:text-red-300"
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
//                 {placeholder || `Select ${label || "option"}`}
//               </span>
//             )}
//           </div>

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

import React, { useRef, useEffect, useState, useCallback } from "react";
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
  values?: string[];
  onChange?: (values: string[]) => void;
}

export const DropdownTagField: React.FC<CustomDropdownProps> = ({
  label,
  required = false,
  options = [],
  inputClassname,
  placeholder = "Type and press Enter",
  values = [], // Default to empty array
  onChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  // Ensure values is always an array
  const safeValues = Array.isArray(values) ? values : [];

  // Filtered options based on input and excluding selected values
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !safeValues.includes(opt.value)
  );

  // Clear option refs when options change
  useEffect(() => {
    optionRefs.current.clear();
  }, [options.length]);

  // Reset highlighted index when options or input change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [options.length, inputValue]);

  // Reset highlighted index when dropdown closes
  useEffect(() => {
    if (!showDropdown) {
      setHighlightedIndex(-1);
    }
  }, [showDropdown]);

  // Set option ref for scrolling
  const setOptionRef = useCallback((index: number) => {
    return (el: HTMLLIElement | null) => {
      if (el) {
        optionRefs.current.set(index, el);
      } else {
        optionRefs.current.delete(index);
      }
    };
  }, []);

  // Scroll to highlighted option
  useEffect(() => {
    if (highlightedIndex >= 0 && showDropdown && dropdownRef.current) {
      const dropdown = dropdownRef.current.querySelector("ul");
      const highlightedOption = optionRefs.current.get(highlightedIndex);

      if (dropdown && highlightedOption) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const optionRect = highlightedOption.getBoundingClientRect();

        const dropdownTop = dropdown.scrollTop;
        const dropdownBottom = dropdownTop + dropdown.clientHeight;
        const optionTop = highlightedOption.offsetTop;
        const optionBottom = optionTop + highlightedOption.offsetHeight;

        if (optionBottom > dropdownBottom) {
          dropdown.scrollTop = optionBottom - dropdown.clientHeight + 8;
        } else if (optionTop < dropdownTop) {
          dropdown.scrollTop = optionTop - 8;
        }
      }
    }
  }, [highlightedIndex, showDropdown]);

  // Close dropdown on click outside
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          const selectedOption = filteredOptions[highlightedIndex];
          if (!safeValues.includes(selectedOption.value)) {
            onChange?.([...safeValues, selectedOption.value]);
            setInputValue("");
            setHighlightedIndex(-1);
          }
        } else if (inputValue.trim()) {
          const trimmed = inputValue.trim();
          if (!safeValues.includes(trimmed)) {
            onChange?.([...safeValues, trimmed]);
            setInputValue("");
          }
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setShowDropdown(true);
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setShowDropdown(true);
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;

      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;

      case "Backspace":
        if (inputValue === "" && safeValues.length > 0) {
          onChange?.(safeValues.slice(0, -1));
        }
        break;
    }
  };

  const handleSelect = (option: Option) => {
    if (!safeValues.includes(option.value)) {
      onChange?.([...safeValues, option.value]);
      setInputValue("");
      setHighlightedIndex(-1);
    }
  };

  const handleRemove = (value: string) => {
    const updatedValues = safeValues.filter((v) => v !== value);
    onChange?.(updatedValues);
  };

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      {label && (
        <label className="flex gap-1   text-[#95949a]">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={twMerge(
            "w-full min-h-[44px] border border-grey-200 py-2 px-4 rounded-xl bg-[#f6f8f8] flex items-center gap-2",
            inputClassname
          )}
        >
          {/* Render tags only if there are values, no extra space */}
          {safeValues.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {safeValues.map((value) => {
                const option = options.find((opt) => opt.value === value);
                const displayLabel = option ? option.label : value;
                return (
                  <span
                    key={value}
                    className="flex items-center gap-1 bg-[#d58523] text-white text-sm px-2 py-1 rounded-full"
                  >
                    {displayLabel}
                    <button
                      className="ml-1 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-[100px] outline-none bg-transparent text-sm"
            placeholder={safeValues.length === 0 ? placeholder : ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(true);
              inputRef.current?.focus();
            }}
          />
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <li
                  key={`${option.value}-${idx}`}
                  ref={setOptionRef(idx)}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className="px-4 py-2 cursor-pointer transition-colors"
                  style={
                    highlightedIndex === idx
                      ? { backgroundColor: "#d58524", color: "#ffffff" }
                      : {}
                  }
                  onMouseOver={(e) => {
                    if (highlightedIndex !== idx) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (highlightedIndex !== idx) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No options found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
