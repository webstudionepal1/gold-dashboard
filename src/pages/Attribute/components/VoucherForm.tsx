// import React from "react";
// import { useForm } from "@tanstack/react-form";
// import { DropdownField } from "../../../components/shared/form_components/Dropdown";
// import { InputField } from "../../../components/shared/form_components/InputField";

// interface voucherFormProps {
//   closeModal: () => void;
// }
// export const VoucherForm = ({ closeModal }: voucherFormProps) => {
//   const form = useForm({
//     defaultValues: {
//       code: "",
//       type: "",
//       discount: "",
//       startDate: "",
//       endDate: "",
//     },
//     onSubmit: async ({ value }) => {
//       console.log("Voucher Form Submitted:", value);
//     },
//   });

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         form.handleSubmit();
//         closeModal();
//       }}
//       className="p-10 flex flex-col gap-10"
//     >
//       <p className="text-lg font-bold text-black text-center">Add Voucher</p>

//       <section className="flex flex-col gap-6">
//         <form.Field name="code">
//           {(field) => (
//             <InputField
//               label="Code"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//               placeholder="e.g Christmas Sale"
//             />
//           )}
//         </form.Field>
//         {/* Dropdown Row */}
//         <div className="flex gap-4 w-full">
//           <form.Field name="type">
//             {(field) => (
//               <div className="w-1/2">
//                 <DropdownField
//                   label="Type"
//                   options={[
//                     { value: "fixed", label: "Fixed" },
//                     { value: "percentage", label: "Percentage" },
//                   ]}
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   inputClassname="w-full"
//                 />
//               </div>
//             )}
//           </form.Field>

//           <form.Field name="discount">
//             {(field) => (
//               <div className="w-1/2">
//                 <DropdownField
//                   label="Discount"
//                   options={[
//                     { value: "shipping", label: "Shipping" },
//                     { value: "product", label: "Product" },
//                   ]}
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                   inputClassname="w-full"
//                 />
//               </div>
//             )}
//           </form.Field>
//         </div>

//         {/* Date Inputs Row */}
//         <div className="flex gap-4 w-full">
//           <form.Field name="startDate">
//             {(field) => (
//               <div className="w-1/2">
//                 <InputField
//                   label="Start Date"
//                   type="date"
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                 />
//               </div>
//             )}
//           </form.Field>

//           <form.Field name="endDate">
//             {(field) => (
//               <div className="w-1/2">
//                 <InputField
//                   label="End Date"
//                   type="date"
//                   value={field.state.value}
//                   onChange={(e) => field.handleChange(e.target.value)}
//                 />
//               </div>
//             )}
//           </form.Field>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={closeModal}
//             className="bg-[#c9c9c9] py-2 px-6 rounded w-full text-base self-start hover:scale-105 transition-transform"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={closeModal}
//             type="submit"
//             className="bg-[#df8d29] text-white py-2 px-6 rounded w-full text-base self-start hover:scale-105 transition-transform"
//           >
//             Create
//           </button>
//         </div>
//       </section>
//     </form>
//   );
// };

import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";

interface VoucherFormProps {
  closeModal: () => void;
  initialValues?: {
    code: string;
    type: string;
    discount: string;
    startDate: string;
    endDate: string;
  };
  onSubmit: (data: {
    code: string;
    type: string;
    discount: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({
  closeModal,
  initialValues = {
    code: "",
    type: "",
    discount: "",
    startDate: "",
    endDate: "",
  },
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      closeModal();
    },
  });

  useEffect(() => {
    form.reset();
  }, [
    initialValues.code,
    initialValues.type,
    initialValues.discount,
    initialValues.startDate,
    initialValues.endDate,
  ]);

  const isEditing =
    initialValues.code !== "" ||
    initialValues.type !== "" ||
    initialValues.discount !== "" ||
    initialValues.startDate !== "" ||
    initialValues.endDate !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="p-10 flex flex-col gap-10"
    >
      <p className="text-lg font-bold text-black text-center">
        {isEditing ? "Edit Voucher" : "Add Voucher"}
      </p>

      <section className="flex flex-col gap-6">
        <form.Field name="code">
          {(field) => (
            <InputField
              label="Code"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g Christmas Sale"
            />
          )}
        </form.Field>

        {/* Dropdown Row */}
        <div className="flex gap-4 w-full">
          <form.Field name="type">
            {(field) => (
              <div className="w-1/2">
                <DropdownField
                  label="Type"
                  options={[
                    { value: "fixed", label: "Fixed" },
                    { value: "percentage", label: "Percentage" },
                  ]}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="discount">
            {(field) => (
              <div className="w-1/2">
                <DropdownField
                  label="Discount"
                  options={[
                    { value: "shipping", label: "Shipping" },
                    { value: "product", label: "Product" },
                  ]}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* Date Inputs Row */}
        <div className="flex gap-4 w-full">
          <form.Field name="startDate">
            {(field) => (
              <div className="w-1/2">
                <InputField
                  label="Start Date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="endDate">
            {(field) => (
              <div className="w-1/2">
                <InputField
                  label="End Date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="bg-[#c9c9c9] py-2 px-6 rounded w-full text-base self-start hover:scale-105 transition-transform"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-[#df8d29] text-white py-2 px-6 rounded w-full text-base self-start hover:scale-105 transition-transform"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </section>
    </form>
  );
};
