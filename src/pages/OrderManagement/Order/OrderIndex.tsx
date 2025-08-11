import dayjs from 'dayjs';
import { groupBy, size } from 'lodash';
import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilterSort } from '../../../components/global/SearchFilterSort';
import MasterTable from '../../../components/shared/MasterTable';
import Header from '../../../components/shared/table_heading/Header';
import ErrorBoundary from '../../../components/shared/ErrorBoundary';
import {
  TableLoading,
  EmptyState,
} from '../../../components/shared/LoadingStates';
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useOrderCache,
} from '../../../server/api/orderHooks';
import {
  filterItems,
  FilterState,
  orderIndexColumns,
  sortOptions,
  getStatusColor,
  getStatusIcon,
} from './orderObj';
import {
  extractOrderData,
  formatCurrency,
  validateOrderData,
} from '../../../utils/dataHelpers';
import { OrderActionButtons } from '../../../components/shared/OrderActionButtons';
import { CancelOrderModal } from '../../../components/shared/modals/CancelOrderModal';
import { CompleteOrderModal } from '../../../components/shared/modals/CompleteOrderModal';
import { PickupOrderModal } from '../../../components/shared/modals/PickupOrderModal';
import type { Order, OrderStatus } from '../../../types/order';

// Tab configuration
const orderTabs = [
  {
    key: 'pending',
    label: 'Pending Orders',
    color: 'bg-gray-100 text-gray-800',
  },
  {
    key: 'confirmed',
    label: 'Confirmed Orders',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    key: 'assigned',
    label: 'Assigned Orders',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    key: 'picked_up',
    label: 'Pickup Orders',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    key: 'delivered',
    label: 'Delivered Orders',
    color: 'bg-green-100 text-green-800',
  },
  {
    key: 'cancelled',
    label: 'Cancelled Orders',
    color: 'bg-red-100 text-red-800',
  },
];

