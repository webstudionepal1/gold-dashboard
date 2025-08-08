import React, { FC, memo, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DeleteDialog } from '../DeleteDialog';

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
  const [showDialog, setShowDialog] = useState(false);

  if (!row) return null;

  return (
    <div className="flex items-center justify-center w-full gap-3">
      {toggleAction && (
        <div
          key={`toggle-${row._id || 'unknown'}`}
          className="flex text-black cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleAction(row);
          }}
        >
          <label
            htmlFor={`toggle-${row._id || 'unknown'}`}
            className="relative flex cursor-pointer"
          >
            <input
              type="checkbox"
              id={`toggle-${row._id || 'unknown'}`}
              className="sr-only"
              checked={row.isActive || false}
              onChange={() => {
                // Do nothing here - the click is handled by the parent div
              }}
            />
            <div
              className={`toggle-bg border-2 h-[18px] w-[36px] rounded-full transition-colors duration-200 ease-in-out ${
                row.isActive ? 'bg-[#76EE59] ' : 'bg-[#B1BAC8] '
              }`}
            >
              <div
                className={`toggle-dot absolute left-0 top-1/2 -translate-y-1/2 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${
                  row.isActive
                    ? 'translate-x-[19px] border-blue-600'
                    : 'translate-x-[1px] border-gray-200'
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
          key={`edit-${row._id || 'unknown'}`}
          className="p-1 text-xl text-black rounded cursor-pointer bg-green"
          onClick={() => editAction(row)}
        >
          <Icon icon="lucide:pen-line" fontSize={14} color="white" />
        </div>
      )}
      {returnAction && (
        <div
          key={`return-${row._id || 'unknown'}`}
          className="text-xl text-black cursor-pointer bg-[#df8d29] rounded p-1"
          onClick={() => returnAction(row)}
        >
          <Icon icon="carbon:return" fontSize={14} className="text-white" />
        </div>
      )}
      {printAction && (
        <div
          key={`print-${row._id || 'unknown'}`}
          className="text-xl text-black cursor-pointer"
          onClick={() => printAction(row)}
        >
          <Icon icon="material-symbols:print" fontSize={14} color="#FF4D4D" />
        </div>
      )}
      {onDelete && (
        <div
          key={`delete-${row._id || 'unknown'}`}
          className="p-1 text-base text-black rounded cursor-pointer bg-red"
          onClick={() => setShowDialog(true)}
        >
          <Icon
            icon="material-symbols:delete-outline-rounded"
            fontSize={14}
            color="white"
          />
        </div>
      )}
      <DeleteDialog
        confirmAction={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          onDelete?.(row._id);
          setShowDialog(false);
        }}
      />
    </div>
  );
};

export default memo(TableAction);
