import { useForm, useStore } from "@tanstack/react-form";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import MultiImageUploader from "../../../components/shared/form_components/FileDropInput";
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
} from "../purchaseObj";
import { cleanObject } from "../../../utils/cleanObject";

const AddSupplierForm = () => {
  const { page = "add" } = useParams();
  const [formKey, setFormKey] = useState(0); // Force re-render key

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

  // Debug logging to understand the data structure
  console.log("Page parameter:", page);
  console.log("Edit data from store:", editData);
  console.log("Edit data type:", typeof editData);
  console.log("Is edit data an array?", Array.isArray(editData));
  console.log("Edit data keys:", editData ? Object.keys(editData) : "No data");

  // If editData is an array, log the first element
  if (Array.isArray(editData) && editData.length > 0) {
    console.log("First element of edit data array:", editData[0]);
    console.log("First element keys:", Object.keys(editData[0]));
  }
  // Handle array data if needed
  const actualEditData =
    Array.isArray(editData) && editData.length > 0 ? editData[0] : editData;

  // Determine if we're in edit mode
  const isEditMode = page === "edit" || (actualEditData && actualEditData._id);
  const formState = isEditMode ? "edit" : "add";

  console.log("Is edit mode:", isEditMode);
  console.log("Form state:", formState);

  const form = useForm({
    defaultValues: getSupplierInitialFormValues(
      formState,
      actualEditData
    ) as SupplierFormValues,
    // validators: {
    //   onChange: supplierSchema,
    // },

    onSubmit: async ({ value }) => {
      const formdata = new FormData();
      const formattedData = cleanObject(value);
      delete formattedData["logo"];
      delete formattedData["existingLogo"];

      appendFormData(formdata, formattedData);
      if (value.logo) {
        formdata.append("logo", value.logo);
      }

      if (formState === "add") {
        console.log("Creating new supplier");
        createSupplier(formdata);
      } else {
        console.log("Updating supplier with ID:", editData?._id);
        updateSupplier({ id: editData?._id, body: formdata });
      }
    },
  });
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      console.log("Form reset triggered");
      // Reset with initial values to ensure proper reset
      form.reset(getSupplierInitialFormValues("add"));
      // Force complete form re-render by changing key
      // setFormKey((prev) => prev + 1);
      history.back();
    }
  }, [updateSuccess, createSuccess, form]);

  return (
    <>
      <div className="">
        <Header text={isEditMode ? "Edit Supplier" : "Add Supplier"}>
          <Breadcrumbs />
        </Header>

        <form
          key={formKey} // Force re-render when key changes
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
                      multiple={false}
                      onChange={(file) => field.handleChange(file)}
                      value={field.state.value}
                      existingFile={form.getFieldValue("existingLogo")}
                      existingFileField="existingLogo"
                      label="Upload Profile Photo"
                      form={form}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
                      }}
                      placeholder="Upload company logo (optional)"
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

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className={clsx(
                  "self-end bg-[#df8d29] text-white px-7 my-2 py-2 rounded-xl disabled:bg-[#966830]",
                  (updatePending || isPending) && "cursor-progress"
                )}
              >
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSupplierForm;
