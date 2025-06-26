import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";

import { get, map } from "lodash";
import { useState } from "react";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import MasterTable from "../../../components/shared/MasterTable";
import {
  IFetchPurchase,
  useCreatePurchaseReturnMutation,
} from "../../../server/api/purchaseHooks";
import { useGetSupplierQuery } from "../../../server/api/supplierHooks";
import { FieldError } from "../../auth/LoginPage";
import { returnColumns } from "../purchaseObj";
import { Constants } from "../../../utils/constants";

interface IPurchaseReturnForm {
  data: IFetchPurchase;
  onClose: () => void;
}
interface IFormValue {
  billNo: string;
  supplier: string;
  reason: string;
  products: {
    product: string;
    quantity: number;
  }[];
  refundAmount: number;
}

const PurchaseReturnForm: React.FC<IPurchaseReturnForm> = ({
  data,
  onClose,
}) => {
  console.log("data", data);
  const { mutate: createPurchaseReturn } = useCreatePurchaseReturnMutation();
  const [dynamicForm, setDynamicForm] = useState({
    product: "",
    quantity: 0,
    maxQuantity: 0,
  });
  const form = useForm({
    defaultValues: {
      billNo: get(data, "billNo", ""),
      supplier: get(data, "supplier", ""),
      refundAmount: 0,
      reason: "",
      products: [],
    } as IFormValue,
    // validators: {
    //   onSubmit: purchaseReturnFormSchema,
    // },
    onSubmit: async ({ value }) => {
      const finalValues = {
        purchase: data._id,
        refundAmount: value.refundAmount,
        reason: value.reason,
        totalReturnAmount: calculateTotalCost,
        ...(data.items.length > 0
          ? {
              items: value.products.map((item) => ({
                item: item.product,
                quantity: item.quantity,
              })),
            }
          : {
              products: value.products.map((item) => ({
                product: item.product,
                quantity: item.quantity,
              })),
            }),
      };
      createPurchaseReturn(finalValues);
      onClose();
    },
  });

  const productList =
    data.items.length > 0
      ? map(data.items, (item) => ({
          ...item,
          value: get(item, "product._id", ""),
          label: get(item, "product.name", ""),
        }))
      : map(data.products, (item) => ({
          ...item,
          value: get(item, "product._id", ""),
          label: get(item, "product.name", ""),
        }));

  const rows = form.state.values.products.map((item) => {
    const product = productList.find((i) => i.value === item.product);
    const price = product?.price || 0;
    const quantity = item?.quantity || 0;
    return {
      _id: product?.value,
      name: product?.label,
      price: `${price}`,
      quantity,
      total: `${price * quantity}`,
    };
  });
  const calculateTotalCost = form.state.values.products.reduce((acc, item) => {
    const product = productList.find((i) => i.value === item.product);
    const price = product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  return (
    <div className="py-4 space-y-4 ">
      <h1 className="text-2xl font-semibold text-center">Purchase Return</h1>

      <form
        className="flex flex-col mx-4 mt-6 space-y-4 "
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-x-4  md:grid-cols-3 ">
          <form.Field name="billNo">
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
          <form.Field name="supplier">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Suppliers Name"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="refundAmount">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="refundAmount"
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </div>
        <div className="grid grid-cols-1  gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full">
            <DropdownField
              label="Product"
              options={productList}
              required
              value={dynamicForm.product}
              onChange={(e) =>
                setDynamicForm({
                  ...dynamicForm,
                  product: e.target.value,
                  maxQuantity:
                    productList.find((item) => item.value === e.target.value)
                      ?.quantity || 0,
                })
              }
              inputClassname="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <InputField
                label="Max"
                type="number"
                max={40}
                placeholder="658696"
                value={dynamicForm.maxQuantity}
                disabled
              />
            </div>

            <div className="w-full">
              <InputField
                label="Quantity"
                required
                placeholder="Quanity"
                value={dynamicForm.quantity}
                onChange={(e) =>
                  setDynamicForm({
                    ...dynamicForm,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full gap-2 pt-7">
            <button
              type="button"
              onClick={() => {
                if (dynamicForm.product && dynamicForm.quantity) {
                  const newProduct = {
                    product: dynamicForm.product,
                    quantity: dynamicForm.quantity,
                  };

                  const currentProducts = form.getFieldValue("products") || [];
                  form.setFieldValue("products", [
                    ...currentProducts,
                    newProduct,
                  ]);

                  // Reset the dynamic form
                  setDynamicForm({
                    product: "",
                    maxQuantity: 0,
                    quantity: 0,
                  });
                }
              }}
              className="flex-1 bg-[#df8d29] text-sm text-white px-3 py-2 rounded-md"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setDynamicForm({
                  product: "",
                  maxQuantity: 0,
                  quantity: 0,
                });
              }}
              className="flex-1 px-3 py-2 text-sm text-black bg-gray-300 rounded-md"
            >
              Reset
            </button>
          </div>
        </div>

        {form.state.values.products.length > 0 && (
          <div className="flex flex-col w-full">
            <div>
              <h1 className="text-xl font-semibold">Product Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2  " />
            </div>
            <MasterTable
              rows={rows}
              columns={returnColumns}
              canSearch={false}
              showAction
              onDelete={(id) => {
                const currentProducts = form.getFieldValue("products") || [];
                const updatedProducts = currentProducts.filter(
                  (item) => item.product !== id
                );
                form.setFieldValue("products", updatedProducts);
              }}
            />
            <div className="flex flex-col items-end gap-2">
              <div className="flex justify-between w-64 text-sm">
                <span className="text-gray-500">Total Cost</span>
                {/* <span>Rs.{totalCost}</span> */}
                <span>{`${Constants.currency} ${calculateTotalCost}`}</span>
              </div>

              <div className="flex justify-between text-sm w-64  font-bold ">
                <span>Net Total</span>
                {/* <span>Rs.{netTotal}</span> */}
                <span>{`${Constants.currency} ${calculateTotalCost}`}</span>
              </div>
            </div>
          </div>
        )}

        <form.Field name="reason">
          {(field) => (
            <div className="flex flex-col w-full">
              <label className="text-[#98999e] font-semibold mb-2">
                Reason for Return
              </label>
              <textarea
                onChange={(e) => field.handleChange(e.target.value)}
                className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1   placeholder:text-[#858492]"
                placeholder="Enter Short Description"
              ></textarea>
              <FieldError field={field} />
            </div>
          )}
        </form.Field>
        <div className="border-b border-[#dedde2] w-full my-4" />
        <div className="flex items-center gap-3">
          <button
            type="button"
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
  );
};

export default PurchaseReturnForm;
