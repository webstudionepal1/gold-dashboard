import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";
import { useGetAllProductsQuery } from "../../../server/api/productHooks";
import { useCreatePurchaseMutation } from "../../../server/api/purchaseHooks";
import { useGetSupplierQuery } from "../../../server/api/supplierHooks";
import { FieldError } from "../../auth/LoginPage";

interface NewProductProps {
  onClose: () => void;
}
const NewProductForm = ({ onClose }: NewProductProps) => {
  const { mutate: createPurchase } = useCreatePurchaseMutation();
  const { data: suppliers, isSuccess } = useGetSupplierQuery();
  const { data: products, isSuccess: productSuccess } =
    useGetAllProductsQuery();
  const suppliersList = isSuccess
    ? suppliers?.map((item) => ({
        label: item.name,
        value: item._id,
      }))
    : [];
  const productList = productSuccess
    ? products?.map((item) => ({ label: item.name, value: item._id }))
    : [];

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

  const form = useForm({
    defaultValues: {
      billNo: "",
      supplier: "",
      phone_no: "",
      items: [
        {
          item: "",
          quantity: 1,
          price: 0,
          paidAmount: 0,
        },
      ],
      description: "",
    },
    // validators: {
    //   onSubmit: AddNewProductSchema,
    // },
    onSubmit: async ({ value }) => {
      createPurchase(value);
    },
  });

  return (
    <div>
      <form
        className="flex flex-col gap-4 mx-4 bg-white"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <form.Field name="billNo">
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

          <form.Field name="supplier">
            {(field) => (
              <div className="w-full">
                <DropdownField
                  label="Suppliers Name"
                  required
                  firstInput="Select Supplier "
                  options={suppliersList}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="items" mode="array">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Product Information</h1>
                <button
                  type="button"
                  onClick={() =>
                    field.pushValue({
                      item: "",
                      quantity: 1,
                      price: 0,
                      paidAmount: 0,
                    })
                  }
                  className="px-3 py-2 text-sm flex items-center text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg"
                >
                  <Icon
                    icon="material-symbols-light:add-rounded"
                    width="18"
                    height="18"
                    className="fill-white"
                  />
                  Product
                </button>
              </div>
              {field.state.value.map((_, index: number) => (
                <div
                  key={index.toString()}
                  className="bg-[#ffffff] border-[#e7e7e7] border-2  px-3 py-2 rounded-xl"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field name={`items[${index}].item`}>
                      {(field) => (
                        <div className="w-full">
                          <DropdownField
                            label="Product Name"
                            required
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            options={productList}
                          />
                          <FieldError field={field} />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name={`items[${index}].quantity`}>
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
                  </div>

                  <div className="grid gap-4 grid-cos-1 sm:grid-cols-2">
                    <form.Field name={`items[${index}].price`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Price (Rs.)"
                            placeholder="Tola"
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
                    <form.Field name={`items[${index}].paidAmount`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Paid Price (Rs.)"
                            required
                            placeholder="176,000"
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

                  {/* Remove Button */}
                  {index > 0 && (
                    <div className="flex items-center justify-end px-2 py-2">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="px-3 py-1 border-[#de8d28] border-2 text-[#de8d28] rounded-xl"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="flex flex-col">
              <label className="text-[#98999e] font-semibold mb-2">
                Description
              </label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1   placeholder:text-[#858492]"
                placeholder="Enter Short Description"
              ></textarea>
            </div>
          )}
        </form.Field>

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
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductForm;
