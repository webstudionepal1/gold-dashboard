import { Icon } from "@iconify/react/dist/iconify.js";
import { memo, useState } from "react";

interface IProps {
  title: string;
  data: {
    [key: string]: any;
  };
}
export const DropdownSection: React.FC<IProps> = memo(({ title, data }) => {
  const [isOpen, setOpen] = useState(true); // Default to open for better UX
  const toggle = () => setOpen((prev) => !prev);
  return data ? (
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm h-fit">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={toggle}
      >
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          {title}
        </h3>
        <Icon
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-5 h-5 text-gray-500 transition-transform duration-200"
        />
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-sm font-semibold text-gray-900 ml-2">
                  {value?.toString() || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;
});
