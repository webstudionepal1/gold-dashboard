import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { DynamicTab } from "../PurchaseManagement/components/DynamicTab";
import { orderReportTabOption, type ITable } from "../analytics/OrderReportObj";
import map from 'lodash/map'
import capitalize from 'lodash/capitalize'

import type { IFetchExpenses } from "../../server/api/expensesHook";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import {
  useGetOrderCategoryQuery,
  useGetOrderStatusQuery,
  useGetTopOrderProductsQuery,
} from "../../server/api/orderReportHook";
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

const OrderReport = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("statusSummary");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<IEditModal>({
    state: false,
    editData: null,
  });

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filterValue: "",
    sortValue: "",
  });

  const todayFilter = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const initialTabFilters: Record<string, TabFilter> = {
    topOrderProducts: { date: todayFilter, period: "Yearly" },
    orderCategory: { date: todayFilter, period: "Yearly" },
  };

  const [tabFilters, setTabFilters] = useState(initialTabFilters);
  const handleTabFilterChange = (updatedFilter: TabFilter) => {
    setTabFilters((prev) => ({
      ...prev,
      [selectedTab]: updatedFilter,
    }));
  };

  // Define filter options
  const statusFilterOptions = [
    { label: "All", value: "" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Delivered", value: "delivered" },
    { label: "Pending", value: "pending" },
    { label: "Shipped", value: "shipped" },
  ];

  const categoryFilterOptions = [
    { label: "All", value: "" },
    { label: "Uncategorized", value: "Uncategorized" },
  ];

  const topProductsFilterOptions = [
    { label: "All", value: "" },
    { label: "High Revenue (>1M)", value: "highRevenue" },
  ];

  const filterOptions = useMemo(() => {
    switch (selectedTab) {
      case "statusSummary":
        return statusFilterOptions;
      case "topOrderProducts":
        return topProductsFilterOptions;
      case "orderCategory":
        return categoryFilterOptions;
      default:
        return [];
    }
  }, [selectedTab]);

  // Define sort options
  const statusSortOptions = [
    { label: "Status A-Z", value: "status_asc" },
    { label: "Status Z-A", value: "status_desc" },
    { label: "Count (Low to High)", value: "count_asc" },
    { label: "Count (High to Low)", value: "count_desc" },
    { label: "Percentage (Low to High)", value: "percentage_asc" },
    { label: "Percentage (High to Low)", value: "percentage_desc" },
  ];

  const topProductsSortOptions = [
    { label: "Product Name A-Z", value: "productName_asc" },
    { label: "Product Name Z-A", value: "productName_desc" },
    { label: "Quantity Sold (Low to High)", value: "totalQuantitySold_asc" },
    { label: "Quantity Sold (High to Low)", value: "totalQuantitySold_desc" },
    { label: "Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
  ];

  const categorySortOptions = [
    { label: "Category A-Z", value: "category_asc" },
    { label: "Category Z-A", value: "category_desc" },
    { label: "Units Sold (Low to High)", value: "unitsSold_asc" },
    { label: "Units Sold (High to Low)", value: "unitsSold_desc" },
    { label: "Total Orders (Low to High)", value: "totalOrders_asc" },
    { label: "Total Orders (High to Low)", value: "totalOrders_desc" },
    { label: "Revenue (Low to High)", value: "totalRevenue_asc" },
    { label: "Revenue (High to Low)", value: "totalRevenue_desc" },
    { label: "Average Price (Low to High)", value: "averagePrice_asc" },
    { label: "Average Price (High to Low)", value: "averagePrice_desc" },
    { label: "Percentage Share (Low to High)", value: "percentageShare_asc" },
    { label: "Percentage Share (High to Low)", value: "percentageShare_desc" },
  ];

  const sortOptions = useMemo(() => {
    switch (selectedTab) {
      case "statusSummary":
        return statusSortOptions;
      case "topOrderProducts":
        return topProductsSortOptions;
      case "orderCategory":
        return categorySortOptions;
      default:
        return [];
    }
  }, [selectedTab]);

  // Fetch data
  const {
    data: orderStatusList,
    isLoading: orderStatusLoading,
    isSuccess: orderStatusSuccess,
  } = useGetOrderStatusQuery();

  const {
    data: orderCategoryList,
    isLoading: orderCategoryLoading,
    isSuccess: orderCategorySuccess,
  } = useGetOrderCategoryQuery();

  const {
    data: TopOrderList,
    isLoading: topOrderLoading,
    isSuccess: topOrderSuccess,
  } = useGetTopOrderProductsQuery({
    date: tabFilters.topOrderProducts?.date,
    period: tabFilters.topOrderProducts?.period.toLowerCase(),
  });

  // Filter and sort data
  const statusDataFiltered = useMemo(() => {
    let result =
      orderStatusSuccess && orderStatusList?.orders
        ? [...orderStatusList.orders]
        : [];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.status.toLowerCase().includes(query) ||
          String(item.count).includes(query) ||
          String(item.percentage).includes(query)
      );
    }

    if (filterState.filterValue) {
      result = result.filter((item) => item.status === filterState.filterValue);
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "status_asc":
          result.sort((a, b) => a.status.localeCompare(b.status));
          break;
        case "status_desc":
          result.sort((a, b) => b.status.localeCompare(a.status));
          break;
        case "count_asc":
          result.sort((a, b) => a.count - b.count);
          break;
        case "count_desc":
          result.sort((a, b) => b.count - a.count);
          break;
        case "percentage_asc":
          result.sort((a, b) => a.percentage - b.percentage);
          break;
        case "percentage_desc":
          result.sort((a, b) => b.percentage - a.percentage);
          break;
      }
    }

    return result;
  }, [orderStatusList, orderStatusSuccess, filterState]);

  const topOrderDataFiltered = useMemo(() => {
    let result =
      topOrderSuccess && TopOrderList?.products
        ? [...TopOrderList.products]
        : [];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(query) ||
          String(item.totalQuantitySold).includes(query) ||
          String(item.totalRevenue).includes(query)
        // String(item.averagePrice).includes(query)
      );
    }

    if (filterState.filterValue) {
      if (filterState.filterValue === "highRevenue") {
        result = result.filter((item) => item.totalRevenue > 1000000);
      }
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "productName_asc":
          result.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "productName_desc":
          result.sort((a, b) => b.productName.localeCompare(a.productName));
          break;
        case "totalQuantitySold_asc":
          result.sort((a, b) => a.totalQuantitySold - b.totalQuantitySold);
          break;
        case "totalQuantitySold_desc":
          result.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => a.totalRevenue - b.totalRevenue);
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => b.totalRevenue - a.totalRevenue);
          break;
        // case "averagePrice_asc":
        //   result.sort((a, b) => a.averagePrice - b.averagePrice);
        //   break;
        // case "averagePrice_desc":
        //   result.sort((a, b) => b.averagePrice - a.averagePrice);
        //   break;
      }
    }

    return result;
  }, [TopOrderList, topOrderSuccess, filterState]);

  const categoryDataFiltered = useMemo(() => {
    let result =
      orderCategorySuccess && orderCategoryList ? [...orderCategoryList] : [];

    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.category.toLowerCase().includes(query) ||
          String(item.unitsSold).includes(query) ||
          String(item.totalOrders).includes(query) ||
          String(item.totalRevenue).includes(query) ||
          String(item.averagePrice).includes(query) ||
          String(item.percentageShare).includes(query)
      );
    }

    if (filterState.filterValue) {
      if (filterState.filterValue === "Uncategorized") {
        result = result.filter((item) => item.category === "Uncategorized");
      }
    }

    if (filterState.sortValue) {
      switch (filterState.sortValue) {
        case "category_asc":
          result.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case "category_desc":
          result.sort((a, b) => b.category.localeCompare(a.category));
          break;
        case "unitsSold_asc":
          result.sort((a, b) => a.unitsSold - b.unitsSold);
          break;
        case "unitsSold_desc":
          result.sort((a, b) => b.unitsSold - a.unitsSold);
          break;
        case "totalOrders_asc":
          result.sort((a, b) => a.totalOrders - b.totalOrders);
          break;
        case "totalOrders_desc":
          result.sort((a, b) => b.totalOrders - a.totalOrders);
          break;
        case "totalRevenue_asc":
          result.sort((a, b) => a.totalRevenue - b.totalRevenue);
          break;
        case "totalRevenue_desc":
          result.sort((a, b) => b.totalRevenue - a.totalRevenue);
          break;
        case "averagePrice_asc":
          result.sort((a, b) => a.averagePrice - b.averagePrice);
          break;
        case "averagePrice_desc":
          result.sort((a, b) => b.averagePrice - a.averagePrice);
          break;
        case "percentageShare_asc":
          result.sort((a, b) => a.percentageShare - b.percentageShare);
          break;
        case "percentageShare_desc":
          result.sort((a, b) => b.percentageShare - a.percentageShare);
          break;
      }
    }

    return result;
  }, [orderCategoryList, orderCategorySuccess, filterState]);

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filterValue: filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sortValue: sort }));
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setFilterState((prev) => ({ ...prev, sortValue: "", filterValue: "" }));
  };

  const orderStatusTableData = useMemo(
    () => ({
      columns: [
        { key: "status", title: "Status" },
        { key: "count", title: "Total Order" },
        { key: "formattedPercentage", title: "Percentage" },
      ],
      rows: map(statusDataFiltered, (item) => ({
        ...item,
        status:capitalize(item.status),
        formattedPercentage: `${item.percentage} %`,
      })),
    }),
    [statusDataFiltered]
  );

  const topOrderProductsTableData = useMemo(
    () => ({
      columns: [
        { key: "productImage", title: "Product Image" },
        { key: "productName", title: "Product Name" },
        { key: "totalQuantitySold", title: "Total Quantity Sold" },
        { key: "totalRevenue", title: "Total Revenue" },
      ],
      rows: map(topOrderDataFiltered, (item) => ({
        ...item,
        productImage: item.productImage || "IMAGE",
      })),
    }),
    [topOrderDataFiltered]
  );

  const orderCategoryTableData = useMemo(
    () => ({
      columns: [
        { key: "category", title: "Category" },
        { key: "unitsSold", title: "Units Sold" },
        { key: "totalOrders", title: "Total Orders" },
        { key: "totalRevenue", title: "Revenue" },
        { key: "percentageShare", title: "Percentage Share" },
      ],
      rows: map(categoryDataFiltered, (item) => ({
        ...item,
        percentageShare: <div>{item.percentageShare} %</div>,
      })),
    }),
    [categoryDataFiltered]
  );

  const tableDataObj: ITable = {
    statusSummary: orderStatusTableData,
    topOrderProducts: topOrderProductsTableData,
    orderCategory: orderCategoryTableData,
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
    <div className="container px-2 md:px-0 py-3 mx-auto">
        <Header text="Order Report" />

      {(selectedTab === "topOrderProducts" ||
        selectedTab === "orderCategory") && (
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
                <span>{tabFilters[selectedTab]?.period}</span>
              </div>
              <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                <span className="font-medium">Date:</span>{" "}
                <span>
                  {tabFilters[selectedTab] &&
                    new Date(tabFilters[selectedTab].date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <MasterTable
          loading={
            orderStatusLoading || topOrderLoading || orderCategoryLoading
          }
          
          tabsOptions={
            <DynamicTab
              selectedTab={selectedTab}
              setSelectedTab={handleTabChange}
              tabOptions={orderReportTabOption}
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
              sortOptions={sortOptions}
              placeholder="Search orders..."
            />
          }
          rows={tableDataObj[selectedTab].rows || []}
          columns={tableDataObj[selectedTab].columns}
        />
      </div>
    </div>
  );
};

export default OrderReport;