const OrderIndex = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('pending');

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // API hooks
  const { mutate: updateOrder, isPending: isUpdating } =
    useUpdateOrderMutation();
  const { updateOrderInCache, invalidateOrderCache } = useOrderCache();

  // Fetch all orders at once for better performance
  const {
    data: allOrders,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersQuery({});

  // Group orders by status for efficient counting and filtering
  const ordersByStatus = useMemo(() => {
    if (!allOrders) return {};
    return groupBy(allOrders, 'orderStatus');
  }, [allOrders]);

  // Get orders for current tab
  const currentTabOrders = useMemo(() => {
    return ordersByStatus[activeTab] || [];
  }, [ordersByStatus, activeTab]);

  // Create tabs with counts using grouped data
  const tabsWithCounts = useMemo(
    () =>
      orderTabs.map((tab) => ({
        ...tab,
        count: size(ordersByStatus[tab.key]) || 0,
      })),
    [ordersByStatus]
  );

  // Consolidated filter state (removed filter since we use tabs)
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    filter: '', // Not used with tabs
    sort: '',
  });

  const navigate = useNavigate();

  // Handle order status update with optimistic updates
  const handleOrderStatusUpdate = useCallback(
    (orderId: string, newStatus: string) => {
      const order = allOrders?.find((o) => o._id === orderId);
      if (!order) return;

      // Optimistic update
      updateOrderInCache(orderId, {
        orderStatus: newStatus as OrderStatus,
        updatedAt: new Date().toISOString(),
      });

      updateOrder(
        {
          id: orderId,
          body: { orderStatus: newStatus },
        },
        {
          onError: () => {
            // Revert optimistic update on error
            updateOrderInCache(orderId, { orderStatus: order.orderStatus });
            invalidateOrderCache(orderId);
          },
        }
      );
    },
    [allOrders, updateOrder, updateOrderInCache, invalidateOrderCache]
  );

  // Handle order cancellation
  const handleCancelOrder = useCallback(
    (reason: string) => {
      if (!selectedOrder) return;

      const cancellationData = {
        orderStatus: 'cancelled' as const,
        cancellation: {
          reason,
          date: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
      updateOrderInCache(selectedOrder._id, cancellationData);

      updateOrder(
        {
          id: selectedOrder._id,
          body: cancellationData,
        },
        {
          onError: () => {
            // Revert optimistic update on error
            updateOrderInCache(selectedOrder._id, {
              orderStatus: selectedOrder.orderStatus,
            });
            invalidateOrderCache(selectedOrder._id);
          },
        }
      );

      setShowCancelModal(false);
      setSelectedOrder(null);
    },
    [selectedOrder, updateOrder, updateOrderInCache, invalidateOrderCache]
  );

  // Handle order pickup
  const handlePickupOrder = useCallback(
    (pickupDetails: {
      pickedUpBy?: string;
      location?: string;
      notes?: string;
    }) => {
      if (!selectedOrder) return;

      const pickupData = {
        orderStatus: 'picked_up' as const,
        pickup: {
          date: new Date().toISOString(),
          pickedUpBy: pickupDetails.pickedUpBy,
          location: pickupDetails.location,
          notes: pickupDetails.notes,
          confirmedBy: 'Admin',
        },
        orderTimeline: {
          ...selectedOrder.orderTimeline,
          pickUp: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
      updateOrderInCache(selectedOrder._id, pickupData);

      updateOrder(
        {
          id: selectedOrder._id,
          body: pickupData,
        },
        {
          onError: () => {
            // Revert optimistic update on error
            updateOrderInCache(selectedOrder._id, {
              orderStatus: selectedOrder.orderStatus,
            });
            invalidateOrderCache(selectedOrder._id);
          },
        }
      );

      setShowPickupModal(false);
      setSelectedOrder(null);
    },
    [selectedOrder, updateOrder, updateOrderInCache, invalidateOrderCache]
  );

  // Handle order completion
  const handleCompleteOrder = useCallback(
    (notes?: string) => {
      if (!selectedOrder) return;

      const completionData = {
        orderStatus: 'delivered' as const,
        deliveryCompletion: {
          date: new Date().toISOString(),
          notes: notes || undefined,
        },
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update
      updateOrderInCache(selectedOrder._id, completionData);

      updateOrder(
        {
          id: selectedOrder._id,
          body: completionData,
        },
        {
          onError: () => {
            // Revert optimistic update on error
            updateOrderInCache(selectedOrder._id, {
              orderStatus: selectedOrder.orderStatus,
            });
            invalidateOrderCache(selectedOrder._id);
          },
        }
      );

      setShowCompleteModal(false);
      setSelectedOrder(null);
    },
    [selectedOrder, updateOrder, updateOrderInCache, invalidateOrderCache]
  );

  // Handle search and sort with useCallback for performance
  const handleSearch = useCallback((query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const handleSort = useCallback((sort: string) => {
    setFilterState((prev) => ({ ...prev, sort }));
  }, []);

  // Get filtered items with improved data safety and styling
  const filteredItems = useMemo(
    () =>
      filterItems(currentTabOrders as any, filterState)
        .filter((item) => {
          const validation = validateOrderData(item);
          if (!validation.isValid) {
            console.warn('Invalid order data:', validation.errors, item);
          }
          return validation.isValid;
        })
        .map((item) => {
          const orderData = extractOrderData(item);
          return {
            ...item,
            id: orderData.id, // Map _id to id for MasterTable compatibility
            orderedProducts: orderData.orderedProducts.length,
            // Keep original orderStatus string for action buttons
            orderStatus: orderData.orderStatus,
            // Add separate field for display
            orderStatusDisplay: (
              <div
                className={`px-1 py-1 text-xs font-medium rounded-full w-[60%] flex items-center gap-1 ${getStatusColor(
                  orderData.orderStatus
                )}`}
              >
                <span>{getStatusIcon(orderData.orderStatus)}</span>
                <span className="capitalize">{orderData.orderStatus}</span>
              </div>
            ),
            customer: orderData.customerName,
            totalAmount: formatCurrency(orderData.totalAmount),
            createdAt: (
              <div className="text-center">
                {dayjs(orderData.createdAt).format('MMMM D, YYYY')}
                <br />
                {dayjs(orderData.createdAt).format('h:mm A')}
              </div>
            ),
          };
        }),
    [currentTabOrders, filterState]
  );

  // Get the current tab configuration
  const currentTab = orderTabs.find((tab) => tab.key === activeTab);
  const getDetailRoute = (orderId: string) => {
    // All order details now use the same route regardless of status
    return `/order/order-details/${orderId}`;
  };

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-xl font-medium">Error loading orders</h2>
        <p className="text-gray-600">
          {error?.message || 'Please check your connection and try again'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white rounded-lg bg-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Fixed Header and Tabs */}
        <div className="flex-shrink-0 bg-white">
          <div className="container mx-auto px-4 py-3">
            <Header text="Order Management" />
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <div className="tab-scroll">
                  <nav
                    className="-mb-px flex space-x-8 min-w-max"
                    aria-label="Tabs"
                  >
                    {tabsWithCounts.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 flex-shrink-0 ${
                          activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activeTab === tab.key
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto px-4 h-full">
            <div className="h-full overflow-y-auto">
              <div className="p-4 bg-white border-2 rounded-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentTab?.label || 'Orders'}
                  </h2>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${currentTab?.color}`}
                  >
                    {filteredItems.length} orders
                  </div>
                </div>

                {isLoading ? (
                  <TableLoading rows={5} columns={5} />
                ) : filteredItems.length === 0 ? (
                  <EmptyState
                    icon="mdi:package-variant"
                    title={`No ${activeTab} orders found`}
                    description={
                      filterState.searchQuery
                        ? `No orders match your search "${filterState.searchQuery}"`
                        : `There are no ${activeTab} orders at the moment.`
                    }
                    action={
                      filterState.searchQuery ? (
                        <button
                          onClick={() => handleSearch('')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Clear Search
                        </button>
                      ) : null
                    }
                  />
                ) : (
                  <MasterTable
                    filterSection={
                      <SearchFilterSort
                        onSearch={handleSearch}
                        onSort={handleSort}
                        sortOptions={sortOptions}
                        placeholder="Search orders..."
                      />
                    }
                    showAction={true}
                    viewAction={(row) => navigate(getDetailRoute(row._id))}
                    customActions={(row) => (
                      <OrderActionButtons
                        order={row}
                        onStatusUpdate={handleOrderStatusUpdate}
                        onCancel={(_orderId) => {
                          setSelectedOrder(row);
                          setShowCancelModal(true);
                        }}
                        onPickup={(_orderId) => {
                          setSelectedOrder(row);
                          setShowPickupModal(true);
                        }}
                        onComplete={(_orderId) => {
                          setSelectedOrder(row);
                          setShowCompleteModal(true);
                        }}
                        isLoading={isUpdating}
                        compact={true}
                      />
                    )}
                    rows={filteredItems}
                    columns={orderIndexColumns}
                    loading={isLoading}
                    emptyStateMessage={`No ${activeTab} orders found`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleCancelOrder}
        isLoading={isUpdating}
        orderNumber={
          selectedOrder?.orderNumber || selectedOrder?._id?.slice(-5) || ''
        }
      />

      <PickupOrderModal
        isOpen={showPickupModal}
        onClose={() => {
          setShowPickupModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={handlePickupOrder}
        isLoading={isUpdating}
        orderNumber={
          selectedOrder?.orderNumber || selectedOrder?._id?.slice(-5) || ''
        }
      />

      <CompleteOrderModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={handleCompleteOrder}
        isLoading={isUpdating}
        orderNumber={
          selectedOrder?.orderNumber || selectedOrder?._id?.slice(-5) || ''
        }
        customerName={selectedOrder?.customer?.name || ''}
        totalAmount={selectedOrder?.totalAmount || 0}
      />
    </ErrorBoundary>
  );
};

export default OrderIndex;
