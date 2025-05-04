// import dayjs from "dayjs";
// import { get } from "lodash";
// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
// import MasterTable from "../../../components/shared/MasterTable";
// import Header from "../../../components/shared/table_heading/Header";
// import { useGetAllOrdersQuery } from "../../../server/api/orderHooks";
// import {
//   filterItems,
//   filterOptions,
//   FilterState,
//   orderIndexColumns,
//   sortOptions,
// } from "./orderObj";

// // Filter state interface

// // Dynamic config for IFetchOrder

// const OrderIndex = () => {
//   const {
//     data: orders,
//     isSuccess,
//     isLoading,
//   } = useGetAllOrdersQuery({
//     orderStatus: "pending",
//   });

//   const orderList = useMemo(
//     () => (isSuccess ? orders : []),
//     [isSuccess, orders]
//   );

//   // Consolidated filter state
//   const [filterState, setFilterState] = useState<FilterState>({
//     filter: "",
//     sort: "",
//   });

//   const navigate = useNavigate();

//   // Get filtered items
//   const filteredItems = useMemo(
//     () =>
//       filterItems(orderList, filterState).map((item) => ({
//         ...item,
//         orderedProducts: get(item, "orderedProducts.length", 0),
//         orderStatus: (
//           <div className="px-2 py-1 text-xs text-white rounded-full bg-green dark-green">
//             {get(item, "orderStatus", "")}
//           </div>
//         ),
//         customer: get(item, "customer.name", "-"),
//         createdAt: (
//           <div className="text-center">
//             {dayjs(get(item, "createdAt", "")).format("MMMM D, YYYY")}
//             <br />
//             {dayjs(get(item, "createdAt", "")).format("h:mm A")}
//           </div>
//         ),
//       })),
//     [orderList, filterState]
//   );

//   const handleFilter = (filter: string) => {
//     setFilterState((prev) => ({ ...prev, filter }));
//   };

//   const handleSort = (sort: string) => {
//     setFilterState((prev) => ({ ...prev, sort }));
//   };

//   return (
//     <div>
//       <Header text="Orders" />
//       <div className="p-4 bg-white border-2 rounded-lg">
//         <MasterTable
//           filterSection={
//             <SearchFilterSort
//               onFilter={(value) => console.log("Filtered:", value)}
//               onSort={(value) => console.log("Sorted:", value)}
//               sortOptions={[{ value: "price-asc", label: "Price Low to High" }]}
//               renderFilterModalContent={(close, apply) => (
//                 <div className="p-4 w-80">
//                   <h2 className="mb-4 text-lg font-semibold">Filter Options</h2>
//                   <button onClick={() => apply("example-filter")}>
//                     Apply Filter
//                   </button>
//                   <button onClick={close} className="mt-2">
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             />
//           }
//           showAction
//           viewAction={(row) => navigate(`/order/order-details/${row._id}`)}
//           rows={filteredItems}
//           columns={orderIndexColumns}
//           loading={isLoading}
//         />
//       </div>
//     </div>
//   );
// };

// export default OrderIndex;

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
  } = useGetAllOrdersQuery({
    orderStatus: "pending",
  });

  const orderList = useMemo(
    () => (isSuccess ? orders : []),
    [isSuccess, orders]
  );

  const [filterState, setFilterState] = useState<FilterState>({
    filter: "",
    sort: "",
    orderStatus: "",
  });

  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return filterItems(orderList, filterState).map((item) => ({
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
    }));
  }, [orderList, filterState]);

  const handleFilter = (value: string) => {
    setFilterState((prev) => ({ ...prev, filter: value }));
  };

  const handleSort = (value: string) => {
    setFilterState((prev) => ({ ...prev, sort: value }));
  };

  return (
    <div>
      <Header text="Orders" />
      <div className="p-4 bg-white border-2 rounded-lg">
        <MasterTable
          filterSection={
            <SearchFilterSort
              onFilter={handleFilter}
              onSort={handleSort}
              sortOptions={sortOptions}
              renderFilterModalContent={(close, apply) => {
                return (
                  <div className="p-4 w-80 space-y-4">
                    <h2 className="text-lg font-semibold">Filter Options</h2>

                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Order Status
                      </label>
                      <select
                        className="w-full px-2 py-1 border rounded"
                        value={filterState.filter}
                        onChange={(e) =>
                          setFilterState((prev) => ({
                            ...prev,
                            filter: e.target.value,
                          }))
                        }
                      >
                        {filterOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* You can extend this with date range or customer name later */}

                    <div className="flex justify-end space-x-2 pt-4">
                      <button
                        onClick={() => {
                          apply(filterState.filter);
                          close();
                        }}
                        className="px-4 py-1 text-white bg-[#d3932a] rounded"
                      >
                        Apply
                      </button>
                      <button
                        onClick={close}
                        className="px-4 py-1 bg-gray-200 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }}
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
