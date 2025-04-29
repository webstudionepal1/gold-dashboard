import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

interface IProps {
  title: string;
  data: {
    [key: string]: any;
  };
}
export const DropdownSection: React.FC<IProps> = ({ title, data }) => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);
  return data ? (
    <div className="space-y-2">
      <div
        className="flex items-center justify-between py-2 border-b cursor-pointer"
        onClick={toggle}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <Icon
          icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-5 h-5 transition-transform"
        />
      </div>
      {isOpen && (
        <div className="space-y-2 transition-all duration-300">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between space-y-1 text-sm">
              <span className="text-sm text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span>{value.toString() || "N/A"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;
};
