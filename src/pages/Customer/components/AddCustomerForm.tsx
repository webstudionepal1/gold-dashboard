import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";

import { z } from "zod";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import { useStore } from "@tanstack/react-form";
import { FieldError } from "../../auth/LoginPage";
const AddCustomerSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  email: z.string().min(1, "Email is required"),
  phone_no: z.string().min(1, "Phone Number is required"),
  address: z.string().min(1, "Address is required"),
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
const AddCustomerForm = () => {
  const form = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone_no: "",
      address: "",
      username: "",
      password: "",
      terms_and_conditions: false,
      profile_photo: null as File | null,
      mobile_image: null as File | null,
    },
    validators: {
      onSubmit: AddCustomerSchema,
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

  return (
    <>
      <div className="mx-8 my-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Add New Customer</h1>
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
              <div className="flex items-center w-full gap-4">
                <form.Field name="full_name">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Full Name"
                        required
                        placeholder="Full Name"
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
                        placeholder="example@gmail.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="flex items-center justify-between gap-4">
                <form.Field name="phone_no">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Phone No"
                        required
                        placeholder="+977 8272377237"
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
                        placeholder="295 Plymouth Street, Halifax MA 2338"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Account Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <form.Field name="username">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Username"
                        required
                        placeholder="lola_li@outlook.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="username">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Username"
                        required
                        placeholder="lola_li@outlook.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="username">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Username"
                        required
                        placeholder="lola_li@outlook.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <h1 className="text-xl font-semibold">Terms and Conditions</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="w-full">
                <form.Field name="terms_and_conditions">
                  {(field) => (
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.state.value}
                            onChange={(e) =>
                              field.handleChange(e.target.checked)
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">
                            I agree to the Terms and Conditions
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>
              <button
                disabled={!termsAccepted}
                type="submit"
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl disabled:bg-[#966830]"
              >
                Save
              </button>
            </form>
          </div>
          <div className="w-[30%] mb-[26rem]    ">
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
                              if (!Array.isArray(file)) {
                                field.handleChange(file);
                              }
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
    </>
  );
};

export default AddCustomerForm;
