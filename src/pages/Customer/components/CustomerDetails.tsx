import React, { useRef, useState } from "react";
import Header from "../../../components/shared/table_heading/Header";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SimpleTable } from "./SimpleTable";
import InfoCard from "./InfoCard";
import { useGetCustomerQuery } from "../../../server/api/customerHook";
import {
  IFetchOrder,
  IOrderSummary,
  useGetAllOrdersQuery,
} from "../../../server/api/orderHooks";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import InfoSection from "../../OrderManagement/Order/components/InfoSection";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import Invoice, { InvoiceData } from "./Invoice";
import { useReactToPrint, UseReactToPrintOptions } from "react-to-print";
import { FrontendRoutes } from "../../../routes/routes";
interface CustomerDetails {
  _id: string;
  order_id: string;
  order_date: string;
  total_price: number;
  status: "Out of Stock" | "Delivered" | "Canceled" | "In Stock";
  isActive?: boolean;
}

interface InvoiceItem {
  name: string;
  weight: number;
  purity: string;
  makingCharge: number;
  ratePerGram: number;
  total: number;
}

const getShippingStatusColor = (status: string) => {
  switch (
    status.toLowerCase() // Converts to lowercase for case-insensitive comparison
  ) {
    case "confirmed":
      return "bg-[#e8faee] text-[#6db289]";
    case "pending":
      return "text-[#df8d28]   font-semibold ";
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "text-[#35c659]  font-semibold";
    case "cancelled":
      return "bg-[#feeeee] text-[#ff4d4c]";
    case "not confirmed":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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
  const { id } = useParams();
  const {
    data: customers = [],
    isLoading,
    error,
  } = useGetCustomerQuery({ role: "customer" });
  const [selectedOrder, setSelectedOrder] = useState<IFetchOrder | null>(null);
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetAllOrdersQuery({ customer: id });

  const customer = customers.find((cust) => cust._id === id);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Invoice",
  } as UseReactToPrintOptions);

  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const handleInvoiceClose = () => {
    setShowInvoiceModal(!showInvoiceModal);
  };
  const handleCloseModal = () => {
    setShowModal(!showModal);
  };
  const handleView = (order: IFetchOrder) => {
    setShowModal(true);
    setSelectedOrder(order);
  };

  const shippingInformation = [
    {
      id: 1,
      title: "Name",
      value: customer?.name || "N/A",
    },
    {
      id: 2,
      title: "Phone No",
      value: <div>+977 {customer?.phone}</div>,
    },
    {
      id: 3,
      title: "Address",
      value: customer?.address || "N/A",
    },
    {
      id: 4,
      title: "Email",
      value: customer?.email || "N/A",
    },

    // {
    //   id: 5,
    //   title: "Shipping Method",
    //   value: <div>not fixed</div>,
    // },
    // {
    //   id: 5,
    //   title: "Payment",
    //   value: customer?.
    // },
  ];

  const billingAddress = [
    {
      id: 1,
      title: "Customer Name",
      value: customer?.name || "N/A",
    },
    {
      id: 2,
      title: "Phone No",
      value: <div>+977 {customer?.phone}</div>,
    },
    {
      id: 3,
      title: "Email",
      value: customer?.email || "N/A",
    },
    {
      id: 4,
      title: "Address",
      value: customer?.address || "N/A",
    },
    {
      id: 5,
      title: "Payment",
      value: (
        <div
          className={` font-semibold  ${getShippingStatusColor(
            selectedOrder?.paymentStatus || ""
          )}`}
        >
          {selectedOrder?.paymentStatus}
        </div>
      ),
    },
  ];

  // const flattenedOrders = orders.flatMap((order) =>
  //   order.orderedProducts.map((item) => ({
  // orderId: order._id,
  // totalAmount: order.totalAmount,
  // productId: item.product,
  // image: item.product.image,
  // qty: item.quantity,
  // price: item.selectedVariant.price,
  // totalPrice: item.quantity * item.selectedVariant.price,
  //   }))
  // );

  const fla = selectedOrder
    ? selectedOrder?.orderedProducts.map((item) => ({
        // name: item?.product?.name || "name",
        name: "Name",
        // image:
        //   (item?.product?.images?.length > 0 && item?.product.images[0]) ||
        //   "/sdfsdf",
        image: "/sdfsdf",
        price: item.selectedVariant.price,
        quantity: item.selectedVariant.quantity,
        totalPrice: item.selectedVariant.quantity * item.selectedVariant.price,
      }))
    : [];

  interface customerData {
    _id: string;
    customer_name: string;
    email: string;
    address: string;
    contact_number: string;
    total_order: string;
  }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "Confirmed":
  //       return "bg-[#e9fbef] text-[#6db289]";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "In Progress":
  //       return "bg-blue-100 text-blue-800";
  //     case "Delivered":
  //       return "bg-green-100 text-green-800";
  //     case "Cancelled":
  //       return "bg-red-100 text-red-800";
  //     case "Not Confirmed":
  //       return "bg-[#f9ebea] text-[#ce8b8e]";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };
  // const invoiceData: InvoiceData = {
  //   invoiceNumber: "INV-00123",

  //   customerName: "Sita Shrestha",
  //   customerPhone: "9800000000",
  //   customerAddress: "Lalitpur, Nepal",
  //   shopName: "Barun Gems Australia",
  //   shopAddress: "123 Gold Street, Kathmandu, Nepal",
  //   shopPhone: "+977-9812345678",
  //   taxRate: 13,
  //   discount: 1000,
  //   items: [
  //     {
  //       name: "Gold Ring",
  //       weight: 5.0,
  //       purity: "22K",
  //       makingCharge: 500,
  //       ratePerGram: 9000,
  //       total: 45500,
  //     },
  //     {
  //       name: "Gold Chain",
  //       weight: 15.0,
  //       purity: "24K",
  //       makingCharge: 1000,
  //       ratePerGram: 9500,
  //       total: 143500,
  //     },
  //   ],
  // };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-[#e8faee] text-[#6db289]";
      case "pending":
        return "text-[#df8d28] border-2 border-[#df8d28] rounded-xl px-4 py-2 font-semibold ";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "text-[#35c659] border-2 border-[#35c659] rounded-xl px-4 py-2 font-semibold";
      case "cancelled":
        return "bg-[#feeeee] text-[#ff4d4c]";
      case "not confirmed":
        return "bg-[#f9ebea] text-[#ce8b8e]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (
      status.toLowerCase() // Converts to lowercase for case-insensitive comparison
    ) {
      case "confirmed":
        return "bg-[#e8faee] text-[#6db289]";
      case "pending":
        return "bg-[#fff7ea] text-[#f7b627] ";
      case "assigned":
        return "bg-[#fff7ea] text-[#f7b627] ";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-[#fff7ea] text-[#23c65f]";
      case "cancelled":
        return "bg-[#feeeee] text-[#ff4d4c]";
      case "not confirmed":
        return "bg-[#f9ebea] text-[#ce8b8e]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <h1 className="font-semibold text-2xl">{customer?.name} </h1>
              <div className="flex items-center gap-4 my-2">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:home-location"
                    width="24"
                    height="24"
                    className="text-[#060606]"
                  />
                  <p className="text-[#7d7a89] font-semibold">
                    {customer?.address}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi-light:phone" width="24" height="24" />
                  <p className="text-[#7d7a89] font-semibold">
                    +977-{customer?.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="ic:outline-mail" width="24" height="24" />
                  <p className="text-[#7d7a89] font-semibold">
                    {customer?.email}
                  </p>
                </div>
              </div>
              <div>
                <h1>Registered on {customer?.joinDate}</h1>
              </div>
            </div>
          </div>

          {/* <button className="flex items-center gap-2 rounded-lg border-[#b8c5d2] border-2 px-3 py-2 mb-[4rem]">
            <Icon
              icon="material-symbols-light:edit-square-outline"
              width="24"
              height="24"
            />
            <h1>Edit</h1>
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 my-[2rem] ">
        {/* Order History Table – col-span-3 */}
        <div className="col-span-8 lg:col-span-8 rounded-xl bg-white border-2  border-[#d5d9e4] ">
          {ordersLoading && <div>Loading... </div>}
          <SimpleTable
            title="Order History"
            data={orders || []}
            titlePosition="justify-center"
            showSerialNumber={true}
            columns={[
              {
                header: "Order Date",
                key: "createdAt",
                render: (_, row) => (
                  <div>
                    {dayjs(row.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </div>
                ),
              },
              { key: "totalAmount", header: "Total Price" },
              {
                header: "Total Price",
                key: "totalAmount",
                render: (_, row) => <div>$ {row.totalAmount}</div>,
              },
              {
                key: "orderStatus",
                header: "Status",
                render: (value: string) => {
                  return (
                    <span
                      className={`px-3 py-[6px] rounded-full text-xs ${getStatusColor(
                        value
                      )}`}
                    >
                      {value}
                    </span>
                  );
                },
              },
            ]}
            onView={handleView}
            viewAllButton={
              <Link to={FrontendRoutes.ORDER} className="bg-white border-2 border-[#F1D097] text-[#F1D097] px-2 py-[3px] rounded-md lg:text-base md:text-sm text-xs hover:bg-[#F1D097] hover:text-white transition-colors">
                View All
              </Link>
            }
          />
        </div>

        <div className="col-span-4 lg:col-span-4 space-y-8   ">
          <div className="bg-white border-2 rounded-xl border-[#d5d9e4]">
            <InfoSection
              title="Shipping Information"
              info={shippingInformation}
              showEdit={false}
              onEditClick={() => console.log("Edit clicked")}
            />
          </div>

          <div className="bg-white border-2 rounded-xl border-[#d5d9e4]">
            <InfoSection
              title="Billing Address"
              info={billingAddress}
              showEdit={false}
              onEditClick={() => console.log("Edit clicked")}
            />
          </div>
          {/*
          <InfoCard
            className="bg-white border border-[#d5d9e2] rounded-lg h-full "
            title="Address Book"
            entries={[
              {
                label: "Home",
                address: customer?.address,
                phone: `+977-${customer?.phone}`,
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
            entries={[
              {
                username: customer?.email,
              },
            ]}
          /> */}
        </div>
      </div>

      {showModal && selectedOrder && (
        <ScrollableModal onClose={handleCloseModal} classname="w-[60%] p-6">
          <div className="mx-2 my-2">
            <div className="border-2 border-[#d6dbe4]  rounded-xl    ">
              <div className=" px-3 py-4 flex items-center  justify-between ">
                {/* <div className="flex flex-col">
                  <h1 className="font-bold text-xl text-[#fe382d]">
                    Order Cancelled{" "}
                    <span className="text-[#fe382d] font-bold text-xl">
                      #12
                    </span>
                  </h1>
                  <p className="text-[#b0b0b0] font-semibold">2024-10-10</p>
                </div> */}

                <div className="flex flex-col">
                  <h1 className="font-bold text-xl">
                    Order{" "}
                    <span className="text-[#ffc174] font-bold text-xl">
                      #12
                    </span>
                  </h1>
                  <p className="text-[#b0b0b0] font-semibold">2024-10-10</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* <h1 className="text-[#df8d28] border-2 border-[#df8d28] rounded-xl px-4 py-2 font-semibold">
                    {selectedOrder?.paymentStatus}
                  </h1> */}

                  <h1
                    className={`rounded-xl px-4 py-2 font-semibold border-2 ${getOrderStatusColor(
                      selectedOrder?.paymentStatus || ""
                    )}`}
                  >
                    {selectedOrder?.paymentStatus}
                  </h1>
                  <button
                    onClick={() => {
                      setShowInvoiceModal(true);
                      setShowModal(false);
                    }}
                    className="flex items-center gap-2 border-2 border-[#d2dae5] px-3 py-2 rounded-xl"
                  >
                    View Invoice{" "}
                    <Icon
                      icon="material-symbols-light:download"
                      width="24"
                      height="24"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 my-[2rem] ">
              <div className="col-span-6 lg:col-span-6 border-2 rounded-xl border-[#d5d9e4]  ">
                <div className="mx-4 my-2">
                  <div>
                    <h1 className="text-2xl font-semibold">Product Details</h1>
                    <div className="border border-b-[#d5d9e2] my-2 w-full"></div>
                    <SimpleTable
                      data={fla}
                      showViewButton={false}
                      titlePosition="justify-center"
                      showSerialNumber={false}
                      columns={[
                        {
                          header: "Item Name",
                          key: "name",
                          render: (_: any, row) => (
                            <div className="flex items-center justify-center">
                              <img
                                src={row.image}
                                alt={row.name}
                                className="w-10 h-10 rounded-md mr-3 object-cover"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {row.name}
                                </div>
                              </div>
                            </div>
                          ),
                        },
                        { key: "quantity", header: "QTY" },
                        {
                          header: "Price",
                          key: "price",
                          render: (_, row) => <div>$ {row.price}</div>,
                        },
                        {
                          header: "Total Price",
                          key: "totalPrice",
                          render: (_, row) => <div>$ {row.totalPrice}</div>,
                        },
                        // {
                        //   key: "orderStatus",
                        //   header: "Status",
                        //   render: (value: string) => {
                        //     console.log("Status value", value); // Log the value to inspect it
                        //     return (
                        //       <span
                        //         className={`px-3 py-[6px] rounded-full text-xs ${getStatusColor(
                        //           value
                        //         )}`}
                        //       >
                        //         {value}
                        //       </span>
                        //     );
                        //   },
                        // },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-6 lg:col-span-6 border-2 rounded-xl border-[#d5d9e4]">
                <div className="rounded-xl  bg-white  ">
                  <div className="px-3 py-2 space-y-3">
                    <h1 className="text-2xl font-semibold">Total Amount</h1>
                    <div className="border-b-2 border-[d5d9e4] my-1"></div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-sm">
                        <p>SubTotal (04 items)</p>
                        <p>
                          Rs. {selectedOrder?.billDetails.subTotalItemPrice}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p>Shipping Cost</p>
                        <p>Rs. {selectedOrder?.billDetails?.shippingCost}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <p>Discounts</p>
                        <p>Rs. {selectedOrder?.billDetails?.discount}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p>Taxes</p>
                        <p>Rs. 0.00</p>
                      </div>
                    </div>

                    <div className="my-2 rounded-md border-2 border-[#d5d9e4] ">
                      <div className="px-3 py-1 flex items-center justify-between">
                        <h1>Total</h1>
                        <p>Rs. {selectedOrder?.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 my-[2rem] ">
              <div className="col-span-6 lg:col-span-6  ">
                <div className="bg-white border-2 rounded-xl border-[#d5d9e4]">
                  <InfoSection
                    title="Shipping Information"
                    info={shippingInformation}
                    showEdit={false}
                    onEditClick={() => console.log("Edit clicked")}
                  />
                </div>
              </div>

              <div className="col-span-6 lg:col-span-6 ">
                <div className="bg-white border-2 rounded-xl border-[#d5d9e4]">
                  <InfoSection
                    title="Billing Address"
                    info={billingAddress}
                    showEdit={false}
                    onEditClick={() => console.log("Edit clicked")}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollableModal>
      )}

      {/* {showInvoiceModal && selectedOrder && (
        <ScrollableModal onClose={handleInvoiceClose} classname="w-[60%] p-6">
          <div>
            {orders?.map((selectedOrder) => {
              // Prepare the invoice data for each order
              const invoiceData = {
                invoiceNumber: selectedOrder._id, // Order ID as invoice number
                date: selectedOrder.createdAt, // Order creation date
                customerName: selectedOrder.shippingAddress.fullname, // Customer's name
                customerPhone: selectedOrder.shippingAddress.phone, // Customer's phone number
                customerAddress: selectedOrder.shippingAddress.address, // Customer's address
                items: selectedOrder.orderedProducts.map((orderedProduct) => ({
                  name: orderedProduct.product,
                  weight: orderedProduct.selectedVariant.wt,
                  purity: "", // Add purity if it's available for your product
                  makingCharge: 0, // Add making charge if applicable
                  ratePerGram: orderedProduct.selectedVariant.price,
                  total:
                    orderedProduct.selectedVariant.price *
                    orderedProduct.selectedVariant.quantity,
                })),
                discount: selectedOrder.billDetails.discount, // Discount from bill details
                taxRate: 0, // Tax rate is 0 (if applicable, add logic here)
                shopName: "Your Shop Name", // Replace with actual shop name
                shopAddress: "Your Shop Address", // Replace with actual shop address
                shopPhone: "Your Shop Phone", // Replace with actual shop phone
                shopGSTNumber: "GST Number", // Replace with actual GST number
                paymentMethod: selectedOrder.transactionDetails.paymentMethod, // Payment method from transaction
                notes: "Thank you for your purchase!", // Optional note or terms
              };

              // Return the Invoice component for each order with the prepared invoiceData
              return <Invoice key={selectedOrder._id} data={invoiceData} />;
            })} */}

      {/* </div>
        </ScrollableModal>
      )} */}

      {showInvoiceModal && selectedOrder && (
        <ScrollableModal onClose={handleInvoiceClose} classname="w-[60%] p-6">
          <div>
            {orders?.map((selectedOrder) => {
              const invoiceData: InvoiceData = {
                // invoiceNumber: selectedOrder._id,
                invoiceNumber: "-",

                date: selectedOrder.createdAt,

                customerName: selectedOrder.shippingAddress.fullname,
                customerPhone: selectedOrder.shippingAddress.phone,
                customerAddress: customer?.address,
                items: selectedOrder.orderedProducts.map((orderedProduct) => ({
                  name: orderedProduct.product?.name,
                  weight: orderedProduct.selectedVariant.wt,
                  purity: "",
                  makingCharge: 0,
                  ratePerGram: orderedProduct.selectedVariant.price,
                  quantity: orderedProduct.selectedVariant.quantity,
                  total:
                    orderedProduct.selectedVariant.price *
                    orderedProduct.selectedVariant.quantity,
                })),
                discount: selectedOrder.billDetails.discount,
                taxRate: 0,

                shopAddress: "Your Shop Address",
                shopPhone: "Your Shop Phone",
                shopGSTNumber: "GST Number",
                paymentMethod: selectedOrder.transactionDetails.paymentMethod,
                // notes: "Thank you for your purchase!",
              };

              return <Invoice key={selectedOrder._id} data={invoiceData} />;
            })}
          </div>
        </ScrollableModal>
      )}
    </div>
  );
};
export default CustomerDetails;
