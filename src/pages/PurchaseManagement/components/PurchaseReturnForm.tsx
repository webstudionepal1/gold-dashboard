import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";

import { z } from "zod";
import FileDropInput from "../../../components/shared/form_components/FileDropInput";
import { useStore } from "@tanstack/react-form";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import {
  SimpleTable,
  SimpleTableColumn,
} from "../../Customer/components/SimpleTable";

type Item = {
  name: string;
  unit: string;
  costPerUnit: number;
  quantity: number;
  total: number;
};

const itemColumns: SimpleTableColumn<Item>[] = [
  { key: "name", header: "Item Name" },
  { key: "unit", header: "Unit" },
  {
    key: "costPerUnit",
    header: "Cost per unit",
    render: (val) => `Rs.${val}`,
  },
  { key: "quantity", header: "QTY" },
  {
    key: "total",
    header: "Total",
    render: (val) => `Rs.${val}`,
  },
];
const itemData: Item[] = [
  {
    name: "Gold",
    unit: "Tola",
    costPerUnit: 45,
    quantity: 50,
    total: 5000,
  },
  {
    name: "Gold",
    unit: "Tola",
    costPerUnit: 45,
    quantity: 50,
    total: 5000,
  },
  {
    name: "Gold",
    unit: "Tola",
    costPerUnit: 45,
    quantity: 50,
    total: 5000,
  },
  {
    name: "Gold",
    unit: "Tola",
    costPerUnit: 45,
    quantity: 50,
    total: 5000,
  },
];

const PurchaseReturnFormSchema = z.object({
  bill_no: z.string().min(1, "Bill No is required"),
  return_id: z.string().min(1, "Return Id is required"),
  supplier_name: z.string().min(1, "Supplier Name is required"),
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
const PurchaseReturnForm = () => {
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
      bill_no: "",
      return_id: "",
      supplier_name: "",
      address: "",
      username: "",
      password: "",
      terms_and_conditions: false,
      profile_photo: null as File | null,
      mobile_image: null as File | null,
    },
    validators: {
      onSubmit: PurchaseReturnFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Order Submitted:", value);
      // Submit to backend or API
    },
  });

  return (
    <>
      <div className=" my-3">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">Purchase Return</h1>
        </div>

        <div className="flex items-center  ">
          <div className="mx-8">
            <form
              className="flex flex-col  mx-4 mt-6 "
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="flex items-center w-full gap-4">
                <form.Field name="bill_no">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Bill No."
                        required
                        placeholder="658696"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="return_id">
                  {(field) => (
                    <div className="w-full">
                      <InputField
                        label="Return ID"
                        type="email"
                        required
                        placeholder="658696"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="supplier_name">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Suppliers Name"
                        options={[
                          { value: "gold_supplier", label: "Gold Supplier" },
                          {
                            value: "silver_supplier",
                            label: "Silver Supplier",
                          },
                          {
                            value: "diamond_supplier",
                            label: "Diamond Supplier",
                          },
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
                <h1 className="text-xl font-semibold">Product Information</h1>
                <div className="border-b border-[#dedde2] w-full my-2  "></div>
              </div>
              <div className="w-full ">
                <SimpleTable<Item>
                  title=""
                  data={itemData}
                  columns={itemColumns}
                  showCheckbox={true}
                  showViewButton={false}
                  showDeleteButton={true}
                  onDelete={() => console.log("HELL WORLD")}
                />
              </div>

              <div className="flex flex-col items-end my-4 gap-3">
                <div className="flex justify-between w-64">
                  <span className="text-gray-500">Total Cost</span>
                  {/* <span>Rs.{totalCost}</span> */}
                  <span>Rs.5000</span>
                </div>
                <div>
                  <div className="flex justify-between w-64">
                    <span className="text-gray-500">Discount (%)</span>
                    {/* <span>Rs.{discount}</span> */}
                    <span>Rs.500</span>
                  </div>
                  <div className="border-b border-[#dedde2] w-full mt-2" />
                </div>

                <div className="flex justify-between w-64 font-bold text-base ">
                  <span>Net Total</span>
                  {/* <span>Rs.{netTotal}</span> */}
                  <span>Rs.4500</span>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[#98999e] font-semibold mb-2">
                  Reason for Return
                </label>
                <textarea
                  className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1   placeholder:text-[#858492]"
                  placeholder="Enter Short Description"
                ></textarea>
              </div>
              <div className="border-b border-[#dedde2] w-full my-4" />
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseReturnForm;
