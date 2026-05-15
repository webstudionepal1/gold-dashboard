import dayjs from "dayjs";
import { get } from "lodash";
import { useMemo } from "react";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import {
  useDeleteCashflowMutation,
  useGetAllCashflowQuery,
} from "../../server/api/cashflowHooks";
import { cashFlowColumns, getCashInAndOut } from "./components/CashObj";

const Cashflow = () => {
  const { data: cashflow, isSuccess, isLoading } = useGetAllCashflowQuery();
  const { mutate: deleteCash } = useDeleteCashflowMutation();
  const rows = useMemo(
    () =>
      isSuccess
        ? cashflow.map((item) => ({
            ...item,

            date: dayjs(item.createdAt).format("MMM-DD-YYYY"),
            type: get(item, "transactionType", "-")
              .split(/(?=[A-Z])/)
              .map((word, index) =>
                index === 0
                  ? word.charAt(0).toUpperCase() + word.slice(1)
                  : word
              )
              .join(" "),
            inFlow: getCashInAndOut(item) === "cash-in" ? item.amount : "-",
            outFlow: getCashInAndOut(item) === "cash-out" ? item.amount : "-",
            total:
              getCashInAndOut(item) === "cash-in"
                ? item.amount
                : getCashInAndOut(item) === "cash-out"
                ? -item.amount
                : "-",
          }))
        : [],
    [isSuccess, cashflow]
  );

  return (
    <div>
      <Header text="Cash Flow" />
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          showAction
          onDelete={(id: string) => deleteCash(id)}
          rows={rows}
          columns={cashFlowColumns}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default Cashflow;
