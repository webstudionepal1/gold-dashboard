import React, { useMemo } from "react";
import MasterTable from "../../../components/shared/MasterTable";
import { formatPrice } from "../../../utils/priceConversions";
import {
  MetalPriceHistoryRecord,
  useGetAllMetalPricesQuery,
} from "../../../server/api/metalPricesHooks";

const historyColumns = [
  { key: "sn", title: "S.N" },
  { key: "createdAt", title: "Date" },
  { key: "baseGold999PerTola", title: "Gold 99.9 / Tola" },
  { key: "baseSilverPerTola", title: "Silver / Tola" },
  { key: "goldPerGram", title: "Gold / Gram" },
  { key: "silverPerGram", title: "Silver / Gram" },
  { key: "currency", title: "Currency" },
  { key: "status", title: "Status" },
];

interface MetalPriceHistoryTableProps {
  title?: string;
  showActions?: boolean;
}

const MetalPriceHistoryTable: React.FC<MetalPriceHistoryTableProps> = ({
  title = "Metal Price History",
  showActions = false,
}) => {
  const { data: records = [], isLoading } = useGetAllMetalPricesQuery();

  const rows = useMemo(
    () =>
      records.map((record: MetalPriceHistoryRecord, index: number) => ({
        ...record,
        sn: index + 1,
        id: record._id,
        createdAt: new Date(record.createdAt).toLocaleString(),
        baseGold999PerTola: formatPrice(
          record.baseGold999PerTola,
          record.currency
        ),
        baseSilverPerTola: formatPrice(
          record.baseSilverPerTola,
          record.currency
        ),
        goldPerGram: formatPrice(record.goldPerGram, record.currency),
        silverPerGram: formatPrice(record.silverPerGram, record.currency),
        status: (
          <span
            className={`text-white py-1 px-2 rounded-full text-xs ${
              record.isLatest ? "bg-green" : "bg-gray-400"
            }`}
          >
            {record.isLatest ? "Latest" : "Archived"}
          </span>
        ),
      })),
    [records]
  );

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      )}
      <MasterTable
        loading={isLoading}
        columns={historyColumns}
        rows={rows}
        showAction={showActions}
      />
    </div>
  );
};

export default MetalPriceHistoryTable;
