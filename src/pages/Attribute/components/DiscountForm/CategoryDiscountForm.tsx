// import React, { useState } from "react";
// import { InputField } from "../../../../components/shared/form_components/InputField";
// import { DropdownField } from "../../../../components/shared/form_components/Dropdown";

// interface DiscountSet {
//   category: string;
//   subCategory: string;
//   type: string;
//   discount: string;
//   startDate: string;
//   endDate: string;
// }

// interface CategoryDiscountFormProps {
//   closeModal: () => void;
// }

// export const CategoryDiscountForm = ({
//   closeModal,
// }: CategoryDiscountFormProps) => {
//   const [discountGroups, setDiscountGroups] = useState<DiscountSet[]>([
//     {
//       category: "",
//       subCategory: "",
//       type: "",
//       discount: "",
//       startDate: "",
//       endDate: "",
//     },
//   ]);

//   const handleFieldChange = (
//     index: number,
//     field: keyof DiscountSet,
//     value: string
//   ) => {
//     const updated = [...discountGroups];
//     updated[index][field] = value;
//     setDiscountGroups(updated);
//   };

//   const addMore = () => {
//     setDiscountGroups([
//       ...discountGroups,
//       {
//         category: "",
//         subCategory: "",
//         type: "",
//         discount: "",
//         startDate: "",
//         endDate: "",
//       },
//     ]);
//   };

//   const removeGroup = (index: number) => {
//     if (discountGroups.length === 1) return;
//     setDiscountGroups(discountGroups.filter((_, i) => i !== index));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Submitted Discount Groups:", discountGroups);
//     closeModal();
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto px-2"
//     >
//       {discountGroups.map((group, index) => (
//         <div
//           key={index}
//           className="relative border-b border-[#dedde2] pb-4 flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm"
//         >
//           {discountGroups.length > 1 && (
//             <button
//               type="button"
//               onClick={() => removeGroup(index)}
//               className="absolute top-2 right-2 text-red-500 hover:underline text-sm"
//             >
//               Remove
//             </button>
//           )}

//           <InputField
//             label="Category Name"
//             value={group.category}
//             onChange={(e) =>
//               handleFieldChange(index, "category", e.target.value)
//             }
//             placeholder="e.g. Electronics"
//           />

//           <InputField
//             label="Sub Category"
//             value={group.subCategory}
//             onChange={(e) =>
//               handleFieldChange(index, "subCategory", e.target.value)
//             }
//             placeholder="e.g. Christmas Sale"
//           />

//           <div className="flex gap-4 w-full">
//             <div className="w-1/2">
//               <DropdownField
//                 label="Type"
//                 options={[
//                   { value: "fixed", label: "Fixed" },
//                   { value: "percentage", label: "Percentage" },
//                 ]}
//                 value={group.type}
//                 onChange={(e) =>
//                   handleFieldChange(index, "type", e.target.value)
//                 }
//                 inputClassname="w-full"
//               />
//             </div>

//             <div className="w-1/2">
//               <DropdownField
//                 label="Discount"
//                 options={[
//                   { value: "shipping", label: "Shipping" },
//                   { value: "product", label: "Product" },
//                 ]}
//                 value={group.discount}
//                 onChange={(e) =>
//                   handleFieldChange(index, "discount", e.target.value)
//                 }
//                 inputClassname="w-full"
//               />
//             </div>
//           </div>

//           <div className="flex gap-4 w-full">
//             <div className="w-1/2">
//               <InputField
//                 label="Start Date"
//                 type="date"
//                 value={group.startDate}
//                 onChange={(e) =>
//                   handleFieldChange(index, "startDate", e.target.value)
//                 }
//               />
//             </div>

//             <div className="w-1/2">
//               <InputField
//                 label="End Date"
//                 type="date"
//                 value={group.endDate}
//                 onChange={(e) =>
//                   handleFieldChange(index, "endDate", e.target.value)
//                 }
//               />
//             </div>
//           </div>
//         </div>
//       ))}

