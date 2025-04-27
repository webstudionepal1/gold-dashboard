// import type React from "react";
// import { useState } from "react";
// import { ColumnConfig, Table, TableData } from "../../components/shared/Table";
// import { SearchFilterSort } from "../../components/global/SearchFilterSort";

// interface Customer {
//   _id: string;
//   date: string;
//   categories: string;
//   inflow: string;
//   outflow: string;
//   balance: string;
// }

// const Cashflow: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [selectedSort, setSelectedSort] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const [customers, setCustomers] = useState<Customer[]>([
//     {
//       _id: "1",
//       date: "2021-09-01",
//       categories: "opening balance",
//       inflow: "Rs 120",
//       outflow: "Rs 120",
//       balance: "Rs 120",
//     },
//     {
//       _id: "2",
//       date: "2021-09-01",
//       categories: "opening balance",
//       inflow: "Rs 120",
//       outflow: "Rs 120",
//       balance: "Rs 120",
//     },
//     {
//       _id: "3",
//       date: "2021-09-01",
//       categories: "opening balance",
//       inflow: "Rs 120",
//       outflow: "Rs 120",
//       balance: "Rs 120",
//     },
//   ]);

//   const handleDeleteCustomer = (row: TableData<Customer>) => {
//     setCustomers((prev) => prev.filter((o) => o._id !== row._id));
//   };

//   const filterOptions = [
//     { value: "", label: "All Customers" },
//     { value: "active", label: "Active" },
//     { value: "inactive", label: "Inactive" },
//   ];

//   const sortOptions = [
//     { value: "", label: "Default" },
//     // These are just placeholders — doesn't apply to your current data
//     { value: "name-asc", label: "Name (A-Z)" },
//     { value: "name-desc", label: "Name (Z-A)" },
//     { value: "orders-high", label: "Orders (High)" },
//     { value: "orders-low", label: "Orders (Low)" },
//   ];

//   const filteredCustomers = customers.filter((customer) => {
//     const matchesSearch = customer.categories
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     return matchesSearch;
//   });

//   const sortedCustomers = [...filteredCustomers]; // Keeping as-is unless real sort fields are added

//   const columns: ColumnConfig<Customer>[] = [
//     { header: "Date", key: "date" },
//     { header: "Categories", key: "categories" },
//     { header: "In Flow (Rs)", key: "inflow" },
//     { header: "Out Flow (Rs)", key: "outflow" },
//     { header: "Balance", key: "balance" },
//   ];

