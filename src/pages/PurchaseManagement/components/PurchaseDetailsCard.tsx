// components/PurchaseDetailsCard.tsx
import React from "react";
import {
  SimpleTable,
  SimpleTableColumn,
} from "../../Customer/components/SimpleTable";
import {
  IFetchPurchase,
  IFetchPurchaseReturn,
} from "../../../server/api/purchaseHooks";
import dayjs from "dayjs";
import { get } from "lodash";
import MasterTable from "../../../components/shared/MasterTable";
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
          name: item.item?.name,
          unit: item.product?.unit,
          costPerUnit: item.costPerUnit,
          quantity: item.quantity,
          total: item.total,
        }))
      : data.products.map((item: any) => ({
          name: item.product?.name,
          unit: item.product?.unit,
          costPerUnit: item.costPerUnit,
          quantity: item.quantity,
          total: item.total,
        }));
  return (
    <div className="max-w-3xl p-6 mx-auto space-y-4 font-sans text-sm text-gray-700 bg-white shadow-md rounded-xl">
      <div className="text-lg font-semibold text-center">{summary}</div>

      {/* Header Info */}
      <div className="flex justify-between gap-10 text-gray-500">
        <div className="flex items-center gap-10">
          <div className="text-xs">Bill No.</div>
          <div className="font-semibold">#{get("data", "billNo", "-")}</div>
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
        <div className="font-semibold">{get(data, "supplier.name")}</div>
      </div>

      {/* Reused Table Component */}
      <MasterTable
        canSearch={false}
        columns={viewPurchaseColumns}
        rows={rows}
      />

      {/* Summary */}
     
    </div>
  );
};
