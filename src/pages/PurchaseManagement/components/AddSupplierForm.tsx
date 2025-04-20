import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";

import { z } from "zod";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import { useStore } from "@tanstack/react-form";
import { DropdownTagField } from "../../../components/shared/form_components/DropdownTags";
import { useState } from "react";
const AddSupplierSchema = z.object({
  supplier_name: z.string().min(1, "Supplier Name is required"),
  business_type: z.string().min(1, "Business Type is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone_no: z.string().min(1, "Phone Number is required"),
  address: z.string().min(1, "Address is required"),

  payment_terms: z.string().min(1, "Payment Terms is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  branch: z.string().min(1, "Branch is required"),
  account_name: z.string().min(1, "Account Name is required"),
  account_number: z.string().min(10, "Account number is required"),
  company_number: z.string().min(8, "Company number is required"),
  pan_no: z.string().min(10, "PAN number is required"),

  item_supplied: z.string().min(1, "Item supplied is required"),

  username: z.string().min(1, "User Name is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      "Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character"
    ),
  terms_and_conditions: z.literal(true, {
    errorMap: () => ({ message: "Follow through the terms and conditions" }),
  }),

  profile_photo: z.instanceof(File, {
    message: "Profile photo is required",
  }),
  mobile_image: z.instanceof(File, {
    message: "Mobile Image is required",
  }),
});
const AddSupplierForm = () => {
  const FieldError = ({ field }: { field: any }) => {
    if (field.state.meta.errors.length > 0) {
      const error = field.state.meta.errors[0];
      // Handle the case where the error is an object
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || JSON.stringify(error);

      return (
        <div className="min-h-[20px]">
          <span className="text-xs text-red">{errorMessage}</span>
        </div>
      );
    }
    return <div className="min-h-[20px]"></div>; // Return empty div when no errors
  };

  const form = useForm({
    defaultValues: {
      supplier_name: "",
      business_type: "",
      name: "",
      email: "",
      phone_no: "",
      address: "",
      payment_terms: "",
      bank_name: "",
      branch: "",
      account_name: "",
      account_number: "",
      company_number: "",
      pan_no: "",
      item_supplied: "",
      username: "",
      password: "",
      terms_and_conditions: false,
      profile_photo: null as File | null,
      mobile_image: null as File | null,
    },
    validators: {
      onSubmit: AddSupplierSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted:", value);
      // Submit to backend or API
    },
  });

  const termsAccepted = useStore(
    form.store,
    (state) => state.values.terms_and_conditions
  );

  const [selectedTagItems, setSelectedTagItems] = useState<string[]>([]);
  return (
    <>
      <div className="mx-8 my-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Add Suppliers</h1>
          <Breadcrumbs />
        </div>

        <div className="flex items-center justify-between my-2 gap-4">
          <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-[70%] ">
            <form
              className="flex flex-col gap-4 mx-4 my-6 "
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div>
                <h1 className="text-xl font-semibold">General Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="w-full">
                <form.Field name="supplier_name">
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

                <form.Field name="business_type">
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

                <form.Field name="address">
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
                <div className="flex flex-col">
                  <label className="text-[#98999e] font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-4 py-3   placeholder:text-[#858492]"
                    placeholder="Enter Short Description"
                  ></textarea>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Contact Person</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
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

                <form.Field name="phone_no">
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
              </div>

              <div>
                <h1 className="text-xl font-semibold">Payment Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <form.Field name="payment_terms">
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

                <form.Field name="bank_name">
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

                <form.Field name="branch">
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

              <div className="flex items-center gap-4 ">
                <form.Field name="account_name">
                  {(field) => (
                    <div className="w-[15.5rem]">
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

                <form.Field name="account_number">
                  {(field) => (
                    <div className="w-[15.5rem]">
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

              <button
                type="submit"
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:bg-[#966830]"
              >
                Save
              </button>
            </form>
          </div>
          <div className="flex flex-col mb-[14.5rem] ">
            <div className="w-full mb-[2rem]    ">
              <div>
                <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
                  <div className="mx-6 my-4">
                    <div>
                      <h1 className="text-xl font-semibold">
                        Upload Profile Photo
                      </h1>
                      <div className="border-b border-[#dedde2] w-full my-2  "></div>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                      }}
                    >
                      <form.Field name="profile_photo">
                        {(field) => (
                          <div className="w-full">
                            <FileDropInput
                              value={field.state.value as unknown as File}
                              onChange={(file) => {
                                field.handleChange(file);
                              }}
                            />
                            <FieldError field={field} />
                          </div>
                        )}
                      </form.Field>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mb-[2rem]    ">
              <div className="">
                <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
                  <div className="mx-6 my-4">
                    <div>
                      <h1 className="text-xl font-semibold">
                        Business Information
                      </h1>
                      <div className="border-b border-[#dedde2] w-full my-2  "></div>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                      }}
                    >
                      <div className="w-full">
                        <form.Field name="company_number">
                          {(field) => (
                            <div className="w-full">
                              <InputField
                                label="Company Number"
                                required
                                placeholder="Enter Company Number"
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              <FieldError field={field} />
                            </div>
                          )}
                        </form.Field>

                        <form.Field name="business_type">
                          {(field) => (
                            <div className="w-full">
                              <InputField
                                label="Business Type"
                                required
                                placeholder="Enter Business Type"
                                value={field.state.value}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                              <FieldError field={field} />
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mb-[2rem]    ">
              <div>
                <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
                  <div className="mx-6 my-4">
                    <div>
                      <h1 className="text-xl font-semibold">Item Supplied</h1>
                      <div className="border-b border-[#dedde2] w-full mt-2 mb-4  "></div>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                      }}
                    >
                      <div className="w-full ">
                        <form.Field name="item_supplied">
                          {(field) => (
                            <div className="w-full">
                              <DropdownTagField
                                required
                                values={selectedTagItems}
                                onChange={(newValues) =>
                                  setSelectedTagItems(newValues)
                                }
                                options={[
                                  { value: "gold", label: "Gold" },
                                  { value: "silver", label: "Silver" },
                                  { value: "platinum", label: "Platinum" },
                                ]}
                              />

                              <FieldError field={field} />
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSupplierForm;
