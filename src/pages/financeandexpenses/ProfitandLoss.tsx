// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { SearchFilterSort } from "../../components/global/SearchFilterSort";
// import MasterTable from "../../components/shared/MasterTable";
// import Header from "../../components/shared/table_heading/Header";
// import { FrontendRoutes } from "../../routes/routes";
// import { IFetchOrder, useGetAllOrdersQuery } from "../../server/api/orderHooks";
// import { cashFlowColumns } from "./components/CashObj";
// import dayjs from "dayjs";
// import { get } from "lodash";
// import ToggleSlider from "../../components/shared/form_components/ToggleSlider";
// import ProfitTable from "./components/ProfitTable";

// // Filter state interface
// interface FilterState {
//   searchQuery: string;
//   currentPage: number;
//   itemsPerPage: number;
//   filter: string;
//   sort: string;
// }

// // Dynamic config for IFetchOrder

// const ProfitandLoss = () => {
//   const {
//     data: orders,
//     isSuccess,
//     isLoading,
//   } = useGetAllOrdersQuery({
//     orderStatus: "pending",
//   });

//   const [showSecondTable, setShowSecondTable] = useState(false);

//   const handleToggle = () => {
//     setShowSecondTable((prev) => !prev);
//   };

//   const orderList = useMemo(
//     () => (isSuccess ? orders : []),
//     [isSuccess, orders]
//   );

//   // Consolidated filter state
//   const [filterState, setFilterState] = useState<FilterState>({
//     searchQuery: "",
//     currentPage: 1,
//     itemsPerPage: 10,
//     filter: "",
//     sort: "",
//   });

//   const navigate = useNavigate();

//   const filterOptions = [
//     { value: "", label: "All Orders" },
//     { value: "pending", label: "Pending" },
//     { value: "completed", label: "Completed" },
//     { value: "delivered", label: "Delivered" },
//     { value: "cancelled", label: "Cancelled" },
//   ];

//   const sortOptions = [
//     { value: "", label: "Default" },
//     { value: "name-asc", label: "Customer Name (A-Z)" },
//     { value: "name-desc", label: "Customer Name (Z-A)" },
//     { value: "date-newest", label: "Newest First" },
//     { value: "date-oldest", label: "Oldest First" },
//     { value: "amount-high", label: "Amount (High to Low)" },
//     { value: "amount-low", label: "Amount (Low to High)" },
//   ];

//   const filterItems = (items: IFetchOrder[]) => {
//     if (!items || items.length === 0) return [];

//     let filteredItems = [...items];

//     // Apply search filter
//     if (filterState.searchQuery) {
//       filteredItems = filteredItems.filter((item) => {
//         const customerName = item.customer?.name?.toLowerCase() || "";
//         const orderId = item._id?.toLowerCase() || "";
//         const email = item.customer?.email?.toLowerCase() || "";

//         return (
//           customerName.includes(filterState.searchQuery.toLowerCase()) ||
//           orderId.includes(filterState.searchQuery.toLowerCase()) ||
//           email.includes(filterState.searchQuery.toLowerCase())
//         );
//       });
//     }

//     // Apply status filter
//     if (filterState.filter) {
//       filteredItems = filteredItems.filter((item) => {
//         return (
//           item.orderStatus.toLowerCase() === filterState.filter.toLowerCase()
//         );
//       });
//     }

//     // Apply sorting
//     if (filterState.sort) {
//       filteredItems = [...filteredItems].sort((a, b) => {
//         switch (filterState.sort) {
//           case "name-asc":
//             return (a.customer?.name || "").localeCompare(
//               b.customer?.name || ""
//             );
//           case "name-desc":
//             return (b.customer?.name || "").localeCompare(
//               a.customer?.name || ""
//             );
//           case "date-newest":
//             return (
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//             );
//           case "date-oldest":
//             return (
//               new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//             );
//           case "amount-high":
//             return b.totalAmount - a.totalAmount;
//           case "amount-low":
//             return a.totalAmount - b.totalAmount;
//           default:
//             return 0;
//         }
//       });
//     }

//     return filteredItems;
//   };

//   // Get filtered items
//   const filteredItems = useMemo(
//     () =>
//       filterItems(orderList).map((item) => ({
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

//   // Calculate pagination

//   const handleViewItem = (item: IFetchOrder) => {
//     navigate(`${FrontendRoutes.ORDERDETAILS}/${item._id}`);
//   };

//   // Updated handlers using the setter function

//   const handleSearch = (query: string) => {
//     setFilterState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
//   };

//   const handleFilter = (filter: string) => {
//     setFilterState((prev) => ({ ...prev, filter, currentPage: 1 }));
//   };

//   const handleSort = (sort: string) => {
//     setFilterState((prev) => ({ ...prev, sort, currentPage: 1 }));
//   };

