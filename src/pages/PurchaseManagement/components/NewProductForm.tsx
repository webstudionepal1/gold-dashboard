// import { Icon } from "@iconify/react/dist/iconify.js";
// import { useForm } from "@tanstack/react-form";
// import { get } from "lodash";
// import { DropdownField } from "../../../components/shared/form_components/Dropdown";
// import { InputField } from "../../../components/shared/form_components/InputField";
// import {
//   IBaseProduct,
//   useGetAllProductsQuery,
// } from "../../../server/api/productHooks";
// import {
//   useCreatePurchaseMutation,
//   useUpdatePurchaseMutation,
// } from "../../../server/api/purchaseHooks";
// import { useGetSupplierQuery } from "../../../server/api/supplierHooks";
// import { FieldError } from "../../auth/LoginPage";
// import { IPurchaseForm, PurchaseSchema } from "../purchaseObj";
// import { useEffect } from "react";

// interface NewProductProps {
//   onClose: () => void;
//   edit?: boolean;
//   data?: IBaseProduct | null;
// }

// const NewProductForm = ({
//   onClose,
//   edit = false,
//   data = null,
// }: NewProductProps) => {
//   const { mutate: createPurchase, isSuccess: createSuccess } =
//     useCreatePurchaseMutation();
//   const { mutate: updatePurchase, isSuccess: updateSuccess } =
//     useUpdatePurchaseMutation();
//   const { data: suppliers, isSuccess } = useGetSupplierQuery();
//   const { data: products, isSuccess: productSuccess } =
//     useGetAllProductsQuery();
//   const suppliersList = isSuccess
//     ? suppliers?.map((item) => ({
//         label: item.name,
//         value: item._id,
//       }))
//     : [];
//   const productList = productSuccess
//     ? products?.map((item) => ({ label: item.name, value: item._id }))
//     : [];

//   const form = useForm({
//     defaultValues: {
//       billNo: edit ? get(data, "billNo") : "",
//       supplier: edit ? get(data, "supplier._id") : "",
//       phone_no: edit ? get(data, "phone", "") : "",
//       products: edit
//         ? get(data, "products", [
//             {
//               product: "",
//               quantity: 1,
//               price: 0,
//               paidAmount: 0,
//               wt: 0,
//             },
//           ])
//         : [
//             {
//               product: "",
//               quantity: 1,
//               price: 0,
//               paidAmount: 0,
//               wt: 0,
//             },
//           ],
//       description: edit ? get(data, "description", "") : "",
//     } as IPurchaseForm,
//     validators: {
//       onSubmit: PurchaseSchema,
//     },
//     onSubmit: async ({ value }) => {
//       if (edit) updatePurchase({ id: data?._id ?? "", body: value });
//       else createPurchase(value);
//     },
//   });

//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       onClose();
//     }
//   }, [createSuccess, updateSuccess, onClose]);

//   // Function to get product weight by ID
//   const getProductWeight = (productId: string) => {
//     const product = products?.find((p) => p._id === productId);
//     return product?.variant?.[0]?.wt ?? 0;
//   };

//   return (
//     <div>
//       <form
//         className="flex flex-col gap-4 mx-4 bg-white"
//         onSubmit={(e) => {
//           e.preventDefault();
//           form.handleSubmit();
//         }}
//       >
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <form.Field name="billNo">
//             {(field) => (
//               <div className="w-full">
//                 <InputField
//                   label="Bill No."
//                   required
//                   placeholder="65656965"
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                 />
//                 <FieldError field={field} />
//               </div>
//             )}
//           </form.Field>

//           <form.Field name="supplier">
//             {(field) => (
//               <div className="w-full">
//                 <DropdownField
//                   label="Suppliers Name"
//                   required
//                   firstInput="Select Supplier "
//                   options={suppliersList}
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                 />
//                 <FieldError field={field} />
//               </div>
//             )}
//           </form.Field>
//         </div>

