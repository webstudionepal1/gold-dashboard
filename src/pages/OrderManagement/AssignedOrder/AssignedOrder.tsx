import dayjs from "dayjs";
import { get, invoke, map, size } from "lodash";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MasterTable from "../../../components/shared/MasterTable";
import Header from "../../../components/shared/table_heading/Header";
import {
  useGetAllOrdersQuery
} from "../../../server/api/orderHooks";
import { confirmedColumns } from "../Order/orderObj";

// Filter state interface
interface FilterState {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  filter: string;
  sort: string;
}


const AssignedOrder = () => {
  const { data: orders, isSuccess, isLoading } = useGetAllOrdersQuery({
    orderStatus: "assigned",
  });
  const navigate = useNavigate();

  const orderList = useMemo(
    () =>
      isSuccess
        ? map(orders, (item) => ({
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
          }))
        : [],
    [isSuccess, orders]
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
    <div className="container px-4 py-3 mx-auto">
      <Header text="Orders"></Header>
      <div className="bg-white border-[#eae9ec] border-2 w-full pb-8 rounded-xl">
        {/* <div className="px-2">
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search by customer name, ID or email..."
          />
        </div> */}
        <div className="mx-3">
          {/* <Table
            data={paginatedItems}
            columns={columns}
            showView
            showDelete={false}
            showEdit={false}
            showAction
            viewRow={handleViewItem}
            showPagination={true}
            paginationDetails={{
              currentPage: filterState.currentPage,
              limit: filterState.itemsPerPage,
              totalCount: filteredItems.length,
            }}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPageChange={handlePageChange}
          /> */}
          <MasterTable
            showAction
            loading={isLoading}
            viewAction={(row) =>
              navigate(`/order/assigned-order-details/${row._id}`)
            }
            columns={confirmedColumns}
            rows={orderList}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignedOrder;
