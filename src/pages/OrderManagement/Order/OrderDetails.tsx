import React from "react";
import Header from "../../../components/shared/table_heading/Header";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SimpleTable } from "../../Customer/components/SimpleTable";
import InfoCard from "../../Customer/components/InfoCard";
import OrderTracker from "./components/OrderTracker";
import { CheckIcon, PackageIcon, TruckIcon } from "lucide-react";
import { pageConfigs, PageType } from "../../../config/orderPageConfig";
import { useParams } from "react-router-dom";
import InfoSection from "./components/InfoSection";

interface CustomerDetails {
  _id: string;
  item_name: string;
  qty: number;
  price: number;
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
    name: "Delivery Completion",
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
    value: <div className="text-green">paid</div>,
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

const orderCancelled = [
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
    title: "Cancelled Date",
    date: <div className="text-red">2051-01-11</div>,
  },

  {
    id: 6,
    title: "Reason for cancellation",
    reason: "N/A",
  },
];

const todaysOrders = [
  {
    item_name: "Lipstick",
    qty: "01",
    price: 262,
    total_price: 262,
    status: "In Stock",
  },
  {
    item_name: "Bag",
    qty: "02",
    price: 262,
    total_price: 262,
    status: "In Stock",
  },
  {
    item_name: "Shoes",
    qty: "02",
    price: 262,
    total_price: 262,
    status: "Low Stock",
  },
  {
    item_name: "Rings",
    qty: "02",
    price: 262,
    total_price: 262,
    status: "Low Stock",
  },
  {
    item_name: "Ear Rings",
    qty: "02",
    price: 262,
    total_price: 262,
    status: "Out of Stock",
  },
];

const OrderDetails = () => {
  const { page } = useParams<{ page: PageType }>();
  console.log("Params", page);
  return (
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-2 ">
        {/* {page === "order-details" ? (
          <Header text="Order Details" />
        ) : page === "confirmed-order-details" ? (
          <Header text="Confirmed Orders" />
        ) : page === "assigned-order-details" ? (
          <Header text="Assigned Orders" />
        ) : page === "completed-order-details" ? (
          <Header text="Completed Orders" />
        ) : page === "cancelled-order-details" ? (
          <Header text="Cancelled Orders" />
        ) : (
          <></>
        )} */}

        {page === "order-details" ? (
          <Header text="Order Details" />
        ) : page === "cancelled-order-details" ? (
          <Header text="Cancelled Orders" />
        ) : (
          <Header text="Order Details" />
        )}
      </div>

      {page === "order-details" ? (
        <div className="ml-[2.5rem] mb-6">
          <OrderTracker steps={steps} currentStep={0} />
        </div>
      ) : page === "confirmed-order-details" ? (
        <div className="ml-[2.5rem] mb-6">
          <OrderTracker steps={steps} currentStep={1} />
        </div>
      ) : page === "assigned-order-details" ? (
        <div className="ml-[2.5rem] mb-6">
          <OrderTracker steps={steps} currentStep={2} />
        </div>
      ) : page === "completed-order-details" ? (
        <div className="ml-[2.5rem] mb-6">
          <OrderTracker steps={steps} currentStep={3} />
        </div>
      ) : page === "cancelled-order-details" ? (
        <div className="ml-[2.5rem] mb-6">
          <OrderTracker
            cancelledBg="bg-[#ff3b2f]"
            cancelledBorder="border-[#ff3b2f] "
            steps={steps}
            currentStep={3}
          />
        </div>
      ) : (
        <></>
      )}

      <div className="bg-white ml-[2.5rem] py-4 rounded-md">
        <div className="border-2 border-[#d6dbe4] mx-3 rounded-xl    ">
          <div className="px-3 py-3 flex items-center  justify-between ">
            {page === "cancelled-order-details" ? (
              <div className="flex flex-col">
                <h1 className="font-bold text-xl text-[#fe382d]">
                  Order Cancelled{" "}
                  <span className="text-[#fe382d] font-bold text-xl">#12</span>
                </h1>
                <p className="text-[#b0b0b0] font-semibold">2024-10-10</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <h1 className="font-bold text-xl">
                  Order{" "}
                  <span className="text-[#ffc174] font-bold text-xl">#12</span>
                </h1>
                <p className="text-[#b0b0b0] font-semibold">2024-10-10</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* <button className="text-[#df8d28] border-2 border-[#df8d28] rounded-xl px-4 py-2 font-semibold">
                Pending
              </button> */}
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
        <div className=" grid grid-cols-12 gap-4 h-auto mt-[1rem] mx-3   ">
          <div className="col-span-4 lg:col-span-8  bg-white border-2 rounded-xl border-[#d5d9e4] ">
            <SimpleTable
              title="Order History"
              data={todaysOrders}
              columns={[
                {
                  key: "item_name",
                  header: "Item Name",
                  render: (_: any, row: any) => (
                    <div className="flex items-center justify-center">
                      <img
                        src={
                          "https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"
                        }
                        alt={row.item_name}
                        className="w-10 h-10 rounded-md mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {row.item_name}
                        </div>
                      </div>
                    </div>
                  ),
                },
                { key: "qty", header: "QTY" },
                {
                  key: "price",
                  header: "Price",
                  render: (_: any, row: any) => (
                    <div>
                      <h1>$ {row.price}</h1>
                    </div>
                  ),
                },

                {
                  key: "total_price",
                  header: "Total Price",
                  render: (_: any, row: any) => (
                    <div>
                      <h1>$ {row.total_price}</h1>
                    </div>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                },
              ]}
              showCheckbox={true}
              showViewButton={false}
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
            <InfoSection
              title="Shipping Information"
              info={shippingInformation}
              showEdit={false}
              onEditClick={() => console.log("Edit clicked")}
            />
          </div>
          {page === "cancelled-order-details" ? (
            <div className="col-span-4 lg:col-span-4  bg-white border-2 rounded-xl border-[#d5d9e4] ">
              <InfoSection
                title="Order Cancelled"
                info={orderCancelled}
                showEdit={false}
                onEditClick={() => console.log("Edit clicked")}
              />
            </div>
          ) : (
            <div className="col-span-4 lg:col-span-4  bg-white border-2 rounded-xl border-[#d5d9e4] ">
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold">Billing Address</h1>

                  {/* <button>
                  <div className="text-xl text-black cursor-pointer bg-green rounded p-1">
                    <Icon icon="lucide:pen-line" fontSize={16} color="white" />
                  </div>
                </button> */}
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
          )}
        </div>
        {page === "order-details" ? (
          <div className="flex items-center justify-end  gap-3 mb-2 mt-4 mx-3">
            <button className="bg-[#de8d29] px-4 py-2 text-white rounded-xl">
              Accept
            </button>
            <button className="bg-[#d1d1d1] px-4 py-2 text-[#878787] rounded-xl font-semibold">
              Cancel
            </button>
          </div>
        ) : page === "confirmed-order-details" ? (
          <div className="flex items-center justify-end  mb-2 mt-4 mx-3">
            <button className="bg-[#de8d29] px-4 py-2 text-white rounded-xl">
              Assign Delivery
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
