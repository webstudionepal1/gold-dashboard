import { Icon } from '@iconify/react/dist/iconify.js';
import clsx from 'clsx';
import { map, get } from 'lodash';
import { CheckIcon, Download, PackageIcon, TruckIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import MasterTable from '../../../components/shared/MasterTable';
import Header from '../../../components/shared/table_heading/Header';
import {
  useGetOrderById,
  useUpdateOrderMutation,
  useOrderCache,
} from '../../../server/api/orderHooks';
import InfoSection from './components/InfoSection';
import OrderTracker from './components/OrderTracker';
import { order_details_columns, Ordertitle, StepperObj } from './orderObj';
import ErrorBoundary from '../../../components/shared/ErrorBoundary';
import {
  OrderDetailsSkeleton,
  ButtonLoading,
} from '../../../components/shared/LoadingStates';
import { Constants } from '../../../utils/constants';
import { CancelOrderModal } from '../../../components/shared/modals/CancelOrderModal';
import { CompleteOrderModal } from '../../../components/shared/modals/CompleteOrderModal';
import { PickupOrderModal } from '../../../components/shared/modals/PickupOrderModal';
import {
  extractOrderData,
  extractProductData,
  formatCurrency,
  safeGet,
  validateOrderData,
} from '../../../utils/dataHelpers';

// Define proper TypeScript interfaces
interface OrderedProduct {
  product: {
    name: string;
  };
  selectedVariant: {
    quantity: number;
    price: number;
  };
}

interface OrderStep {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

interface InfoItem {
  id: number;
  title: string;
  value?: string | React.ReactNode;
  Note?: string;
  date?: React.ReactNode;
  reason?: string;
}

// Constants separated for better organization
const STEPS: OrderStep[] = [
  {
    id: 0,
    name: 'Pending',
  },
  {
    id: 1,
    name: 'Confirmed',
    icon: <CheckIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 2,
    name: 'Assigned Order',
    icon: <PackageIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 3,
    name: 'Pickup',
    icon: <TruckIcon className="w-6 h-6 text-white" />,
  },
  {
    id: 4,
    name: 'Delivery Completion',
    icon: <CheckIcon className="w-6 h-6 text-white" />,
  },
];

// Utility function to get button configuration based on order status
const getOrderActionButton = (orderStatus: string) => {
  const statusConfig = {
    pending: {
      text: 'Accept Order',
      nextStatus: 'confirmed',
      variant: 'primary' as const,
      icon: <CheckIcon className="w-4 h-4" />,
      disabled: false,
    },
    confirmed: {
      text: 'Assign Order',
      nextStatus: 'assigned',
      variant: 'primary' as const,
      icon: <PackageIcon className="w-4 h-4" />,
      disabled: false,
    },
    assigned: {
      text: 'Mark as Picked Up',
      nextStatus: 'picked_up',
      variant: 'primary' as const,
      icon: <TruckIcon className="w-4 h-4" />,
      disabled: false,
    },
    picked_up: {
      text: 'Mark as Delivered',
      nextStatus: 'delivered',
      variant: 'success' as const,
      icon: <CheckIcon className="w-4 h-4" />,
      disabled: false,
    },
    delivered: {
      text: 'Order Completed',
      nextStatus: 'delivered',
      variant: 'success' as const,
      icon: <CheckIcon className="w-4 h-4" />,
      disabled: true,
    },
    cancelled: {
      text: 'Order Cancelled',
      nextStatus: 'cancelled',
      variant: 'danger' as const,
      icon: null,
      disabled: true,
    },
  };

  return (
    statusConfig[orderStatus as keyof typeof statusConfig] ||
    statusConfig.pending
  );
};

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Get the current page type from the URL
  const pagePath = pathname.split('/');
  const page = pagePath[pagePath.length - 2]; // This should be "order-details" for /order/order-details/123

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);

  // API hooks with proper error handling
  const {
    mutate: updateOrder,
    isPending,
    isSuccess,
  } = useUpdateOrderMutation();

  const { data: order, isLoading, isError, error } = useGetOrderById(id);

  // Cache management hook
  const { updateOrderInCache, invalidateOrderCache } = useOrderCache();

  // Handle navigation after successful order update with cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isSuccess) {
      // Add a small delay to ensure the success message is shown
      timeoutId = setTimeout(() => {
        navigate('/order/orders');
      }, 500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSuccess, navigate]);

  // Handle order pickup with optimistic updates
  const handlePickupOrder = (pickupDetails: {
    pickedUpBy?: string;
    location?: string;
    notes?: string;
  }) => {
    if (!order?._id) return;

    const pickupData = {
      orderStatus: 'picked_up' as const,
      pickup: {
        date: new Date().toISOString(),
        pickedUpBy: pickupDetails.pickedUpBy,
        location: pickupDetails.location,
        notes: pickupDetails.notes,
        confirmedBy: 'Admin', // You can get this from auth context
      },
      orderTimeline: {
        ...order.orderTimeline,
        pickUp: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    updateOrderInCache(order._id, pickupData);

    updateOrder(
      {
        id: order._id,
        body: pickupData,
      },
      {
        onError: () => {
          // Revert optimistic update on error
          updateOrderInCache(order._id, { orderStatus: order.orderStatus });
          invalidateOrderCache(order._id);
        },
      }
    );

    setShowPickupModal(false);
  };

  // Handle order completion with optimistic updates
  const handleCompleteOrder = (notes?: string) => {
    if (!order?._id) return;

    const completionData = {
      orderStatus: 'delivered' as const,
      deliveryCompletion: {
        date: new Date().toISOString(),
        notes: notes || undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    updateOrderInCache(order._id, completionData);

    updateOrder(
      {
        id: order._id,
        body: completionData,
      },
      {
        onError: () => {
          // Revert optimistic update on error
          updateOrderInCache(order._id, { orderStatus: order.orderStatus });
          invalidateOrderCache(order._id);
        },
      }
    );

    setShowCompleteModal(false);
    // Navigate back to main order management page after successful completion
    setTimeout(() => navigate('/order/orders'), 1000);
  };

  // Handle order cancellation with optimistic updates
  const handleCancelOrder = (reason: string) => {
    if (!order?._id) return;

    const cancellationData = {
      orderStatus: 'cancelled' as const,
      cancellation: {
        reason,
        date: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    updateOrderInCache(order._id, cancellationData);

    updateOrder(
      {
        id: order._id,
        body: cancellationData,
      },
      {
        onError: () => {
          // Revert optimistic update on error
          updateOrderInCache(order._id, { orderStatus: order.orderStatus });
          invalidateOrderCache(order._id);
        },
      }
    );

    setShowCancelModal(false);
    // Navigate to cancelled orders page after successful cancellation
    setTimeout(() => navigate('/order/cancelled-order'), 1000);
  };

  // Transform order products data with safe access and performance optimization
  const orderMenu = useMemo(() => {
    if (!order?.orderedProducts) return [];

    return map(order.orderedProducts, (item) => {
      const productData = extractProductData(item);
      const imageUrl =
        productData.images.length > 0
          ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${productData.images[0]}`
          : '/no-image.png';

      return {
        image: (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10">
              <img
                src={imageUrl}
                alt={productData.name}
                className="w-full h-full rounded-md object-cover aspect-square"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/no-image.png';
                }}
              />
            </div>
          </div>
        ),
        name: productData.name,
        qty: productData.quantity,
        price: formatCurrency(productData.price),
        total_price: formatCurrency(productData.totalPrice),
      };
    });
  }, [order?.orderedProducts]);

  // Calculate order details with safe data access
  const orderDetails = useMemo(() => {
    if (!order) {
      return {
        subTotal: { label: 'SubTotal', value: 0 },
        shippingCost: { label: 'Shipping Cost', value: 0 },
        discounts: { label: 'Discounts', value: 0 },
        taxes: { label: 'Taxes', value: 0 },
      };
    }

    const orderData = extractOrderData(order);
    const itemCount = orderData.orderedProducts.length;

    return {
      subTotal: {
        label: `SubTotal (${itemCount} items)`,
        value: orderData.totalAmount,
      },
      shippingCost: {
        label: 'Shipping Cost',
        value: orderData.billDetails.shippingCost,
      },
      discounts: {
        label: 'Discounts',
        value: orderData.billDetails.discount,
      },
      taxes: {
        label: 'Taxes',
        value: orderData.billDetails.taxes,
      },
    };
  }, [order]);

  // Calculate total amount
  const totalValue = useMemo(() => {
    return Object.values(orderDetails).reduce(
      (acc, curr) => acc + Number(curr.value),
      0
    );
  }, [orderDetails]);

  // Generate shipping information with safe data access
  const shippingInformation = useMemo(() => {
    if (!order) return [];

    const orderData = extractOrderData(order);

    return [
      {
        id: 1,
        title: 'Customer',
        value: orderData.shippingAddress.fullname || 'N/A',
      },
      {
        id: 2,
        title: 'Phone Number',
        value: orderData.shippingAddress.phone || 'N/A',
      },
      {
        id: 3,
        title: 'Address',
        value: orderData.shippingAddress.address || 'N/A',
      },
      {
        id: 4,
        title: 'Email',
        value: orderData.shippingAddress.email || 'N/A',
      },
      {
        id: 5,
        title: 'Shipping Method',
        value: safeGet(order, 'shippingMethod', 'Standard'),
      },
      {
        id: 6,
        title: 'Payment Status',
        value: (
          <div
            className={`text-sm rounded-full py-1 px-4 font-medium ${
              orderData.paymentStatus === 'paid'
                ? 'text-white bg-green-600'
                : 'text-white bg-red-600'
            }`}
          >
            <span className="capitalize">{orderData.paymentStatus}</span>
          </div>
        ),
      },
    ];
  }, [order]);

  // Generate billing address info from customer data
  const billingAddress = useMemo(() => {
    if (!order) return [];

    return [
      {
        id: 1,
        title: 'Customer Name',
        value: get(order, 'billingAddress.fullname', '-'),
      },
      {
        id: 2,
        title: 'Phone Number',
        value: get(order, 'billingAddress.phone', ''),
      },
      {
        id: 3,
        title: 'Email',
        value: get(order, 'billingAddress.email', ''),
      },
      {
        id: 4,
        title: 'Address',
        value: get(order, 'billingAddress.address', ''),
      },
      {
        id: 5,
        title: 'landmark',
        Note: get(order, 'billingAddress.landMark', 'N/A'),
      },
    ];
  }, [order]);

  // Order cancellation details
  const orderCancelled = useMemo(() => {
    if (!order) return [];

    return [
      {
        id: 5,
        title: 'Cancelled Date',
        date: (
          <div className="text-red">
            {get(order, 'cancellation.data', 'N/A')}
          </div>
        ),
      },
      {
        id: 6,
        title: 'Reason for cancellation',
        reason: get(order, 'cancellation.reason', 'N/A'),
      },
    ];
  }, [order]);

  // Handle order status update with optimistic updates
  const handleOrderStatusUpdate = (newStatus: string) => {
    if (!id || !order) return;

    // Optimistic update - immediately update the cache
    updateOrderInCache(id, {
      orderStatus: newStatus as any, // Type assertion for flexibility
      updatedAt: new Date().toISOString(),
    });

    updateOrder(
      {
        id,
        body: { orderStatus: newStatus },
      },
      {
        onError: () => {
          // Revert optimistic update on error
          updateOrderInCache(id, { orderStatus: order.orderStatus });
          invalidateOrderCache(id);
        },
      }
    );
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container px-4 py-3 mx-auto">
        <OrderDetailsSkeleton />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <ErrorBoundary
        fallback={
          <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Icon icon="mdi:alert-circle" className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-medium">Error loading order details</h2>
            <p className="text-gray-600">
              {error?.message || 'Please check your connection and try again'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        }
      >
        <div></div>
      </ErrorBoundary>
    );
  }

  const orderStatus = get(order, 'orderStatus', 'pending');
  const orderDate = get(order, 'orderDate', '').split('T')[0];
  const orderNumber = get(order, 'id', '').slice(-5);

  return (
    <ErrorBoundary>
      <div className="container px-4 py-3 mx-auto">
        <Header text={Ordertitle[page] || 'Order Details'} />

        {/* Order Progress Tracker */}
        <OrderTracker
          steps={STEPS}
          currentStep={StepperObj[orderStatus] || 0}
          cancelledBg={orderStatus === 'cancelled' ? 'bg-red-600' : undefined}
          cancelledBorder={
            orderStatus === 'cancelled' ? 'border-red-600' : undefined
          }
          cancelledText={
            orderStatus === 'cancelled' ? 'text-red-600 font-medium' : undefined
          }
        />

        <div className="py-6 grid grid-cols-1 md:grid-cols-3 mt-6 gap-6 lg:grid-cols-12">
          {/* Order Header */}
          {/* <div className="border-2 border-[#d6dbe4] mx-3 rounded-xl">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex flex-col">
              <h1
                className={clsx(
                  "text-xl font-bold",
                  page === "cancelled-order-details" ? "text-[#fe382d]" : ""
                )}
              >
                {page === "cancelled-order-details"
                  ? "Order Cancelled"
                  : "Order"}{" "}
                <span
                  className={clsx(
                    "font-bold text-xl",
                    page === "cancelled-order-details"
                      ? "text-[#fe382d]"
                      : "text-[#ffc174]"
                  )}
                >
                  #{orderNumber}
                </span>
              </h1>
              <p className="text-[#b0b0b0] font-semibold">{orderDate}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 border-2 border-[#d2dae5] px-3 py-2 rounded-xl">
                Download Invoice <Download size={24} />
              </button>
            </div>
          </div>
        </div> */}

          {/* Main Content Grid */}
          <div className="md:col-span-2 flex flex-col gap-6 lg:col-span-8">
            {/* Order Items Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>
              <MasterTable
                rows={orderMenu}
                columns={order_details_columns}
                canSearch={false}
              />
            </div>

            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <InfoSection
                title="Shipping Information"
                info={shippingInformation}
                showEdit={false}
                onEditClick={() => {
                  /* Implement edit functionality */
                }}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="space-y-6">
              {/* Order Total Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <div className="border-b border-gray-200"></div>

                  <div className="flex flex-col gap-3">
                    {Object.entries(orderDetails).map(
                      ([key, { label, value }]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between text-sm"
                        >
                          <p>{label}</p>
                          <p>
                            {Constants.currency}{' '}
                            {typeof value === 'number'
                              ? value.toFixed(2)
                              : value}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div className="my-2 rounded-md border-2 border-[#d5d9e4]">
                    <div className="flex items-center justify-between px-3 py-1 font-semibold">
                      <h1>Total</h1>
                      <p>
                        {Constants.currency} {totalValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {page === 'cancelled-order-details' ? (
                <InfoSection
                  title="Order Cancelled"
                  info={orderCancelled}
                  showEdit={false}
                  onEditClick={() => {
                    /* Implement edit functionality */
                  }}
                />
              ) : (
                <InfoSection
                  title="Billing Address"
                  info={billingAddress}
                  showEdit={false}
                  onEditClick={() => {
                    /* Implement edit functionality */
                  }}
                />
              )}
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              {(() => {
                const buttonConfig = getOrderActionButton(orderStatus);
                const getButtonStyles = (variant: string) => {
                  const baseStyles =
                    'px-6 py-3 text-white rounded-lg font-medium transition-all shadow-sm flex items-center gap-2';
                  const variants = {
                    primary: 'bg-blue-600 hover:bg-blue-700',
                    success: 'bg-green hover:bg-green-700',
                    danger: 'bg-red hover:bg-red-700',
                    warning: 'bg-orange hover:bg-orange-700',
                  };
                  return `${baseStyles} ${
                    variants[variant as keyof typeof variants] ||
                    variants.primary
                  }`;
                };

                const getLoadingText = (status: string) => {
                  const loadingTexts = {
                    confirmed: 'Accepting...',
                    assigned: 'Assigning...',
                    picked_up: 'Updating...',
                    delivered: 'Completing...',
                  };
                  return (
                    loadingTexts[status as keyof typeof loadingTexts] ||
                    'Processing...'
                  );
                };

                const handleButtonClick = () => {
                  if (buttonConfig.nextStatus === 'delivered') {
                    setShowCompleteModal(true);
                  } else if (buttonConfig.nextStatus === 'picked_up') {
                    setShowPickupModal(true);
                  } else {
                    handleOrderStatusUpdate(buttonConfig.nextStatus);
                  }
                };

                return (
                  <>
                    {/* Main action button - only show if order is not completed or cancelled */}
                    {orderStatus !== 'delivered' &&
                      orderStatus !== 'cancelled' && (
                        <ButtonLoading
                          isLoading={isPending}
                          loadingText={getLoadingText(buttonConfig.nextStatus)}
                          onClick={handleButtonClick}
                          disabled={buttonConfig.disabled}
                          className={getButtonStyles(buttonConfig.variant)}
                        >
                          {buttonConfig.icon}
                          {buttonConfig.text}
                        </ButtonLoading>
                      )}

                    {/* Cancel button - only show for pending and confirmed orders */}
                    {(orderStatus === 'pending' ||
                      orderStatus === 'confirmed') && (
                      <ButtonLoading
                        isLoading={isPending}
                        loadingText="Cancelling..."
                        onClick={() => setShowCancelModal(true)}
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 text-white rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
                      >
                        <Icon icon="mdi:cancel" className="w-4 h-4" />
                        Cancel Order
                      </ButtonLoading>
                    )}

                    {/* Status indicator for completed/cancelled orders */}
                    {(orderStatus === 'delivered' ||
                      orderStatus === 'cancelled') && (
                      <div
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                          orderStatus === 'delivered'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {buttonConfig.icon}
                        {buttonConfig.text}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Modals */}
        <CompleteOrderModal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          onConfirm={handleCompleteOrder}
          isLoading={isPending}
          orderNumber={get(order, 'orderNumber', '')}
          customerName={get(order, 'customer.name', '')}
          totalAmount={get(order, 'totalAmount', 0)}
        />

        <PickupOrderModal
          isOpen={showPickupModal}
          onClose={() => setShowPickupModal(false)}
          onConfirm={handlePickupOrder}
          orderNumber={get(order, 'orderNumber', '')}
          isLoading={isPending}
        />

        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelOrder}
          isLoading={isPending}
          orderNumber={safeGet(order, 'orderNumber', '')}
        />
      </div>
    </ErrorBoundary>
  );
};

export default OrderDetails;
