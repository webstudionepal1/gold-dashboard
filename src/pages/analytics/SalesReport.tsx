import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
import { salesReportTabOption, type ITable } from "../analytics/SalesReportObj";
import { map } from "lodash";
import {
  type IFetchExpenses,
  useDeleteExpenseMutation,
  useGetExpenseCategoryQuery,
  useGetExpensesQuery,
} from "../../server/api/expensesHook";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  useGetCategoryWiseDataQuery,
  useGetProductWiseDataQuery,
  useGetSubCategoryWiseDataQuery,
} from "../../server/api/salesReportHook";
import {
  DateFilter,
  type PeriodOption,
} from "../../components/shared/DatePeriodFilter";

interface IEditModal {
  state: boolean;
  editData?: IFetchExpenses | null;
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

type TabFilter = {
  date: string;
  period: PeriodOption;
};

const SalesReport = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("productWise");
  const todayFilter = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const initialTabFilters: Record<string, TabFilter> = {
    productWise: { date: todayFilter, period: "Yearly" },
    categoryWise: { date: todayFilter, period: "Yearly" },
    subCategoryWise: { date: todayFilter, period: "Yearly" },
  };

  const [tabFilters, setTabFilters] = useState(initialTabFilters);
  const handleTabFilterChange = (updatedFilter: TabFilter) => {
    setTabFilters((prev) => ({
      ...prev,
      [selectedTab]: updatedFilter,
    }));
  };
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

  // Define filter options based on backend fields
  const filterOptions = [
    { label: "All", value: "" },
    { label: "Category: Uncategorized", value: "Uncategorized" },
    { label: "Subcategory: Uncategorized", value: "Uncategorized_sub" },
  ];

