// // components/SimpleTable.tsx
// import React from "react";
// import { Icon } from "@iconify/react";

// export type SimpleTableColumn<T> = {
//   key: keyof T;
//   header?: string;
//   render?: (value: any, row: T) => React.ReactNode;
// };

// type SimpleTableProps<T> = {
//   title?: string;
//   data: T[];
//   columns: SimpleTableColumn<T>[];
//   onRowSelect?: (selectedRows: T[]) => void;
//   onView?: (row: T) => void;
//   onDelete?: (row: T) => void;
//   showDeleteButton?: boolean;
//   showCheckbox?: boolean;
//   showViewButton?: boolean;
//   viewAllButton?: React.ReactNode;
// };

// export function SimpleTable<T extends { [key: string]: any }>({
//   title,
//   data,
//   columns,
//   onRowSelect,
//   onView,
//   onDelete,
//   showDeleteButton = false,
//   showCheckbox = false,
//   showViewButton = true,
//   viewAllButton,
// }: SimpleTableProps<T>) {
//   const [selectedRows, setSelectedRows] = React.useState<Set<number>>(
//     new Set()
//   );

//   const handleCheckbox = (index: number) => {
//     const newSelection = new Set(selectedRows);
//     if (newSelection.has(index)) {
//       newSelection.delete(index);
//     } else {
//       newSelection.add(index);
//     }
//     setSelectedRows(newSelection);
//     onRowSelect?.(Array.from(newSelection).map((i) => data[i]));
//   };

//   return (
//     <div className={`p-4 bg-white  rounded-xl   overflow-y-auto`}>
//       <div className="flex items-center justify-between py-1  ">
//         {title && (
//           <h2 className="mb-4 text-xl font-semibold text-gray-700">{title}</h2>
//         )}
//         {/* <div className="mb-4">{viewAllButton}</div> */}
//       </div>

//       <div className="mt-3 overflow-x-auto ">
//         <table className="w-full ">
//           <thead>
//             <tr className="text-sm text-center text-[#15112C] tracking-wide border-b">
//               {showCheckbox && <th className="pb-2" />}
//               {columns.map((col, i) => (
//                 <th key={i} className="pb-2">
//                   {col.header ?? String(col.key)}
//                 </th>
//               ))}
//               {showViewButton && <th className="pb-2">View</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, index) => (
//               <tr
//                 key={index}
//                 className="text-sm font-medium text-center border-b"
//               >
//                 {showCheckbox && (
//                   <td className="py-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedRows.has(index)}
//                       onChange={() => handleCheckbox(index)}
//                       className="w-4 h-4 form-checkbox"
//                     />
//                   </td>
//                 )}
//                 {columns.map((col, i) => {
//                   const value = row[col.key];

//                   // Built-in rendering for "status"
//                   if (col.key === "status") {
//                     const status = String(value).toLowerCase();
//                     const isNegative =
//                       status === "out of stock" || status === "cancelled";
//                     const isPositive =
//                       status === "in stock" || status === "delivered";

//                     const bgClass = isNegative
//                       ? "bg-[#ffeceb]"
//                       : isPositive
//                       ? "bg-[#e9fbef]"
//                       : "bg-gray-100";

//                     const textClass = isNegative
//                       ? "text-[#ff3b2f]"
//                       : isPositive
//                       ? "text-[#28c260]"
//                       : "text-gray-600";

//                     return (
//                       <td key={i} className="py-3 text-gray-700">
//                         <span
//                           className={`px-3 py-1 text-sm font-medium rounded-xl inline-block ${bgClass} ${textClass}`}
//                         >
//                           {value}
//                         </span>
//                       </td>
//                     );
//                   }

//                   // Fallback to custom render or raw value
//                   return (
//                     <td key={i} className="py-3 text-gray-700">
//                       {col.render ? col.render(value, row) : value ?? "—"}
//                     </td>
//                   );
//                 })}

