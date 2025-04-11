// import { useForm, FieldApi } from "@tanstack/react-form";
// import { z } from "zod";

// import { InputField } from "../../../../components/shared/form_components/InputField";
// import { DropdownField } from "../../../../components/shared/form_components/Dropdown";

// // Define categories directly here
// const categories = [
//   { value: "electronics", label: "Electronics" },
//   { value: "clothing", label: "Clothing" },
//   { value: "books", label: "Books" },
//   { value: "furniture", label: "Furniture" },
//   { value: "groceries", label: "Groceries" },
// ];

// const AddOrderSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   price: z.coerce.number().min(0, "Price must be a positive number"),
//   sku: z.string().min(1, "SKU is required"),
//   category: z.string().min(1, "Select a category"),
//   stock: z.coerce.number().min(0, "Stock must be a non-negative number"),
// });

// type AddOrderValues = z.infer<typeof AddOrderSchema>;

// const FieldError = ({ field }: { field: any }) => {
//   if (field.state.meta.errors.length > 0) {
//     const error = field.state.meta.errors[0];
//     // Handle the case where the error is an object
//     const errorMessage =
//       typeof error === "string"
//         ? error
//         : error.message || JSON.stringify(error);

//     return (
//       <div className="min-h-[20px]">
//         <span className="text-xs text-red-500">{errorMessage}</span>
//       </div>
//     );
//   }
//   return <div className="min-h-[20px]"></div>; // Return empty div when no errors
// };
// export default function AddOrderForm() {
//   const form = useForm({
//     defaultValues: {
//       name: "",
//       price: 0,
//       sku: "",
//       category: "",
//       stock: 0,
//     },
//     validators: {
//       onSubmit: AddOrderSchema,
//     },
//     onSubmit: async ({ value }) => {
//       console.log("Order Submitted:", value);
//       // Submit to backend or API
//     },
//   });

//   return (
//     <form
//       className="flex flex-col gap-6"
//       onSubmit={(e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         form.handleSubmit();
//       }}
//     >
//       <form.Field name="name">
//         {(field) => (
//           <div>
//             <InputField
//               label="Customer Name"
//               required
//               placeholder="e.g., John Doe"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//             />
//             <FieldError field={field} />
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="price">
//         {(field) => (
//           <div>
//             <InputField
//               label="Order Total"
//               required
//               type="number"
//               placeholder="e.g., 250.00"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(Number(e.target.value))}
//             />
//             <FieldError field={field} />
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="sku">
//         {(field) => (
//           <div>
//             <InputField
//               label="Order ID"
//               required
//               placeholder="e.g., ORD-123456"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//             />
//             <FieldError field={field} />
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="category">
//         {(field) => (
//           <div>
//             <DropdownField
//               label="Order Type"
//               required
//               firstInput="Select order type"
//               options={categories}
//               value={field.state.value}
//               onChange={(e) => field.handleChange(e.target.value)}
//             />
//             <FieldError field={field} />
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="stock">
//         {(field) => (
//           <div>
//             <InputField
//               label="Quantity"
//               required
//               type="number"
//               placeholder="e.g., 3"
//               value={field.state.value}
//               onChange={(e) => field.handleChange(Number(e.target.value))}
//             />
//             <FieldError field={field} />
//           </div>
//         )}
//       </form.Field>

//       <button
//         type="submit"
//         className="self-end px-6 py-2 text-white rounded-md bg-primary"
//       >
//         Add Order
//       </button>
//     </form>
//   );
// }

// The code above works which is using @tanstack/react-form with zod

import { useForm, useField } from "@tanstack/react-form";
import { z } from "zod";

import { InputField } from "../../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../../components/shared/form_components/Dropdown";
import Breadcrumbs from "../../../../components/shared/Breadcrumb";
import { PriceInputField } from "./PriceInputField";
import FileDropInput from "../../../../components/shared/form_components/FileDropInput";
import { jsx } from "react/jsx-runtime";
import ToggleSlider from "../../../../components/shared/form_components/ToggleSlider";
import { useState } from "react";

// Define categories directly here
const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "furniture", label: "Furniture" },
  { value: "groceries", label: "Groceries" },
];

const AddOrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  billing_phone: z.string().min(1, "Phone number is required"),
  shipping_address: z.string().min(1, "Shipping Address is required"),
  shipping_information_note: z.string(),
  delivery_partner: z.string().min(1, "Delivery partner is required"),
  shipping_method: z.string().min(1, "Shipping method is required"),
  customer_name: z.string().min(1, "Customer Name is required"),
  address: z.string().min(1, "Address is required"),
  billing_email: z.string().min(1, "Email Address is required"),
  billing_information_note: z.string(),
  item_name: z.string().min(1, "Item name is required"),
  qty: z.coerce.number().min(0, "Quantity is required"),
  discount: z.coerce.number().min(0, "Price must be a positive number"),
  shipping_cost: z.coerce.number().min(0, "Price must be a positive number"),
  taxes: z.coerce.number().min(0, "Price must be a positive number"),
  payment_type: z.string().min(1, "Payment type is required"),
  payment_status: z.boolean({ required_error: "Payment status is required" }),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Select a category"),
  stock: z.coerce.number().min(0, "Stock must be a non-negative number"),
});

