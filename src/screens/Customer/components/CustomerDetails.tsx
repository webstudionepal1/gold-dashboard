import React, { useState, useMemo } from 'react';
import Header from '../../../components/shared/table_heading/Header';
import Breadcrumbs from '../../../components/shared/Breadcrumb';
import { Icon } from '@iconify/react/dist/iconify.js';
import { SimpleTable } from './SimpleTable';
import { useGetCustomerQuery } from '../../../server/api/customerHook';
import {
  IFetchOrder,
  useGetAllOrdersQuery,
} from '../../../server/api/orderHooks';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import InfoSection from '../../OrderManagement/Order/components/InfoSection';
import { ScrollableModal } from '../../../components/shared/ScrollableModal';
import Invoice, { InvoiceData } from './Invoice';

import { FrontendRoutes } from '../../../routes/routes';

// Constants for styling and configuration
const CARD_STYLES = {
  base: 'bg-white border-2 rounded-xl border-[#d5d9e4]',
  compact: 'p-3',
  section: 'space-y-4',
} as const;

const EMPTY_STATES = {
  noOrders: {
    icon: 'mdi:package-variant-closed',
    title: 'No Orders Found',
    message: "This customer hasn't placed any orders yet.",
  },
  noCustomer: {
    icon: 'mdi:account-question',
    title: 'Customer Not Found',
    message: 'The requested customer could not be found.',
  },
} as const;

