// DateFilter.tsx
import React from "react";
import { cn } from "../../lib/utils";

export type PeriodOption = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface DateFilterProps {
  value: {
    date: string; // YYYY-MM-DD
    period: PeriodOption;
  };
  onChange: (newValue: { date: string; period: PeriodOption }) => void;
  className?: string;
}
const periodOptions: PeriodOption[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export const DateFilter: React.FC<DateFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, date: e.target.value });
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, period: e.target.value as PeriodOption });
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={value.date}
          onChange={handleDateChange}
          className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Period
        </label>
        <select
          value={value.period}
          onChange={handlePeriodChange}
          className="border rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {periodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
