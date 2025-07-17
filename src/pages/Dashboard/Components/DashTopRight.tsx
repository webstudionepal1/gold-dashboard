import PriceList1 from "../../../assets/images/PriceList1.png";
import { DonutChart } from "../../../components/ui/DonutChart";
import BarChart from "../../../components/ui/BarChart";
import { useEffect, useState, ReactNode } from "react";
import TopCustomer from "../../../assets/images/TopCustomers1.png";
import Marquee from "react-fast-marquee";
import { DashboardData } from "../../../server/api/dashboardHooks";
import { Icon } from "@iconify/react/dist/iconify.js";

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
  const metalPricesData =
    dashboardData.metalPrices &&
    dashboardData.metalPrices.goldPrice &&
    dashboardData.metalPrices.silverPrice
      ? [
          {
            img: PriceList1, // Gold icon
            price: (
              <div className="flex flex-col">
                <div className="font-bold">
                  ${dashboardData.metalPrices.goldPrice.pricePerGram.toFixed(3)}{" "}
                  / g
                </div>
                <div>
                  $
                  {dashboardData.metalPrices.goldPrice.pricePerOunce.toFixed(3)}{" "}
                  / oz
                </div>
              </div>
            ),
            title: "Gold Price",
            bgColor: "bg-[#FCF6EA]",
          },
          {
            img: PriceList1, // Silver icon
            price: (
              <div className="flex flex-col">
                <div className="font-bold">
                  $
                  {dashboardData.metalPrices.silverPrice.pricePerGram.toFixed(
                    3
                  )}{" "}
                  / g
                </div>
                <div>
                  $
                  {dashboardData.metalPrices.silverPrice.pricePerOunce.toFixed(
                    3
                  )}{" "}
                  / oz
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
    <div className="flex flex-col gap-5">
      {/* Price List Section */}
      <div className="flex flex-col w-full h-full gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold lg:text-2xl md:text-xl">
            Today's Price List
          </h2>
          {dashboardData.metalPrices && dashboardData.metalPrices.goldPrice && (
            <div className="flex items-center text-sm text-gray-500">
              <Icon icon="mdi:clock-outline" className="mr-1" />
              <span>
                Updated:{" "}
                {new Date(
                  dashboardData.metalPrices.goldPrice.timestamp
                ).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <div
          className={`${bgColor} rounded-xl px-4 py-4 shadow-md transition-all duration-300 ease-linear`}>
          <div className="flex items-center w-full">
            <div className="overflow-hidden rounded-lg w-14 h-14">
              <img
                src={img}
                alt="Product Icon"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="ml-4 w-full">
              <div className="lg:text-xl md:text-lg text-base text-[#333]">
                {price}
              </div>
              <div className="text-xs text-gray-500 lg:text-base md:text-sm">
                {title}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full p-4 bg-white shadow-md rounded-xl">
          <h2 className="mb-4 text-base font-semibold text-left text-black lg:text-xl md:text-lg">
            Total Sales
          </h2>
          <div className="flex items-center justify-center">
            {dashboardData.salesMetrics?.totalSalesByCategory?.length ? (
              <DonutChart data={totalSalesData} options={totalSalesOptions} />
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400">
                <p>No sales data available</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm font-medium text-gray-600">
            {(dashboardData.salesMetrics?.totalSalesByCategory || []).map(
              (category, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: chartColors[index % chartColors.length],
                    }}></span>
                  {category.category}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Total Order Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md w-full h-[300px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-black lg:text-xl md:text-lg">
            Total Order
          </h2>
        </div>
        <div className="h-[200px]">
          {dashboardData.orderMetrics?.dailyOrders?.labels?.length ? (
            <BarChart data={totalOrderData} options={totalOrderOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No order data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Customers Section */}
      <div className="flex flex-col w-full gap-2 p-4 overflow-hidden bg-white shadow-md rounded-xl">
        <h2 className="mb-3 text-base font-semibold lg:text-xl md:text-lg">
          Top Customer
        </h2>
        <div className="xl:w-[22rem] lg:w-[18rem] md:w-[18rem] w-[16rem] rounded-sm flex items-center justify-center overflow-hidden">
          {topCustomers.length > 0 ? (
            <Marquee pauseOnHover gradient={false} speed={50}>
              {topCustomers.map((customer, index) => (
                <div
                  key={index}
                  className="w-auto mx-[10px] bg-[#FCF6EA] rounded-xl shadow-md flex flex-col items-center lg:px-8 lg:py-5 md:px-7 md:py-4 px-6 py-3 text-center">
                  <div className="w-12 h-12 mb-3 overflow-hidden rounded-full lg:w-20 lg:h-20 md:w-16 md:h-16">
                    <img
                      src={customer.img}
                      alt={customer.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="text-sm font-normal text-gray-800 lg:text-lg md:text-base">
                    {customer.name}
                  </div>
                  <div className="lg:text-sm md:text-[13px] text-sm text-gray-500">
                    {customer.price} Purchase
                  </div>
                </div>
              ))}
            </Marquee>
          ) : (
            <div className="flex items-center justify-center h-20 w-full text-gray-400">
              <p>No customer data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashTopRight;