// Utility functions
const getOrderStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-[#e8faee] text-[#6db289]';
    case 'pending':
      return 'text-[#df8d28] border-2 border-[#df8d28] rounded-xl px-4 py-2 font-semibold ';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'text-[#35c659] border-2 border-[#35c659] rounded-xl px-4 py-2 font-semibold';
    case 'cancelled':
      return 'bg-[#feeeee] text-[#ff4d4c]';
    case 'not confirmed':
      return 'bg-[#f9ebea] text-[#ce8b8e]';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (
    status.toLowerCase() // Converts to lowercase for case-insensitive comparison
  ) {
    case 'confirmed':
      return 'bg-[#e8faee] text-[#6db289]';
    case 'pending':
      return 'bg-[#fff7ea] text-[#f7b627] ';
    case 'assigned':
      return 'bg-[#fff7ea] text-[#f7b627] ';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-[#fff7ea] text-[#23c65f]';
    case 'cancelled':
      return 'bg-[#feeeee] text-[#ff4d4c]';
    case 'not confirmed':
      return 'bg-[#f9ebea] text-[#ce8b8e]';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper Components
const EmptyState: React.FC<{
  icon: string;
  title: string;
  message: string;
  className?: string;
}> = ({ icon, title, message, className = '' }) => (
  <div
    className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
  >
    <Icon icon={icon} className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-500 max-w-md">{message}</p>
  </div>
);

const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">{message}</span>
  </div>
);

const CustomerDetails = () => {
  const { id } = useParams();
  const {
    data: customers = [],
    isLoading: customersLoading,
    error: customersError,
  } = useGetCustomerQuery({ role: 'customer' });

  const [selectedOrder, setSelectedOrder] = useState<IFetchOrder | null>(null);
  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetAllOrdersQuery({ customer: id });

  const customer = customers.find((cust) => cust._id === id);
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Customer information data - moved before early returns
  const shippingInformation = useMemo(
    () => [
      {
        id: 1,
        title: 'Name',
        value: customer?.name || 'N/A',
      },
      {
        id: 2,
        title: 'Phone No',
        value: customer?.phone ? `+977 ${customer.phone}` : 'N/A',
      },
      {
        id: 3,
        title: 'Address',
        value: customer?.address || 'N/A',
      },
      {
        id: 4,
        title: 'Email',
        value: customer?.email || 'N/A',
      },
    ],
    [customer]
  );

  const billingAddress = useMemo(
    () => [
      {
        id: 1,
        title: 'Customer Name',
        value: customer?.name || 'N/A',
      },
      {
        id: 2,
        title: 'Phone No',
        value: customer?.phone ? `+977 ${customer.phone}` : 'N/A',
      },
      {
        id: 3,
        title: 'Email',
        value: customer?.email || 'N/A',
      },
      {
        id: 4,
        title: 'Address',
        value: customer?.address || 'N/A',
      },
      {
        id: 5,
        title: 'Payment',
        value: selectedOrder?.paymentStatus ? (
          <div
            className={`font-semibold ${getStatusColor(
              selectedOrder.paymentStatus
            )}`}
          >
            {selectedOrder.paymentStatus}
          </div>
        ) : (
          'N/A'
        ),
      },
    ],
    [customer, selectedOrder]
  );

  // Early returns after all hooks are called
  if (customersLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Header text="Customer Details" />
          <Breadcrumbs />
        </div>
        <LoadingState message="Loading customer details..." />
      </div>
    );
  }

  if (customersError || !customer) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Header text="Customer Details" />
          <Breadcrumbs />
        </div>
        <EmptyState
          icon={EMPTY_STATES.noCustomer.icon}
          title={EMPTY_STATES.noCustomer.title}
          message={EMPTY_STATES.noCustomer.message}
          className={CARD_STYLES.base}
        />
      </div>
    );
  }

  const handleInvoiceClose = () => {
    setShowInvoiceModal(!showInvoiceModal);
  };
  const handleCloseModal = () => {
    setShowModal(!showModal);
  };
  const handleView = (order: IFetchOrder) => {
    setShowModal(true);
    setSelectedOrder({
      ...order,
    });
  };

  console.log(selectedOrder, 'order selected is::');

  const fla = selectedOrder
    ? selectedOrder?.orderedProducts.map((item) => ({
        // name: item?.product?.name || "name",
        name: 'Name',
        // image:
        //   (item?.product?.images?.length > 0 && item?.product.images[0]) ||
        //   "/sdfsdf",
        image: '/sdfsdf',
        price: item.selectedVariant.price,
        quantity: item.selectedVariant.quantity,
        totalPrice: item.selectedVariant.quantity * item.selectedVariant.price,
      }))
    : [];

  // const joinDate = customer.joinDate;
  const joinDate = new Date(customer.createdAt).toDateString();

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between">
        <Header text="Customer Details" />
        <Breadcrumbs />
      </div>

      {/* Customer Header - More Compact */}
      <div className={`${CARD_STYLES.base} mb-6`}>
        <div className="flex items-center gap-4 p-4">
          <img
            src={customer.image || '/no-image.png'}
            alt={customer.name || 'Customer'}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <h1 className="font-semibold text-xl mb-2">{customer.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:home-location"
                  className="w-4 h-4 text-gray-500"
                />
                <span className="text-gray-600">
                  {customer.address || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi-light:phone"
                  className="w-4 h-4 text-gray-500"
                />
                <span className="text-gray-600">
                  {customer.phone ? `+977-${customer.phone}` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="ic:outline-mail"
                  className="w-4 h-4 text-gray-500"
                />
                <span className="text-gray-600">{customer.email || 'N/A'}</span>
              </div>
            </div>
            {customer.joinDate && (
              <p className="text-xs text-gray-500 mt-2">
                Registered on {joinDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid - More Compact */}
      <div className="grid grid-cols-12 gap-4">
        {/* Order History Table */}
        <div className="col-span-12 lg:col-span-8">
          <div className={CARD_STYLES.base}>
            {ordersLoading ? (
              <LoadingState message="Loading orders..." />
            ) : ordersError ? (
              <EmptyState
                icon="mdi:alert-circle"
                title="Error Loading Orders"
                message="There was an error loading the order history. Please try again."
              />
            ) : orders.length === 0 ? (
              <EmptyState
                icon={EMPTY_STATES.noOrders.icon}
                title={EMPTY_STATES.noOrders.title}
                message={EMPTY_STATES.noOrders.message}
              />
            ) : (
              <SimpleTable
                title="Order History"
                data={orders}
                titlePosition="justify-center"
                showSerialNumber={true}
                columns={[
                  {
                    header: 'Order Date',
                    key: 'createdAt',
                    render: (_, row) => (
                      <div className="text-sm">
                        {dayjs(row.createdAt).format('DD MMM YYYY')}
                        <div className="text-xs text-gray-500">
                          {dayjs(row.createdAt).format('hh:mm A')}
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: 'Total Amount',
                    key: 'totalAmount',
                    render: (_, row) => (
                      <div className="font-semibold">$ {row.totalAmount}</div>
                    ),
                  },
                  {
                    key: 'orderStatus',
                    header: 'Status',
                    render: (value: string) => (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          value
                        )}`}
                      >
                        {value}
                      </span>
                    ),
                  },
                ]}
                onView={handleView}
                viewAllButton={
                  <Link
                    to={FrontendRoutes.ORDER}
                    className="bg-white border-2 border-[#F1D097] text-[#F1D097] px-3 py-1 rounded-md text-sm hover:bg-[#F1D097] hover:text-white transition-colors"
                  >
                    View All Orders
                  </Link>
                }
              />
            )}
          </div>
        </div>

        {/* Customer Information Sidebar - More Compact */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className={CARD_STYLES.base}>
            <InfoSection
              title="Contact Information"
              info={shippingInformation}
              showEdit={false}
              onEditClick={() => console.log('Edit clicked')}
            />
          </div>

          {selectedOrder && (
            <div className={CARD_STYLES.base}>
              <InfoSection
                title="Billing Address"
                info={billingAddress}
                showEdit={false}
                onEditClick={() => console.log('Edit clicked')}
              />
            </div>
          )}

          {/* Order Summary Card */}
          <div className={CARD_STYLES.base}>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold">
                    Rs.{' '}
                    {orders
                      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Order:</span>
                  <span className="font-semibold">
                    Rs.{' '}
                    {orders.length > 0
                      ? (
                          orders.reduce(
                            (sum, order) => sum + (order.totalAmount || 0),
                            0
                          ) / orders.length
                        ).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
                    #{' '}
                    <span className="text-[#ffc174] font-bold text-xl">
                      {selectedOrder?.orderNumber}
                    </span>
                  </h1>
                  <p className="text-[#b0b0b0] font-semibold">
                    {
                      selectedOrder?.orderTimeline?.orderCreated?.split(
                        'GMT'
                      )[0]
                    }
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* <h1 className="text-[#df8d28] border-2 border-[#df8d28] rounded-xl px-4 py-2 font-semibold">
                    {selectedOrder?.paymentStatus}
                  </h1> */}

                  <h1
                    className={`rounded-xl px-4 py-2 font-semibold border-2 ${getOrderStatusColor(
                      selectedOrder?.paymentStatus || ''
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
                    View Invoice{' '}
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
                          header: 'Item Name',
                          key: 'name',
                          render: (_: unknown, row: any) => (
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
                        { key: 'quantity', header: 'QTY' },
                        {
                          header: 'Price',
                          key: 'price',
                          render: (_, row) => <div>$ {row.price}</div>,
                        },
                        {
                          header: 'Total Price',
                          key: 'totalPrice',
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
                    onEditClick={() => console.log('Edit clicked')}
                  />
                </div>
              </div>

              <div className="col-span-6 lg:col-span-6 ">
                <div className="bg-white border-2 rounded-xl border-[#d5d9e4]">
                  <InfoSection
                    title="Billing Address"
                    info={billingAddress}
                    showEdit={false}
                    onEditClick={() => console.log('Edit clicked')}
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
        <ScrollableModal onClose={handleInvoiceClose} classname="w-[60%] ">
          <div>
            {orders?.map((selectedOrder) => {
              const invoiceData: InvoiceData = {
                // invoiceNumber: selectedOrder._id,
                invoiceNumber: '-',

                date: selectedOrder.createdAt,

                customerName: selectedOrder.shippingAddress.fullname,
                customerPhone: selectedOrder.shippingAddress.phone,
                customerAddress: customer?.address,
                items: selectedOrder.orderedProducts.map((orderedProduct) => ({
                  name: orderedProduct.product?.name,
                  weight: orderedProduct.selectedVariant.wt,
                  purity: '',
                  makingCharge: 0,
                  ratePerGram: orderedProduct.selectedVariant.price,
                  quantity: orderedProduct.selectedVariant.quantity,
                  total:
                    orderedProduct.selectedVariant.price *
                    orderedProduct.selectedVariant.quantity,
                })),
                discount: selectedOrder.billDetails.discount,
                taxRate: 0,

                shopAddress: 'Your Shop Address',
                shopPhone: 'Your Shop Phone',
                shopGSTNumber: 'GST Number',
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
