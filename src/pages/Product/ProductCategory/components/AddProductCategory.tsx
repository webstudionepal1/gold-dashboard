// import { useForm } from "@tanstack/react-form";
// import get from "lodash/get";
// import { useEffect, useMemo } from "react";
// import { Modal } from "../../../../components/shared";
// import {
//   IFetchCategory,
//   IProductCategory,
//   useCreateProductCategoriesMutation,
//   useGetAllProductSubCategoriesQuery,
//   useUpdateProductCategoriesMutation
// } from "../../../../server/api/productHooks";
interface propTypes {
  modalRef: React.RefObject<HTMLDivElement | null>;
  editData?: IProductCategory | null;
  closeModal: () => void;
}

// export const AddProductCategory = ({
//   modalRef,
//   editData,
//   closeModal,
// }: propTypes) => {
//   const { data: subcategories, isSuccess } =
//     useGetAllProductSubCategoriesQuery();
//   const { mutate: createCategory, isSuccess: createSuccess } =
//     useCreateProductCategoriesMutation();
//   const { mutate: updateCategory, isSuccess: updateSuccess } =
//     useUpdateProductCategoriesMutation();
//   const subCategoriesList = useMemo(
//     () => (isSuccess ? subcategories : []),
//     [isSuccess, subcategories]
//   );
//   const form = useForm({
//     defaultValues: {
//       name: editData ? get(editData, "name", "") : "",
//       subCategory: editData ? get(editData, "subCategory", []) : [],
//       description: editData ? get(editData, "description", "") : "",
//     },
//     validators: {},

//     onSubmit: async ({ value }) => {
//       if (editData) updateCategory({ id: editData._id, body: value });
//       else createCategory(value);
//     },
//   });

//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       form.reset();
//       closeModal();
//     }
//   }, [createSuccess, updateSuccess]);
//   return (
//     <Modal classname="w-[450px]" ref={modalRef}>
//       <form
//         className="p-6"
//         onSubmit={(e) => {
//           e.preventDefault();
//           form.handleSubmit();
//         }}
//       >
//         <h2 className="mb-6 text-xl font-semibold">
//           {editData ? "Edit Category" : "Add New Category"}
//         </h2>
//         <div className="space-y-6">
//           {/* <div>
//             <label
//               htmlFor="category"
//               className="block mb-1 text-sm font-medium text-gray-700"
//             >
//               Name
//             </label>
//             <form.Field name="name">
//               {(field) => (
//                 <input
//                   id="category"
//                   type="text"
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500}`}
//                   placeholder="Enter Category name"
//                 />
//               )}
//             </form.Field>
//           </div> */}
//           <div>
//             <label
//               htmlFor="subcategory"
//               className="block mb-1 text-sm font-medium text-gray-700"
//             >
//               Subcategory
//             </label>
//             <form.Field name="subCategory">
//               {(field) => (
//                 <>
//                   <select
//                     id="subcategory"
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (value && !field.state.value.includes(value)) {
//                         field.handleChange([...field.state.value, value]);
//                       }
//                     }}
//                     className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     defaultValue=""
//                   >
//                     <option value="" disabled>
//                       Select Subcategory
//                     </option>
//                     {subCategoriesList.map((item) => (
//                       <option key={item._id} value={item._id}>
//                         {item.name}
//                       </option>
//                     ))}
//                   </select>

//                   {/* Chips for selected subcategories */}
//                   <div className="flex flex-wrap gap-2 mt-3">
//                     {field.state.value.map((item: string, index: number) => (
//                       <div
//                         key={index}
//                         className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
//                       >
//                         {subCategoriesList.find((i) => i._id === item)?.name}
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const newList = field.state.value.filter(
//                               (_:any, i: number) => i !== index
//                             );
//                             field.handleChange(newList);
//                           }}
//                           className="ml-2 text-blue-500 hover:text-blue-700"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </form.Field>
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="block mb-1 text-sm font-medium text-gray-700"
//             >
//               Description *
//             </label>
//             <form.Field name="description">
//               {(field) => (
//                 <textarea
//                   id="description"
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                   rows={3}
//                   placeholder="Enter short description"
//                 />
//               )}
//             </form.Field>
//           </div>
//         </div>
//         <div className="flex justify-between gap-3 mt-6">
//           <button
//             type="button"
//             onClick={closeModal}
//             className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-7 py-2 bg-[#DF8D28] hover:bg-[#DF8D28]/90 text-white rounded-md text-sm font-medium transition-colors duration-200"
//           >
//             {editData ? "Update" : "Add"}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// };



import React from "react";
import { IProductCategory } from "../../../../server/api/productHooks";

const AddProductCategory = ({ modalRef, editData, closeModal }: propTypes) => {
  console.log(modalRef, editData, closeModal);
  return <div>AddProductCategory</div>;
};

export default AddProductCategory;
