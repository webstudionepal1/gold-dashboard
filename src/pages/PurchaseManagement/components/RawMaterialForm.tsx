import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "@tanstack/react-form";
import { get } from "lodash";
import { z } from "zod";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import { InputField } from "../../../components/shared/form_components/InputField";
import {
  IBaseProduct,
  useGetAllProductsQuery,
} from "../../../server/api/productHooks";
import {
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
} from "../../../server/api/purchaseHooks";
import { useGetSupplierQuery } from "../../../server/api/supplierHooks";
import { FieldError } from "../../auth/LoginPage";
import { IRawMaterialForm, RawMaterialSchema } from "../purchaseObj";

interface NewProductProps {
  onClose: () => void;
  edit?: boolean;
  data?: IBaseProduct | null;
}
const NewProductForm = ({
  onClose,
  edit = false,
  data = null,
}: NewProductProps) => {
  const { mutate: createPurchase } = useCreatePurchaseMutation();
  const { mutate: updatePurchase } = useUpdatePurchaseMutation();
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

  const form = useForm({
    defaultValues: {
      billNo: edit ? get(data, "billNo", "") : "",
      supplier: edit ? get(data, "supplier._id", "") : "",
      phone_no: edit ? get(data, "phone_no", "") : "",
      items: edit
        ? get(data, "items", [
            {
              item: "",
              quantity: 1,
              price: 0,
              paidAmount: 0,
              wt: 0,
            },
          ])
        : [
            {
              item: "",
              quantity: 1,
              price: 0,
              paidAmount: 0,
              wt: 0,
            },
          ],
      description: edit ? get(data, "description") : "",
    } as IRawMaterialForm,
    validators: {
      onSubmit: RawMaterialSchema,
    },
    // onSubmit: async ({ value }) => {
    //   if (edit) updatePurchase({ id: data?._id ?? "", body: value });
    //   else createPurchase(value);
    // },
    onSubmit: async ({ value }) => {
      if (edit) {
        updatePurchase(
          { id: data?._id ?? "", body: value },
          {
            onSuccess: () => {
              onClose();
            },
          }
        );
      } else {
        createPurchase(value, {
          onSuccess: () => {
            onClose();
          },
        });
      }
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
                      wt: 0,
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

                  <div className="grid gap-4 grid-cos-1 sm:grid-cols-3">
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

                    <form.Field name={`items[${index}].wt`}>
                      {(field) => (
                        <div className="w-full">
                          <InputField
                            label="Weight"
                            type="number"
                            // min={0}
                            placeholder="Enter weight"
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
