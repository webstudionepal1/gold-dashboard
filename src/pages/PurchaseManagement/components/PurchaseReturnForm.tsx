import { useForm } from "@tanstack/react-form";
import { InputField } from "../../../components/shared/form_components/InputField";
import { get, map } from "lodash";
import { useState, useEffect, useMemo } from "react";
import { DropdownField } from "../../../components/shared/form_components/Dropdown";
import MasterTable from "../../../components/shared/MasterTable";
import {
  IFetchPurchase,
  useCreatePurchaseReturnMutation,
  useGetPurchaseReturnSummaryQuery,
} from "../../../server/api/purchaseHooks";
import { FieldError } from "../../auth/LoginPage";
import { returnColumns } from "../purchaseObj";
import { Constants } from "../../../utils/constants";
import { z } from "zod";

interface IPurchaseReturnForm {
  data: IFetchPurchase;
  onClose: () => void;
}
interface IFormValue {
  billNo: string;
  supplier: string;
  reason?: string;
  products: {
    product: string;
    quantity: number;
    wt: number;
  }[];
  refundAmount: number;
}

// Zod schema for validation
const purchaseReturnFormSchema = z.object({
  billNo: z
    .string()
    .min(1, "Bill No. is required")
    .regex(/^[A-Za-z0-9-]+$/, "Bill No. must be alphanumeric with hyphens"),
  supplier: z.string().min(1, "Supplier is required").trim(),
  refundAmount: z.number().min(0, "Refund amount must be non-negative"),
  reason: z
    .string()
    .max(500, "Reason must be 500 characters or less")
    .optional(),
  products: z
    .array(
      z.object({
        product: z.string().min(1, "Product is required"),
        quantity: z
          .number()
          .min(1, "Quantity must be at least 1")
          .max(1000, "Quantity cannot exceed 1000"),
        wt: z.number().min(0, "Weight must be non-negative"),
      })
    )
    .min(1, "At least one product is required"),
});

