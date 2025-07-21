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

type Item = {
  name: string;
  unit: string;
  costPerUnit: number;
  quantity: number;
  total: number;
};

type SummaryType = "purchase" | "refund";
type PurchaseDetailsProps = {
  billNo: string;
  date: string;
  purchaseId: string;
  supplier: string;
  items: Item[];
  totalCost?: number;
  discount?: number;
  netTotal?: number;
  refundAmount?: number;
  summaryType?: SummaryType;
};

interface PropDetails {
  data: IFetchPurchase | IFetchPurchaseReturn;
  summary?: string;
}
export const PurchaseDetailsCard: React.FC<PropDetails> = ({
  data,
  summary = "Purchase",
}) => {
  const rows =
    data?.items.length > 0
      ? data.items.map((item: any) => ({
          name: get(item, "product.name", "N/A"),
          costPerUnit: get(item, "price", 0),
          quantity: get(item, "quantity", 0),
          wt: get(item, "wt", 0),
          total: get(item, "totalCost", 0),
        }))
      : data.products.map((item: any) => ({
          name: get(item, "product.name", "N/A"),
          costPerUnit: get(item, "price", 0),
          quantity: get(item, "quantity", 0),
          wt: get(item, "wt", 0),
          total: get(item, "quantity", 0) * get(item, "price", 0),
        }));
  return (
    <div className="max-w-4xl p-4 mx-auto font-sans text-sm text-gray-700 bg-white shadow-md rounded-xl">
      <div className="text-lg font-semibold text-center">{summary}</div>

      {/* Header Info */}
      <div>
        <div className="flex justify-between text-gray-500">
          <div className="flex items-center gap-10">
            <div className="text-xs">Bill No.</div>
            <div className="font-semibold">#{get(data, "billNo", "-")}</div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-xs">Date:</div>
            <div className="font-semibold">
              {dayjs(data?.createdAt).format("MMM-DD-YYYY")}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-2 gap-7">
          <div className="text-xs text-gray-500">Suppliers</div>
          <div className="font-semibold">{get(data, "supplier", "")}</div>
        </div>
      </div>

      {/* Reused Table Component */}
      <MasterTable
        className="p-0"
        canSearch={false}
        columns={viewPurchaseColumns}
        rows={rows}
      />

      {/* Summary */}
    </div>
  );
};
