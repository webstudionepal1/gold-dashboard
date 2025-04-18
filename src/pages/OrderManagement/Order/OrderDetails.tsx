import React from "react";
import Header from "../../../components/shared/table_heading/Header";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SimpleTable } from "../../Customer/components/SimpleTable";
import InfoCard from "../../Customer/components/InfoCard";
import OrderTracker from "./components/OrderTracker";
import { CheckIcon, PackageIcon, TruckIcon } from "lucide-react";
interface CustomerDetails {
  _id: string;
  order_id: string;
  order_date: string;
  total_price: number;
  status: "Out of Stock" | "Delivered" | "Canceled" | "In Stock";
  isActive?: boolean;
}

const steps = [
  {
    id: 0,
    name: "Pending",
  },
  {
    id: 1,
    name: "Confirmed",
    icon: <CheckIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    name: "Order Handover",
    icon: <PackageIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 3,
    name: "Delivered",
    icon: <TruckIcon className="w-6 h-6 text-white" />,
  },
];

const shippingInformation = [
  {
    id: 1,
    title: "Customer Name",
    value: "Brandon Lubin",
  },
  {
    id: 2,
    title: "Phone Number",
    value: "+977 82827238978",
  },
  {
    id: 3,
    title: "Address",
    value: "601 Frank Stottile Blvd, Kingston NY 12401",
  },
  {
    id: 4,
    title: "Email",
    value: "example@gmail.com",
  },
  {
    id: 5,
    title: "Shipping Method",
    value: "Same Day Shipping",
  },

  {
    id: 6,
    title: "Payment Method",
    value: "Paid",
  },
  {
    id: 7,
    title: "Note",
    Note: "N/A",
  },
];

const billingAddress = [
  {
    id: 1,
    title: "Customer Name",
    value: "Brandon Lubin",
  },
  {
    id: 2,
    title: "Phone Number",
    value: "+977 82827238978",
  },
  {
    id: 3,
    title: "Email",
    value: "example@gmail.com",
  },
  {
    id: 4,
    title: "Address",
    value: "601 Frank Stottile Blvd, Kingston NY 12401",
  },

  {
    id: 5,
    title: "Note",
    Note: "N/A",
  },
];

const todaysOrders = [
  {
    order_id: "01",
    order_date: "2025-02-11",
    total_price: "$262",
    status: "Out of Stock",
  },
  {
    order_id: "01",
    order_date: "2025-02-15",
    total_price: "$262",
    status: "Delivered",
  },
  {
    order_id: "01",
    order_date: "2025-01-11",
    total_price: "$262",
    status: "Delivered",
  },
  {
    order_id: "01",
    order_date: "2025-02-12",
    total_price: "$262",
    status: "Cancelled",
  },
  {
    order_id: "01",
    order_date: "2025-02-12",
    total_price: "$262",
    status: "In Stock",
  },
];