//                 {showViewButton && (
//                   <td className="py-3">
//                     <div
//                       className="inline-flex items-center justify-center bg-primary-blue p-1 rounded cursor-pointer"
//                       onClick={() => onView?.(row)}
//                     >
//                       <Icon icon="mdi:eye-outline" color="white" width={16} />
//                     </div>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// components/SimpleTable.tsx
import React from "react";
import { Icon } from "@iconify/react";

export type SimpleTableColumn<T> = {
  key: keyof T;
  header?: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type SimpleTableProps<T> = {
  title?: string;
  data: T[];
  columns: SimpleTableColumn<T>[];
  onRowSelect?: (selectedRows: T[]) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
  showDeleteButton?: boolean;
  showCheckbox?: boolean;
  showViewButton?: boolean;
  viewAllButton?: React.ReactNode;
};

export function SimpleTable<T extends { [key: string]: any }>({
  title,
  data,
  columns,
  onRowSelect,
  onView,
  onDelete,
  showDeleteButton = false,
  showCheckbox = false,
  showViewButton = true,
  viewAllButton,
}: SimpleTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(
    new Set()
  );

  const handleCheckbox = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedRows(newSelection);
    onRowSelect?.(Array.from(newSelection).map((i) => data[i]));
  };

  return (
    <div className="px-4 bg-white rounded-xl overflow-y-auto">
      <div className="flex items-center justify-between py-1">
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-gray-700">{title}</h2>
        )}
        {/* <div className="mb-4">{viewAllButton}</div> */}
      </div>

      <div className=" overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-center text-[#15112C] tracking-wide border-b">
              {showCheckbox && <th className="pb-2" />}
              {columns.map((col, i) => (
                <th key={i} className="pb-2">
                  {col.header ?? String(col.key)}
                </th>
              ))}
              {(showViewButton || showDeleteButton) && (
                <th className="pb-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="text-sm font-medium text-center border-b"
              >
                {showCheckbox && (
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => handleCheckbox(index)}
                      className="w-4 h-4 form-checkbox"
                    />
                  </td>
                )}
                {columns.map((col, i) => {
                  const value = row[col.key];

                  // Special handling for status
                  if (col.key === "status") {
                    const status = String(value).toLowerCase();
                    const isNegative =
                      status === "out of stock" || status === "cancelled";
                    const isPositive =
                      status === "in stock" || status === "delivered";

                    const bgClass = isNegative
                      ? "bg-[#ffeceb]"
                      : isPositive
                      ? "bg-[#e9fbef]"
                      : "bg-gray-100";

                    const textClass = isNegative
                      ? "text-[#ff3b2f]"
                      : isPositive
                      ? "text-[#28c260]"
                      : "text-gray-600";

                    return (
                      <td key={i} className="py-3 text-gray-700">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-xl inline-block ${bgClass} ${textClass}`}
                        >
                          {value}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={i} className="py-3 text-gray-700">
                      {col.render ? col.render(value, row) : value ?? "—"}
                    </td>
                  );
                })}

                {(showViewButton || showDeleteButton) && (
                  <td className="py-3 flex items-center justify-center gap-2">
                    {showViewButton && (
                      <div
                        className="inline-flex items-center justify-center bg-primary-blue p-1 rounded cursor-pointer"
                        onClick={() => onView?.(row)}
                      >
                        <Icon icon="mdi:eye-outline" color="white" width={16} />
                      </div>
                    )}
                    {showDeleteButton && (
                      // <div
                      //   className="inline-flex items-center justify-center bg-red-500 p-1 rounded cursor-pointer"
                      //   onClick={() => onDelete?.(row)}
                      // >
                      //   <Icon
                      //     icon="mdi:delete-outline"
                      //     color="red"
                      //     width={16}
                      //   />
                      // </div>

                      <div
                        className="text-xl text-black cursor-pointer bg-red rounded p-1"
                        onClick={() => onDelete?.(row)}
                      >
                        <Icon
                          icon="material-symbols:delete-outline-rounded"
                          fontSize={16}
                          color="white"
                        />
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
