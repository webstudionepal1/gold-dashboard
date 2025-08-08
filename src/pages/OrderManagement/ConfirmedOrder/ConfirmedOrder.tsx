import dayjs from "dayjs";
import { get, invoke, map, size } from "lodash";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useOrderCache,
} from "../../../server/api/orderHooks";
import {
  confirmedColumns,
  getStatusColor,
  getStatusIcon,
} from "../Order/orderObj";
import { OrderActionButtons } from "../../../components/shared/OrderActionButtons";
import { CancelOrderModal } from "../../../components/shared/modals/CancelOrderModal";
import { CompleteOrderModal } from "../../../components/shared/modals/CompleteOrderModal";

// Filter state interface
interface FilterState {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  filter: string;
  sort: string;
}

const ConfirmedOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    status: "confirmed",
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

  const orderList = useMemo(
    () =>
      isSuccess
        ? map(orders, (item) => ({
            ...item,
            orderedProducts: size(item.orderedProducts),
            orderStatus: (
              <div
                className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(
                  item.orderStatus
                )}`}>
                <span>{getStatusIcon(item.orderStatus)}</span>
                <span className="capitalize">{item.orderStatus}</span>
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
          }))
        : [],
    [isSuccess, orders, handleOrderStatusUpdate, isUpdating]
  );

  // // Consolidated filter state
  // const [filterState, setFilterState] = useState<FilterState>({
  //   searchQuery: "",
  //   currentPage: 1,
  //   itemsPerPage: 10,
  //   filter: "",
  //   sort: "",
  // });

  // const navigate = useNavigate();

  // const filterOptions = [
  //   { value: "", label: "All Orders" },
  //   { value: "pending", label: "Pending" },
  //   { value: "completed", label: "Completed" },
  //   { value: "delivered", label: "Delivered" },
  //   { value: "cancelled", label: "Cancelled" },
  // ];

  // const sortOptions = [
  //   { value: "", label: "Default" },
  //   { value: "name-asc", label: "Customer Name (A-Z)" },
  //   { value: "name-desc", label: "Customer Name (Z-A)" },
  //   { value: "date-newest", label: "Newest First" },
  //   { value: "date-oldest", label: "Oldest First" },
  //   { value: "amount-high", label: "Amount (High to Low)" },
  //   { value: "amount-low", label: "Amount (Low to High)" },
  // ];

  // const filterItems = (items: IFetchOrder[]) => {
  //   if (!items || items.length === 0) return [];

  //   let filteredItems = [...items];

  //   // Apply search filter
  //   if (filterState.searchQuery) {
  //     filteredItems = filteredItems.filter((item) => {
  //       const customerName = item.customer?.name?.toLowerCase() || "";
  //       const orderId = item._id?.toLowerCase() || "";
  //       const email = item.customer?.email?.toLowerCase() || "";

  //       return (
  //         customerName.includes(filterState.searchQuery.toLowerCase()) ||
  //         orderId.includes(filterState.searchQuery.toLowerCase()) ||
  //         email.includes(filterState.searchQuery.toLowerCase())
  //       );
  //     });
  //   }

  //   // Apply status filter
  //   if (filterState.filter) {
  //     filteredItems = filteredItems.filter((item) => {
  //       return (
  //         item.orderStatus.toLowerCase() === filterState.filter.toLowerCase()
  //       );
  //     });
  //   }

  //   // Apply sorting
  //   if (filterState.sort) {
  //     filteredItems = [...filteredItems].sort((a, b) => {
  //       switch (filterState.sort) {
  //         case "name-asc":
  //           return (a.customer?.name || "").localeCompare(
  //             b.customer?.name || ""
  //           );
  //         case "name-desc":
  //           return (b.customer?.name || "").localeCompare(
  //             a.customer?.name || ""
  //           );
  //         case "date-newest":
  //           return (
  //             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //           );
  //         case "date-oldest":
  //           return (
  //             new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //           );
  //         case "amount-high":
  //           return b.totalAmount - a.totalAmount;
  //         case "amount-low":
  //           return a.totalAmount - b.totalAmount;
  //         default:
  //           return 0;
  //       }
  //     });
  //   }

  //   return filteredItems;
  // };

  // // Get filtered items
  // const filteredItems = useMemo(
  //   () => filterItems(orderList),
  //   [orderList, filterState]
  // );

  // // Calculate pagination
  // const paginatedItems = useMemo(() => {
  //   if (!filteredItems.length) return [];

  //   const startIndex = (filterState.currentPage - 1) * filterState.itemsPerPage;
  //   return filteredItems.slice(
  //     startIndex,
  //     startIndex + filterState.itemsPerPage
  //   );
  // }, [filteredItems, filterState.currentPage, filterState.itemsPerPage]);

  // const handleViewItem = (item: IFetchOrder) => {
  //   navigate(`/order/confirmed-order-details/${item._id}`);
  // };

  // // Updated handlers using the setter function
  // const handlePageChange = (page: number) => {
  //   setFilterState((prev) => ({ ...prev, currentPage: page }));
  // };

  // const handleItemsPerPageChange = (limit: number) => {
  //   setFilterState((prev) => ({
  //     ...prev,
  //     itemsPerPage: limit,
  //     currentPage: 1,
  //   }));
  // };

  // const handleSearch = (query: string) => {
  //   setFilterState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  // };

  // const handleFilter = (filter: string) => {
  //   setFilterState((prev) => ({ ...prev, filter, currentPage: 1 }));
  // };

  // const handleSort = (sort: string) => {
  //   setFilterState((prev) => ({ ...prev, sort, currentPage: 1 }));
  // };

  return (
    <div className="container mx-auto px-4 py-3">
      <Header text="Confirmed Orders" />

      {/* Status Indicator */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                Confirmed Orders
              </h3>
              <p className="text-sm text-blue-600">
                Orders confirmed and ready for delivery assignment
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {orderList.length} orders
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
          loading={isLoading}
          viewAction={(row) =>
            navigate(`/order/confirmed-order-details/${row._id}`)
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
          rows={orderList}
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

export default ConfirmedOrder;
