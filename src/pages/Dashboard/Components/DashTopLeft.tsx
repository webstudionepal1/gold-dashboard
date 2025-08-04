import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BrideImage from "../../../assets/images/BrideImage.png";
import BrideImageBg from "../../../assets/images/BrideImageBg.png";
import { Icon } from "@iconify/react/dist/iconify.js";
import LazyChart from "../../../components/ui/LazyChart";
import { ChartData, ChartOptions } from "chart.js";
import { DashboardData } from "../../../server/api/dashboardHooks";
import { FrontendRoutes } from "../../../routes/routes";

interface DashTopLeftProps {
  dashboardData: DashboardData;
}

const DashTopLeft = ({ dashboardData }: DashTopLeftProps) => {
  // Memoize chart data to prevent unnecessary recalculations
  const chartData: ChartData<"line"> = useMemo(
    () => ({
      labels:
        dashboardData.salesMetrics?.dailySales?.map((sale) => sale.day) || [],
      datasets: [
        {
          label: "Total Sales",
          data:
            dashboardData.salesMetrics?.dailySales?.map(
              (sale) => sale.amount
            ) || [],
          fill: true,
          backgroundColor: "rgba(247, 203, 109, 0.2)",
          borderColor: "#E7932F",
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#E7932F",
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    }),
    [dashboardData.salesMetrics?.dailySales]
  );

  // Memoize chart options to prevent unnecessary recalculations
  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: string | number) => `$${value}`,
            color: "#A3A3A3",
            font: {
              size: 12,
            },
          },
          grid: {
            color: "#ffffff",
          },
        },
        x: {
          ticks: {
            color: "#7D7D7D",
            font: {
              size: 12,
            },
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#E7932F",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <Icon icon="material-symbols:trending-up" className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-xl font-bold text-slate-900">
                ${dashboardData.salesMetrics?.totalRevenue?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Icon icon="material-symbols:shopping-bag" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-xl font-bold text-slate-900">
                {dashboardData.salesMetrics?.totalOrders?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
              <Icon icon="material-symbols:payments" className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Order Value</p>
              <p className="text-xl font-bold text-slate-900">
                ${dashboardData.salesMetrics?.averageOrderValue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10"></div>
        <img
          src={BrideImageBg}
          alt="Background"
          className="absolute inset-0 object-cover w-full h-full opacity-30"
        />

        <div className="relative z-10 flex items-center justify-between h-full p-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-amber-900 leading-tight">
                Order your desire Jewelry
                <br />
                <span className="text-amber-700">on your special Occasion</span>
              </h2>
              <p className="text-amber-700/80 text-sm">Discover our exclusive collection of handcrafted jewelry</p>
            </div>

            <Link
              to="#"
              className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
              <span>Learn More</span>
              <Icon icon="material-symbols:arrow-forward" className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="hidden md:block flex-shrink-0">
            <img
              src={BrideImage}
              alt="Jewelry Promo"
              className="h-40 object-cover drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Today's Orders Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Icon icon="material-symbols:shopping-cart" className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Today's Orders</h2>
                <p className="text-sm text-slate-500">Recent order activity</p>
              </div>
            </div>
            <Link
              to={FrontendRoutes.ORDER}
              className="inline-flex items-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm">
              <span>View All</span>
              <Icon icon="material-symbols:arrow-forward" className="ml-1 w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Enhanced Orders Table */}
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                </th>
                <th className="px-6 py-3 text-left">Item Name</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dashboardData.orderMetrics?.todaysOrders?.length ? (
                dashboardData.orderMetrics.todaysOrders.map((order, index) => (
                  <tr
                    key={order.orderId || `${order.item}-${order.customer}`}
                    className="hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                          <Icon icon="material-symbols:diamond" className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{order.item}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {order.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Icon icon="material-symbols:shopping-cart-off" className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="text-sm text-slate-500">No orders available today</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Sales Overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
              <Icon icon="material-symbols:trending-up" className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Sales Overview</h2>
              <p className="text-sm text-slate-500">Daily sales performance</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {dashboardData.salesMetrics?.dailySales?.length ? (
            <div className="h-64">
              <LazyChart type="sales" data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Icon icon="material-symbols:analytics" className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No sales data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashTopLeft);
