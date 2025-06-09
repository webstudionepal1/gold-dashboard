import { useForm, useStore } from "@tanstack/react-form";
import clsx from "clsx";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { DropdownTagField } from "../../../components/shared/form_components/DropdownTags";
import MultiImageUploader from "../../../components/shared/form_components/FileDropInput";
import { InputField } from "../../../components/shared/form_components/InputField";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllProductsQuery } from "../../../server/api/productHooks";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../../../server/api/supplierHooks";
import { supplierStore } from "../../../store/supplierStore";
import { FieldError } from "../../auth/LoginPage";
import {
  appendFormData,
  getSupplierInitialFormValues,
  SupplierFormValues,
} from "../purchaseObj";

const AddSupplierForm = () => {
  const { page = "add" } = useParams();
  const { data: products, isSuccess } = useGetAllProductsQuery();
  const {
    mutate: createSupplier,
    isPending,
    isSuccess: createSuccess,
  } = useCreateSupplierMutation();
  const {
    mutate: updateSupplier,
    isPending: updatePending,
    isSuccess: updateSuccess,
  } = useUpdateSupplierMutation();
  const productsList = isSuccess
    ? products?.map((item) => ({ label: item.name, value: item._id }))
    : [];

  const editData = useStore(supplierStore, (state) => state);
  console.log("editData", editData);
  const form = useForm({
    defaultValues: getSupplierInitialFormValues(
      page,
      editData
    ) as SupplierFormValues,
    // validators: {
    //   onChange: supplierSchema,
    // },

    onSubmit: async ({ value }) => {
      const formdata = new FormData();

      appendFormData(formdata, value);

      console.log(formdata, "SAVING DATA");
      if (page === "add") createSupplier(formdata);
      else updateSupplier({ id: editData?._id, body: formdata });
    },
  });
  useEffect(() => {
    if (createSuccess || updateSuccess) form.reset();
  }, [updateSuccess, createSuccess]);

  return (
    <>
      <div className="">
        <Header text={page === "Edit" ? "Edit Supplier" : "Add Supplier"}>
          <Breadcrumbs />
        </Header>

        <form
          className="grid grid-cols-1 gap-4 lg:grid-cols-6 "
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="col-span-4 p-6 space-y-4 bg-white border rounded-xl">
            <div>
              <h1 className="text-xl font-semibold">General Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between gap-4">
                <form.Field name="name">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Supplier Name"
                        required
                        placeholder="Enter Supplier Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Email"
                        type="email"
                        required
                        placeholder="Enter Email Address"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="phone">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Phone No"
                        required
                        placeholder="Enter Phone No."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="businessType">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Business Type"
                      required
                      placeholder="Enter Business Type"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div className="flex items-center justify-between gap-4">
                <form.Field name="addresses.address">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Address"
                        required
                        placeholder="Enter Address"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="addresses.district">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="District"
                        required
                        placeholder="Enter District"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="addresses.province">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Province"
                        required
                        placeholder="Enter Province"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="description">
                {(field) => (
                  <div className="flex flex-col">
                    <label className="text-[#98999e] font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-4 py-3 placeholder:text-[#858492]"
                      placeholder="Enter Short Description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    ></textarea>
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <h1 className="text-xl font-semibold">Contact Person</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <form.Field name="contactPerson.name">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Name"
                      required
                      placeholder="Enter Full Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="contactPerson.phone">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Phone No"
                      required
                      placeholder="Enter Phone No."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="contactPerson.email">
              {(field) => (
                <div className="w-full">
                  <InputField
                    label="Email"
                    type="email"
                    required
                    placeholder="Enter Email Address"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <div>
              <h1 className="text-xl font-semibold">Payment Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <form.Field name="bankDetails.paymentTerms">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Payment Terms"
                      required
                      placeholder="Enter Payment Terms"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="bankDetails.bankName">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Bank Name"
                      required
                      placeholder="Enter Bank Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="bankDetails.branch">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Branch"
                      required
                      placeholder="Enter Branch"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="flex items-center gap-4">
              <form.Field name="bankDetails.accountHolderName">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Account Name"
                      required
                      placeholder="Enter Account Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="bankDetails.accountNumber">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Account Number"
                      required
                      placeholder="Enter Account Number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>
          <div className="col-span-2">
            <div className="p-6 bg-white border rounded-xl">
              <div>
                <h1 className="text-xl font-semibold">Upload Profile Photo</h1>
                <div className="border-b w-full border-[#dedde2] my-2" />
              </div>
              <form.Field name="logo">
                {(field) => (
                  <div>
                    <MultiImageUploader
                      label=""
                      value={field.state.value as File[]}
                      onChange={(files: File[]) => field.handleChange(files)}
                      existingImages={
                        form.getFieldValue("existingImages") as [string]
                      }
                      existingImagefield="existingImages"
                      form={form}
                    />
                    {field.state.meta.isTouched && <FieldError field={field} />}
                  </div>
                )}
              </form.Field>
            </div>
            <div className="w-full mb-[2rem]">
              <div className="bg-[#ffffff] border-[#eeeeee] border-2  rounded-xl w-full">
                <div className="mx-6 my-4">
                  <div>
                    <h1 className="text-xl font-semibold">
                      Business Information
                    </h1>
                    <div className="border-b border-[#dedde2] w-full my-2"></div>
                  </div>
                  <div className="w-full">
                    <form.Field name="businessInfo.company">
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Company"
                            required
                            placeholder="Enter Company"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="businessInfo.companyNumber">
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Company Number"
                            required
                            placeholder="Enter Company Number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="businessInfo.PAN">
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="PAN Number"
                            required
                            placeholder="Enter PAN Number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white border rounded-xl">
              <div>
                <h1 className="text-xl font-semibold">Item Supplied</h1>
                <div className="border-b border-[#dedde2] w-full mt-2 mb-4"></div>
              </div>
              <div className="w-full">
                <form.Field name="products" mode="array">
                  {(field) => (
                    <div className="w-full">
                      <DropdownTagField
                        required
                        values={field.state.value}
                        onChange={(newValues) => {
                          field.handleChange(newValues);
                        }}
                        options={productsList}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className={clsx(
                  "self-end bg-[#df8d29] text-white px-7 my-2 py-2 rounded-xl disabled:bg-[#966830]",
                  (updatePending || isPending) && "cursor-progress"
                )}
              >
                {page === "Edit" ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSupplierForm;

// import { useForm, useStore } from "@tanstack/react-form";
// import clsx from "clsx";
// import { useCallback, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Breadcrumbs from "../../../components/shared/Breadcrumb";
// import { DropdownTagField } from "../../../components/shared/form_components/DropdownTags";
// import MultiImageUploader from "../../../components/shared/form_components/FileDropInput";
// import { InputField } from "../../../components/shared/form_components/InputField";
// import Header from "../../../components/shared/table_heading/Header";
// import { useGetAllProductsQuery } from "../../../server/api/productHooks";
// import {
//   useCreateSupplierMutation,
//   useUpdateSupplierMutation,
// } from "../../../server/api/supplierHooks";
// import { supplierStore } from "../../../store/supplierStore";
// import { FieldError } from "../../auth/LoginPage";
// import {
//   appendFormData,
//   getSupplierInitialFormValues,
//   SupplierFormValues,
//   supplierSchema,
// } from "../purchaseObj";

// const AddSupplierForm = () => {
//   const { page = "add" } = useParams();
//   const { data: products, isSuccess } = useGetAllProductsQuery();
//   const {
//     mutate: createSupplier,
//     isPending,
//     isSuccess: createSuccess,
//   } = useCreateSupplierMutation();
//   const {
//     mutate: updateSupplier,
//     isPending: updatePending,
//     isSuccess: updateSuccess,
//   } = useUpdateSupplierMutation();
//   const productsList = isSuccess
//     ? products?.map((item) => ({ label: item.name, value: item._id }))
//     : [];

//   const editData = useStore(supplierStore, (state) => state);

//   // State for logo preview (for edit mode) and file errors
//   const [logoPreview, setLogoPreview] = useState<string[]>([]);
//   const [fileErrors, setFileErrors] = useState<string[]>([]);

//   // Initialize logo preview for edit mode
//   useEffect(() => {
//     if (
//       page === "edit" &&
//       editData?.logo &&
//       typeof editData.logo === "string"
//     ) {
//       setLogoPreview([editData.logo]); // Assuming editData.logo is a URL
//     }
//   }, [page, editData]);

//   const form = useForm({
//     defaultValues: getSupplierInitialFormValues(
//       page,
//       editData
//     ) as SupplierFormValues,
//     validators: {
//       onSubmit: supplierSchema,
//     },
//     onSubmit: async ({ value }) => {
//       const formdata = new FormData();
//       appendFormData(formdata, value);
//       console.log(formdata, "SAVING DATA");
//       if (page === "add") createSupplier(formdata);
//       else updateSupplier({ id: editData?._id, body: formdata });
//     },
//   });

//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       form.reset();
//       setLogoPreview([]); // Clear logo preview on reset
//       setFileErrors([]); // Clear file errors on reset
//     }
//   }, [updateSuccess, createSuccess]);

//   // Error handler for FileDropInput
//   const handleFileError = useCallback(
//     (fieldApi: any) => (error: string) => {
//       setFileErrors([error]); // Store file error in state
//       fieldApi.pushErrors([error]); // Add error to field
//     },
//     []
//   );

//   return (
//     <>
//       <div className="">
//         <Header text={page === "Edit" ? "Edit Supplier" : "Add Supplier"}>
//           <Breadcrumbs />
//         </Header>

//         <form
//           className="grid grid-cols-1 gap-4 md:grid-cols-6"
//           onSubmit={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             form.handleSubmit();
//           }}
//         >
//           <div className="col-span-4 p-6 space-y-4 bg-white border rounded-xl">
//             <div>
//               <h1 className="text-xl font-semibold">General Information</h1>
//               <div className="border-b border-[#dedde2] w-full my-2"></div>
//             </div>
//             <div className="w-full">

//               <form.Field
//                 name="businessType"
//                 validators={{
//                   onBlur: fieldSchemas.businessType,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Business Type"
//                       required
//                       placeholder="Enter Business Type"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>

//               <div className="flex items-center justify-between gap-4">
//                 <form.Field
//                   name="addresses.address"
//                   validators={{
//                     onBlur: fieldSchemas.addresses.address,
//                   }}
//                 >
//                   {(field) => (
//                     <div className="w-full">
//                       <InputField
//                         label="Address"
//                         required
//                         placeholder="Enter Address"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                         onBlur={field.handleBlur}
//                       />
//                       {field.state.meta.isTouched && (
//                         <FieldError field={field} />
//                       )}
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field
//                   name="addresses.district"
//                   validators={{
//                     onBlur: fieldSchemas.addresses.district,
//                   }}
//                 >
//                   {(field) => (
//                     <div className="w-full">
//                       <InputField
//                         label="District"
//                         required
//                         placeholder="Enter District"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                         onBlur={field.handleBlur}
//                       />
//                       {field.state.meta.isTouched && (
//                         <FieldError field={field} />
//                       )}
//                     </div>
//                   )}
//                 </form.Field>

//                 <form.Field
//                   name="addresses.province"
//                   validators={{
//                     onBlur: fieldSchemas.addresses.province,
//                   }}
//                 >
//                   {(field) => (
//                     <div className="w-full">
//                       <InputField
//                         label="Province"
//                         required
//                         placeholder="Enter Province"
//                         value={field.state.value}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                         onBlur={field.handleBlur}
//                       />
//                       {field.state.meta.isTouched && (
//                         <FieldError field={field} />
//                       )}
//                     </div>
//                   )}
//                 </form.Field>
//               </div>

//               <form.Field
//                 name="description"
//                 validators={{
//                   onBlur: fieldSchemas.description,
//                 }}
//               >
//                 {(field) => (
//                   <div className="flex flex-col">
//                     <label className="text-[#98999e] font-semibold mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-4 py-3 placeholder:text-[#858492]"
//                       placeholder="Enter Short Description"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     ></textarea>
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>
//             </div>

//             <div>
//               <h1 className="text-xl font-semibold">Contact Person</h1>
//               <div className="border-b border-[#dedde2] w-full my-2"></div>
//             </div>
//             <div className="flex items-center justify-between gap-4">
//               <form.Field
//                 name="contactPerson.name"
//                 validators={{
//                   onBlur: fieldSchemas.contactPerson.name,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Name"
//                       required
//                       placeholder="Enter Full Name"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field
//                 name="contactPerson.phone"
//                 validators={{
//                   onBlur: fieldSchemas.contactPerson.phone,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Phone No"
//                       required
//                       placeholder="Enter Phone No."
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>
//             </div>

//             <form.Field
//               name="contactPerson.email"
//               validators={{
//                 onBlur: fieldSchemas.contactPerson.email,
//               }}
//             >
//               {(field) => (
//                 <div className="w-full">
//                   <InputField
//                     label="Email"
//                     type="email"
//                     required
//                     placeholder="Enter Email Address"
//                     value={field.state.value}
//                     onChange={(e) => field.handleChange(e.target.value)}
//                     onBlur={field.handleBlur}
//                   />
//                   {field.state.meta.isTouched && <FieldError field={field} />}
//                 </div>
//               )}
//             </form.Field>

//             <div>
//               <h1 className="text-xl font-semibold">Payment Information</h1>
//               <div className="border-b border-[#dedde2] w-full my-2"></div>
//             </div>
//             <div className="flex items-center justify-between gap-4">
//               <form.Field
//                 name="bankDetails.paymentTerms"
//                 validators={{
//                   onBlur: fieldSchemas.bankDetails.paymentTerms,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Payment Terms"
//                       required
//                       placeholder="Enter Payment Terms"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field
//                 name="bankDetails.bankName"
//                 validators={{
//                   onBlur: fieldSchemas.bankDetails.bankName,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Bank Name"
//                       required
//                       placeholder="Enter Bank Name"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field
//                 name="bankDetails.branch"
//                 validators={{
//                   onBlur: fieldSchemas.bankDetails.branch,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Branch"
//                       required
//                       placeholder="Enter Branch"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>
//             </div>

//             <div className="flex items-center gap-4">
//               <form.Field
//                 name="bankDetails.accountHolderName"
//                 validators={{
//                   onBlur: fieldSchemas.bankDetails.accountHolderName,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Account Name"
//                       required
//                       placeholder="Enter Account Name"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>

//               <form.Field
//                 name="bankDetails.accountNumber"
//                 validators={{
//                   onBlur: fieldSchemas.bankDetails.accountNumber,
//                 }}
//               >
//                 {(field) => (
//                   <div className="w-full">
//                     <InputField
//                       label="Account Number"
//                       required
//                       placeholder="Enter Account Number"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>
//             </div>
//           </div>
//           <div className="col-span-2">
//             <div className="p-6 bg-white border rounded-xl">
//               <div>
//                 <h1 className="text-xl font-semibold">Upload Profile Photo</h1>
//                 <div className="border-b w-full border-[#dedde2] my-2" />
//               </div>
//               <form.Field name="logo">
//                 {(field) => (
//                   <div>
//                     <MultiImageUploader
//                       label=""
//                       value={field.state.value as File[]}
//                       onChange={(files: File[]) => field.handleChange(files)}
//                     />
//                     {field.state.meta.isTouched && <FieldError field={field} />}
//                   </div>
//                 )}
//               </form.Field>
//             </div>
//             <div className="w-full mb-[2rem]">
//               <div className="bg-[#ffffff] border-[#eeeeee] border-2 rounded-xl w-full">
//                 <div className="mx-6 my-4">
//                   <div>
//                     <h1 className="text-xl font-semibold">
//                       Business Information
//                     </h1>
//                     <div className="border-b border-[#dedde2] w-full my-2"></div>
//                   </div>
//                   <div className="w-full">
//                     <form.Field
//                       name="businessInfo.company"
//                       validators={{
//                         onBlur: fieldSchemas.businessInfo.company,
//                       }}
//                     >
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="Company"
//                             required
//                             placeholder="Enter Company"
//                             value={field.state.value}
//                             onChange={(e) => field.handleChange(e.target.value)}
//                             onBlur={field.handleBlur}
//                           />
//                           {field.state.meta.isTouched && (
//                             <FieldError field={field} />
//                           )}
//                         </div>
//                       )}
//                     </form.Field>

//                     <form.Field
//                       name="businessInfo.companyNumber"
//                       validators={{
//                         onBlur: fieldSchemas.businessInfo.companyNumber,
//                       }}
//                     >
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="Company Number"
//                             required
//                             placeholder="Enter Company Number"
//                             value={field.state.value}
//                             onChange={(e) => field.handleChange(e.target.value)}
//                             onBlur={field.handleBlur}
//                           />
//                           {field.state.meta.isTouched && (
//                             <FieldError field={field} />
//                           )}
//                         </div>
//                       )}
//                     </form.Field>

//                     <form.Field
//                       name="businessInfo.PAN"
//                       validators={{
//                         onBlur: fieldSchemas.businessInfo.PAN,
//                       }}
//                     >
//                       {(field) => (
//                         <div className="w-full">
//                           <InputField
//                             label="PAN Number"
//                             required
//                             placeholder="Enter PAN Number"
//                             value={field.state.value}
//                             onChange={(e) => field.handleChange(e.target.value)}
//                             onBlur={field.handleBlur}
//                           />
//                           {field.state.meta.isTouched && (
//                             <FieldError field={field} />
//                           )}
//                         </div>
//                       )}
//                     </form.Field>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 bg-white border rounded-xl">
//               <div>
//                 <h1 className="text-xl font-semibold">Item Supplied</h1>
//                 <div className="border-b border-[#dedde2] w-full mt-2 mb-4"></div>
//               </div>
//               <div className="w-full">
//                 <form.Field
//                   name="products"
//                   mode="array"
//                   validators={{
//                     onBlur: fieldSchemas.products,
//                   }}
//                 >
//                   {(field) => (
//                     <div className="w-full">
//                       <DropdownTagField
//                         required
//                         values={field.state.value}
//                         onChange={(newValues) => {
//                           field.handleChange(newValues);
//                         }}
//                         options={productsList}
//                         // onBlur={field.handleBlur}
//                       />
//                       {field.state.meta.isTouched && (
//                         <FieldError field={field} />
//                       )}
//                     </div>
//                   )}
//                 </form.Field>
//               </div>
//             </div>
//             <div className="flex items-center justify-end">
//               <button
//                 type="submit"
//                 className={clsx(
//                   "self-end bg-[#df8d29] text-white px-7 my-2 py-2 rounded-xl disabled:bg-[#966830]",
//                   (updatePending || isPending) && "cursor-progress"
//                 )}
//                 disabled={updatePending || isPending}
//               >
//                 {page === "Edit" ? "Update" : "Save"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default AddSupplierForm;
