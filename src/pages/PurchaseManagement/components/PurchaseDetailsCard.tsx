// components/PurchaseDetailsCard.tsx
import React from "react";
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

export const PurchaseDetailsCard: React.FC<PurchaseDetailsProps> = ({
  billNo,
  date,
  purchaseId,
  supplier,
  items,
  totalCost,
  discount,
  netTotal,
  refundAmount,
  summaryType,
}) => {
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 text-sm text-gray-700 font-sans">
      {summaryType === "purchase" ? (
        <div className="text-center font-semibold text-lg">
          Purchase Details
        </div>
      ) : summaryType === "refund" ? (
        <div className="text-center font-semibold text-lg">
          Purchase Return Details
        </div>
      ) : null}

      {/* Header Info */}
      <div className="flex justify-between text-gray-500 gap-10">
        <div className="flex items-center gap-10">
          <div className="text-xs">Bill No.</div>
          <div className="font-semibold">#{billNo}</div>
        </div>
        <div className="flex items-center gap-2 pl-[">
          <div className="text-xs">Date:</div>
          <div className="font-semibold">{date}</div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="text-xs text-gray-500">Purchase ID</div>
        <div className="font-semibold">{purchaseId}</div>
      </div>
      <div className="flex items-center gap-10">
        <div className="text-xs text-gray-500">Suppliers</div>
        <div className="font-semibold">{supplier}</div>
      </div>

      {/* Reused Table Component */}
      <SimpleTable<Item>
        title=""
        data={items}
        columns={itemColumns}
        showCheckbox={false}
        showViewButton={false}
      />

      {/* Summary */}
      {summaryType === "purchase" ? (
        <div className="flex flex-col items-end space-y-1 mt-4 text-sm">
          <div className="flex justify-between w-64">
            <span className="text-gray-500">Total Cost</span>
            <span>Rs.{totalCost}</span>
          </div>
          <div>
            <div className="flex justify-between w-64">
              <span className="text-gray-500">Discount (%)</span>
              <span>Rs.{discount}</span>
            </div>
            <div className="border-b border-[#dedde2] w-full my-2" />
          </div>
          <div className="flex justify-between w-64 font-bold text-base mt-2">
            <span>Net Total</span>
            <span>Rs.{netTotal}</span>
          </div>
        </div>
      ) : summaryType === "refund" ? (
        <div className="flex justify-between w-64 ml-auto font-bold text-base mt-4">
          <span>Refund Amount</span>
          <span>Rs.{refundAmount}</span>
        </div>
      ) : null}
    </div>
  );
};