const PurchaseReturnForm: React.FC<IPurchaseReturnForm> = ({
  data,
  onClose,
}) => {
  const { mutate: createPurchaseReturn } = useCreatePurchaseReturnMutation();
  const { data: returnSummary, isLoading: isLoadingReturnSummary } =
    useGetPurchaseReturnSummaryQuery(data._id || "");
  const [dynamicForm, setDynamicForm] = useState({
    product: "",
    quantity: 0,
    maxQuantity: 0,
    wt: 0,
  });
  const [noProductsAvailable, setNoProductsAvailable] = useState(false);

  const form = useForm({
    defaultValues: {
      billNo: get(data, "billNo", "")?.trim() || "PR-DEFAULT",
      supplier:
        get(data, "supplier.name", get(data, "supplier", ""))?.trim() ||
        "Unknown Supplier",
      refundAmount: 0,
      reason: "",
      products: [],
    } as IFormValue,
    validators: {
      onSubmit: purchaseReturnFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);
      const totalReturnAmount = value.products.reduce((acc, item) => {
        const product = productList.find((i) => i.value === item.product);
        const price = product?.price || 0;
        return acc + price * item.quantity;
      }, 0);
      const finalValues = {
        purchase: data._id || "unknown-purchase-id",
        refundAmount: value.refundAmount,
        reason: value.reason?.trim() || "",
        totalReturnAmount,
        ...(data.items?.length > 0
          ? {
              items: value.products.map((item) => ({
                item: item.product,
                quantity: item.quantity,
                wt: item.wt,
              })),
            }
          : {
              products: value.products.map((item) => ({
                product: item.product,
                quantity: item.quantity,
                wt: item.wt,
              })),
            }),
      };
      console.log("Sending to API:", finalValues);
      createPurchaseReturn(finalValues);
      onClose();
    },
    onSubmitInvalid: async ({ value, formApi }) => {
      console.log("Validation failed with values:", value);
      console.log("Validation errors:", formApi.state.errors);
    },
  });

  // Log form state for debugging
  useEffect(() => {
    console.log("Form state:", form.state.values);
    console.log("Form errors:", form.state.errors);
  }, [form.state.values, form.state.errors]);

  const productList = useMemo(() => {
    const items = data.items?.length > 0 ? data.items : data.products || [];
    const mappedProducts = map(items, (item) => {
      const productId = get(item, "product._id", "");
      const weight = get(item, "wt", 0);

      // Find return summary for this product and weight combination
      const returnSummaryItem = returnSummary?.returnSummary?.find(
        (summary) => summary.productId === productId && summary.wt === weight
      );

      const productName =
        get(item, "product.name", "")?.trim() || "Unknown Product";
      const remainingQty =
        returnSummaryItem?.remainingQuantity || get(item, "quantity", 0);

      return {
        value: productId,
        label: `${productName} (${weight}g) - Available: ${remainingQty}`,
        price: get(item, "price", 0),
        quantity: get(item, "quantity", 0),
        wt: weight,
        // Add return summary data
        originalQuantity:
          returnSummaryItem?.originalQuantity || get(item, "quantity", 0),
        totalReturned: returnSummaryItem?.totalReturned || 0,
        remainingQuantity: remainingQty,
        canReturn: returnSummaryItem?.canReturn ?? true,
      };
    });

    // Filter out products that cannot be returned
    const returnableProducts = mappedProducts.filter(
      (product) => product.canReturn && product.remainingQuantity > 0
    );
    setNoProductsAvailable(returnableProducts.length === 0);
    return returnableProducts;
  }, [data, returnSummary]);

  // Function to get product weight by ID
  const getProductWeight = (productId: string) => {
    const product = productList.find((p) => p.value === productId);
    return product?.wt ?? 0;
  };

  useEffect(() => {
    console.log("Data prop:", JSON.stringify(data, null, 2));
    console.log("Product list:", productList);
    console.log("No products available:", noProductsAvailable);
  }, [data, productList, noProductsAvailable]);

  const rows = form.state.values.products.map((item) => {
    const product = productList.find((i) => i.value === item.product);
    const price = product?.price || 0;
    const quantity = item?.quantity || 0;
    return {
      _id: product?.value,
      name: product?.label,
      price: `${price}`,
      quantity,
      wt: item.wt,
      total: `${price * quantity}`,
    };
  });

  const calculateTotalCost = form.state.values.products.reduce((acc, item) => {
    const product = productList.find((i) => i.value === item.product);
    const price = product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Show loading state while fetching return summary
  if (isLoadingReturnSummary) {
    return (
      <div className="py-4 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Purchase Return</h1>
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading return information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-2xl font-semibold text-center">Purchase Return</h1>

      <form
        className="flex flex-col mx-4 mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Form submit event triggered");
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
          <form.Field name="billNo">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Bill No."
                  required
                  placeholder="Enter Bill No. (e.g., PR-00019)"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value.trim())}
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
                  placeholder="Enter Supplier Name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value.trim())}
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
          <form.Field name="refundAmount">
            {(field) => (
              <div className="w-full">
                <InputField
                  label="Refund Amount"
                  required
                  type="number"
                  placeholder="0"
                  value={field.state.value === 0 ? "" : field.state.value}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value) || 0)
                  }
                />
                <FieldError field={field} />
              </div>
            )}
          </form.Field>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="w-full">
            {noProductsAvailable ? (
              <div className="text-red-500 text-sm">
                No products available for this purchase.
              </div>
            ) : (
              <DropdownField
                label="Product"
                options={productList}
                required
                firstInput="Select Product"
                value={dynamicForm.product}
                onChange={(e) => {
                  const selectedProduct = productList.find(
                    (item) => item.value === e.target.value
                  );
                  console.log(
                    "Selected product:",
                    e.target.value,
                    selectedProduct
                  );
                  setDynamicForm({
                    product: e.target.value,
                    maxQuantity: selectedProduct?.remainingQuantity || 0, // Use remaining quantity instead of original
                    quantity: 0,
                    wt: getProductWeight(e.target.value), // Pre-fill weight
                  });
                }}
                inputClassname="w-full"
                disabled={noProductsAvailable}
              />
            )}
          </div>
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4">
              <div className="w-full">
                <InputField
                  label="Available for Return"
                  type="number"
                  placeholder="0"
                  value={
                    dynamicForm.maxQuantity === 0 ? "" : dynamicForm.maxQuantity
                  }
                  disabled
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Quantity"
                  required
                  type="number"
                  placeholder="0"
                  value={dynamicForm.quantity === 0 ? "" : dynamicForm.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value) || 0;
                    console.log(
                      "Quantity input:",
                      value,
                      "Max:",
                      dynamicForm.maxQuantity
                    );
                    if (value >= 0 && value <= dynamicForm.maxQuantity) {
                      setDynamicForm({
                        ...dynamicForm,
                        quantity: value,
                      });
                    }
                  }}
                  disabled={noProductsAvailable}
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Weight (kg)"
                  required
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={dynamicForm.wt === 0 ? "" : dynamicForm.wt}
                  onChange={(e) => {
                    const value = Number(e.target.value) || 0;
                    if (value >= 0) {
                      setDynamicForm({
                        ...dynamicForm,
                        wt: value,
                      });
                    }
                  }}
                  disabled={noProductsAvailable}
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  console.log("Add button clicked, dynamicForm:", dynamicForm);
                  if (
                    dynamicForm.product &&
                    dynamicForm.quantity > 0 &&
                    dynamicForm.quantity <= dynamicForm.maxQuantity &&
                    dynamicForm.wt >= 0
                  ) {
                    const newProduct = {
                      product: dynamicForm.product,
                      quantity: dynamicForm.quantity,
                      wt: dynamicForm.wt,
                    };
                    const currentProducts =
                      form.getFieldValue("products") || [];
                    const updatedProducts = [...currentProducts, newProduct];
                    form.setFieldValue("products", updatedProducts);
                    console.log(
                      "Product added, new products:",
                      updatedProducts
                    );
                    setDynamicForm({
                      product: "",
                      maxQuantity: 0,
                      quantity: 0,
                      wt: 0,
                    });
                  } else {
                    console.warn("Invalid product, quantity, or weight", {
                      product: dynamicForm.product,
                      quantity: dynamicForm.quantity,
                      maxQuantity: dynamicForm.maxQuantity,
                      wt: dynamicForm.wt,
                    });
                  }
                }}
                className="bg-[#df8d29] text-sm text-white px-3 py-2 rounded-md mr-2"
                disabled={noProductsAvailable}
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
                    wt: 0,
                  });
                }}
                className="px-3 py-2 text-sm text-black bg-gray-300 rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {form.state.values.products.length > 0 && (
          <div className="flex flex-col w-full">
            <div>
              <h1 className="text-xl font-semibold">Product Information</h1>
              <div className="border-b border-[#dedde2] w-full my-2" />
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
                <span>{`${Constants.currency} ${calculateTotalCost}`}</span>
              </div>
              <div className="flex justify-between text-sm w-64 font-bold">
                <span>Net Total</span>
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
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="resize-none bg-[#f6f7f9] border-2 border-[#d3dae4] focus:outline-none rounded-xl px-3 py-1 placeholder:text-[#858492]"
                placeholder="Enter reason for return"
              />
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
            disabled={form.state.values.products.length === 0}
            className={`flex-1 bg-[#df8d29] text-white px-7 py-2 rounded-xl ${
              form.state.values.products.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseReturnForm;
