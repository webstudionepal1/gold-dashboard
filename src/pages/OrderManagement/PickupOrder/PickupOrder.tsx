import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { get, size } from "lodash";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useOrderCache,
} from "../../../server/api/orderHooks";
import {
  extractOrderData,
  formatCurrency,
  validateOrderData,
} from "../../../utils/dataHelpers";
import {
  confirmedColumns,
  filterItems,
  FilterState,
  sortOptions,
} from "../Order/orderObj";
import { OrderActionButtons } from "../../../components/shared/OrderActionButtons";
import { CancelOrderModal } from "../../../components/shared/modals/CancelOrderModal";
import { CompleteOrderModal } from "../../../components/shared/modals/CompleteOrderModal";
import type { OrderStatus } from "../../../types/order";

const PickupOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    status: "picked_up",
  });

  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrderMutation();
  const { updateOrderInCache, invalidateOrderCache } = useOrderCache();

  const navigate = useNavigate();

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filter: "",
    sort: "",
  });

  // Handle order status update with optimistic updates
  const handleOrderStatusUpdate = useCallback(
    (orderId: string, newStatus: string) => {
      const order = orders?.find((o) => o._id === orderId);
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
    [orders, updateOrder, updateOrderInCache, invalidateOrderCache]
  );

  // Handle order cancellation
  const handleCancelOrder = useCallback(
    (reason: string) => {
      if (!selectedOrder) return;

      const cancellationData = {
        orderStatus: "cancelled" as const,
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

  // Handle order completion
  const handleCompleteOrder = useCallback(
    (notes?: string) => {
      if (!selectedOrder) return;

      const completionData = {
        orderStatus: "delivered" as const,
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

  // Handle sort
  const handleSort = (sortValue: string) => {
    setFilterState((prev) => ({ ...prev, sort: sortValue }));
  };

  // Process and filter orders
  const processedOrders = useMemo(() => {
    if (!orders) return [];

    return orders
      .map((order) => {
        const orderData = extractOrderData(order);
        if (!validateOrderData(orderData)) return null;

        return {
          ...order,
          customer: orderData.customerName,
          totalAmount: formatCurrency(orderData.totalAmount),
          createdAt: (
            <div className="text-center">
              {dayjs(orderData.createdAt).format("MMMM D, YYYY")}
              <br />
              {dayjs(orderData.createdAt).format("h:mm A")}
            </div>
          ),
          orderStatusDisplay: (
            <div
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-200`}>
              <span>🚛</span>
              <span className="capitalize">Picked Up</span>
            </div>
          ),
          orderedProducts: size(orderData.orderedProducts),
        };
      })
      .filter(Boolean);
  }, [orders]);

  // Apply filters and sorting
  const filteredItems = useMemo(() => {
    if (!processedOrders.length) return [];
    return filterItems(processedOrders as any, filterState);
  }, [processedOrders, filterState]);

  return (
    <div className="container px-4 py-3 mx-auto">
      <Header text="Pickup Orders" />

      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          showAction
          loading={isLoading}
          viewAction={(row) =>
            navigate(`/order/pickup-order-details/${row._id}`)
          }
          customActions={(row) => (
            <OrderActionButtons
              order={row}
              onStatusUpdate={handleOrderStatusUpdate}
              onCancel={(orderId) => {
                setSelectedOrder(row);
                setShowCancelModal(true);
              }}
              onComplete={(orderId) => {
                setSelectedOrder(row);
                setShowCompleteModal(true);
              }}
              isLoading={isUpdating}
              compact={true}
            />
          )}
          columns={confirmedColumns}
          rows={filteredItems}
        />
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
          selectedOrder?.orderNumber || selectedOrder?._id?.slice(-5) || ""
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
          selectedOrder?.orderNumber || selectedOrder?._id?.slice(-5) || ""
        }
        customerName={get(selectedOrder, "customer.name", "")}
        totalAmount={get(selectedOrder, "totalAmount", 0)}
      />
    </div>
  );
};

export default PickupOrder;
