import dayjs from "dayjs";
import { get, invoke, size } from "lodash";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useOrderCache,
} from "../../../server/api/orderHooks";
import {
  confirmedColumns,
  filterItems,
  FilterState,
  sortOptions,
} from "../Order/orderObj";
import { OrderActionButtons } from "../../../components/shared/OrderActionButtons";
import { CancelOrderModal } from "../../../components/shared/modals/CancelOrderModal";
import { CompleteOrderModal } from "../../../components/shared/modals/CompleteOrderModal";

const AssignedOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    status: "assigned",
  });
  const navigate = useNavigate();

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // API hooks
  const { mutate: updateOrder, isPending: isUpdating } =
    useUpdateOrderMutation();
  const { updateOrderInCache, invalidateOrderCache } = useOrderCache();

  const orderList = useMemo(
    () => (isSuccess ? orders : []),
    [isSuccess, orders]
  );

  const [filterState, setFilterState] = useState<FilterState>({
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
        orderStatus: newStatus,
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

  const filteredItems = useMemo(
    () =>
      filterItems(orderList as any, filterState).map((item) => ({
        ...item,
        id: item._id, // Map _id to id for MasterTable compatibility
        orderedProducts: size(item.orderedProducts),
        // Keep original orderStatus string for action buttons
        orderStatus: item.orderStatus,
        // Add separate field for display
        orderStatusDisplay: (
          <div className="px-2 py-1 text-xs text-white rounded-full bg-green">
            {item.orderStatus}
          </div>
        ),
        customer: get(item, "customer.name", "-"),
        createdAt: (
          <div className="text-center">
            {invoke(dayjs(item.createdAt), "format", "MMMM D, YYYY")}
            <br />
            {invoke(dayjs(item.createdAt), "format", "h:mm A")}
          </div>
        ),
      })),
    [orderList, filterState, handleOrderStatusUpdate, isUpdating]
  );

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort }));
  };
  return (
    <div className="container mx-auto px-4 py-3">
      <Header text="Assigned Orders" />

      {/* Status Indicator */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Assigned Orders
              </h3>
              <p className="text-sm text-yellow-600">
                Orders that have been assigned for delivery
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {filteredItems.length} orders
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mb-4 flex gap-2 text-sm">
        <button
          onClick={() => navigate("/order/orders")}
          className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
          ← Back to Order Management
        </button>
      </div>

      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          showAction
          filterSection={
            <SearchFilterSort onSort={handleSort} sortOptions={sortOptions} />
          }
          loading={isLoading}
          viewAction={(row) =>
            navigate(`/order/assigned-order-details/${row._id}`)
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
        customerName={selectedOrder?.customer?.name || ""}
        totalAmount={selectedOrder?.totalAmount || 0}
      />
    </div>
  );
};

export default AssignedOrder;