  // Define sort options for product-wise tab
  const productWiseSortOptions = [
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Subcategory A-Z", value: "subCategory_asc" },
    { label: "Subcategory Z-A", value: "subCategory_desc" },
    { label: "Product A-Z", value: "product_asc" },
    { label: "Product Z-A", value: "product_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
  ];

  // Define sort options for category-wise tab
  const categoryWiseSortOptions = [
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
    { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
    { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
    { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
    { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
  ];

  // Define sort options for subcategory-wise tab
  const subCategoryWiseSortOptions = [
    { label: "Subcategory A-Z", value: "subCategory_asc" },
    { label: "Subcategory Z-A", value: "subCategory_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
    { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
    { label: "Total Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Total Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
    { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
    { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
  ];

  // Get current sort options based on selected tab
  const currentSortOptions =
    selectedTab === "productWise"
      ? productWiseSortOptions
      : selectedTab === "categoryWise"
      ? categoryWiseSortOptions
      : subCategoryWiseSortOptions;

  // Log filter and sort options to debug

  const {
    data: ProductWiseData,
    isSuccess: isProductWiseDataSuccess,
    isLoading: isProductWiseDataLoading,
  } = useGetProductWiseDataQuery({
    date: tabFilters.productWise.date,
    period: tabFilters.productWise.period.toLowerCase(),
  });

  const {
    data: categoryWiseDataList,
    isLoading: isCategoryWiseDataLoading,
    isSuccess: isCategoryWiseDataSuccess,
  } = useGetCategoryWiseDataQuery({
    date: tabFilters.categoryWise.date,
    period: tabFilters.categoryWise.period.toLowerCase(),
  });

  const {
    data: subCategoryWiseDataList,
    isLoading: isSubCategoryWiseDataLoading,
    isSuccess: isSubCategoryWiseDataSuccess,
  } = useGetSubCategoryWiseDataQuery({
    date: tabFilters.subCategoryWise.date,
    period: tabFilters.subCategoryWise.period.toLowerCase(),
  });

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

  const productWiseDataFiltered = useMemo(() => {
    if (!ProductWiseData || ProductWiseData.length === 0) {
      return [];
    }

    let result = [...ProductWiseData];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.category?.toLowerCase().includes(query) ||
          item.subCategory?.toLowerCase().includes(query) ||
          item.product?.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query)
      );
    }

    if (filterState.filterValue) {
      result = result.filter((item) => {
        if (filterState.filterValue === "Uncategorized") {
          return item.category === "Uncategorized";
        }
        if (filterState.filterValue === "Uncategorized_sub") {
          return item.subCategory === "Uncategorized";
        }

        return false;
      });
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "category_asc":
          result.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          break;
        case "category_desc":
          result.sort((a, b) =>
            (b.category || "").localeCompare(a.category || "")
          );
          break;
        case "subCategory_asc":
          result.sort((a, b) =>
            (a.subCategory || "").localeCompare(b.subCategory || "")
          );
          break;
        case "subCategory_desc":
          result.sort((a, b) =>
            (b.subCategory || "").localeCompare(a.subCategory || "")
          );
          break;
        case "product_asc":
          result.sort((a, b) =>
            (a.product || "").localeCompare(b.product || "")
          );
          break;
        case "product_desc":
          result.sort((a, b) =>
            (b.product || "").localeCompare(a.product || "")
          );
          break;
        case "unitsSold_asc":
          result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
          break;
        case "unitsSold_desc":
          result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
          break;
        case "averagePrice_asc":
          result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          break;
        case "averagePrice_desc":
          result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          break;
        default:
          console.log(
            "No matching sort value for product wise data:",
            filterState.sortValue
          );
          break;
      }
    }

    return result;
  }, [ProductWiseData, filterState]);

  const categoryWiseDataFiltered = useMemo(() => {
    if (
      !categoryWiseDataList ||
      !categoryWiseDataList.data ||
      categoryWiseDataList.data.length === 0
    ) {
      return [];
    }

    let result = [...categoryWiseDataList.data];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.category?.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalOrders).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query) ||
          String(item.percentageShare).includes(query)
      );
    }

    if (filterState.filterValue) {
      result = result.filter((item) => {
        if (filterState.filterValue === "Uncategorized") {
          return item.category === "Uncategorized";
        }

        return false;
      });
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "category_asc":
          result.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          break;
        case "category_desc":
          result.sort((a, b) =>
            (b.category || "").localeCompare(a.category || "")
          );
          break;
        case "unitsSold_asc":
          result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
          break;
        case "unitsSold_desc":
          result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
          break;
        case "totalOrders_asc":
          result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
          break;
        case "totalOrders_desc":
          result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
          break;
        case "averagePrice_asc":
          result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          break;
        case "averagePrice_desc":
          result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          break;
        case "percentageShare_asc":
          result.sort(
            (a, b) => (a.percentageShare || 0) - (b.percentageShare || 0)
          );
          break;
        case "percentageShare_desc":
          result.sort(
            (a, b) => (b.percentageShare || 0) - (a.percentageShare || 0)
          );
          break;
        default:
          console.log(
            "No matching sort value for category wise data:",
            filterState.sortValue
          );
          break;
      }
    }

    return result;
  }, [categoryWiseDataList, filterState]);

  const subCategoryWiseDataFiltered = useMemo(() => {
    if (
      !subCategoryWiseDataList ||
      !subCategoryWiseDataList.data ||
      subCategoryWiseDataList.data.length === 0
    ) {
      return [];
    }

    let result = [...subCategoryWiseDataList.data];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.subCategory?.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalOrders).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query) ||
          String(item.percentageShare).includes(query)
      );
    }

    if (filterState.filterValue) {
      result = result.filter((item) => {
        if (filterState.filterValue === "Uncategorized_sub") {
          return item.subCategory === "Uncategorized";
        }

        return false;
      });
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "subCategory_asc":
          result.sort((a, b) =>
            (a.subCategory || "").localeCompare(b.subCategory || "")
          );
          break;
        case "subCategory_desc":
          result.sort((a, b) =>
            (b.subCategory || "").localeCompare(a.subCategory || "")
          );
          break;
        case "unitsSold_asc":
          result.sort((a, b) => (a.unitsSold || 0) - (b.unitsSold || 0));
          break;
        case "unitsSold_desc":
          result.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
          break;
        case "totalOrders_asc":
          result.sort((a, b) => (a.totalOrders || 0) - (b.totalOrders || 0));
          break;
        case "totalOrders_desc":
          result.sort((a, b) => (b.totalOrders || 0) - (a.totalOrders || 0));
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => (a.totalRevenue || 0) - (b.totalRevenue || 0));
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
          break;
        case "averagePrice_asc":
          result.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
          break;
        case "averagePrice_desc":
          result.sort((a, b) => (b.averagePrice || 0) - (a.averagePrice || 0));
          break;
        case "percentageShare_asc":
          result.sort(
            (a, b) => (a.percentageShare || 0) - (b.percentageShare || 0)
          );
          break;
        case "percentageShare_desc":
          result.sort(
            (a, b) => (b.percentageShare || 0) - (a.percentageShare || 0)
          );
          break;
        default:
          console.log(
            "No matching sort value for subcategory wise data:",
            filterState.sortValue
          );
          break;
      }
    }

    return result;
  }, [subCategoryWiseDataList, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  // Reset sort value when tab changes to avoid invalid sort options
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setFilterState((prev) => ({ ...prev, sortValue: "" })); // Reset sort when switching tabs
  };

  const productWiseTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "subCategory", title: "Sub Category" },
        { key: "product", title: "Products" },
        { key: "totalRevenue", title: "Revenue" },
      ],
      rows: map(productWiseDataFiltered, (item) => {
        const row = {
          category: item.category || "N/A",
          subCategory: item.subCategory || "N/A",
          product: item.product || "N/A",
          totalRevenue: item.totalRevenue ?? 0,
        };
        return row;
      }),
    }),
    [productWiseDataFiltered]
  );

  const categoryWiseTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageSharee", title: "Percentage Share" },
      ],
      rows: map(categoryWiseDataFiltered, (item) => {
        const row = {
          category: item.category || "N/A",
          totalOrders: item.totalOrders ?? 0,
          totalRevenue: item.totalRevenue ?? 0,
          percentageSharee: <div>{item.percentageShare ?? 0} %</div>,
        };
        return row;
      }),
    }),
    [categoryWiseDataFiltered]
  );

  const subCategoryTableData = useMemo(
    () => ({
      columns: [
        { key: "subCategory", title: "Sub Category" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageSharee", title: "Percentage Share" },
      ],
      rows: map(subCategoryWiseDataFiltered, (item) => {
        const row = {
          subCategory: item.subCategory || "N/A",
          totalOrders: item.totalOrders ?? 0,
          totalRevenue: item.totalRevenue ?? 0,
          percentageSharee: <div>{item.percentageShare ?? 0} %</div>,
        };
        return row;
      }),
    }),
    [subCategoryWiseDataFiltered]
  );

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
    <div className="container px-4 py-3 mx-auto">
      <div className="mb-6">
        <Header text="Sales Report" />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Report Settings
            </h3>
            <DateFilter
              value={tabFilters[selectedTab]}
              onChange={handleTabFilterChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
              <span className="font-medium">Current Period:</span>{" "}
              <span>{tabFilters[selectedTab].period}</span>
            </div>
            <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
              <span className="font-medium">Date:</span>{" "}
              <span>
                {new Date(tabFilters[selectedTab].date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <MasterTable
          loading={
            isProductWiseDataLoading ||
            isCategoryWiseDataLoading ||
            isSubCategoryWiseDataLoading ||
            expensesLoading ||
            expenseCatLoading
          }
          tabsOptions={
            <DynamicTab
              selectedTab={selectedTab}
              setSelectedTab={handleTabChange}
              tabOptions={salesReportTabOption}
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
              filterOptions={filterOptions}
              sortOptions={currentSortOptions}
              placeholder="Search products..."
            />
          }
          rows={tableDataObj[selectedTab].rows || []}
          columns={tableDataObj[selectedTab].columns}
          canSelect
        />
      </div>
    </div>
  );
};

export default SalesReport;
