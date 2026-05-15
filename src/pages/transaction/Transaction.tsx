import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";

import {
  ITable,
  transactionTabOption
} from "../transaction/transactionObj";

import { format, isValid, parseISO } from "date-fns";
import { map } from "lodash";
import { useGetTransactionsQuery } from "../../server/api/transactionHooks";

import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { getOrderDetailsPath } from "@/lib/order-api";

function formatDisplayDate(
  value: string | Date | null | undefined,
  fallback = "—"
): string {
  if (value == null || value === "") return fallback;
  const date = value instanceof Date ? value : parseISO(String(value));
  if (!isValid(date)) return fallback;
  return format(date, "dd MMM yyyy");
}

function formatPaymentStatus(status: string | undefined): string {
  const s = (status || "pending").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toSortableTime(value: string | undefined): number {
  if (!value) return 0;
  const date = parseISO(value);
  return isValid(date) ? date.getTime() : 0;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

interface DateFilter {
  fromDate: string;
  toDate: string;
}

const Transaction = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("cash");

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  // Set default date range to current month
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    fromDate: format(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      "yyyy-MM-dd"
    ),
    toDate: format(new Date(), "yyyy-MM-dd"),
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    isSuccess: transactionsSuccess,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({
    fromDate: dateFilter.fromDate,
    toDate: dateFilter.toDate,
  });

  // Refetch data when date filter changes
  useEffect(() => {
    refetchTransactions();
  }, [dateFilter.fromDate, dateFilter.toDate, refetchTransactions]);

  const transactionData = useMemo(
    () => (transactionsSuccess ? transactions : []),
    [transactionsSuccess, transactions]
  );

  const filteredTransactions = useMemo(() => {
    if (!transactionData || transactionData.length === 0) return [];

    let result = [...transactionData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.customerName &&
            item.customerName.toLowerCase().includes(query)) ||
          (item.orderId && item.orderId.toLowerCase().includes(query)) ||
          (item.transactionId &&
            item.transactionId.toLowerCase().includes(query)) ||
          (item.customerPhone &&
            item.customerPhone.toLowerCase().includes(query))
      );
    }

    if (filterState.filterValue) {
      result = result.filter(
        (item) => item.paymentMethod === filterState.filterValue
      );
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "date_asc":
          result.sort(
            (a, b) =>
              toSortableTime(a.paymentDate || a.orderDate) -
              toSortableTime(b.paymentDate || b.orderDate)
          );
          break;
        case "date_desc":
          result.sort(
            (a, b) =>
              toSortableTime(b.paymentDate || b.orderDate) -
              toSortableTime(a.paymentDate || a.orderDate)
          );
          break;
        case "amount_asc":
          result.sort((a, b) => a.totalAmount - b.totalAmount);
          break;
        case "amount_desc":
          result.sort((a, b) => b.totalAmount - a.totalAmount);
          break;
      }
    }

    return result;
  }, [transactionData, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  const cashTransactionTableData = useMemo(
    () => ({
      columns: [
        { key: "customerName", title: "Customer Name" },
        { key: "customerPhone", title: "Phone No." },
        { key: "orderId", title: "Order ID" },
        { key: "transactionId", title: "Transaction ID" },
        { key: "orderDate", title: "Order Date" },
        { key: "paymentDate", title: "Payment Date" },
        { key: "totalAmount", title: "Total Amount" },
        { key: "payment", title: "Payment" },
        { key: "remainingPayment", title: "Remaining" },
        { key: "paymentStatus", title: "Status" },
      ],
      rows: map(
        filteredTransactions.filter((item) => item.paymentMethod === "cash"),
        (item) => ({
          ...item,
          orderDate: formatDisplayDate(item.orderDate),
          paymentDate: formatDisplayDate(item.paymentDate || item.orderDate),
          totalAmount: `Rs. ${(item.totalAmount ?? 0).toLocaleString()}`,
          payment: `Rs. ${(item.payment ?? 0).toLocaleString()}`,
          remainingPayment: `Rs. ${(item.remainingPayment ?? 0).toLocaleString()}`,
          paymentStatus: formatPaymentStatus(item.paymentStatus),
        })
      ),
    }),
    [filteredTransactions]
  );

  const digitalPaymentTableData = useMemo(
    () => ({
      columns: [
        { key: "customerName", title: "Customer Name" },
        { key: "customerPhone", title: "Phone No." },
        { key: "orderId", title: "Order ID" },
        { key: "transactionId", title: "Transaction ID" },
        { key: "paymentMethodFormatted", title: "Payment Method" },
        { key: "orderDate", title: "Order Date" },
        { key: "paymentDate", title: "Payment Date" },
        { key: "totalAmount", title: "Total Amount" },
        { key: "payment", title: "Payment" },
        { key: "remainingPayment", title: "Remaining" },
        { key: "paymentStatus", title: "Status" },
      ],
      rows: map(
        filteredTransactions.filter((item) =>
          ["card", "bank_transfer", "online", "paypal", "afterpay"].includes(
            item.paymentMethod
          )
        ),
        (item) => {
          // Format payment method to be more readable
          let paymentMethodFormatted = "";
          switch (item.paymentMethod) {
            case "card":
              paymentMethodFormatted = "Card";
              break;
            case "bank_transfer":
              paymentMethodFormatted = "Bank Transfer";
              break;
            case "online":
              paymentMethodFormatted = "Online";
              break;
            case "paypal":
              paymentMethodFormatted = "PayPal";
              break;
            case "afterpay":
              paymentMethodFormatted = "AfterPay";
              break;
            default:
              paymentMethodFormatted =
                item.paymentMethod.charAt(0).toUpperCase() +
                item.paymentMethod.slice(1);
          }

          return {
            ...item,
            paymentMethodFormatted,
            orderDate: formatDisplayDate(item.orderDate),
            paymentDate: formatDisplayDate(item.paymentDate || item.orderDate),
            totalAmount: `Rs. ${(item.totalAmount ?? 0).toLocaleString()}`,
            payment: `Rs. ${(item.payment ?? 0).toLocaleString()}`,
            remainingPayment: `Rs. ${(item.remainingPayment ?? 0).toLocaleString()}`,
            paymentStatus: formatPaymentStatus(item.paymentStatus),
          };
        }
      ),
    }),
    [filteredTransactions]
  );
  // const returnTableData = useMemo(
  //   () => ({
  //     columns: [{ key: "name", title: "Name" }],
  //     rows: map(returnList, (item) => ({
  //       ...item,
  //     })),
  //   }),
  //   [returnList, returnSuccess]
  // );

  const tableDataObj: ITable = {
    cash: cashTransactionTableData,
    digitalPayment: digitalPaymentTableData,
  };
  const [modal, setModal] = useState({
    of: "",
    edit: false,
    data: null,
  });
  const closeModal = useCallback(
    () => setModal({ of: "", edit: false, data: null }),
    []
  );
  return (
    <div className="container px-4 py-3 mx-auto ">
      <Header
        // text={selectedTab === "expenses" ? "Expenses" : "Expenses Category"}
        text="Transaction"
      />
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              value={dateFilter.fromDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, fromDate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              value={dateFilter.toDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, toDate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="self-end mb-1">
            <button
              onClick={() => refetchTransactions()}
              className="px-4 py-2 bg-blue-600 flex items-center gap-2 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Icon icon="mdi:refresh" className="mr-1" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {transactionsError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error loading transactions. Please try again.
        </div>
      )}

      <MasterTable
        loading={transactionsLoading}
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={transactionTabOption}
          />
        }
        filterSection={
          <SearchFilterSort
            onFilter={handleFilter}
            onSort={handleSort}
            onViewChange={() => {}}
            showFilter={true}
            showSort={true}
            showView={false}
            filterOptions={[
              { label: "All", value: "" },
              { label: "Cash", value: "cash" },
              { label: "Card", value: "card" },
              { label: "Bank Transfer", value: "bank_transfer" },
              { label: "Online", value: "online" },
              { label: "PayPal", value: "paypal" },
              { label: "AfterPay", value: "afterpay" },
            ]}
            sortOptions={[
              { label: "Date (Newest)", value: "date_desc" },
              { label: "Date (Oldest)", value: "date_asc" },
              { label: "Amount (High-Low)", value: "amount_desc" },
              { label: "Amount (Low-High)", value: "amount_asc" },
            ]}
            placeholder="Search by name, order ID..."
          />
        }
        rows={tableDataObj[selectedTab].rows || []}
        columns={tableDataObj[selectedTab].columns}
        emptyStateMessage="No transactions found for the selected period. Try changing the date range."
        showAction={true}
        viewAction={(row) => {
          if (!row.orderId) return;
          navigate(getOrderDetailsPath(row.orderId, row.orderStatus));
        }}
      />
      {/* {modal.of === "expenses" && (
        <ScrollableModal onClose={closeModal} classname="w-[35rem]">
          <ExpenseForm closeModal={closeModal} />
        </ScrollableModal>
      )}

      {modal.of === "expensesCategory" && (
        <ScrollableModal classname="w-[35rem]" onClose={closeModal}>
          <ExpenseCategoryForm closeModal={closeModal} />
        </ScrollableModal>
      )} */}
    </div>
  );
};

export default Transaction;
