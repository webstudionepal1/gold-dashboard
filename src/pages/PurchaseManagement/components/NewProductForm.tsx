import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { Icon } from "@iconify/react/dist/iconify.js";
import { z } from "zod";

interface NewProductProps {
  onClose: () => void;
}
const NewProductForm = ({ onClose }: NewProductProps) => {
  const FieldError = ({ field }: { field: any }) => {
    if (field.state.meta.errors.length > 0) {
      const error = field.state.meta.errors[0];
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
    return <div className="min-h-[20px]"></div>;
  };
  const AddNewProductSchema = z.object({
    bill_no: z.string().min(1, "Bill No is required"),
    supplier_name: z.string().min(1, "Supplier name is required"),
    phone_no: z.string().min(1, "Phone Number is required"),
    products: z.array(
      z.object({
        product_name: z.string().min(1, "Product name is required"),
        material: z.string().min(1, "Material is required"),
        units: z.string().min(1, "Unit is required"),
        quantity: z.number().min(1, "Quantity must be greater than 0"),
        paid_price: z.string().min(1, "Paid Price is required"),
      })
    ),
  });

  const [products, setProducts] = useState([
    {
      product_name: "",
      material: "",
      units: "",
      quantity: 1,
      paid_price: "",
    },
  ]);

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        product_name: "",
        material: "",
        units: "",
        quantity: 1,
        paid_price: "",
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const form = useForm({
    defaultValues: {
      bill_no: "",
      supplier_name: "",
      phone_no: "",
      products,
    },
    validators: {
      onSubmit: AddNewProductSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submitted:", value);
    },
  });

  // Update the validation schema to dynamically handle the products array

  return (
    <>
      <div className="my-3">
        <div className="flex items-center justify-between my-2 gap-4">
          <div className="bg-[#ffffff]">
            <form
              className="flex flex-col gap-4 mx-4 my-6"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="flex items-center gap-4">
                <form.Field name="bill_no">
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

                <form.Field name="supplier_name">
                  {(field) => (
                    <div className="w-full">
                      <DropdownField
                        label="Suppliers Name"
                        required
                        firstInput="Gold supplier pvt ltd   "
                        options={[
                          {
                            value: "gold-supplier-pvt-ltd",
                            label: "Gold supplier pvt ltd",
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
              </div>

              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Product Information</h1>
                <button
                  type="button"
                  onClick={addProduct}
                  className="px-3 py-2 flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
                >
                  <Icon
                    icon="material-symbols-light:add-rounded"
                    width="24"
                    height="24"
                    className="fill-white"
                  />
                  Product
                </button>
              </div>

              {products.map((_, index) => (
                <div
                  key={index}
                  className="bg-[#ffffff] border-[#e7e7e7] border-2 rounded-xl"
                >
                  <div className="flex items-center gap-4 justify-between px-3 py-2">
                    <form.Field name={`products[${index}].product_name`}>
                      {(field) => (
                        <div className="w-full">
                          <DropdownField
                            label="Product Name"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            options={[
                              { value: "gold", label: "Gold" },
                              { value: "silver", label: "Silver" },
                            ]}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name={`products[${index}].material`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Material"
                            required
                            placeholder="Gold"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div className="flex items-center gap-4 justify-between px-3 py-2">
                    {" "}
                    <form.Field name={`products[${index}].units`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Units"
                            placeholder="Tola"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
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
                    <form.Field name={`products[${index}].paid_price`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Paid Price (Rs.)"
                            required
                            placeholder="176,000"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* Remove Button */}
                  {index > 0 && (
                    <div className="flex items-center justify-end px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="px-3 py-1 border-[#de8d28] border-2 text-[#de8d28] rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col">
                <label className="text-[#98999e] font-semibold mb-2">
                  Description
                </label>
                <textarea
                  className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1   placeholder:text-[#858492]"
                  placeholder="Enter Short Description"
                ></textarea>
              </div>

              <div className="border-b border-[#dedde2] w-full   "></div>

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

export default NewProductForm;
