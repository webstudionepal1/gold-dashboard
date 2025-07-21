import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
import { stockReportTabOption, type ITable } from "./StockReportObj";
import { map } from "lodash";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  useCategoryWiseDataQuery,
  useLowStockWiseDataQuery,
} from "../../server/api/stockReportHooks";

// Define interfaces for data structures
interface CategoryWiseItem {
  category?: string;
  totalProducts?: number;
  totalStock?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
  lowStockPercentage?: number;
  outofStockPercentage?: number;
}

interface LowStockWiseItem {
  name?: string;
  category?: string;
  variant?: {
    remainingStock?: number;
    reorderPoint?: number;
    status?: string;
    price?: number;
  };
}

interface FilterState {
  searchQuery: string;
  filterValue: string;
  sortValue: string;
}

const StoreReport = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<
    "categoryWise" | "lowStockWise"
  >("categoryWise");
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  // Define filter options directly in the component
  const filterOptions = [
    { label: "All", value: "" },
    { label: "Low Stock", value: "low_stock" },
    { label: "Out of Stock", value: "out_of_stock" },
  ];

  // Define sort options for category-wise tab
  const categoryWiseSortOptions = [
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Total Stock (Low to High)", value: "totalStock_asc" },
    { label: "Total Stock (High to Low)", value: "totalStock_desc" },
    { label: "Total Products (Low to High)", value: "totalProducts_asc" },
    { label: "Total Products (High to Low)", value: "totalProducts_desc" },
    { label: "Low Stock Count (Low to High)", value: "lowStockCount_asc" },
    { label: "Low Stock Count (High to Low)", value: "lowStockCount_desc" },
    { label: "Out of Stock Count (Low to High)", value: "outOfStockCount_asc" },
    {
      label: "Out of Stock Count (High to Low)",
      value: "outOfStockCount_desc",
    },
    { label: "Low Stock % (Low to High)", value: "lowStockPercentage_asc" },
    { label: "Low Stock % (High to Low)", value: "lowStockPercentage_desc" },
    {
      label: "Out of Stock % (Low to High)",
      value: "outofStockPercentage_asc",
    },
    {
      label: "Out of Stock % (High to Low)",
      value: "outofStockPercentage_desc",
    },
  ];

  // Define sort options for low stock-wise tab
  const lowStockWiseSortOptions = [
    { label: "Name A-Z", value: "name_asc" },
    { label: "Name Z-A", value: "name_desc" },
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Remaining Stock (Low to High)", value: "remainingStock_asc" },
    { label: "Remaining Stock (High to Low)", value: "remainingStock_desc" },
    { label: "Status A-Z", value: "status_asc" },
    { label: "Status Z-A", value: "status_desc" },
    { label: "Price (Low to High)", value: "price_asc" },
    { label: "Price (High to Low)", value: "price_desc" },
  ];

  // Get current sort options based on selected tab
  const currentSortOptions =
    selectedTab === "categoryWise"
      ? categoryWiseSortOptions
      : lowStockWiseSortOptions;

  // Log filter, sort options, and tab configuration

  const {
    data: categoryWiseDataList,
    isLoading: categoryWiseDataLoading,
    isSuccess: categoryWiseDataSuccess,
  } = useCategoryWiseDataQuery();

  const {
    data: lowStockWiseDataList,
    isLoading: lowStockWiseDataLoading,
    isSuccess: lowStockWiseDataSuccess,
  } = useLowStockWiseDataQuery();

  // Process category-wise data without useMemo
  let categoryWiseData: CategoryWiseItem[] = [];
  if (
    !categoryWiseDataSuccess ||
    !Array.isArray(categoryWiseDataList) ||
    !categoryWiseDataList.length
  ) {
    categoryWiseData = [
      {
        category: "Electronics",
        totalProducts: 10,
        totalStock: 100,
        lowStockCount: 2,
        outOfStockCount: 1,
        lowStockPercentage: 20,
        outofStockPercentage: 10,
      },
      {
        category: "Clothing",
        totalProducts: 15,
        totalStock: 150,
        lowStockCount: 3,
        outOfStockCount: 0,
        lowStockPercentage: 20,
        outofStockPercentage: 0,
      },
    ];
  } else {
    categoryWiseData = categoryWiseDataList;
  }

  // Process low stock-wise data without useMemo
  let lowStockWiseData: LowStockWiseItem[] = [];
  if (
    !lowStockWiseDataSuccess ||
    !Array.isArray(lowStockWiseDataList) ||
    !lowStockWiseDataList.length
  ) {
    lowStockWiseData = [
      {
        name: "Product A",
        category: "Category 1",
        variant: {
          remainingStock: 5,
          reorderPoint: 10,
          status: "low_stock",
          price: 20,
        },
      },
      {
        name: "Product B",
        category: "Category 2",
        variant: {
          remainingStock: 0,
          reorderPoint: 5,
          status: "out_of_stock",
          price: 15,
        },
      },
    ];
  } else {
    lowStockWiseData = lowStockWiseDataList;
  }

  // Filter and sort category-wise data without useMemo
  let categoryWiseDataFiltered = [...categoryWiseData];
  if (!Array.isArray(categoryWiseData) || categoryWiseData.length === 0) {
    categoryWiseDataFiltered = [
      {
        category: "Electronics",
        totalProducts: 10,
        totalStock: 100,
        lowStockCount: 2,
        outOfStockCount: 1,
        lowStockPercentage: 20,
        outofStockPercentage: 10,
      },
      {
        category: "Clothing",
        totalProducts: 15,
        totalStock: 150,
        lowStockCount: 3,
        outOfStockCount: 0,
        lowStockPercentage: 20,
        outofStockPercentage: 0,
      },
    ];
  } else {
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      categoryWiseDataFiltered = categoryWiseDataFiltered.filter((item) =>
        [
          item.category?.toLowerCase(),
          String(item.totalStock || ""),
          String(item.lowStockCount || ""),
        ].some((field) => field?.includes(query))
      );
    }

    if (filterState.filterValue) {
      categoryWiseDataFiltered = categoryWiseDataFiltered.filter((item) => {
        if (filterState.filterValue === "low_stock") {
          return item.lowStockPercentage && item.lowStockPercentage > 0;
        }
        if (filterState.filterValue === "out_of_stock") {
          return item.outofStockPercentage && item.outofStockPercentage > 0;
        }
        if (item.category === filterState.filterValue) {
          return true;
        }
        return true; // Default to include all if no specific filter matches
      });
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "category_asc":
          categoryWiseDataFiltered.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          break;
        case "category_desc":
          categoryWiseDataFiltered.sort((a, b) =>
            (b.category || "").localeCompare(a.category || "")
          );
          break;
        case "totalStock_asc":
          categoryWiseDataFiltered.sort(
            (a, b) => (a.totalStock || 0) - (b.totalStock || 0)
          );
          break;
        case "totalStock_desc":
          categoryWiseDataFiltered.sort(
            (a, b) => (b.totalStock || 0) - (a.totalStock || 0)
          );
          break;
        case "totalProducts_asc":
          categoryWiseDataFiltered.sort(
            (a, b) => (a.totalProducts || 0) - (b.totalProducts || 0)
          );
          break;
        case "totalProducts_desc":
          categoryWiseDataFiltered.sort(
            (a, b) => (b.totalProducts || 0) - (a.totalProducts || 0)
          );
          break;
        case "lowStockCount_asc":
          categoryWiseDataFiltered.sort(
            (a, b) => (a.lowStockCount || 0) - (b.lowStockCount || 0)
          );
          break;
        case "lowStockCount_desc":
          categoryWiseDataFiltered.sort(
            (a, b) => (b.lowStockCount || 0) - (a.lowStockCount || 0)
          );
          break;
        case "outOfStockCount_asc":
          categoryWiseDataFiltered.sort(
            (a, b) => (a.outOfStockCount || 0) - (b.outOfStockCount || 0)
          );
          break;
        case "outOfStockCount_desc":
          categoryWiseDataFiltered.sort(
            (a, b) => (b.outOfStockCount || 0) - (a.outOfStockCount || 0)
          );
          break;
        case "lowStockPercentage_asc":
          categoryWiseDataFiltered.sort(
            (a, b) => (a.lowStockPercentage || 0) - (b.lowStockPercentage || 0)
          );
          break;
        case "lowStockPercentage_desc":
          categoryWiseDataFiltered.sort(
            (a, b) => (b.lowStockPercentage || 0) - (a.lowStockPercentage || 0)
          );
          break;
        case "outofStockPercentage_asc":
          categoryWiseDataFiltered.sort(
            (a, b) =>
              (a.outofStockPercentage || 0) - (b.outofStockPercentage || 0)
          );
          break;
        case "outofStockPercentage_desc":
          categoryWiseDataFiltered.sort(
            (a, b) =>
              (b.outofStockPercentage || 0) - (a.outofStockPercentage || 0)
          );
          break;
        default:
          console.log(
            "No matching sort value for category data:",
            filterState.sortValue
          );
          break;
      }
    }
  }

  // Filter and sort low stock-wise data without useMemo
  let lowStockWiseDataFiltered = [...lowStockWiseData];
  if (!Array.isArray(lowStockWiseData) || lowStockWiseData.length === 0) {
    lowStockWiseDataFiltered = [
      {
        name: "Product A",
        category: "Category 1",
        variant: {
          remainingStock: 5,
          reorderPoint: 10,
          status: "low_stock",
          price: 20,
        },
      },
      {
        name: "Product B",
        category: "Category 2",
        variant: {
          remainingStock: 0,
          reorderPoint: 5,
          status: "out_of_stock",
          price: 15,
        },
      },
    ];
  } else {
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      lowStockWiseDataFiltered = lowStockWiseDataFiltered.filter((item) =>
        [
          item.name?.toLowerCase(),
          item.category?.toLowerCase(),
          item.variant?.status?.toLowerCase(),
          String(item.variant?.remainingStock || ""),
        ].some((field) => field?.includes(query))
      );
    }

    if (filterState.filterValue) {
      lowStockWiseDataFiltered = lowStockWiseDataFiltered.filter((item) => {
        if (filterState.filterValue === "low_stock") {
          return (
            typeof item.variant?.remainingStock === "number" &&
            typeof item.variant?.reorderPoint === "number" &&
            item.variant.remainingStock < item.variant.reorderPoint
          );
        }
        if (filterState.filterValue === "out_of_stock") {
          return item.variant?.status === "out_of_stock";
        }
        if (item.category === filterState.filterValue) {
          return true;
        }
        return true; // Default to include all if no specific filter matches
      });
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "name_asc":
          lowStockWiseDataFiltered.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
          );
          break;
        case "name_desc":
          lowStockWiseDataFiltered.sort((a, b) =>
            (b.name || "").localeCompare(a.name || "")
          );
          break;
        case "category_asc":
          lowStockWiseDataFiltered.sort((a, b) =>
            (a.category || "").localeCompare(b.category || "")
          );
          break;
        case "category_desc":
          lowStockWiseDataFiltered.sort((a, b) =>
            (b.category || "").localeCompare(a.category || "")
          );
          break;
        case "remainingStock_asc":
          lowStockWiseDataFiltered.sort(
            (a, b) =>
              (a.variant?.remainingStock || 0) -
              (b.variant?.remainingStock || 0)
          );
          break;
        case "remainingStock_desc":
          lowStockWiseDataFiltered.sort(
            (a, b) =>
              (b.variant?.remainingStock || 0) -
              (a.variant?.remainingStock || 0)
          );
          break;
        case "status_asc":
          lowStockWiseDataFiltered.sort((a, b) =>
            (a.variant?.status || "").localeCompare(b.variant?.status || "")
          );
          break;
        case "status_desc":
          lowStockWiseDataFiltered.sort((a, b) =>
            (b.variant?.status || "").localeCompare(a.variant?.status || "")
          );
          break;
        case "price_asc":
          lowStockWiseDataFiltered.sort(
            (a, b) => (a.variant?.price || 0) - (b.variant?.price || 0)
          );
          break;
        case "price_desc":
          lowStockWiseDataFiltered.sort(
            (a, b) => (b.variant?.price || 0) - (a.variant?.price || 0)
          );
          break;
        default:
          console.log(
            "No matching sort value for low stock data:",
            filterState.sortValue
          );
          break;
      }
    }
  }

  const handleSearch = (query: string) => {
    setFilterState((prev: FilterState) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev: FilterState) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev: FilterState) => ({ ...prev, sortValue: sort }));
  };

  // Reset sort value when tab changes to avoid invalid sort options
  const handleTabChange = (tab: string) => {
    if (tab === "categoryWise" || tab === "lowStockWise") {
      setSelectedTab(tab);
      setFilterState((prev: FilterState) => ({ ...prev, sortValue: "" }));
    } else {
      console.warn("Invalid tab value:", tab);
    }
  };

  // Create category-wise table data without useMemo
  const categoryWiseTableData = {
    columns: [
      { key: "category", title: "Category" },
      { key: "totalProducts", title: "Total Products" },
      { key: "totalStock", title: "Total Stock" },
      { key: "lowStockCount", title: "Low Stock Items" },
      { key: "outOfStockCount", title: "Out of Stock" },
    ],
    rows: map(categoryWiseDataFiltered, (item) => {
      const row = {
        category: item.category || "N/A",
        totalProducts: item.totalProducts ?? 0,
        totalStock: item.totalStock ?? 0,
        lowStockCount: item.lowStockCount ?? 0,
        outOfStockCount: item.outOfStockCount ?? 0,
      };
      return row;
    }),
  };

  // Create low stock-wise table data without useMemo
  const lowStockWiseTableData = {
    columns: [
      { key: "name", title: "Product Name" },
      { key: "category", title: "Category" },
      { key: "remainingStock", title: "Current Stock" },
      { key: "reorderPoint", title: "Minimum Stock" },
      { key: "status", title: "Status" },
    ],
    rows: map(lowStockWiseDataFiltered, (item) => {
      const row = {
        name: item.name || "N/A",
        category: item.category || "N/A",
        remainingStock: item.variant?.remainingStock ?? 0,
        reorderPoint: item.variant?.reorderPoint ?? "N/A",
        status: item.variant?.status || "Unknown",
      };
      return row;
    }),
  };

  const tableDataObj: ITable = {
    categoryWise: categoryWiseTableData,
    lowStockWise: lowStockWiseTableData,
  };

  const [modal, setModal] = useState<{
    of: string;
    edit: boolean;
    data: null | any;
  }>({
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
        <Header text="Stock Report" />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <MasterTable
          loading={categoryWiseDataLoading || lowStockWiseDataLoading}
          tabsOptions={
            <DynamicTab
              selectedTab={selectedTab}
              setSelectedTab={handleTabChange}
              tabOptions={stockReportTabOption}
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
              onSearch={handleSearch}
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

export default StoreReport;
