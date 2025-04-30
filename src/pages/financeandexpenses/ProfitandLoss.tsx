import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import Header from "../../components/shared/table_heading/Header";
import { FrontendRoutes } from "../../routes/routes";

import ProfitTable from "./components/ProfitTable";
import {
  RevenueCategory,
  useGetFinancialReportQuery,
} from "../../server/api/profitandlossHook";
import { profitandlossColumns } from "./profitandlossObj";

// Filter state interface
interface FilterState {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  filter: string;
  sort: string;
}

const ProfitandLoss = () => {
  // Consolidated filter state
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(formatDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  const handleDataChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    currentPage: 1,
    itemsPerPage: 10,
    filter: "",
    sort: "",
  });

  const {
    data: FinancialReport,
    isSuccess: isfinancialRepSuccess,
    isLoading: isfinancialRepLoading,
  } = useGetFinancialReportQuery({ startDate, endDate });
  console.log("DATA", FinancialReport);

  // State for controlling hidden rows toggle visibility
  const [showHiddenRows, setShowHiddenRows] = useState(false);
  const financialReportList = useMemo(
    () =>
      isfinancialRepSuccess && FinancialReport?.revenue
        ? FinancialReport.revenue
        : [],
    [isfinancialRepSuccess, FinancialReport]
  );
  console.log("DATA FINANCIAL", financialReportList);

  const financiallReportList = useMemo(
    () =>
      isfinancialRepSuccess && FinancialReport?.expenses
        ? FinancialReport.expenses
        : [],
    [isfinancialRepSuccess, FinancialReport]
  );
  console.log("finadkfsdfs", financiallReportList);

  const navigate = useNavigate();

  const filterOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Customer Name (A-Z)" },
    { value: "name-desc", label: "Customer Name (Z-A)" },
    { value: "date-newest", label: "Newest First" },
    { value: "date-oldest", label: "Oldest First" },
    { value: "amount-high", label: "Amount (High to Low)" },
    { value: "amount-low", label: "Amount (Low to High)" },
  ];

  const filterItems = (items: RevenueCategory[]) => {
    if (!items || items.length === 0) return [];

    let filteredItems = [...items];

    // Apply search filter
    if (filterState.searchQuery) {
      filteredItems = filteredItems.filter((item) => {
        const category = item?.category?.toLowerCase() || "";

        return category.includes(filterState.searchQuery.toLowerCase());
      });
    }

    if (filterState.filter) {
      filteredItems = filteredItems.filter((item) => {
        return item.category.toLowerCase() === filterState.filter.toLowerCase();
      });
    }

    if (filterState.sort) {
      filteredItems = [...filteredItems].sort((a, b) => {
        switch (filterState.sort) {
          case "category-asc":
            return a.category.localeCompare(b.category);
          case "category-desc":
            return b.category.localeCompare(a.category);
          case "inflow-high":
            return b.inflow - a.inflow;
          case "inflow-low":
            return a.inflow - b.inflow;
          case "outflow-high":
            return b.outflow - a.outflow;
          case "outflow-low":
            return a.outflow - b.outflow;
          case "balance-high":
            return b.balance - a.balance;

          case "balance-low":
            return a.balance - b.balance;
          default:
            return 0;
        }
      });
    }

    return filteredItems;
  };

  // Sample data for main visible rows

  // const mainTransactions = useMemo(() => {
  //   return filterItems(financialReportList).map((categoryItem) => ({
  //     id: categoryItem.category, // Or a unique ID if needed
  //     category: categoryItem.category,
  //     inFlow: categoryItem.inflow,
  //     outFlow: categoryItem.outflow,
  //     balance: categoryItem.balance,
  //   }));
  // }, [financialReportList, filterState]);

  const mainTransactions = useMemo(() => {
    return filterItems(financialReportList).map((categoryItem) => ({
      id: categoryItem.category,
      category: categoryItem.category,
      inflow: categoryItem.inflow, // was: inFlow
      outflow: categoryItem.outflow, // was: outFlow
      balance: categoryItem.balance,
    }));
  }, [financialReportList, filterState]);

  const detailedTransactions = useMemo(() => {
    return filterItems(financiallReportList).map((item) => ({
      id: item.category,
      category: item.category,
      inflow: item.inflow,
      outflow: item.outflow,
      balance: item.balance,
    }));
  }, [financiallReportList]);
  console.log("DETAIED TRANSCSTIONS ", detailedTransactions);

  // const detailedTransactions = useMemo(() => {
  //   // Generate detailed transaction rows based on the main transactions
  //   return mainTransactions.slice(0, 3).flatMap((transaction) => {
  //     // Generate detailed rows based on inflow and outflow for each transaction
  //     return [
  //       {
  //         id: `${transaction.id}-detail-1`,

  //         category: `${transaction.category} - Item 1`,
  //         inFlow: Math.round(transaction.inflow * 0.6),
  //         outFlow: Math.round(transaction.outflow * 0.6),
  //         balance:
  //           Math.round(transaction.inflow * 0.6) -
  //           Math.round(transaction.outflow * 0.6),
  //       },
  //       {
  //         // id: `${transaction.id}-detail-2`,

  //         inFlow: Math.round(transaction.inflow * 0.4),
  //         outFlow: Math.round(transaction.outflow * 0.4),
  //         balance:
  //           Math.round(transaction.inflow * 0.4) -
  //           Math.round(transaction.outflow * 0.4),
  //       },
  //     ];
  //   });
  // }, [mainTransactions]);

  const handleViewItem = (item: any) => {
    navigate(`${FrontendRoutes.ORDERDETAILS}/${item.id}`);
  };

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filter, currentPage: 1 }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort, currentPage: 1 }));
  };

  return (
    <div className="container px-4 py-3 mx-auto">
      <Header text="Profit & Loss"></Header>

      <div className="flex gap-4 items-center my-4">
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>
      <div className="bg-white border-[#eae9ec] border-2 w-full pb-8 rounded-xl">
        <div className="mx-3">
          <ProfitTable
            // filterSection={
            //   <SearchFilterSort
            //     onFilter={handleFilter}
            //     onSort={handleSort}
            //     filterOptions={filterOptions}
            //     sortOptions={sortOptions}
            //     placeholder="Search by customer name, ID or email..."
            //   />
            // }
            rows={mainTransactions}
            columns={profitandlossColumns}
            loading={isfinancialRepLoading}
            // Enable hidden rows feature
            hiddenRows={detailedTransactions}
            showHiddenRowsToggle={true}
            hiddenRowsLabel="Expenses"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitandLoss;
