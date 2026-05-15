import dayjs from "dayjs";
import { get } from "lodash";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
import {
  filterItems,
  filterOptions,
  FilterState,
  orderIndexColumns,
  sortOptions,
} from "./orderObj";

const OrderIndex = () => {
  const {
    data: orders,
    isSuccess,
    isLoading,
  } = useGetAllOrdersQuery({});

  const orderList = useMemo(
    () => (isSuccess ? orders : []),
    [isSuccess, orders]
  );

  // Consolidated filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    filter: "",
    sort: "",
  });

  const navigate = useNavigate();

  // Handle search, filter, and sort
  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filter }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort }));
  };

  // Get filtered items
  const filteredItems = useMemo(
    () =>
      filterItems(orderList, filterState).map((item) => ({
        ...item,
        orderedProducts: get(item, "orderedProducts.length", 0),
        orderStatus: (
          <div className="px-2 py-1 text-xs text-white rounded-full bg-green dark-green">
            {get(item, "orderStatus", "")}
          </div>
        ),
        customer: get(item, "customer.name", "-"),
        createdAt: (
          <div className="text-center">
            {dayjs(get(item, "createdAt", "")).format("MMMM D, YYYY")}
            <br />
            {dayjs(get(item, "createdAt", "")).format("h:mm A")}
          </div>
        ),
      })),
    [orderList, filterState]
  );

  return (
    <div>
      <Header text="Orders" />
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          filterSection={
            <SearchFilterSort
              onSearch={handleSearch}
              onFilter={handleFilter}
              onSort={handleSort}
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              placeholder="Search orders..."
            />
          }
          showAction
          viewAction={(row) => navigate(`/order/order-details/${row._id}`)}
          rows={filteredItems}
          columns={orderIndexColumns}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default OrderIndex;