const OrderDetails = () => {
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-2 ">
        <Header text="Order Details" />
      </div>

      <div className="ml-[2.5rem] mb-6">
        <OrderTracker steps={steps} currentStep={0} />
      </div>

      <div className="bg-white ml-[2.5rem] py-4 rounded-md">
        <div className="border-2 border-[#d6dbe4] mx-3 rounded-xl    ">
          <div className="px-3 py-3 flex items-center  justify-between ">
            <div className="flex flex-col">
              <h1 className="font-bold text-xl">
                Order{" "}
                <span className="text-[#ffc174] font-bold text-xl">#12</span>
              </h1>
              <p className="text-[#b0b0b0] font-semibold">2024-10-10</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[#df8d28] border-2 border-[#df8d28] rounded-xl px-4 py-2 font-semibold">
                Pending
              </button>
              <button className="flex items-center gap-2 border-2 border-[#d2dae5] px-3 py-2 rounded-xl">
                Download Invoice{" "}
                <Icon
                  icon="material-symbols-light:download"
                  width="24"
                  height="24"
                />
              </button>
            </div>
          </div>
        </div>
        <div className=" grid grid-cols-12 gap-4 h-auto mt-[2rem] mx-3   ">
          <div className="col-span-4 lg:col-span-8  bg-white border-2 rounded-xl border-[#d5d9e4] ">
            <SimpleTable
              title="Order History"
              data={todaysOrders}
              columns={[
                { key: "order_id", header: "Order Id" },
                { key: "order_date", header: "Order Date" },
                { key: "total_price", header: "Total Price" },
                {
                  key: "status",
                  header: "Status",
                  render: (value) => {
                    const colorMap = {
                      Completed: "bg-[#22C55E] text-[#22C55E] bg-opacity-20",
                      Cancelled: "bg-[#FF4D4D] text-[#FF4D4D] bg-opacity-20",
                      Meeting: "bg-[#eeeeee] text-[#777676]",
                    };
                    return (
                      <span
                        className={`px-3 py-[6px] rounded-full text-xs ${
                          colorMap[value as keyof typeof colorMap] ?? ""
                        }`}
                      >
                        {value}
                      </span>
                    );
                  },
                },
              ]}
              onView={(row) => console.log("View row:", row)}
              viewAllButton={
                <button className="bg-white border-2 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs">
                  View All
                </button>
              }
            />
          </div>

          {/* Info Cards – stacked vertically, col-span-1 */}
          <div className="col-span-4 h-full lg:col-span-4 space-y-4">
            <div className="border-2 rounded-xl border-[#d5d9e4] bg-white">
              <div className="px-3 py-2 flex flex-col gap-4">
                <h1 className="text-xl font-semibold">Delivery Partner</h1>
                <div className="flex items-center gap-2 justify-between">
                  <img src="/testimg.jpg" alt="test" height={80} width={80} />
                  <h1 className="text-nowrap">Australian Post</h1>
                  <button className="bg-[#e08d26] px-3 py-1 rounded-xl text-nowrap   text-white ">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
            <div className="border-2 rounded-xl border-[#d5d9e4] bg-white h-[267px] ">
              <div className="px-3 py-2 space-y-3">
                <h1 className="text-2xl font-semibold">Total Amount</h1>
                <div className="border-b-2 border-[d5d9e4] my-1"></div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <p>SubTotal (04 items)</p>
                    <p>Rs. 524</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p>Shipping Cost</p>
                    <p>Rs. 120</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p>Discounts</p>
                    <p>Rs. 0.00</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p>Taxes</p>
                    <p>Rs. 0.00</p>
                  </div>
                </div>

                <div className="my-2 rounded-md border-2 border-[#d5d9e4] ">
                  <div className="px-3 py-1 flex items-center justify-between">
                    <h1>Total</h1>
                    <p>Rs.644</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-12 gap-4 h-auto mt-[2rem] mx-3   ">
          <div className="col-span-4 lg:col-span-8  bg-white border-2 rounded-xl border-[#d5d9e4] ">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Shipping Information</h1>

                <button>
                  <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
                    <Icon icon="lucide:pen-line" fontSize={16} color="white" />
                  </div>
                </button>
              </div>
              <div className="border-b-2 border-[#d5d9e4] my-2"></div>

              <div className=" space-y-4">
                {shippingInformation.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between  "
                  >
                    <p className="text-sm min-w-[150px]">{item.title}:</p>
                    <p className="text-sm">{item.value || item.Note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4 lg:col-span-4  bg-white border-2 rounded-xl border-[#d5d9e4] ">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Billing Address</h1>

                <button>
                  <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
                    <Icon icon="lucide:pen-line" fontSize={16} color="white" />
                  </div>
                </button>
              </div>
              <div className="border-b-2 border-[#d5d9e4] my-2"></div>

              <div className=" space-y-4">
                {billingAddress.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between  "
                  >
                    <p className="text-sm ">{item.title}:</p>
                    <p className="text-sm">{item.value || item.Note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end  gap-3 mb-2 mt-4 mx-3">
          <button className="bg-[#de8d29] px-4 py-2 text-white rounded-xl">
            Accept
          </button>
          <button className="bg-[#d1d1d1] px-4 py-2 text-[#878787] rounded-xl font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
