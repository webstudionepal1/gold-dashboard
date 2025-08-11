import dayjs from "dayjs";
import capitalize from "lodash/capitalize";
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import size from 'lodash/size';
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import {
  deliveredColumns,
  filterItems,
  FilterState,
  sortOptions
} from "../Order/orderObj";

// Filter state interface

const CompletedOrder = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({
    orderStatus: "delivered",
  });
  const navigate = useNavigate();

  const orderList = useMemo(
    () => (isSuccess && orders ? orders : []),
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
            {capitalize(item.orderStatus)}
          </div>
        ),
        deliveryDate: dayjs(item.updatedAt).format("MMM D, YYYY"),
        customer: get(item, "customer.name", "-"),
        createdAt: (
          <div className="text-center">
            {invoke(dayjs(item.createdAt), "format", "MMM D, YYYY")}
            <br />
            {invoke(dayjs(item.createdAt), "format", "h:mm a")}
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
          showAction
          loading={isLoading}
          filterSection={
            <SearchFilterSort onSort={handleSort} sortOptions={sortOptions} />
          }
          viewAction={(row) =>
            navigate(`/order/completed-order-details/${row._id}`)
          }
          columns={deliveredColumns}
          rows={filteredItems}
        />
      </div>
    </div>
  );
};

export default CompletedOrder;
