import React from "react";
import Header from "../../../components/shared/table_heading/Header";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SimpleTable } from "./SimpleTable";
import InfoCard from "./InfoCard";

interface CustomerDetails {
  _id: string;
  order_id: string;
  order_date: string;
  total_price: number;
  status: "Out of Stock" | "Delivered" | "Canceled" | "In Stock";
  isActive?: boolean;
}

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

const CustomerDetails = () => {
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-2 ">
        <Header text="Customer Details" />
        <Breadcrumbs />
      </div>

      <div className="bg-[#ffffff] shadow-lg rounded-xl h-full w-full pb-4     ">
        <div className="flex items-center justify-between mx-6 py-6">
          <div className="flex items-center gap-3">
            <img src="/yellowgirl.png" />
            <div className="flex flex-col ">
              <h1 className="font-semibold text-2xl">Ram Bahadur </h1>
              <div className="flex items-center gap-4 my-2">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:home-location"
                    width="24"
                    height="24"
                    className="text-[#060606]"
                  />
                  <p className="text-[#7d7a89] font-semibold">
                    Bhangal Kathmandu 44600
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi-light:phone" width="24" height="24" />
                  <p className="text-[#7d7a89] font-semibold">
                    +977-9825825852
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="ic:outline-mail" width="24" height="24" />
                  <p className="text-[#7d7a89] font-semibold">
                    RamBahadur@gmail.com
                  </p>
                </div>
              </div>
              <div>
                <h1>Registered on 2023-09-10</h1>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 rounded-lg border-[#b8c5d2] border-2 px-3 py-2 mb-[4rem]">
            <Icon
              icon="material-symbols-light:edit-square-outline"
              width="24"
              height="24"
            />
            <h1>Edit</h1>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 my-[2rem] ">
        {/* Order History Table – col-span-3 */}
        <div className="col-span-4 lg:col-span-2 rounded-xl bg-white ">
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
        <div className="col-span-4 lg:col-span-2 space-y-4">
          <InfoCard
            title="Address Book"
            onEdit={() => console.log("Edit clicked")}
            entries={[
              {
                label: "Home",
                address: "601 Frank Stottile Blvd, Kingston NY 12401",
                phone: "+977-9898989898",
              },
              {
                label: "Work",
                address: "123 Main Street, NYC NY 10001",
                phone: "+977-1234567890",
              },
            ]}
          />
          <InfoCard
            title="Account Information"
            onEdit={() => console.log("Edit clicked")}
            entries={[
              {
                username: "matrinsaris@gmail.com",
                password: "12345689",
              },
            ]}
          />
        </div>
      </div>

      {/* <div className="flex  items-center gap-2 my-[2rem] ">
        <div className="border-2 border-[#d5dae0] bg-[#ffffff] flex-1 rounded-xl">
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

        <div className="flex flex-col flex-1">
          <div>
            <InfoCard
              title="Address Book"
              onEdit={() => console.log("Edit clicked")}
              entries={[
                {
                  label: "Home",
                  address: "601 Frank Stottile Blvd, Kingston NY 12401",
                  phone: "+977-9898989898",
                },
                {
                  label: "Work",
                  address: "123 Main Street, NYC NY 10001",
                  phone: "+977-1234567890",
                },
              ]}
            />
          </div>
          <div>
            <InfoCard
              title="Account Information  "
              onEdit={() => console.log("Edit clicked")}
              entries={[
                {
                  address: "601 Frank Stottile Blvd, Kingston NY 12401",
                  phone: "+977-9898989898",
                },
              ]}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CustomerDetails;
