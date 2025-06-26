// components/StatCard.tsx
import React from "react";
import { cn } from "../../../lib/utils";

interface StatCardProps {
  percentage: number;
  label: string;
  icon?: React.ReactNode;
  imageBgClassName?: string;
  className?: string; // for customizing the outer card too
}

export const StatCard: React.FC<StatCardProps> = ({
  percentage,
  label,
  icon,
  imageBgClassName = "bg-yellow-100",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col  items-center gap-4 rounded-xl  bg-white p-4 shadow-sm",
        className
      )}
    >
      {/* <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          imageBgClassName
        )}
      >
        {icon}
      </div> */}
      <div className="flex flex-col items-center justify-center ">
        <div className="text-2xl   text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-[#6d6d6d]">
          {percentage}%
        </div>
      </div>
    </div>
  );
};
