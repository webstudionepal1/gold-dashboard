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
    <div className="flex flex-col gap-5">
      <div className="relative h-[14rem] md:overflow-visible overflow-hidden shadow-md rounded-xl">
        <div className="relative z-10 flex flex-col items-center justify-between w-full h-full md:flex-row rounded-xl">
          <img
            src={BrideImageBg}
            alt="Background"
            className="absolute inset-0 z-0 object-cover w-full h-full scale-100 rounded-xl"
          />
          <div className="relative flex flex-col items-center justify-center w-full h-full md:flex-row">
            <div className="z-10 gap-3 w-full h-full flex justify-start md:justify-center flex-col text-[#B45C1A] md:pl-6 pl-4 lg:pl-8 md:pr-4 pr-2 md:py-8 py-4 mb-6 text-left md:w-[60%] md:mb-0">
              <h2 className="text-lg font-bold leading-snug sm:text-xl md:text-2xl lg:text-3xl">
                Order your desire Jewelry <br /> on your special Occasion
              </h2>
              <Link
                to="#"
                className="flex flex-row items-center text-[#DF8D28] md:text-sm text-xs lg:text-base font-semibold hover:underline">
                <p>Learn More</p>
                <Icon icon="lineicons:arrow-right" width="25" height="25" />
              </Link>
            </div>

            <div className="relative z-10 flex w-full h-full md:w-[40%] md:justify-end justify-center">
              <img
                src={BrideImage}
                alt="Jewelry Promo"
                className="lg:h-[240px] md:h-[220px] h-[100px] xl:h-[270px] absolute bottom-0 md:right-0 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Orders Section */}
      <div className="p-4 bg-white shadow-md rounded-xl h-[25rem] overflow-y-scroll">
        <div className="flex flex-row items-center justify-between py-1 border-b border-gray-300">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Today's Order
          </h2>
          <Link
            to={FrontendRoutes.ORDER}
            className="bg-white border-2 mb-4 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs hover:bg-[#F1D097] hover:text-white transition-colors">
            View All
          </Link>
        </div>

        {/* Orders Table */}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-center text-[#15112C] tracking-wide border-b">
                <th className="pb-2"></th>
                <th className="pb-2">Item Name</th>
                <th className="pb-2">Customer Name</th>
                <th className="pb-2">QTY</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.orderMetrics?.todaysOrders?.length ? (
                dashboardData.orderMetrics.todaysOrders.map((order) => (
                  <tr
                    key={order.orderId || `${order.item}-${order.customer}`}
                    className="text-sm font-medium text-center border-b">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 form-checkbox"
                      />
                    </td>
                    <td className="py-3 text-gray-800">{order.item}</td>
                    <td className="py-3 text-gray-600">{order.customer}</td>
                    <td className="py-3 text-gray-600">{order.qty}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-[6px] rounded-full text-xs ${
                          order.status === "Completed"
                            ? "bg-[#22C55E] text-[#22C55E] bg-opacity-20"
                            : order.status === "Cancelled"
                            ? "bg-[#FF4D4D] bg-opacity-20 text-[#FF4D4D]"
                            : "bg-[#eeeeee] text-[#777676]"
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No orders available today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="mb-4 text-base font-semibold text-left text-black lg:text-xl md:text-lg">
          Sales Overview
        </h2>
        {dashboardData.salesMetrics?.dailySales?.length ? (
          <LazyChart type="sales" data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400">
            <p>No sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DashTopLeft);
