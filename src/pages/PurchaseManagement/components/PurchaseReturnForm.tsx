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
import { purchaseReturnFormSchema, returnColumns } from "../purchaseObj";
import { IFetchProduct } from "../../../server/api/productHooks";
import {
  IFetchPurchase,
  useCreatePurchaseReturnMutation,
  useGetPurchaseReturnSummaryQuery,
  IReturnSummaryItem,
} from "../../../server/api/purchaseHooks";
import { FieldError } from "../../auth/LoginPage";
import { useState } from "react";
import { get, map } from "lodash";
import { useGetSupplierQuery } from "../../../server/api/supplierHooks";
import MasterTable from "../../../components/shared/MasterTable";

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
  const { data: returnSummary, isLoading: isLoadingReturnSummary } =
    useGetPurchaseReturnSummaryQuery(data._id);
  const [dynamicForm, setDynamicForm] = useState({
    product: "",
    quantity: 0,
    maxQuantity: 0,
    wt: 0,
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const { data: suppliers } = useGetSupplierQuery();
  const supplierList = map(suppliers, (item) => ({
    value: get(item, "_id", ""),
    label: get(item, "name", ""),
  }));

  // Helper function to validate return quantity
  const validateReturnQuantity = (
    productId: string,
    wt: number,
    quantity: number
  ): string | null => {
    if (!returnSummary) return null;

    const productSummary = returnSummary.returnSummary.find(
      (item) => item.productId === productId && item.wt === wt
    );

    if (!productSummary) {
      return "Product not found in original purchase";
    }

    if (quantity <= 0) {
      return "Quantity must be greater than 0";
    }

    if (quantity > productSummary.remainingQuantity) {
      return `Cannot return ${quantity} items. Only ${productSummary.remainingQuantity} items remaining (${productSummary.totalReturned} already returned out of ${productSummary.originalQuantity})`;
    }

    return null;
  };

  const form = useForm({
    defaultValues: {
      billNo: get(data, "billNo", ""),
      supplier: get(data, "supplier.", ""),
      refundAmount: 0,
      reason: "",
      products: [],
    } as IFormValue,
    // validators: {
    //   onSubmit: purchaseReturnFormSchema,
    // },
    onSubmit: async ({ value }) => {
      // Validate all products before submission
      const errors: { [key: string]: string } = {};
      value.products.forEach((product, index) => {
        const productData = data.products?.find(
          (p) =>
            (typeof p.product === "string"
              ? p.product
              : (p.product as any)._id) === product.product
        );
        if (productData) {
          const error = validateReturnQuantity(
            product.product,
            productData.wt,
            product.quantity
          );
          if (error) {
            errors[`product_${index}`] = error;
          }
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }

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
                prduct: item.product,
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
      ? map(data.items, (item) => {
          const returnInfo = returnSummary?.returnSummary.find(
            (summary) => summary.productId === get(item, "product._id", "")
          );
          return {
            ...item,
            value: get(item, "product._id", ""),
            label: get(item, "product.name", ""),
            remainingQuantity:
              returnInfo?.remainingQuantity || get(item, "quantity", 0),
            totalReturned: returnInfo?.totalReturned || 0,
            canReturn: returnInfo?.canReturn !== false,
          };
        })
      : map(data.products, (item) => {
          const returnInfo = returnSummary?.returnSummary.find(
            (summary) =>
              summary.productId === get(item, "product._id", "") &&
              summary.wt === get(item, "wt", 0)
          );
          return {
            ...item,
            value: get(item, "product._id", ""),
            label: get(item, "product.name", ""),
            remainingQuantity:
              returnInfo?.remainingQuantity || get(item, "quantity", 0),
            totalReturned: returnInfo?.totalReturned || 0,
            canReturn: returnInfo?.canReturn !== false,
          };
        });

  const rows = form.state.values.products.map((item) => {
    const product = productList.find((i) => i.value === item.product);
    const price = product?.price || 0;
    const quantity = item?.quantity || 0;
    return {
      _id: product?.value,
      name: product?.label,
      price: `$ ${price}`,
      quantity,
      total: `$ ${price * quantity}`,
    };
  });
  const calculateTotalCost = form.state.values.products.reduce((acc, item) => {
    const product = productList.find((i) => i.value === item.product);
    const price = product?.price || 0;
    return acc + price * item.quantity;
  }, 0);
  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Purchase Return</h1>

      <form
        className="flex flex-col mx-4 mt-6 "
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
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
                <DropdownField
                  label="Suppliers Name"
                  options={supplierList}
                  required
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  inputClassname="w-full"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full">
            <DropdownField
              label="Product"
              options={productList
                .filter((item) => item.canReturn)
                .map((item) => ({
                  ...item,
                  label: `${item.label} (${item.remainingQuantity} available, ${item.totalReturned} returned)`,
                }))}
              required
              value={dynamicForm.product}
              onChange={(e) => {
                const selectedProduct = productList.find(
                  (item) => item.value === e.target.value
                );
                setDynamicForm({
                  ...dynamicForm,
                  product: e.target.value,
                  maxQuantity: selectedProduct?.remainingQuantity || 0,
                  wt:
                    selectedProduct && "wt" in selectedProduct
                      ? selectedProduct.wt
                      : 0,
                });
                // Clear any previous validation errors for this field
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.dynamicProduct;
                  return newErrors;
                });
              }}
              inputClassname="w-full"
            />
            {validationErrors.dynamicProduct && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.dynamicProduct}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <InputField
                label="Max Quantity"
                type="number"
                max={40}
                placeholder="658696"
                value={dynamicForm.maxQuantity}
                disabled
              />
            </div>

            <div className="w-full">
              <InputField
                label={`Quantity (Max: ${dynamicForm.maxQuantity})`}
                required
                placeholder="Quantity"
                type="number"
                min="1"
                max={dynamicForm.maxQuantity}
                value={dynamicForm.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value);
                  setDynamicForm({
                    ...dynamicForm,
                    quantity,
                  });

                  // Real-time validation
                  if (dynamicForm.product && quantity > 0) {
                    const error = validateReturnQuantity(
                      dynamicForm.product,
                      dynamicForm.wt,
                      quantity
                    );
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      if (error) {
                        newErrors.dynamicQuantity = error;
                      } else {
                        delete newErrors.dynamicQuantity;
                      }
                      return newErrors;
                    });
                  } else {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.dynamicQuantity;
                      return newErrors;
                    });
                  }
                }}
              />
              {validationErrors.dynamicQuantity && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.dynamicQuantity}
                </p>
              )}
              {dynamicForm.maxQuantity > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                  Available for return: {dynamicForm.maxQuantity} items
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center w-full gap-2 pt-7">
            <button
              type="button"
              onClick={() => {
                if (dynamicForm.product && dynamicForm.quantity) {
                  // Validate before adding
                  const error = validateReturnQuantity(
                    dynamicForm.product,
                    dynamicForm.wt,
                    dynamicForm.quantity
                  );

                  if (error) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      dynamicQuantity: error,
                    }));
                    return;
                  }

                  // Check if this product is already in the return list
                  const currentProducts = form.getFieldValue("products") || [];
                  const existingProductIndex = currentProducts.findIndex(
                    (p) => p.product === dynamicForm.product
                  );

                  if (existingProductIndex >= 0) {
                    // Update existing product quantity
                    const updatedProducts = [...currentProducts];
                    const newQuantity =
                      updatedProducts[existingProductIndex].quantity +
                      dynamicForm.quantity;

                    // Validate combined quantity
                    const combinedError = validateReturnQuantity(
                      dynamicForm.product,
                      dynamicForm.wt,
                      newQuantity
                    );

                    if (combinedError) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        dynamicQuantity: combinedError,
                      }));
                      return;
                    }

                    updatedProducts[existingProductIndex].quantity =
                      newQuantity;
                    form.setFieldValue("products", updatedProducts);
                  } else {
                    // Add new product
                    const newProduct = {
                      product: dynamicForm.product,
                      quantity: dynamicForm.quantity,
                    };

                    form.setFieldValue("products", [
                      ...currentProducts,
                      newProduct,
                    ]);
                  }

                  // Reset the dynamic form and validation errors
                  setDynamicForm({
                    product: "",
                    maxQuantity: 0,
                    quantity: 0,
                    wt: 0,
                  });
                  setValidationErrors({});
                } else {
                  // Show validation errors if fields are empty
                  const newErrors: { [key: string]: string } = {};
                  if (!dynamicForm.product) {
                    newErrors["dynamicProduct"] = "Please select a product";
                  }
                  if (!dynamicForm.quantity) {
                    newErrors["dynamicQuantity"] = "Please enter a quantity";
                  }
                  setValidationErrors((prev) => ({ ...prev, ...newErrors }));
                }
              }}
              className="flex-1 bg-[#df8d29] text-sm text-white px-3 py-2 rounded-md">
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setDynamicForm({
                  product: "",
                  maxQuantity: 0,
                  quantity: 0,
                  wt: 0,
                });
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.dynamicProduct;
                  delete newErrors.dynamicQuantity;
                  return newErrors;
                });
              }}
              className="flex-1 px-3 py-2 text-sm text-black bg-gray-300 rounded-md">
              Reset
            </button>
          </div>
        </div>

        {form.state.values.products.length > 0 && (
          <div className="flex flex-col w-full mt-4">
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
            <div className="flex flex-col items-end gap-3 my-4">
              <div className="flex justify-between w-64">
                <span className="text-gray-500">Total Cost</span>
                {/* <span>Rs.{totalCost}</span> */}
                <span>{`$ ${calculateTotalCost}`}</span>
              </div>

              <div className="flex justify-between w-64 text-base font-bold ">
                <span>Net Total</span>
                {/* <span>Rs.{netTotal}</span> */}
                <span>{`$ ${calculateTotalCost}`}</span>
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
                className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1   placeholder:text-[#858492]"
                placeholder="Enter Short Description"></textarea>
              <FieldError field={field} />
            </div>
          )}
        </form.Field>
        <div className="border-b border-[#dedde2] w-full my-4" />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#c9c9c9] px-7 py-2 rounded-xl">
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseReturnForm;
