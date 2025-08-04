import PriceList1 from "../../../assets/images/PriceList1.png";
import DonutChart from "../../../components/ui/DonutChart";
import BarChart from "../../../components/ui/BarChart";
import { useEffect, useState, ReactNode } from "react";
import TopCustomer from "../../../assets/images/TopCustomers1.png";
import Marquee from "react-fast-marquee";
import { DashboardData } from "../../../server/api/dashboardHooks";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  convertGramToTola,
  formatPrice,
} from "../../../utils/priceConversions";

interface DashTopRightProps {
  dashboardData: DashboardData;
}

const DashTopRight = ({ dashboardData }: DashTopRightProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define colors for the chart
  const chartColors = ["#f5d287", "#3e8e4e", "#7a8ca1"];

  // Create donut chart data from API response with fallback for missing data
  const totalSalesData = {
    labels:
      dashboardData.salesMetrics?.totalSalesByCategory?.map(
        (category) => category.category
      ) || [],
    datasets: [
      {
        data:
          dashboardData.salesMetrics?.totalSalesByCategory?.map(
            (category) => category.percentage
          ) || [],
        backgroundColor: (
          dashboardData.salesMetrics?.totalSalesByCategory || []
        ).map((_, index) => chartColors[index % chartColors.length]),
        borderWidth: 0,
      },
    ],
  };

  const totalSalesOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Use the daily orders data from API with fallback for missing data
  const totalOrderData = {
    labels: dashboardData.orderMetrics?.dailyOrders?.labels || [],
    datasets: (dashboardData.orderMetrics?.dailyOrders?.datasets || []).map(
      (dataset, index) => ({
        label: dataset.label || "",
        data: dataset.data || [],
        backgroundColor: index === 0 ? "#f5d287" : "#7a8ca1",
        borderRadius: 4,
        barThickness: 20,
      })
    ),
  };

  const totalOrderOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#222", font: { weight: "500" } },
      },
      y: {
        grid: {
          drawBorder: false,
          color: "#eee",
        },
        ticks: {
          color: "#999",
          stepSize: 10,
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Map price list data from API and add metal prices if available
  const metalPricesData = dashboardData.metalPrices
    ? [
        {
          img: PriceList1, // Gold icon
          price: (
            <div className="flex flex-col">
              <div className="font-bold text-lg">
                {formatPrice(
                  convertGramToTola(
                    dashboardData.metalPrices.goldPrice.pricePerGram
                  ),
                  dashboardData.metalPrices.goldPrice.currency || "NPR"
                )}{" "}
                / tola
              </div>
              <div className="text-sm text-gray-600">
                {formatPrice(
                  dashboardData.metalPrices.goldPrice.pricePerGram,
                  dashboardData.metalPrices.goldPrice.currency || "NPR"
                )}{" "}
                / g
              </div>
            </div>
          ),
          title: "Gold Price (24k)",
          bgColor: "bg-[#FCF6EA]",
        },
        {
          img: PriceList1, // Silver icon
          price: (
            <div className="flex flex-col">
              <div className="font-bold text-lg">
                {formatPrice(
                  convertGramToTola(
                    dashboardData.metalPrices.silverPrice.pricePerGram
                  ),
                  dashboardData.metalPrices.silverPrice.currency || "NPR"
                )}{" "}
                / tola
              </div>
              <div className="text-sm text-gray-600">
                {formatPrice(
                  dashboardData.metalPrices.silverPrice.pricePerGram,
                  dashboardData.metalPrices.silverPrice.currency || "NPR"
                )}{" "}
                / g
              </div>
            </div>
          ),
          title: "Silver Price",
          bgColor: "bg-[#ECEEF2]",
        },
      ]
    : [];

  // Define the interface for price data items
  interface PriceDataItem {
    img: string;
    price: string | ReactNode;
    title: string | ReactNode;
    bgColor: string;
  }

  // Only use metal prices data for the sliding display
  const todaysPriceData: PriceDataItem[] = metalPricesData;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % todaysPriceData.length);
    }, 2000);

    return () => clearInterval(interval); // Clean up
  }, [todaysPriceData.length]);

  // Handle the case when there are no metal prices data available
  const { img, price, title, bgColor } =
    todaysPriceData.length > 0
      ? todaysPriceData[currentIndex]
      : ({
          img: PriceList1,
          price: "Loading...",
          title: "Metal price data unavailable",
          bgColor: "bg-[#FCF6EA]",
        } as PriceDataItem);

  // Map top customers from API with fallback for missing data
  const topCustomers = (dashboardData.topCustomers || []).map((customer) => ({
    img: customer.image || TopCustomer, // Fallback to default image
    price: customer.orderCount || 0,
    name: customer.name || "Unknown Customer",
  }));

  return (
    <div className="space-y-6">
      {/* Enhanced Price List Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-lg">
                <Icon icon="material-symbols:price-check" className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Today's Prices</h2>
                <p className="text-sm text-slate-500">Live metal prices</p>
              </div>
            </div>
            {dashboardData.metalPrices && dashboardData.metalPrices.goldPrice && (
              <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                <Icon icon="material-symbols:schedule" className="mr-1 w-3 h-3" />
                <span>
                  {new Date(dashboardData.metalPrices.goldPrice.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className={`${bgColor} rounded-xl p-4 transition-all duration-300 ease-in-out hover:shadow-md border border-amber-200/50`}>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <img
                    src={img}
                    alt="Product Icon"
                    className="w-8 h-8 object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-slate-800">
                  {price}
                </div>
                <div className="text-sm text-slate-600 truncate">
                  {title}
                </div>
              </div>

              <div className="flex-shrink-0">
                <Icon icon="material-symbols:trending-up" className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Total Sales Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
              <Icon icon="material-symbols:pie-chart" className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Total Sales</h2>
              <p className="text-sm text-slate-500">Sales by category</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            {dashboardData.salesMetrics?.totalSalesByCategory?.length ? (
              <div className="w-48 h-48">
                <DonutChart data={totalSalesData} options={totalSalesOptions} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Icon icon="material-symbols:pie-chart-outline" className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No sales data available</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3">
            {(dashboardData.salesMetrics?.totalSalesByCategory || []).map(
              (category, index) => (
                <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-lg">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: chartColors[index % chartColors.length],
                    }}></span>
                  <span className="text-sm font-medium text-slate-700">{category.category}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Total Order Chart */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Icon icon="material-symbols:bar-chart" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Total Orders</h2>
              <p className="text-sm text-slate-500">Daily order volume</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-48">
            {dashboardData.orderMetrics?.dailyOrders?.labels?.length ? (
              <BarChart data={totalOrderData} options={totalOrderOptions} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Icon icon="material-symbols:bar-chart" className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No order data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Top Customers Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg">
              <Icon icon="material-symbols:person-star" className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Top Customers</h2>
              <p className="text-sm text-slate-500">Most valued customers</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-hidden">
            {topCustomers.length > 0 ? (
              <Marquee pauseOnHover gradient={false} speed={40}>
                {topCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="mx-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center text-center min-w-[140px] hover:shadow-md transition-shadow duration-200">
                    <div className="w-12 h-12 mb-3 overflow-hidden rounded-full ring-2 ring-amber-200">
                      <img
                        src={customer.img}
                        alt={customer.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mb-1">
                      {customer.name}
                    </div>
                    <div className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                      {customer.price} Orders
                    </div>
                  </div>
                ))}
              </Marquee>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Icon icon="material-symbols:person-off" className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No customer data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashTopRight;
