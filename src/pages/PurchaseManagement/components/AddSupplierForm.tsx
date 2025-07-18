import { useForm, useStore } from "@tanstack/react-form";
import clsx from "clsx";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import { InputField } from "../../../components/shared/form_components/InputField";
import Header from "../../../components/shared/table_heading/Header";
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
  supplierSchema,
} from "../purchaseObj";

const AddSupplierForm = () => {
  const { page = "add" } = useParams();
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

  const editData = useStore(supplierStore, (state) => state);
  console.log("editData", editData);
  const form = useForm({
    defaultValues: getSupplierInitialFormValues(
      page,
      editData
    ) as SupplierFormValues,
    validators: {
      onSubmit: supplierSchema,
    },

    onSubmit: async ({ value }) => {
      const formdata = new FormData();
      appendFormData(formdata, value);
      if (page === "add") createSupplier(formdata);
      else updateSupplier({ id: editData?._id, body: formdata });
    },
  });
  console.log("page", page);
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
          className="grid grid-cols-1 gap-4 md:grid-cols-6 "
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}>
          <div className="col-span-4 p-6 space-y-4 bg-white border rounded-xl">
            <div>
              <h1 className="text-xl font-semibold">General Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2"></div>
            </div>
            <div className="w-full">
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
                <form.Field name="addresses.district">
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
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }></textarea>
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
              <form.Field name="name">
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

              <form.Field name="alternatePhone">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Alternate Phone"
                      placeholder="Enter Alternate Phone"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>

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
                  <div className="w-full">
                    <FileDropInput
                      value={field.state.value}
                      onChange={(file) => {
                        field.handleChange(file);
                      }}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            <div className="w-full mb-[2rem]">
              <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full">
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

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={updatePending || isPending}
                className={clsx(
                  "self-end bg-[#df8d29] text-white px-7 my-2 py-2 rounded-xl disabled:bg-[#966830]",
                  (updatePending || isPending) && "cursor-progress"
                )}>
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
