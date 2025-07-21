import { Icon } from "@iconify/react/dist/iconify.js";
import { memo, useState } from "react";

interface IProps {
  title: string;
  data: {
    [key: string]: any;
  };
}
export const DropdownSection: React.FC<IProps> = memo(({ title, data }) => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  // Don't render if no data or empty object
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <div
        className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={toggle}
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Icon
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-4 h-4 text-gray-600 transition-transform duration-200"
        />
      </div>
      {isOpen && (
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-start py-1 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-xs font-medium text-gray-600 capitalize flex-shrink-0 mr-3">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-xs text-gray-900 font-medium text-right">
                  {value?.toString() || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