//       <button
//         type="button"
//         onClick={addMore}
//         className="bg-[#f7e8c9] px-3 py-2 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 w-fit"
//       >
//         + Add More
//       </button>

//       <div className="flex items-center gap-3 pt-4">
//         <button
//           type="button"
//           onClick={closeModal}
//           className="bg-[#c9c9c9] py-2 px-6 rounded w-full text-base hover:scale-105 transition-transform"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           className="bg-[#df8d29] text-white py-2 px-6 rounded w-full text-base hover:scale-105 transition-transform"
//         >
//           Create
//         </button>
//       </div>
//     </form>
//   );
// };

import React, { useState } from "react";
import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";

interface DiscountSet {
  category: string;
  subCategory: string;
  type: string;
  discount: string;
  startDate: string;
  endDate: string;
}

interface CategoryDiscountFormProps {
  closeModal: () => void;
  initialValues?: DiscountSet[];
  mode?: "create" | "edit";
}

export const CategoryDiscountForm = ({
  closeModal,
  initialValues,
  mode = "create",
}: CategoryDiscountFormProps) => {
  const [discountGroups, setDiscountGroups] = useState<DiscountSet[]>(
    initialValues?.length
      ? initialValues
      : [
          {
            category: "",
            subCategory: "",
            type: "",
            discount: "",
            startDate: "",
            endDate: "",
          },
        ]
  );

  const handleFieldChange = (
    index: number,
    field: keyof DiscountSet,
    value: string
  ) => {
    const updated = [...discountGroups];
    updated[index][field] = value;
    setDiscountGroups(updated);
  };

  const addMore = () => {
    setDiscountGroups([
      ...discountGroups,
      {
        category: "",
        subCategory: "",
        type: "",
        discount: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeGroup = (index: number) => {
    if (discountGroups.length === 1) return;
    setDiscountGroups(discountGroups.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Discount Groups:", discountGroups);
    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto px-2"
    >
      {discountGroups.map((group, index) => (
        <div
          key={index}
          className="relative border-b border-[#dedde2] pb-4 flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm"
        >
          {discountGroups.length > 1 && (
            <button
              type="button"
              onClick={() => removeGroup(index)}
              className="absolute top-2 right-2 text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          )}

          <InputField
            label="Category Name"
            value={group.category}
            onChange={(e) =>
              handleFieldChange(index, "category", e.target.value)
            }
            placeholder="e.g. Electronics"
          />

          <InputField
            label="Sub Category"
            value={group.subCategory}
            onChange={(e) =>
              handleFieldChange(index, "subCategory", e.target.value)
            }
            placeholder="e.g. Christmas Sale"
          />

          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <DropdownField
                label="Type"
                options={[
                  { value: "fixed", label: "Fixed" },
                  { value: "percentage", label: "Percentage" },
                ]}
                value={group.type}
                onChange={(e) =>
                  handleFieldChange(index, "type", e.target.value)
                }
                inputClassname="w-full"
              />
            </div>

            <div className="w-1/2">
              <DropdownField
                label="Discount"
                options={[
                  { value: "shipping", label: "Shipping" },
                  { value: "product", label: "Product" },
                ]}
                value={group.discount}
                onChange={(e) =>
                  handleFieldChange(index, "discount", e.target.value)
                }
                inputClassname="w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <InputField
                label="Start Date"
                type="date"
                value={group.startDate}
                onChange={(e) =>
                  handleFieldChange(index, "startDate", e.target.value)
                }
              />
            </div>

            <div className="w-1/2">
              <InputField
                label="End Date"
                type="date"
                value={group.endDate}
                onChange={(e) =>
                  handleFieldChange(index, "endDate", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addMore}
        className="bg-[#f7e8c9] px-3 py-2 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 w-fit"
      >
        + Add More
      </button>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="bg-[#c9c9c9] py-2 px-6 rounded w-full text-base hover:scale-105 transition-transform"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-[#df8d29] text-white py-2 px-6 rounded w-full text-base hover:scale-105 transition-transform"
        >
          {mode === "edit" ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
