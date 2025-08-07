import dayjs from "dayjs";
import { get, invoke, size } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import {
  confirmedColumns,
  filterItems,
  FilterState,
  sortOptions,
} from "../Order/orderObj";

const AssignedOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    status: "assigned",
  });
  const navigate = useNavigate();
  const orderList = useMemo(
    () => (isSuccess ? orders : []),
    [isSuccess, orders]
  );

  const [filterState, setFilterState] = useState<FilterState>({
    filter: "",
    sort: "",
  });

  const filteredItems = useMemo(
    () =>
      filterItems(orderList as any, filterState).map((item) => ({
        ...item,
        id: item._id, // Map _id to id for MasterTable compatibility
        orderedProducts: size(item.orderedProducts),
        orderStatus: (
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
    [orderList, filterState]
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
          columns={confirmedColumns}
          rows={filteredItems}
        />
      </div>
    </div>
  );
};

export default AssignedOrder;