//   const handleRowSelect = (selectedIds: string[]) => {
//     console.log("Selected rows:", selectedIds);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemsPerPageChange = (limit: number) => {
//     setItemsPerPage(limit);
//     setCurrentPage(1);
//   };

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleFilter = (filter: string) => {
//     setSelectedFilter(filter);
//     setCurrentPage(1);
//   };

//   const handleSort = (sort: string) => {
//     setSelectedSort(sort);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Cash Flow</h1>
//       </div>

//       <div className="bg-white p-4">
//         <SearchFilterSort
//           onSearch={handleSearch}
//           onFilter={handleFilter}
//           onSort={handleSort}
//           filterOptions={filterOptions}
//           sortOptions={sortOptions}
//           placeholder="Search here..."
//         />

//         <div className="bg-white rounded-lg shadow">
//           <Table
//             columns={columns}
//             data={sortedCustomers}
//             showSelectAll={true}
//             onRowSelect={handleRowSelect}
//             // onToggle={handleToggleStatus} // ❌ Removed since it doesn't exist now
//             deleteRow={handleDeleteCustomer}
//             showPagination={true}
//             paginationDetails={{
//               currentPage,
//               limit: itemsPerPage,
//               totalCount: filteredCustomers.length,
//             }}
//             onItemsPerPageChange={handleItemsPerPageChange}
//             onPageChange={handlePageChange}
//             showBg={true}
//             showAction={true}
//             showEdit={true}
//             showDelete={true}
//             showView={true}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cashflow;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import MasterTable from "../../components/shared/MasterTable";
import Header from "../../components/shared/table_heading/Header";
import { FrontendRoutes } from "../../routes/routes";
import { IFetchOrder, useGetAllOrdersQuery } from "../../server/api/orderHooks";
import { cashFlowColumns } from "./components/CashObj";
import dayjs from "dayjs";
import { get } from "lodash";

// Filter state interface
interface FilterState {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  filter: string;
  sort: string;
}

// Dynamic config for IFetchOrder

const Cashflow = () => {
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

  // Consolidated filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    currentPage: 1,
    itemsPerPage: 10,
    filter: "",
    sort: "",
  });

  const navigate = useNavigate();

  const filterOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Customer Name (A-Z)" },
    { value: "name-desc", label: "Customer Name (Z-A)" },
    { value: "date-newest", label: "Newest First" },
    { value: "date-oldest", label: "Oldest First" },
    { value: "amount-high", label: "Amount (High to Low)" },
    { value: "amount-low", label: "Amount (Low to High)" },
  ];

  const filterItems = (items: IFetchOrder[]) => {
    if (!items || items.length === 0) return [];

    let filteredItems = [...items];

    // Apply search filter
    if (filterState.searchQuery) {
      filteredItems = filteredItems.filter((item) => {
        const customerName = item.customer?.name?.toLowerCase() || "";
        const orderId = item._id?.toLowerCase() || "";
        const email = item.customer?.email?.toLowerCase() || "";

        return (
          customerName.includes(filterState.searchQuery.toLowerCase()) ||
          orderId.includes(filterState.searchQuery.toLowerCase()) ||
          email.includes(filterState.searchQuery.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (filterState.filter) {
      filteredItems = filteredItems.filter((item) => {
        return (
          item.orderStatus.toLowerCase() === filterState.filter.toLowerCase()
        );
      });
    }

    // Apply sorting
    if (filterState.sort) {
      filteredItems = [...filteredItems].sort((a, b) => {
        switch (filterState.sort) {
          case "name-asc":
            return (a.customer?.name || "").localeCompare(
              b.customer?.name || ""
            );
          case "name-desc":
            return (b.customer?.name || "").localeCompare(
              a.customer?.name || ""
            );
          case "date-newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "date-oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "amount-high":
            return b.totalAmount - a.totalAmount;
          case "amount-low":
            return a.totalAmount - b.totalAmount;
          default:
            return 0;
        }
      });
    }

    return filteredItems;
  };

  // Get filtered items
  const filteredItems = useMemo(
    () =>
      filterItems(orderList).map((item) => ({
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

  // Calculate pagination

  const handleViewItem = (item: IFetchOrder) => {
    navigate(`${FrontendRoutes.ORDERDETAILS}/${item._id}`);
  };

  // Updated handlers using the setter function

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filter, currentPage: 1 }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort, currentPage: 1 }));
  };

  const dummyData = [
    {
      date: "2025-04-20",
      category: "Salary",
      inFlow: 50000,
      outFlow: 0,
      balance: 50000,
    },
    {
      date: "2025-04-21",
      category: "Groceries",
      inFlow: 0,
      outFlow: 5000,
      balance: 45000,
    },
    {
      date: "2025-04-22",
      category: "Investment Return",
      inFlow: 10000,
      outFlow: 0,
      balance: 55000,
    },
    {
      date: "2025-04-23",
      category: "Dining Out",
      inFlow: 0,
      outFlow: 2000,
      balance: 53000,
    },
    {
      date: "2025-04-24",
      category: "Online Shopping",
      inFlow: 0,
      outFlow: 7000,
      balance: 46000,
    },
  ];

  return (
    <div className="container px-4 py-3 mx-auto">
      <Header text="Cash Flow"></Header>
      <div className="bg-white border-[#eae9ec] border-2 w-full pb-8 rounded-xl">
        <div className="mx-3">
          <MasterTable
            showAction
            filterSection={
              <SearchFilterSort
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                filterOptions={filterOptions}
                sortOptions={sortOptions}
                placeholder="Search by customer name, ID or email..."
              />
            }
            viewAction={(row) => navigate(`/order/order-details/${row._id}`)}
            editAction={() => console.log("edit")}
            onDelete={(id) => console.log("delete")}
            rows={filteredItems}
            columns={cashFlowColumns}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Cashflow;
