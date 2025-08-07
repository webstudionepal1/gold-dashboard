import dayjs from "dayjs";
import { groupBy, size } from "lodash";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import ErrorBoundary from "../../../components/shared/ErrorBoundary";
import {
  TableLoading,
  EmptyState,
} from "../../../components/shared/LoadingStates";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import {
  filterItems,
  FilterState,
  orderIndexColumns,
  sortOptions,
  getStatusColor,
  getStatusIcon,
} from "./orderObj";
import {
  extractOrderData,
  formatCurrency,
  safeGet,
  validateOrderData,
} from "../../../utils/dataHelpers";

// Tab configuration
const orderTabs = [
  {
    key: "pending",
    label: "Pending Orders",
    color: "bg-gray-100 text-gray-800",
  },
  {
    key: "confirmed",
    label: "Confirmed Orders",
    color: "bg-blue-100 text-blue-800",
  },
  {
    key: "assigned",
    label: "Assigned Orders",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    key: "delivered",
    label: "Delivered Orders",
    color: "bg-green-100 text-green-800",
  },
  {
    key: "cancelled",
    label: "Cancelled Orders",
    color: "bg-red-100 text-red-800",
  },
];

const OrderIndex = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Fetch all orders at once for better performance
  const {
    data: allOrders,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersQuery({});

  // Group orders by status for efficient counting and filtering
  const ordersByStatus = useMemo(() => {
    if (!allOrders) return {};
    return groupBy(allOrders, "orderStatus");
  }, [allOrders]);

  // Get orders for current tab
  const currentTabOrders = useMemo(() => {
    return ordersByStatus[activeTab] || [];
  }, [ordersByStatus, activeTab]);

  // Create tabs with counts using grouped data
  const tabsWithCounts = useMemo(
    () =>
      orderTabs.map((tab) => ({
        ...tab,
        count: size(ordersByStatus[tab.key]) || 0,
      })),
    [ordersByStatus]
  );

  // Consolidated filter state (removed filter since we use tabs)
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filter: "", // Not used with tabs
    sort: "",
  });

  const navigate = useNavigate();

  // Handle search and sort with useCallback for performance
  const handleSearch = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleSort = useCallback((sort: string) => {
    setFilterState((prev) => ({ ...prev, sort }));
  }, []);

  // Get filtered items with improved data safety and styling
  const filteredItems = useMemo(
    () =>
      filterItems(currentTabOrders, filterState)
        .filter((item) => {
          const validation = validateOrderData(item);
          if (!validation.isValid) {
            console.warn("Invalid order data:", validation.errors, item);
          }
          return validation.isValid;
        })
        .map((item) => {
          const orderData = extractOrderData(item);
          return {
            ...item,
            orderedProducts: orderData.orderedProducts.length,
            orderStatus: (
              <div
                className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(
                  orderData.orderStatus
                )}`}>
                <span>{getStatusIcon(orderData.orderStatus)}</span>
                <span className="capitalize">{orderData.orderStatus}</span>
              </div>
            ),
            customer: orderData.customerName,
            totalAmount: formatCurrency(orderData.totalAmount),
            createdAt: (
              <div className="text-center">
                {dayjs(orderData.createdAt).format("MMMM D, YYYY")}
                <br />
                {dayjs(orderData.createdAt).format("h:mm A")}
              </div>
            ),
          };
        }),
    [currentTabOrders, filterState]
  );

  // Get the current tab configuration
  const currentTab = orderTabs.find((tab) => tab.key === activeTab);
  const getDetailRoute = (orderId: string) => {
    // All order details now use the same route regardless of status
    return `/order/order-details/${orderId}`;
  };

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-xl font-medium">Error loading orders</h2>
        <p className="text-gray-600">
          {error?.message || "Please check your connection and try again"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white rounded-lg bg-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Fixed Header and Tabs */}
        <div className="flex-shrink-0 bg-white">
          <div className="container mx-auto px-4 py-3">
            <Header text="Order Management" />
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="tab-scroll">
                <nav
                  className="-mb-px flex space-x-8 min-w-max"
                  aria-label="Tabs">
                  {tabsWithCounts.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 flex-shrink-0 ${
                        activeTab === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}>
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activeTab === tab.key
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 h-full">
          <div className="h-full overflow-y-auto">
            <div className="p-4 bg-white border-2 rounded-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentTab?.label || "Orders"}
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${currentTab?.color}`}>
                  {filteredItems.length} orders
                </div>
              </div>

              {isLoading ? (
                <TableLoading rows={5} columns={5} />
              ) : filteredItems.length === 0 ? (
                <EmptyState
                  icon="mdi:package-variant"
                  title={`No ${activeTab} orders found`}
                  description={
                    filterState.searchQuery
                      ? `No orders match your search "${filterState.searchQuery}"`
                      : `There are no ${activeTab} orders at the moment.`
                  }
                  action={
                    filterState.searchQuery ? (
                      <button
                        onClick={() => handleSearch("")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Clear Search
                      </button>
                    ) : null
                  }
                />
              ) : (
                <MasterTable
                  filterSection={
                    <SearchFilterSort
                      onSearch={handleSearch}
                      onSort={handleSort}
                      sortOptions={sortOptions}
                      placeholder="Search orders..."
                    />
                  }
                  showAction
                  viewAction={(row) => navigate(getDetailRoute(row._id))}
                  rows={filteredItems}
                  columns={orderIndexColumns}
                  loading={isLoading}
                  emptyStateMessage={`No ${activeTab} orders found`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default OrderIndex;
