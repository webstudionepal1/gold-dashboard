import React, { useMemo } from "react";
import DashBottom from "./DashBottom";
import DashTopLeft from "./DashTopLeft";
import DashTopRight from "./DashTopRight";
import { useGetDashboardDataQuery } from "../../../server/api/dashboardHooks";
import { useGetLatestMetalPricesQuery } from "../../../server/api/metalPricesHooks";

const DashboardComp = () => {
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetDashboardDataQuery();
  const {
    data: metalPricesData,
    isLoading: metalPricesLoading,
    error: metalPricesError,
  } = useGetLatestMetalPricesQuery();
  const isLoading = dashboardLoading || metalPricesLoading;
  const error = dashboardError || metalPricesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Error loading dashboard data
      </div>
    );
  }

  // Create a default empty data structure if no data is available
  const emptyData = {
    salesMetrics: {
      dailySales: [],
      totalSalesByCategory: [],
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
    },
    orderMetrics: {
      dailyOrders: { labels: [], datasets: [] },
      todaysOrders: [],
    },
    priceList: [],
    recentTransactions: [],
    lowStockItems: [],
    topCustomers: [],
    metalPrices: undefined,
  };
console.log('sldfkjsldfkjsafdkajpoweiurwe', dashboardData)
  // Combine dashboard data with metal prices or use empty data if none available
  const combinedData = dashboardData
    ? {
        ...dashboardData,
        metalPrices: metalPricesData,
      }
    : emptyData;

  return (
    <div className="space-y-4">
      {/* Top Section - Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left Column - Takes 2/3 on xl screens */}
        <div className="xl:col-span-2 space-y-6">
          <DashTopLeft dashboardData={combinedData} />
          <DashBottom dashboardData={combinedData} />
        </div>

        {/* Right Column - Takes 1/3 on xl screens */}
        <div className="xl:col-span-1 space-y-4">
          <DashTopRight dashboardData={combinedData} />
        </div>
      </div>

      {/* Bottom Section */}
    </div>
  );
};

export default DashboardComp;
