import React, { FC, memo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

export interface TableActionProps {
  viewAction?: (row: any) => void;
  toggleAction?: (row: any) => void;
  editAction?: (row: any) => void;
  returnAction?: (row: any) => void;
  printAction?: (row: any) => void;
  onDelete?: (row: any) => void;
  row?: any;
}

const TableAction: FC<TableActionProps> = ({
  viewAction,
  toggleAction,
  editAction,
  returnAction,
  printAction,
  onDelete,
  row,
}) => {
  // Check if row and row._id exist to avoid errors
  if (!row) return null;

  return (
    <div className="flex items-center justify-center w-full gap-3">
      {toggleAction && (
        <div
          key={`toggle-${row._id || "unknown"}`}
          className="flex text-black cursor-pointer"
          onClick={() => toggleAction(row)}
        >
          <label
            htmlFor={`toggle-${row._id || "unknown"}`}
            className="relative flex cursor-pointer"
          >
            <input
              type="checkbox"
              id={`toggle-${row._id || "unknown"}`}
              className="sr-only"
              checked={row.isActive || false}
              onChange={(e) => {
                // Prevent double firing when clicking the label
                e.stopPropagation();
                toggleAction(row);
              }}
            />
            <div
              className={`toggle-bg border-2 h-[18px] w-[36px] rounded-full transition-colors duration-200 ease-in-out ${
                row.isActive ? "bg-[#76EE59] " : "bg-[#B1BAC8] "
              }`}
            >
              <div
                className={`toggle-dot absolute left-0 top-1/2 -translate-y-1/2 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${
                  row.isActive
                    ? "translate-x-[19px] border-blue-600"
                    : "translate-x-[1px] border-gray-200"
                }`}
              />
            </div>
          </label>
        </div>
      )}
      {viewAction && (
        <div
          className="p-1 text-xl text-black rounded cursor-pointer bg-primary-blue"
          onClick={() => viewAction(row)}
        >
          <Icon icon="mdi:eye-outline" fontSize={14} color="white" />
        </div>
      )}
      {editAction && (
        <div
          key={`edit-${row._id || "unknown"}`}
          className="p-1 text-xl text-black rounded cursor-pointer bg-green"
          onClick={() => editAction(row)}
        >
          <Icon icon="lucide:pen-line" fontSize={14} color="white" />
        </div>
      )}
      {returnAction && (
        <div
          key={`return-${row._id || "unknown"}`}
          className="text-xl text-black cursor-pointer bg-[#df8d29] rounded p-1"
          onClick={() => returnAction(row)}
        >
          <Icon icon="carbon:return" fontSize={14} className="text-white" />
        </div>
      )}
      {printAction && (
        <div
          key={`print-${row._id || "unknown"}`}
          className="text-xl text-black cursor-pointer"
          onClick={() => printAction(row)}
        >
          <Icon icon="material-symbols:print" fontSize={14} color="#FF4D4D" />
        </div>
      )}
      {onDelete && (
        <div
          key={`delete-${row._id || "unknown"}`}
          className="p-1 text-base text-black rounded cursor-pointer bg-red"
          onClick={() => onDelete(row._id)}
        >
          <Icon
            icon="material-symbols:delete-outline-rounded"
            fontSize={14}
            color="white"
          />
        </div>
      )}
    </div>
  );
};

export default memo(TableAction);
