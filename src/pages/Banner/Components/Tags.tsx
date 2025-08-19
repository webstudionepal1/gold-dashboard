import { FieldApi } from '@tanstack/react-form';
import { useState, useEffect, useRef } from 'react';

type ChipInputProps = {
  field: any;
  options: string[]; // Array of dropdown options
};

const Tags = ({ field, options }: ChipInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValues = field.state.value || [];

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      field.setValue(selectedValues.filter((item: string) => item !== option));
    } else {
      field.setValue([...selectedValues, option]);
    }
  };

  const removeChip = (option: string) => {
    field.setValue(selectedValues.filter((item: string) => item !== option));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded min-h-[48px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0 ? (
          selectedValues.map((chip: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-200 rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              {chip}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(chip);
                }}
                className="font-bold text-red-500"
                type="button"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-500">Select options...</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                selectedValues.includes(option) ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                toggleOption(option);
              }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => {}}
                  className="mr-2"
                />
                {option}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tags;
