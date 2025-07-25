// components/InfoSection.tsx
import React from "react";
import { Icon } from "@iconify/react";

interface InfoItem {
  id: string | number;
  title: string;
  value?: string | React.ReactNode;
  Note?: string;
  date?: string | React.ReactNode;
  reason?: string;
}

interface InfoSectionProps {
  title: string;
  info: InfoItem[];
  showEdit?: boolean;
  onEditClick?: () => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  info,
  showEdit = false,
  onEditClick,
}) => {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>

        {showEdit && (
          <button onClick={onEditClick}>
            <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
              <Icon icon="lucide:pen-line" fontSize={16} color="white" />
            </div>
          </button>
        )}
      </div>

      <div className="border-b-2 border-[#d5d9e4] my-2" />

      <div className="space-y-1">
        {info.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <p className="text-sm w-auto">{item.title}</p>
            <p className="text-sm">
              {item.value || item.Note || item.date || item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;