type AddOrderValues = z.infer<typeof AddOrderSchema>;

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
export default function AddOrderForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      billing_phone: "",
      shipping_address: "",
      delivery_partner: "",
      shipping_method: "",
      shipping_information_note: "",
      address: "",
      customer_name: "",
      billing_email: "",
      billing_information_note: "",
      item_name: "",
      qty: 0,
      discount: 0,
      shipping_cost: 0,
      taxes: 0,
      payment_type: "",
      payment_status: false,
      price: 0,
      sku: "",
      category: "",
      stock: 0,
    },
    validators: {
      onSubmit: AddOrderSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted:", value);
      // Submit to backend or API
    },
  });

  // Slider component
  const [isEnabled, setIsEnabled] = useState(false);
  const paymentStatusField = useField({
    form: form as any,
    name: "payment_status",
  });
  return (
    <>
      <div className="mx-4 my-2">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Add New Order</h1>

          <div>
            <Breadcrumbs />
          </div>
        </div>
        <div className="bg-[#ffffff] border-[#eeeeee] border-2 shadow-lg rounded-xl ">
          <div className="px-6 pt-4 pb-2">
            <h1 className="text-xl font-semibold">General Information</h1>
            <div className="border-b border-[#dedde2] w-full my-2  "></div>
            <form
              className="flex flex-col gap-4 "
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field name="name">
                {(field) => (
                  <div>
                    <InputField
                      label="Full Name"
                      required
                      placeholder="Enter Full Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div className="flex items-center w-full gap-4">
                <form.Field name="email">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Email"
                        required
                        placeholder="Enter your email"
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
                        label="Phone Number"
                        required
                        placeholder="Enter your phone number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Shipping Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4">
                <form.Field name="shipping_address">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Shipping Address"
                        required
                        type="text"
                        placeholder="eg. 2 Gannett Dr, Johnson City NY 13790"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="delivery_partner">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Delivery Partner"
                        required
                        firstInput="Select Delivery Partner"
                        options={[
                          { value: "samsung", label: "Samsung" },
                          { value: "asus", label: "Asus" },
                          { value: "dell", label: "Dell" },
                          { value: "acer", label: "Acer" },
                        ]}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="shipping_method">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Shipping Method"
                        required
                        firstInput="Select Shipping Method"
                        options={[
                          {
                            value: "same-day shipping",
                            label: "Same-Day Shipping",
                          },
                          { value: "fast shipping", label: "Fast Shipping" },
                        ]}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
              <form.Field name="shipping_information_note">
                {(field) => (
                  <div className="w-full">
                    <InputField
                      label="Note"
                      type="text"
                      placeholder="Handle with care"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div>
                <h1 className="text-xl font-semibold">Billing Address</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="flex items-center gap-4">
                <form.Field name="customer_name">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Customer Name"
                        required
                        placeholder="eg. William Anderson"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="billing_phone">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Phone Number"
                        required
                        placeholder="+977 787786767"
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
                        placeholder="5033 Transit Road, Clarence NY 14031"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="flex items-center gap-4">
                <form.Field name="billing_email">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Email"
                        required
                        placeholder="jeanette_colon@icloud.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="billing_information_note">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Note"
                        type="text"
                        placeholder="Leave Outside"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <h1 className="text-xl font-semibold">Product Detals</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>

              <div className="flex items-center gap-4">
                <form.Field name="item_name">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Item Name"
                        required
                        placeholder="eg. Pasni Set"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="qty">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Qty"
                        type="number"
                        required
                        min={0}
                        placeholder="Enter the number of quantities"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="discount">
                  {(field) => (
                    <div className="w-full">
                      <PriceInputField
                        label="Discounts"
                        type="number"
                        min={0}
                        required
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="flex items-center gap-4">
                <form.Field name="shipping_cost">
                  {(field) => (
                    <div className="w-full">
                      <PriceInputField
                        label="Shipping Cost"
                        type="number"
                        min={0}
                        required
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="taxes">
                  {(field) => (
                    <div className="w-full">
                      <PriceInputField
                        label="Taxes"
                        type="number"
                        min={0}
                        required
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
                <form.Field name="price">
                  {(field) => (
                    <div className="w-full">
                      <PriceInputField
                        label="Price"
                        type="number"
                        min={0}
                        required
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>

              <div>
                <FileDropInput label="Upload Photo" />
              </div>

              <div>
                <h1 className="text-xl font-semibold">Payment Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>

              <div className="flex items-center gap-4">
                <form.Field name="payment_type">
                  {(field) => (
                    <div className="w-[50%]">
                      <DropdownField
                        label="Payment Type"
                        required
                        firstInput="Select Payment Type"
                        options={[
                          {
                            value: "cash-on-delivery",
                            label: "COD (Cash on Delivery)",
                          },
                          { value: "cash", label: "Cash" },
                        ]}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
                <div className="relative">
                  <h1 className="a text-[#a8a8a8] absolute bottom-10">
                    Payment Status <span className="text-red">*</span>
                  </h1>
                  <div className="flex items-center gap-4">
                    <h1
                      className={`text-base px-5 py-1 rounded-xl font-medium ${isEnabled
                          ? "bg-[#e9fbef] text-[#67c492]"
                          : "bg-[#feeeee] text-[#dd667a]"
                        }`}
                    >
                      {isEnabled ? "Paid" : "Unpaid"}
                    </h1>

                    <ToggleSlider
                      enabled={isEnabled}
                      onToggle={() => setIsEnabled((prev) => !prev)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="self-end bg-[#df8d29] text-white px-7 py-2 rounded-xl"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
