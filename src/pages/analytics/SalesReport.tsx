import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import { ScrollableModal } from "../../components/shared/ScrollableModal";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";

import { salesReportTabOption, ITable } from "../analytics/SalesReportObj";

import { map } from "lodash";
import {
  IFetchExpenses,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";

import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { filterOptions, sortOptions } from "../../constants/DropDownOptions";
import {
  useGetCategoryWiseDataQuery,
  useGetProductWiseDataQuery,
  useGetSubCategoryWiseDataQuery,
} from "../../server/api/salesReportHook";
import { useGetOrderCategoryQuery } from "../../server/api/orderReportHook";

interface IEditModal {
  state: boolean;
  editData?: IFetchExpenses | null;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

const SalesReport = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("productWise");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState<string>(formatDate(sevenDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  const {
    data: ProductWiseData,
    isSuccess: isProductWiseDataSuccess,
    isLoading: isProductWiseDataLoading,
  } = useGetProductWiseDataQuery({ startDate, endDate });

  const {
    data: categoryWiseDataList,
    isLoading: isCategoryWiseDataLoading,
    isSuccess: isCategoryWiseDataSuccess,
  } = useGetCategoryWiseDataQuery();

  const {
    data: subCategoryWiseDataList,
    isLoading: isSubCategoryWiseDataLoading,
    isSuccess: isSubCategoryWiseDataSuccess,
  } = useGetSubCategoryWiseDataQuery();

  const { mutate: deleteExpense } = useDeleteExpenseMutation();
  const {
    data: expensesList,
    isLoading: expensesLoading,
    isSuccess: expensesSuccess,
  } = useGetExpensesQuery();

  const {
    data: expenseCategories,
    isLoading: expenseCatLoading,
    isSuccess: expenseCatSuccess,
  } = useGetExpenseCategoryQuery();

  const expenseData = useMemo(
    () => (expensesSuccess ? expensesList : []),
    [expensesSuccess, expensesList]
  );

  const filteredExpenses = useMemo(() => {
    if (!expenseData || expenseData.length === 0) return [];

    let result = [...expenseData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.expenseCategory.name &&
            item.expenseCategory.name.toLowerCase().includes(query)) ||
          (typeof item.expenseCategory.name === "string" &&
            item.expenseCategory.name.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }
    if (filterState.filterValue) {
      result = result.filter(
        (item) =>
          (typeof item.expenseCategory.name === "string" &&
            item.expenseCategory.name === filterState.filterValue) ||
          (item.description && item.description === filterState.filterValue)
      );
    }

    // if (filterState.sortValue) {
    //   switch (filterState.sortValue) {
    //     case "title_asc":
    //       result.sort((a, b) =>
    //         a.name && b.name ? a.name.localeCompare(b.name) : 0
    //       );
    //       break;
    //     case "title_desc":
    //       result.sort((a, b) =>
    //         a.name && b.name ? b.name.localeCompare(a.name) : 0
    //       );
    //       break;
    //     case "price_asc":
    //       result.sort((a, b) => (a.price && b.price ? a.price - b.price : 0));
    //       break;
    //     case "price_desc":
    //       result.sort((a, b) => (a.price && b.price ? b.price - a.price : 0));
    //       break;
    //     case "rating_asc":
    //       result.sort((a, b) =>
    //         a.ratings && b.ratings ? a.ratings - b.ratings : 0
    //       );
    //       break;
    //     case "rating_desc":
    //       result.sort((a, b) =>
    //         a.ratings && b.ratings ? b.ratings - a.ratings : 0
    //       );
    //       break;
    //   }
    // }

    return result;
  }, [expenseData, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  const productWiseTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "subCategory", title: "Sub Category" },
        { key: "product", title: "Products" },
        { key: "totalRevenue", title: "Revenue" },
      ],
      rows: map(ProductWiseData, (item) => ({
        ...item,
      })),
    }),
    [ProductWiseData, isProductWiseDataSuccess]
  );
  const categoryWiseTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageSharee", title: "Percentage Share" },
      ],
      rows: map(categoryWiseDataList, (item) => ({
        ...item,
        percentageSharee: <div>{item.percentageShare} %</div>,
      })),
    }),
    [categoryWiseDataList, isCategoryWiseDataSuccess]
  );

  const subCategoryTableData = useMemo(
    () => ({
      columns: [
        { key: "subCategory", title: "Sub Category" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageSharee", title: "Percentage Share" },
      ],
      rows: map(subCategoryWiseDataList, (item) => ({
        ...item,
        percentageSharee: <div>{item.percentageShare} %</div>,
      })),
    }),
    [subCategoryWiseDataList, isSubCategoryWiseDataSuccess]
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
    productWise: productWiseTableData,
    categoryWise: categoryWiseTableData,
    subCategoryWise: subCategoryTableData,
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
      <Header text="Sales Report" />

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
      <MasterTable
        loading={expensesLoading || expenseCatLoading}
        tabsOptions={
          <DynamicTab
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={salesReportTabOption}
          />
        }
        // filterSection={
        //   <SearchFilterSort
        //     onFilter={handleFilter}
        //     onSort={handleSort}
        //     onViewChange={() => {}}
        //     showFilter={true}
        //     showSort={true}
        //     showView={true}
        //     filterOptions={filterOptions}
        //     sortOptions={sortOptions}
        //     placeholder="Search products..."
        //   />
        // }
        rows={tableDataObj[selectedTab].rows || []}
        columns={tableDataObj[selectedTab].columns}
        canSelect
      />
    </div>
  );
};

export default SalesReport;
