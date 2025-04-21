import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Pagination from "./_table/_Pagination";
import { DeleteDialog } from "./DeleteDialog";

export type TableData<T = Record<string, any>> = {
  _id: string;
} & T;

export type ColumnConfig<T> = {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: TableData<T>) => React.ReactNode;
};

type TableProps<T extends Record<string, any>> = {
  data: TableData<T>[];
  columns: ColumnConfig<T>[];
  onRowSelect?: (selectedIds: string[]) => void;
  viewRow?: (row: TableData<T>) => void;
  editRow?: (row: TableData<T>) => void;
  deleteRow?: (row: TableData<T>) => void;
  returnRow?: (row: TableData<T>) => void;
  onToggle?: (row: TableData<T>, isSingle?: boolean) => void;
  onButtonClick?: (row: TableData<T>) => void;
  buttonTitle?: string;
  showDelete?: boolean;
  showEdit?: boolean;
  showView?: boolean;
  showReturn?: boolean;
  showButton?: boolean;
  showToggle?: boolean;
  showAction?: boolean;
  showSelectAll?: boolean;
  showBg?: boolean;
  hasPadding?: boolean;
  showPagination?: boolean;
  paginationDetails?: {
    currentPage: number;
    limit: number;
    totalCount?: number;
  };
  conditionRendering?: boolean;
  totalCount?: number;
  onItemsPerPageChange?: (page: number) => void;
  onPageChange?: (page: number) => void;
  showPrint?: boolean;
  printAction?: (row: TableData<T>) => void;
};

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  onRowSelect,
  viewRow,
  editRow,
  onToggle,
  deleteRow,
  returnRow,
  showDelete = false,
  showEdit,
  showView,
  showReturn = false,
  showToggle,
  showAction = true,
  showSelectAll = true,
  showButton,
  buttonTitle,
  onButtonClick,
  showBg = true,
  hasPadding = true,
  showPagination = false,
  paginationDetails,
  onItemsPerPageChange,
  onPageChange,
  totalCount,
  conditionRendering = false,
  showPrint = false,
  printAction,
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set()
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<TableData<T> | null>(null);
  const [rowToReturn, setRowToReturn] = useState<TableData<T> | null>(null);

  const handleRowSelect = (row: TableData<T>) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(row._id)) {
      newSelectedRows.delete(row._id);
    } else {
      newSelectedRows.add(row._id);
    }
    setSelectedRows(newSelectedRows);
    onRowSelect?.(Array.from(newSelectedRows));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIds = data.map((row) => row._id);
      setSelectedRows(new Set(allIds));
      onRowSelect?.(allIds);
    }
  };

  const handleToggle = (row: TableData<T>) => {
    setToggledRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(row._id)) {
        newSet.delete(row._id);
      } else {
        newSet.add(row._id);
      }
      return newSet;
    });
    onToggle?.(row);
  };

  const handleDelete = (row: TableData<T>) => {
    setRowToDelete(row);
    setShowDeleteDialog(true);
  };

  const handleReturn = (row: TableData<T>) => {
    setRowToReturn(row);
  };

  const handleDeleteConfirm = () => {
    if (rowToDelete && deleteRow) {
      deleteRow(rowToDelete);
    }
    setShowDeleteDialog(false);
    setRowToDelete(null);
  };

  const [_, setToggledRows] = useState(new Set());

  return (
    <div className="flex flex-col w-full ">
      <div className="w-full overflow-auto">
        <div className="min-w-full max-w-screen-md w-full h-fit ">
          <section className=" w-full rounded-xl overflow-hidden border border-[#e0e2e5] ">
            <table className="min-w-full w-full    ">
              <thead className={showBg ? "bg-fade-bg" : ""}>
                <tr className="justify-between border border-[#e0e2e5]  bg-[#f8f9fd]">
                  {showSelectAll && (
                    <th
                      scope="col"
                      className="px-6   py-3 text-center text-xs font-medium"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        checked={selectedRows.size === data?.length}
                        onChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </th>
                  )}
                  {columns?.map((column, index) => (
                    <th
                      key={`${column.key}-${index}`}
                      scope="col"
                      className={`${
                        hasPadding ? "px-6" : ""
                      } py-3   text-center text-sm text-nowrap font-semibold text-fade-black tracking-wider ${
                        column.width ? `w-[${column.width}]` : ""
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                  {showAction && (
                    <th
                      scope="col"
                      className="px-6 py-3 mr-4 text-center flex justify-end text-sm font-semibold text-fade-black tracking-wider"
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white ">
                {data?.length ? (
                  data.map((row, index) => (
                    <tr
                      key={`${row._id}-${index}`}
                      className={`border border-[#e0e2e5]${
                        index % 2 === 0 && showBg ? "bg-fade-bg" : ""
                      }`}
                    >
                      {showSelectAll && (
                        <td className="px-6 py-4 flex items-center justify-center whitespace-nowrap ">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                            checked={selectedRows?.has(row._id)}
                            onChange={() => handleRowSelect(row)}
                            aria-label={`Select row ${row._id}`}
                          />
                        </td>
                      )}

                      {columns?.map((column, index) => (
                        <td
                          key={`${row._id}-${index}`}
                          className={`${
                            hasPadding && "px-6  cursor-pointer"
                          } py-4 whitespace-nowrap text-center`}
                          onClick={() => viewRow?.(row)}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : typeof row[column.key] === "boolean"
                            ? row[column.key]
                              ? "Yes"
                              : "No"
                            : row[column.key] ?? "N/A"}
                        </td>
                      ))}

                      {showAction && (
                        <td className="px-6 flex justify-end md:min-w-[10rem] w-full gap-3 py-4 place-items-center text-right text-sm font-medium ">
                          {showToggle && (
                            <div
                              key={`toggle-${row._id}`}
                              className="flex text-black cursor-pointer"
                              onClick={() => handleToggle(row)}
                            >
                              <label
                                htmlFor={`toggle-${row._id}`}
                                className="flex cursor-pointer relative"
                              >
                                <input
                                  type="checkbox"
                                  id={`toggle-${row._id}`}
                                  className="sr-only"
                                  checked={row.isActive}
                                  onChange={() => handleToggle(row)}
                                />
                                <div
                                  className={`toggle-bg border-2 h-[18px] w-[36px] rounded-full transition-colors duration-200 ease-in-out ${
                                    row.isActive
                                      ? "bg-[#76EE59] "
                                      : "bg-[#B1BAC8] "
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

                          {!conditionRendering && showButton && (
                            <button
                              key={`button-${row._id}`}
                              className="px-2 py-1 bg-lynch-400 text-white rounded text-xs"
                              onClick={() => onButtonClick?.(row)}
                            >
                              {buttonTitle}
                            </button>
                          )}

                          {showView && (
                            <div
                              key={`view-${row._id}`}
                              className="text-xl text-black cursor-pointer bg-primary-blue rounded p-1"
                              onClick={() => viewRow?.(row)}
                            >
                              <Icon
                                icon="mdi:eye-outline"
                                fontSize={16}
                                color="white"
                              />
                            </div>
                          )}

                          {showEdit && (
                            <div
                              key={`edit-${row._id}`}
                              className="text-xl text-black cursor-pointer bg-green rounded p-1"
                              onClick={() => editRow?.(row)}
                            >
                              <Icon
                                icon="lucide:pen-line"
                                fontSize={16}
                                color="white"
                              />
                            </div>
                          )}

                          {showReturn && (
                            <div
                              key={`return-${row._id}`}
                              className="text-xl text-black cursor-pointer bg-[#df8d29] rounded p-1"
                              onClick={() => returnRow?.(row)}
                            >
                              <Icon
                                icon="carbon:return"
                                width="16"
                                height="16"
                                className="text-white"
                              />
                            </div>
                          )}

                          {showPrint && (
                            <div
                              key={`print-${row._id}`}
                              className="text-xl text-black cursor-pointer"
                              onClick={() => printAction?.(row)}
                            >
                              <Icon
                                icon="material-symbols:print"
                                fontSize={16}
                                color="#FF4D4D"
                              />
                            </div>
                          )}

                          {showDelete && (
                            <div
                              key={`delete-${row._id}`}
                              className="text-xl text-black cursor-pointer bg-red rounded p-1"
                              onClick={() => handleDelete(row)}
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (showSelectAll ? 1 : 0) +
                        (showAction ? 1 : 0)
                      }
                      className="text-center py-8"
                    >
                      No data was found
                    </td>
                  </tr>
                )}
              </tbody>
              {showPagination && (
                <tfoot>
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (showSelectAll ? 1 : 0) +
                        (showAction ? 1 : 0)
                      }
                      className="py-4"
                    >
                      <div className="flex justify-between items-center w-full px-6">
                        <Pagination
                          currentPage={paginationDetails?.currentPage ?? 1}
                          itemsPerPage={paginationDetails?.limit ?? 10}
                          totalItems={
                            paginationDetails?.totalCount ?? totalCount ?? 0
                          }
                          onItemsPerPageChange={(page: number) =>
                            onItemsPerPageChange?.(page)
                          }
                          onPageChange={(page: number) => onPageChange?.(page)}
                        />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </section>
        </div>
      </div>

      {/* {showPagination && (
        <section className="flex flex-col bg-[#ffffff] mt-2 " id="pagination">
          <Pagination
            currentPage={paginationDetails?.currentPage ?? 1}
            itemsPerPage={paginationDetails?.limit ?? 10}
            totalItems={paginationDetails?.totalCount ?? totalCount ?? 0}
            onItemsPerPageChange={(page: number) =>
              onItemsPerPageChange?.(page)
            }
            onPageChange={(page: number) => onPageChange?.(page)}
          />
        </section>
      )} */}

      <DeleteDialog
        confirmAction={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

// import { Icon } from "@iconify/react/dist/iconify.js";
// import React, { useState } from "react";
// import Pagination from "./_table/_Pagination";
// import { DeleteDialog } from "./DeleteDialog";

// export type TableData<T = Record<string, any>> = {
//   _id: string;
// } & T;

// export type ColumnConfig<T> = {
//   key: string;
//   header: string;
//   width?: string;
//   render?: (value: any, row: TableData<T>) => React.ReactNode;
// };

// type TableProps<T extends Record<string, any>> = {
//   data: TableData<T>[];
//   columns: ColumnConfig<T>[];
//   onRowSelect?: (selectedIds: string[]) => void;
//   viewRow?: (row: TableData<T>) => void;
//   editRow?: (row: TableData<T>) => void;
//   deleteRow?: (row: TableData<T>) => void;
//   onToggle?: (row: TableData<T>, isSingle?: boolean) => void;
//   onButtonClick?: (row: TableData<T>) => void;
//   buttonTitle?: string;
//   showDelete?: boolean;
//   showEdit?: boolean;
//   showView?: boolean;
//   showButton?: boolean;
//   showToggle?: boolean;
//   showAction?: boolean;
//   showSelectAll?: boolean;
//   showBg?: boolean;
//   hasPadding?: boolean;
//   showPagination?: boolean;
//   paginationDetails?: {
//     currentPage: number;
//     limit: number;
//     totalCount?: number;
//   };
//   tableClass?: string;
//   conditionRendering?: boolean;
//   totalCount?: number;
//   onItemsPerPageChange?: (page: number) => void;
//   onPageChange?: (page: number) => void;
//   showPrint?: boolean;
//   printAction?: (row: TableData<T>) => void;
// };

// export const Table = <T extends Record<string, any>>({
//   data,
//   columns,
//   onRowSelect,
//   viewRow,
//   editRow,
//   onToggle,
//   deleteRow,
//   showDelete = false,
//   showEdit,
//   showView,
//   showToggle,
//   showAction = true,
//   showSelectAll = true,
//   showButton,
//   buttonTitle,
//   onButtonClick,
//   showBg = true,
//   hasPadding = true,
//   showPagination = false,
//   paginationDetails,
//   onItemsPerPageChange,
//   onPageChange,
//   totalCount,
//   tableClass,
//   conditionRendering = false,
//   showPrint = false,
//   printAction,
// }: TableProps<T>) => {
//   const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
//     new Set()
//   );
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [rowToDelete, setRowToDelete] = useState<TableData<T> | null>(null);

//   const handleRowSelect = (row: TableData<T>) => {
//     const newSelectedRows = new Set(selectedRows);
//     if (newSelectedRows.has(row._id)) {
//       newSelectedRows.delete(row._id);
//     } else {
//       newSelectedRows.add(row._id);
//     }
//     setSelectedRows(newSelectedRows);
//     onRowSelect?.(Array.from(newSelectedRows));
//   };

//   const handleSelectAll = () => {
//     if (selectedRows.size === data.length) {
//       setSelectedRows(new Set());
//       onRowSelect?.([]);
//     } else {
//       const allIds = data.map((row) => row._id);
//       setSelectedRows(new Set(allIds));
//       onRowSelect?.(allIds);
//     }
//   };

//   const handleToggle = (row: TableData<T>) => {
//     setToggledRows((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(row._id)) {
//         newSet.delete(row._id);
//       } else {
//         newSet.add(row._id);
//       }
//       return newSet;
//     });
//     onToggle?.(row);
//   };

//   const handleDelete = (row: TableData<T>) => {
//     setRowToDelete(row);
//     setShowDeleteDialog(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (rowToDelete && deleteRow) {
//       deleteRow(rowToDelete);
//     }
//     setShowDeleteDialog(false);
//     setRowToDelete(null);
//   };

//   const [_, setToggledRows] = useState(new Set());

//   return (
//     <div className="flex flex-col w-full ">
//       <div className="w-full overflow-auto">
//         <div className="min-w-full max-w-screen-md w-full h-fit ">
//           <section
//             className={` w-full rounded-xl overflow-hidden ${
//               tableClass ?? "border border-[#e0e2e5]"
//             } `}
//           >
//             <table className="min-w-full w-full    ">
//               <thead className={showBg ? "bg-fade-bg" : ""}>
//                 <tr
//                   className={`justify-between ${
//                     tableClass ?? "border border-[#e0e2e5]  bg-[#f8f9fd]"
//                   } `}
//                 >
//                   {showSelectAll && (
//                     <th
//                       scope="col"
//                       className="px-6   py-3 text-center text-xs font-medium"
//                     >
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                         checked={selectedRows.size === data?.length}
//                         onChange={handleSelectAll}
//                         aria-label="Select all rows"
//                       />
//                     </th>
//                   )}
//                   {columns?.map((column, index) => (
//                     <th
//                       key={`${column.key}-${index}`}
//                       scope="col"
//                       className={`${
//                         hasPadding ? "px-6" : ""
//                       } py-3   text-center text-sm text-nowrap font-semibold text-fade-black tracking-wider ${
//                         column.width ? `w-[${column.width}]` : ""
//                       }`}
//                     >
//                       {column.header}
//                     </th>
//                   ))}
//                   {showAction && (
//                     <th
//                       scope="col"
//                       className="px-6 py-3 mr-4 text-center flex justify-end text-sm font-semibold text-fade-black tracking-wider"
//                     >
//                       Action
//                     </th>
//                   )}
//                 </tr>
//               </thead>

//               <tbody className="bg-white ">
//                 {data?.length ? (
//                   data.map((row, index) => (
//                     <tr
//                       key={`${row._id}-${index}`}
//                       className={`${tableClass ?? "border border-[#e0e2e5]"} ${
//                         index % 2 === 0 && showBg ? "bg-fade-bg" : ""
//                       }`}
//                     >
//                       {showSelectAll && (
//                         <td className="px-6 py-4 flex items-center justify-center whitespace-nowrap ">
//                           <input
//                             type="checkbox"
//                             className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
//                             checked={selectedRows?.has(row._id)}
//                             onChange={() => handleRowSelect(row)}
//                             aria-label={`Select row ${row._id}`}
//                           />
//                         </td>
//                       )}

//                       {columns?.map((column, index) => (
//                         <td
//                           key={`${row._id}-${index}`}
//                           className={`${
//                             hasPadding && "px-6  cursor-pointer"
//                           } py-4 whitespace-nowrap text-center`}
//                           onClick={() => viewRow?.(row)}
//                         >
//                           {column.render
//                             ? column.render(row[column.key], row)
//                             : typeof row[column.key] === "boolean"
//                             ? row[column.key]
//                               ? "Yes"
//                               : "No"
//                             : row[column.key] ?? "N/A"}
//                         </td>
//                       ))}

//                       {showAction && (
//                         <td className="px-6 flex justify-end md:min-w-[10rem] w-full gap-3 py-4 place-items-center text-right text-sm font-medium ">
//                           {showToggle && (
//                             <div
//                               key={`toggle-${row._id}`}
//                               className="flex text-black cursor-pointer"
//                               onClick={() => handleToggle(row)}
//                             >
//                               <label
//                                 htmlFor={`toggle-${row._id}`}
//                                 className="flex cursor-pointer relative"
//                               >
//                                 <input
//                                   type="checkbox"
//                                   id={`toggle-${row._id}`}
//                                   className="sr-only"
//                                   checked={row.isActive}
//                                   onChange={() => handleToggle(row)}
//                                 />
//                                 <div
//                                   className={`toggle-bg border-2 h-[18px] w-[36px] rounded-full transition-colors duration-200 ease-in-out ${
//                                     row.isActive
//                                       ? "bg-[#76EE59] "
//                                       : "bg-[#B1BAC8] "
//                                   }`}
//                                 >
//                                   <div
//                                     className={`toggle-dot absolute left-0 top-1/2 -translate-y-1/2 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${
//                                       row.isActive
//                                         ? "translate-x-[19px] border-blue-600"
//                                         : "translate-x-[1px] border-gray-200"
//                                     }`}
//                                   />
//                                 </div>
//                               </label>
//                             </div>
//                           )}

//                           {!conditionRendering && showButton && (
//                             <button
//                               key={`button-${row._id}`}
//                               className="px-2 py-1 bg-lynch-400 text-white rounded text-xs"
//                               onClick={() => onButtonClick?.(row)}
//                             >
//                               {buttonTitle}
//                             </button>
//                           )}

//                           {showView && (
//                             <div
//                               key={`view-${row._id}`}
//                               className="text-xl text-black cursor-pointer bg-primary-blue rounded p-1"
//                               onClick={() => viewRow?.(row)}
//                             >
//                               <Icon
//                                 icon="mdi:eye-outline"
//                                 fontSize={16}
//                                 color="white"
//                               />
//                             </div>
//                           )}

//                           {showEdit && (
//                             <div
//                               key={`edit-${row._id}`}
//                               className="text-xl text-black cursor-pointer bg-green rounded p-1"
//                               onClick={() => editRow?.(row)}
//                             >
//                               <Icon
//                                 icon="lucide:pen-line"
//                                 fontSize={16}
//                                 color="white"
//                               />
//                             </div>
//                           )}

//                           {showPrint && (
//                             <div
//                               key={`print-${row._id}`}
//                               className="text-xl text-black cursor-pointer"
//                               onClick={() => printAction?.(row)}
//                             >
//                               <Icon
//                                 icon="material-symbols:print"
//                                 fontSize={16}
//                                 color="#FF4D4D"
//                               />
//                             </div>
//                           )}

//                           {showDelete && (
//                             <div
//                               key={`delete-${row._id}`}
//                               className="text-xl text-black cursor-pointer bg-red rounded p-1"
//                               onClick={() => handleDelete(row)}
//                             >
//                               <Icon
//                                 icon="material-symbols:delete-outline-rounded"
//                                 fontSize={16}
//                                 color="white"
//                               />
//                             </div>
//                           )}
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={
//                         columns.length +
//                         (showSelectAll ? 1 : 0) +
//                         (showAction ? 1 : 0)
//                       }
//                       className="text-center py-8"
//                     >
//                       No data was found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//               {showPagination && (
//                 <tfoot>
//                   <tr>
//                     <td
//                       colSpan={
//                         columns.length +
//                         (showSelectAll ? 1 : 0) +
//                         (showAction ? 1 : 0)
//                       }
//                       className="py-4"
//                     >
//                       <div className="flex justify-between items-center w-full px-6">
//                         <Pagination
//                           currentPage={paginationDetails?.currentPage ?? 1}
//                           itemsPerPage={paginationDetails?.limit ?? 10}
//                           totalItems={
//                             paginationDetails?.totalCount ?? totalCount ?? 0
//                           }
//                           onItemsPerPageChange={(page: number) =>
//                             onItemsPerPageChange?.(page)
//                           }
//                           onPageChange={(page: number) => onPageChange?.(page)}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 </tfoot>
//               )}
//             </table>
//           </section>
//         </div>
//       </div>

//       {/* {showPagination && (
//         <section className="flex flex-col bg-[#ffffff] mt-2 " id="pagination">
//           <Pagination
//             currentPage={paginationDetails?.currentPage ?? 1}
//             itemsPerPage={paginationDetails?.limit ?? 10}
//             totalItems={paginationDetails?.totalCount ?? totalCount ?? 0}
//             onItemsPerPageChange={(page: number) =>
//               onItemsPerPageChange?.(page)
//             }
//             onPageChange={(page: number) => onPageChange?.(page)}
//           />
//         </section>
//       )} */}

//       <DeleteDialog
//         confirmAction={showDeleteDialog}
//         onClose={() => setShowDeleteDialog(false)}
//         onConfirm={handleDeleteConfirm}
//       />
//     </div>
//   );
// };
