import dayjs from "dayjs";
import { get } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import {
  filterItems,
  FilterState,
  orderIndexColumns,
  sortOptions,
} from "./orderObj";

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

  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    orderStatus: activeTab,
  });

  // Get counts for each tab (optional - for better UX)
  const { data: pendingOrders } = useGetAllOrdersQuery({
    orderStatus: "pending",
  });
  const { data: confirmedOrders } = useGetAllOrdersQuery({
    orderStatus: "confirmed",
  });
  const { data: assignedOrders } = useGetAllOrdersQuery({
    orderStatus: "assigned",
  });
  const { data: deliveredOrders } = useGetAllOrdersQuery({
    orderStatus: "delivered",
  });
  const { data: cancelledOrders } = useGetAllOrdersQuery({
    orderStatus: "cancelled",
  });

  // Create tabs with counts
  const tabsWithCounts = orderTabs.map((tab) => ({
    ...tab,
    count: (() => {
      switch (tab.key) {
        case "pending":
          return pendingOrders?.length || 0;
        case "confirmed":
          return confirmedOrders?.length || 0;
        case "assigned":
          return assignedOrders?.length || 0;
        case "delivered":
          return deliveredOrders?.length || 0;
        case "cancelled":
          return cancelledOrders?.length || 0;
        default:
          return 0;
      }
    })(),
  }));

  const orderList = useMemo(
    () => (isSuccess ? orders : []),
    [isSuccess, orders]
  );

  // Consolidated filter state (removed filter since we use tabs)
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filter: "", // Not used with tabs
    sort: "",
  });

  const navigate = useNavigate();

  // Handle search and sort
  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort }));
  };

  // Get filtered items
  const filteredItems = useMemo(
    () =>
      filterItems(orderList, filterState).map((item) => ({
        ...item,
        orderedProducts: get(item, "orderedProducts.length", 0),
        orderStatus: (
          <div className="px-2 py-1 text-xs text-white rounded-full bg-green dark-green">
            {get(item, "orderStatus", "")}
          </div>
        ),
        customer: get(item, "customer.name", "-"),
        createdAt: (
          <div className="text-center">
            {dayjs(get(item, "createdAt", "")).format("MMMM D, YYYY")}
            <br />
            {dayjs(get(item, "createdAt", "")).format("h:mm A")}
          </div>
        ),
      })),
    [orderList, filterState]
  );

  // Get the current tab configuration
  const currentTab = orderTabs.find((tab) => tab.key === activeTab);
  const getDetailRoute = (orderId: string) => {
    // All order details now use the same route regardless of status
    return `/order/order-details/${orderId}`;
  };

  return (
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderIndex;
