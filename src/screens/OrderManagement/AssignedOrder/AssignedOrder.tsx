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
    orderStatus: "assigned",
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
      <Header text="Orders"></Header>
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
