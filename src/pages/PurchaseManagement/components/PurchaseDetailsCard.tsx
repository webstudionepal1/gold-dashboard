// components/PurchaseDetailsCard.tsx
import dayjs from "dayjs";
import { get } from "lodash";
import React from "react";
import MasterTable from "../../../components/shared/MasterTable";
import {
  IFetchPurchase,
  IFetchPurchaseReturn,
} from "../../../server/api/purchaseHooks";
import { viewPurchaseColumns } from "../purchaseObj";

// Removed unused types to fix ESLint warnings

interface PropDetails {
  data: IFetchPurchase | IFetchPurchaseReturn;
  summary?: string;
}
export const PurchaseDetailsCard: React.FC<PropDetails> = ({
  data,
  summary = "Purchase",
}) => {
  const rows =
    data?.items && data.items.length > 0
      ? data.items.map((item) => ({
          name: get(item, "product.name", "N/A"),
          costPerUnit: get(item, "price", 0),
          quantity: get(item, "quantity", 0),
          wt: get(item, "wt", 0),
          total: get(item, "totalCost", 0),
        }))
      : data?.products && data.products.length > 0
      ? data.products.map((item) => ({
          name: get(item, "product.name", "N/A"),
          costPerUnit: get(item, "price", 0),
          quantity: get(item, "quantity", 0),
          wt: get(item, "wt", 0),
          total: get(item, "quantity", 0) * get(item, "price", 0),
        }))
      : [];
  return (
    <div className="max-w-2xl p-6 mx-auto space-y-4 font-sans text-sm text-gray-700 bg-white shadow-md rounded-xl">
      <div className="text-lg font-semibold text-center">{summary}</div>

      {/* Header Info */}
      <div className="flex justify-between gap-10 text-gray-500">
        <div className="flex items-center gap-10">
          <div className="text-xs">Bill No.</div>
          <div className="font-semibold">#{get(data, "billNo", "-")}</div>
        </div>
        <div className="flex items-center gap-2 pl-[">
          <div className="text-xs">Date:</div>
          <div className="font-semibold">
            {dayjs(data?.createdAt).format("MMM-DD-YYYY")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="text-xs text-gray-500">Suppliers</div>
        <div className="font-semibold">{get(data, "supplier", "")}</div>
      </div>

      {/* Reused Table Component */}
      <MasterTable
        mainClassName="p-0"
        canSearch={false}
        columns={viewPurchaseColumns}
        rows={rows}
      />

      {/* Summary */}
      {summary === "refund" && "totalQuantityPurchased" in data && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Qty Purchased:</span>
              <span className="font-semibold">
                {(data as IFetchPurchaseReturn).totalQuantityPurchased || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Qty Returned:</span>
              <span className="font-semibold">
                {(data as IFetchPurchaseReturn).totalQuantityReturned || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Return Amount:</span>
              <span className="font-semibold">
                Rs.{(data as IFetchPurchaseReturn).totalReturnAmount || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Refund Amount:</span>
              <span className="font-semibold">
                Rs.{(data as IFetchPurchaseReturn).refundAmount || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Summary */}
      {summary === "Purchase" && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Quantity:</span>
              <span className="font-semibold">
                {rows.reduce((acc, item) => acc + (item.quantity || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">
                Rs.{rows.reduce((acc, item) => acc + (item.total || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