//         <form.Field name="products" mode="array">
//           {(field) => (
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <h1 className="text-xl font-semibold">Product Information</h1>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     field.pushValue({
//                       product: "",
//                       quantity: 1,
//                       price: 0,
//                       paidAmount: 0,
//                       wt: 0,
//                     })
//                   }
//                   className="px-3 py-2 text-sm flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
//                 >
//                   <Icon
//                     icon="material-symbols-light:add-rounded"
//                     width="18"
//                     height="18"
//                     className="fill-white"
//                   />
//                   Product
//                 </button>
//               </div>
//               {field.state.value.map((_, index: number) => (
//                 <div
//                   key={index.toString()}
//                   className="bg-[#ffffff] border-[#e7e7e7] border-2 rounded-xl px-3 py-2"
//                 >
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <form.Field name={`products[${index}].product`}>
//                       {(field) => (
//                         <div className="w-full">
//                           <DropdownField
//                             label="Product Name"
//                             required
//                             value={field.state.value}
//                             onChange={(e) => {
//                               field.handleChange(e.target.value);
//                               // Update weight field when product changes
//                               const weight = getProductWeight(e.target.value);
//                               form.setFieldValue(
//                                 `products[${index}].wt`,
//                                 weight
//                               );
//                             }}
//                             options={productList}
//                           />
//                           <FieldError field={field} />
//                         </div>
//                       )}
//                     </form.Field>

//                     <form.Field name={`products[${index}].quantity`}>
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="Quantity"
//                             type="number"
//                             value={field.state.value}
//                             onChange={(e) =>
//                               field.handleChange(Number(e.target.value))
//                             }
//                           />
//                           <FieldError field={field} />
//                         </div>
//                       )}
//                     </form.Field>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                     <form.Field name={`products[${index}].price`}>
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="Price (Rs.)"
//                             placeholder="Tola"
//                             required
//                             value={field.state.value}
//                             onChange={(e) =>
//                               field.handleChange(Number(e.target.value))
//                             }
//                           />
//                           <FieldError field={field} />
//                         </div>
//                       )}
//                     </form.Field>
//                     <form.Field name={`products[${index}].paidAmount`}>
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="Paid Price (Rs.)"
//                             required
//                             placeholder="176,000"
//                             value={field.state.value}
//                             onChange={(e) =>
//                               field.handleChange(Number(e.target.value))
//                             }
//                           />
//                           <FieldError field={field} />
//                         </div>
//                       )}
//                     </form.Field>
//                     <form.Field name={`products[${index}].wt`}>
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="Weight"
//                             placeholder="Weight"
//                             value={field.state.value}
//                             onChange={(e) =>
//                               field.handleChange(Number(e.target.value))
//                             }
//                           />
//                           <FieldError field={field} />
//                         </div>
//                       )}
//                     </form.Field>
//                   </div>

//                   {index > 0 && (
//                     <div className="flex items-center justify-end px-2 py-2">
//                       <button
//                         type="button"
//                         onClick={() => field.removeValue(index)}
//                         className="px-3 py-1 border-[#de8d28] border-2 text-[#de8d28] rounded-xl"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </form.Field>

//         <form.Field name="description">
//           {(field) => (
//             <div className="flex flex-col">
//               <label className="text-[#98999e] font-semibold mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={field.state.value}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1 placeholder:text-[#858492]"
//                 placeholder="Enter Short Description"
//               ></textarea>
//             </div>
//           )}
//         </form.Field>

//         <div className="border-b border-[#dedde2] w-full"></div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl"
//           >
//             Create
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NewProductForm;

// Second

import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "@tanstack/react-form";
import { get } from "lodash";
import { z } from "zod";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";
import {
  IBaseProduct,
  useGetAllProductsQuery,
} from "../../../server/api/productHooks";
import {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
} from "../../../server/api/purchaseHooks";
import { useGetSupplierQuery } from "../../../server/api/supplierHooks";
import { FieldError } from "../../auth/LoginPage";
import { useEffect } from "react";

// Updated PurchaseSchema to enforce non-negative quantity
export const PurchaseSchema = z.object({
  billNo: z.string().min(1, "**Bill No is required**"),
  supplier: z.string().min(1, "**Supplier name is required**"),
  products: z
    .array(
      z.object({
        product: z.string().min(1, "**Product name is required**"),
        quantity: z.coerce
          .number()
          .min(0, "**Quantity must be non-negative**")
          .optional(),
        price: z.coerce.number().min(1, "**Price is required**"),
        paidAmount: z.coerce.number().min(1, "**Paid Amount is required**"),
        wt: z.coerce.number().optional(),
      })
    )
    .min(1, "**At least one product is required**"),
});

export interface IPurchaseForm {
  billNo: string;
  supplier: string;
  products: {
    product: string;
    quantity?: number;
    price: number;
    paidAmount: number;
    wt?: number;
  }[];
}

interface NewProductProps {
  onClose: () => void;
  edit?: boolean;
  data?: IBaseProduct | null;
}

const NewProductForm = ({
  onClose,
  edit = false,
  data = null,
}: NewProductProps) => {
  // Debug logging for edit mode
  if (edit && data) {
    console.log("=== EDIT MODE DEBUG ===");
    console.log("Raw data received:", data);
    console.log("Supplier field:", get(data, "supplier"));
    console.log("Supplier type:", typeof get(data, "supplier"));
    console.log("Products field:", get(data, "products"));
    console.log("=======================");
  }
  const { mutate: createPurchase, isSuccess: createSuccess } =
    useCreatePurchaseMutation();
  const { mutate: updatePurchase, isSuccess: updateSuccess } =
    useUpdatePurchaseMutation();
  const { data: suppliers, isSuccess } = useGetSupplierQuery();
  const { data: products, isSuccess: productSuccess } =
    useGetAllProductsQuery();
  const suppliersList = isSuccess
    ? suppliers?.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    : [];
  const productList = productSuccess
    ? products?.map((item) => ({ label: item.name, value: item._id }))
    : [];

  const form = useForm({
    defaultValues: {
      billNo: edit ? get(data, "billNo", "") : "",
      supplier: edit
        ? // Handle both populated object and string ID cases
          typeof get(data, "supplier") === "object"
          ? get(data, "supplier._id", "") || get(data, "supplier.id", "")
          : get(data, "supplier", "")
        : "",
      phone_no: edit ? get(data, "phone", "") : "",
      products: edit
        ? get(data, "products", []).map((product: any) => ({
            product:
              typeof product.product === "object"
                ? product.product._id || product.product.id || ""
                : product.product || "",
            quantity: product.quantity || 1,
            price: product.price || 0,
            paidAmount: product.paidAmount || 0,
            wt: product.wt || 0,
          }))
        : [
            {
              product: "",
              quantity: 1,
              price: 0,
              paidAmount: 0,
              wt: 0,
            },
          ],
    } as IPurchaseForm,
    validators: {
      onSubmit: PurchaseSchema,
    },
    onSubmit: async ({ value }) => {
      if (edit) updatePurchase({ id: data?._id ?? "", body: value });
      else createPurchase(value);
    },
  });

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      onClose();
    }
  }, [createSuccess, updateSuccess, onClose]);

  // Function to get product weight by ID
  const getProductWeight = (productId: string) => {
    const product = products?.find((p) => p._id === productId);
    return product?.variant?.[0]?.wt ?? 0;
  };

  return (
    <div>
      <form
        className="flex flex-col gap-4 mx-4 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <form.Field name="billNo">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Bill No."
                  required
                  placeholder="65656965"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="supplier">
            {(field) => (
              <div className="w-full">
                <DropdownField
                  label="Suppliers Name"
                  required
                  firstInput="Select Supplier "
                  options={suppliersList}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="products" mode="array">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Product Information</h1>
                <button
                  type="button"
                  onClick={() =>
                    field.pushValue({
                      product: "",
                      quantity: 1,
                      price: 0,
                      paidAmount: 0,
                      wt: 0,
                    })
                  }
                  className="px-3 py-2 text-sm flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
                >
                  <Icon
                    icon="material-symbols-light:add-rounded"
                    width="18"
                    height="18"
                    className="fill-white"
                  />
                  Product
                </button>
              </div>
              {field.state.value.map((_, index: number) => (
                <div
                  key={index.toString()}
                  className="bg-[#ffffff] border-[#e7e7e7] border-2 rounded-xl px-3 py-2"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field name={`products[${index}].product`}>
                      {(field) => (
                        <div className="w-full">
                          <DropdownField
                            label="Product Name"
                            required
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              // Update weight field when product changes
                              const weight = getProductWeight(e.target.value);
                              form.setFieldValue(
                                `products[${index}].wt`,
                                weight
                              );
                            }}
                            options={productList}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name={`products[${index}].quantity`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Quantity"
                            type="number"
                            min={0} // Prevent negative input
                            placeholder="0"
                            value={
                              field.state.value === 0 ? "" : field.state.value
                            }
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value) || 0)
                            }
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <form.Field name={`products[${index}].price`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Price (Rs.)"
                            type="number"
                            placeholder="0"
                            required
                            value={
                              field.state.value === 0 ? "" : field.state.value
                            }
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value) || 0)
                            }
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                    <form.Field name={`products[${index}].paidAmount`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Paid Price (Rs.)"
                            type="number"
                            required
                            placeholder="0"
                            value={
                              field.state.value === 0 ? "" : field.state.value
                            }
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value) || 0)
                            }
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                    <form.Field name={`products[${index}].wt`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Weight"
                            type="number"
                            placeholder="0"
                            value={
                              field.state.value === 0 ? "" : field.state.value
                            }
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value) || 0)
                            }
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {index > 0 && (
                    <div className="flex items-center justify-end px-2 py-2">
                      <button
                        type="button"
                        onClick={() => field.removeValue(index)}
                        className="px-3 py-1 border-[#de8d28] border-2 text-[#de8d28] rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </form.Field>

        <div className="border-b border-[#dedde2] w-full"></div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductForm;