//   const dummyData = [
//     {
//       date: "2025-04-20",
//       category: "Salary",
//       inFlow: 50000,
//       outFlow: 0,
//       balance: 50000,
//     },
//     {
//       date: "2025-04-21",
//       category: "Groceries",
//       inFlow: 0,
//       outFlow: 5000,
//       balance: 45000,
//     },
//     {
//       date: "2025-04-22",
//       category: "Investment Return",
//       inFlow: 10000,
//       outFlow: 0,
//       balance: 55000,
//     },
//     {
//       date: "2025-04-23",
//       category: "Dining Out",
//       inFlow: 0,
//       outFlow: 2000,
//       balance: 53000,
//     },
//     {
//       date: "2025-04-24",
//       category: "Online Shopping",
//       inFlow: 0,
//       outFlow: 7000,
//       balance: 46000,
//     },
//   ];

//   return (
//     <div className="container px-4 py-3 mx-auto">
//       <Header text="Profit & Loss"></Header>
//       <div className="bg-white border-[#eae9ec] border-2 w-full pb-8 rounded-xl">
//         <div className="mx-3">
//           {/* <MasterTable
//             showAction
//             filterSection={
//               <SearchFilterSort
//                 onSearch={handleSearch}
//                 onFilter={handleFilter}
//                 onSort={handleSort}
//                 filterOptions={filterOptions}
//                 sortOptions={sortOptions}
//                 placeholder="Search by customer name, ID or email..."
//               />
//             }
//             // viewAction={(row) => navigate(`/order/order-details/${row._id}`)}
//             // editAction={() => console.log("edit")}
//             // onDelete={(id) => console.log("delete")}
//             rows={filteredItems}
//             columns={cashFlowColumns}
//             loading={isLoading}
//           /> */}

//           <ProfitTable
//             showAction
//             filterSection={
//               <SearchFilterSort
//                 onSearch={handleSearch}
//                 onFilter={handleFilter}
//                 onSort={handleSort}
//                 filterOptions={filterOptions}
//                 sortOptions={sortOptions}
//                 placeholder="Search by customer name, ID or email..."
//               />
//             }
//             rows={filteredItems}
//             columns={cashFlowColumns}
//             loading={isLoading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfitandLoss;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import Header from "../../components/shared/table_heading/Header";
import { FrontendRoutes } from "../../routes/routes";
import { IFetchOrder, useGetAllOrdersQuery } from "../../server/api/orderHooks";
import { cashFlowColumns } from "./components/CashObj";
import dayjs from "dayjs";
import { get } from "lodash";
import ProfitTable from "./components/ProfitTable";

// Filter state interface
interface FilterState {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  filter: string;
  sort: string;
}

const ProfitandLoss = () => {
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

  // State for controlling hidden rows toggle visibility
  const [showHiddenRows, setShowHiddenRows] = useState(false);

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

  // Sample data for main visible rows
  const mainTransactions = useMemo(
    () =>
      filterItems(orderList).map((item) => ({
        id: item._id,
        date: dayjs(get(item, "createdAt", "")).format("MMMM D, YYYY"),
        category: get(item, "orderStatus", ""),
        inFlow: item.totalAmount > 0 ? item.totalAmount : 0,
        outFlow: item.totalAmount < 0 ? Math.abs(item.totalAmount) : 0,
        balance: item.totalAmount,
        customer: get(item, "customer.name", "-"),
        orderStatus: (
          <div className="px-2 py-1 text-xs text-white rounded-full bg-green dark-green">
            {get(item, "orderStatus", "")}
          </div>
        ),
      })),
    [orderList, filterState]
  );

  // Sample data for hidden/collapsible detailed rows
  const detailedTransactions = useMemo(() => {
    // Generate some detailed transaction rows based on the main transactions
    // These would typically be more detailed breakdowns of each transaction
    return mainTransactions.slice(0, 3).flatMap((transaction) => {
      // Create 2-3 detailed rows for each main transaction
      return [
        {
          id: `${transaction.id}-detail-1`,
          date: transaction.date,
          category: `${transaction.customer} - Item 1`,
          inFlow: Math.round(transaction.inFlow * 0.6),
          outFlow: Math.round(transaction.outFlow * 0.6),
          balance:
            Math.round(transaction.inFlow * 0.6) -
            Math.round(transaction.outFlow * 0.6),
        },
        {
          id: `${transaction.id}-detail-2`,
          date: transaction.date,
          category: `${transaction.customer} - Item 2`,
          inFlow: Math.round(transaction.inFlow * 0.4),
          outFlow: Math.round(transaction.outFlow * 0.4),
          balance:
            Math.round(transaction.inFlow * 0.4) -
            Math.round(transaction.outFlow * 0.4),
        },
      ];
    });
  }, [mainTransactions]);

  const handleViewItem = (item: any) => {
    navigate(`${FrontendRoutes.ORDERDETAILS}/${item.id}`);
  };

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filter, currentPage: 1 }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort, currentPage: 1 }));
  };

  return (
    <div className="container px-4 py-3 mx-auto">
      <Header text="Profit & Loss"></Header>
      <div className="bg-white border-[#eae9ec] border-2 w-full pb-8 rounded-xl">
        <div className="mx-3">
          <ProfitTable
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
            rows={mainTransactions}
            columns={cashFlowColumns}
            loading={isLoading}
            // Enable hidden rows feature
            hiddenRows={detailedTransactions}
            showHiddenRowsToggle={true}
            hiddenRowsLabel="Show transaction details"
            viewAction={handleViewItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitandLoss;
