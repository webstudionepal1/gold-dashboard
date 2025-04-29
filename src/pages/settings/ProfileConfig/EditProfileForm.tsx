import { useForm } from "@tanstack/react-form";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { InputField } from "../../../components/shared/form_components/InputField";

import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import Header from "../../../components/shared/table_heading/Header";
import { useGetCompanyDetailsQuery } from "../../../server/api/companyHooks";
import { FieldError } from "../../auth/LoginPage";
import { editCustomerSchema, generateProfileValue } from "../profileObj";
import { useMemo } from "react";

const EditProfileForm = () => {
  const { data, isLoading, isSuccess } = useGetCompanyDetailsQuery();
  const companyData = useMemo(() => isSuccess && data[0], [isSuccess, data]);

  const form = useForm({
    defaultValues: generateProfileValue(),
    validators: {
      onSubmit: editCustomerSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted:", value);
      // Submit to backend or API
    },
  });

  // const termsAccepted = useStore(
  //   form.store,
  //   (state) => state.values.terms_and_conditions
  // );

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between">
          <Header text="Edit Shop Profile" />
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

              <form.Field name="shop_name">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Shop Name"
                      required
                      placeholder="Enter Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div className="flex items-center justify-between gap-4">
                <form.Field name="owner_name">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Owner Name"
                        required
                        placeholder="Enter Owner Name"
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
                        label="Phone Number"
                        required
                        placeholder="eg. +977 327732622"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div className="flex items-center justify-between gap-4">
                <form.Field name="email">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Email"
                        required
                        placeholder="Enter Email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="registration_number">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Registration Number"
                        required
                        placeholder="Enter Registration Number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Address</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <form.Field name="street_address">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Street Address"
                        required
                        placeholder="Enter Street Address"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="city">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="City"
                        options={[
                          { value: "Shape", label: "Shape" },
                          { value: "Size", label: "Size" },
                          { value: "Color", label: "Color" },
                        ]}
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        inputClassname="w-full"
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="flex items-center gap-4 justify-between">
                <form.Field name="country">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Country"
                        options={[
                          { value: "Shape", label: "Shape" },
                          { value: "Size", label: "Size" },
                          { value: "Color", label: "Color" },
                        ]}
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        inputClassname="w-full"
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="zip_code">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Zip Code"
                        options={[
                          { value: "Shape", label: "Shape" },
                          { value: "Size", label: "Size" },
                          { value: "Color", label: "Color" },
                        ]}
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        inputClassname="w-full"
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Business Hours</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <form.Field name="open_day">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Open Day"
                        required
                        placeholder="Sun-Mon"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="opening_time">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Opening Time"
                        type="time"
                        required
                        placeholder="Sun-Mon"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="closing_time">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Closing Time"
                        type="time"
                        required
                        placeholder="Sun-Mon"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <h1 className="text-xl font-semibold">Shop Preference</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <form.Field name="open_day">
                  {(field) => (
                    <div className="w-1/2">
                      <DropdownField
                        label="Payment Method"
                        options={[
                          { value: "cash", label: "Cash" },
                          { value: "Size", label: "Size" },
                          { value: "Color", label: "Color" },
                        ]}
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        inputClassname="w-full"
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <h1 className="text-xl font-semibold">Bank Details</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <form.Field name="bank_name">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Bank Name"
                        required
                        placeholder="Nepal Rastriya Bank Ltd."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="bank_account_number">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Bank Account Number"
                        required
                        placeholder="012334456676823"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <form.Field name="account_name">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Account Name"
                      required
                      placeholder="Barun Gems Modern & Ethic Jewelery"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <button
                type="submit"
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:bg-[#966830]"
              >
                Save
              </button>
            </form>
          </div>
          <div className="flex flex-col self-start w-[35%] space-y-4">
            <div>
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

            <div>
              <div>
                <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl w-full ">
                  <div className="mx-6 my-4">
                    <div>
                      <h1 className="text-xl font-semibold">Upload QR</h1>
                      <div className="border-b border-[#dedde2] w-full my-2  "></div>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                      }}
                    >
                      <form.Field name="qrcode">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileForm;
