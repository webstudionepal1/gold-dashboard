import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/shared/Breadcrumb";
import { ScrollableModal } from "../../../components/shared/ScrollableModal";
import Header from "../../../components/shared/table_heading/Header";
import { FrontendRoutes } from "../../../routes/routes";
import { useGetCustomerById } from "../../../server/api/customerHook";
import {
  IFetchOrder,
  useGetAllOrdersQuery,
} from "../../../server/api/orderHooks";
import InfoSection from "../../OrderManagement/Order/components/InfoSection";
import Invoice, { InvoiceData } from "./Invoice";
import { SimpleTable } from "./SimpleTable";
interface CustomerDetails {
  _id: string;
  order_id: string;
  order_date: string;
  total_price: number;
  status: "Out of Stock" | "Delivered" | "Canceled" | "In Stock";
  isActive?: boolean;
}

// interface InvoiceItem {
//   name: string;
//   weight: number;
//   purity: string;
//   makingCharge: number;
//   ratePerGram: number;
//   total: number;
// }

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
  const { data: customer } = useGetCustomerById(id as string);

  const [selectedOrder, setSelectedOrder] = useState<IFetchOrder | null>(null);
  const {
    data: orders,
    isLoading: ordersLoading,
    // error: ordersError,
  } = useGetAllOrdersQuery({ customerId: id });

  // const printRef = useRef<HTMLDivElement>(null);

  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  //   documentTitle: "Invoice",
  // } as UseReactToPrintOptions);

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
          )}`}>
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
        ...item,
        name: "Name",
        price: item.selectedVariant.price,
        quantity: item.selectedVariant.quantity,
        totalPrice: item.selectedVariant.quantity * item.selectedVariant.price,
      }))
    : [];

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

  console.log("orderedProducts", selectedOrder);
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex items-center justify-between mb-3">
        <Header text="Customer Details" />
        <Breadcrumbs />
      </div>

      {/* Customer Header Card - More Compact */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-4">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  `${import.meta.env.VITE_API_IMAGE_BASE_URL}${
                    customer?.image
                  }` || "https://via.placeholder.com/150?text=User"
                }
                alt={customer?.name || "Customer"}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-bold text-xl text-gray-900">
                  {customer?.name}
                </h1>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:map-marker"
                    className="w-4 h-4 text-gray-500"
                  />
                  <span className="text-gray-600 truncate">
                    {customer?.address || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi:phone" className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">+977-{customer?.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon="mdi:email" className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 truncate">
                    {customer?.email}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                <Icon icon="mdi:calendar" className="w-3 h-3 inline mr-1" />
                Registered on {dayjs(customer?.joinDate).format("MMM DD, YYYY")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - More Compact */}
      <div className="grid grid-cols-12 gap-4">
        {/* Order History Table */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {ordersLoading && (
              <div className="p-4 text-center text-gray-500">
                <Icon
                  icon="mdi:loading"
                  className="w-6 h-6 animate-spin mx-auto mb-2"
                />
                Loading orders...
              </div>
            )}
            <SimpleTable
              title="Order History"
              data={(orders as any) || []}
              titlePosition="justify-center"
              showSerialNumber={true}
              columns={[
                {
                  header: "Order Date",
                  key: "createdAt",
                  render: (_, row) => (
                    <div className="text-sm">
                      {dayjs(row.createdAt).format("MMM DD, YYYY")}
                      <div className="text-xs text-gray-500">
                        {dayjs(row.createdAt).format("hh:mm A")}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Total Amount",
                  key: "totalAmount",
                  render: (_, row) => (
                    <div className="font-semibold text-gray-900">
                      ${row.totalAmount}
                    </div>
                  ),
                },
                {
                  key: "orderStatus",
                  header: "Status",
                  render: (value: string) => {
                    return (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          value
                        )}`}>
                        {value}
                      </span>
                    );
                  },
                },
              ]}
              onView={handleView}
              viewAllButton={
                <Link
                  to={FrontendRoutes.ORDER}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors">
                  <Icon icon="mdi:eye" className="w-4 h-4 mr-1" />
                  View All
                </Link>
              }
            />
          </div>
        </div>

        {/* Customer Info Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <InfoSection
              title="Contact Information"
              info={shippingInformation}
              showEdit={false}
              onEditClick={() => console.log("Edit clicked")}
            />
          </div>
        </div>
      </div>

      {showModal && selectedOrder && (
        <ScrollableModal
          onClose={handleCloseModal}
          classname="w-[90%] max-w-4xl p-4">
          <div className="space-y-4">
            {/* Order Header - Compact */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-bold text-lg text-gray-900">
                    Order{" "}
                    <span className="text-amber-600">
                      #{selectedOrder._id.slice(-6)}
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500">
                    {dayjs(selectedOrder.createdAt).format(
                      "MMM DD, YYYY - hh:mm A"
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(
                      selectedOrder?.paymentStatus || ""
                    )}`}>
                    {selectedOrder?.paymentStatus}
                  </span>
                  <button
                    onClick={() => {
                      setShowInvoiceModal(true);
                      setShowModal(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Icon icon="mdi:file-document" className="w-4 h-4" />
                    View Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Order Content Grid - More Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order Items
                    </h2>
                    <div className="border-b border-gray-200 mt-2"></div>
                  </div>
                  <SimpleTable
                    data={fla}
                    showViewButton={false}
                    titlePosition="justify-center"
                    showSerialNumber={false}
                    columns={[
                      {
                        header: "Item",
                        key: "name",
                        render: (_: unknown, row: any) => {
                          console.log("rows", row);
                          return (
                            <div className="flex items-center gap-2">
                              <img
                                src={`${
                                  import.meta.env.VITE_API_IMAGE_BASE_URL
                                }${row.product.images}`}
                                alt={row.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {row?.product?.name}
                              </div>
                            </div>
                          );
                        },
                      },
                      {
                        key: "quantity",
                        header: "Qty",
                        render: (value: number) => (
                          <span className="text-sm font-medium">{value}</span>
                        ),
                      },
                      {
                        header: "Price",
                        key: "price",
                        render: (_, row: any) => (
                          <span className="text-sm font-semibold text-gray-900">
                            ${row.price}
                          </span>
                        ),
                      },
                      {
                        header: "Total",
                        key: "totalPrice",
                        render: (_, row: any) => (
                          <span className="text-sm font-bold text-gray-900">
                            ${row.totalPrice}
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order Summary
                    </h2>
                    <div className="border-b border-gray-200 mt-2"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal ({selectedOrder?.orderedProducts?.length || 0}{" "}
                        items)
                      </span>
                      <span className="font-medium">
                        ${selectedOrder?.totalAmount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        ${selectedOrder?.billDetails?.shippingCost || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -${selectedOrder?.billDetails?.discount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">$0.00</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${selectedOrder?.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg">
              <InfoSection
                title="Shipping Information"
                info={shippingInformation}
                showEdit={false}
                onEditClick={() => console.log("Edit clicked")}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <InfoSection
                title="Billing Address"
                info={billingAddress}
                showEdit={false}
                onEditClick={() => console.log("Edit clicked")}
              />
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
                  weight: orderedProduct.selectedVariant.wt || 0,
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
                paymentMethod:
                  selectedOrder.transactionDetails?.paymentMethod || "N/A",
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
