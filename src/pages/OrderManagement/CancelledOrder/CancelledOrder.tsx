import dayjs from "dayjs";
import { get, invoke, map, size } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import {
  confirmedColumns,
  filterItems,
  FilterState,
  sortOptions,
} from "../Order/orderObj";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";

// Filter state interface

const CancelledOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    orderStatus: "cancelled",
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
      filterItems(orderList, filterState).map((item) => ({
        ...item,
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
    <div>
      <Header text="Orders" />
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          filterSection={
            <SearchFilterSort onSort={handleSort} sortOptions={sortOptions} />
          }
          showAction
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

export default CancelledOrder;
