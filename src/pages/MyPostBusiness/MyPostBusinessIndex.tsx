import { useMemo, useState } from "react";
import { SearchFilterSort } from "../../components/global/SearchFilterSort";
import { Table, ColumnConfig, TableData } from "../../components/shared/Table";
import { Icon } from "@iconify/react/dist/iconify.js";
import Header from "../../components/shared/table_heading/Header";
import MasterTable from "../../components/shared/MasterTable";
import { IFetchOrder, useGetAllOrdersQuery } from "../../server/api/orderHooks";
import { get, map } from "lodash";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface PostBusinessItem {
  _id: string;
  item_name: string;
  price: string;
  total_amount: string;
  image: string;
  selected_packages: string;
}
interface FilterState {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  filter: string;
  sort: string;
}

const MyPostBusinessIndex = () => {
  const [isactionButtonClicked, setIsActionButtonClicked] = useState(false);

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
    searchQuery: "",
    currentPage: 1,
    itemsPerPage: 10,
    filter: "",
    sort: "",
  });

  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  };

  const handleFilter = (filter: string) => {
    setFilterState((prev) => ({ ...prev, filter, currentPage: 1 }));
  };

  const handleSort = (sort: string) => {
    setFilterState((prev) => ({ ...prev, sort, currentPage: 1 }));
  };
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

  const dummyData: TableData<PostBusinessItem>[] = [
    {
      _id: "1",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
    {
      _id: "2",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
    {
      _id: "3",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
    {
      _id: "4",
      item_name: "2 X 1 Gold Neckless",
      price: "$12.09",
      total_amount: "$24.00",
      selected_packages: "Custom Packing (15 x 10 x 3) Weight(kg) 0.09",
      image: "/necklace.jpg",
    },
  ];

  const myPostBusinessTableData = useMemo(
    () => ({
      columns: [
        // { key: "productName", title: "Product Name" },
        // { key: "currentStock", title: "Current Stock" },
        // { key: "minimumStock", title: "Minimum Stock" },
        // { key: "totalStock", title: "Total Stock" },
        // { key: "status", title: "Status" },

        {
          key: "customer",
          title: "Item Name",
        },
        {
          title: "Price",
          key: "createdAt",
        },
        {
          key: "totalAmount",
          title: "Total Amount",
        },
        {
          key: "orderedProducts",
          title: "Selected Packages",
        },

        // {
        //   key: "orderStatus",
        //   title: "Status",
        // },
      ],
      rows: map(orders, (item) => ({
        ...item,
        // productName: "Maintainenance",
        // currentStock: "1",
        // minimumStock: "1",
        // totalStock: "1",
        // status: "pending",
        customer: "hello",
        createdAt: "world",
        totalAmount: "Rs 100",
        orderedProducts: "Custom Packing(15 x 10x 3) Weight(Kg) 0.09",
      })),
    }),
    [orders, isSuccess]
  );

  return (
    <div className="mx-6 my-3">
      <Header text="Packages" />

      <div className="bg-[#ffffff] border-[#dcdddf] pb-[1rem] border-2 rounded-xl">
        {/* <div className="p-4">
          <SearchFilterSort
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            placeholder="Search here..."
          />
        </div> */}

        <div className="flex items-center gap-2 px-3 ">
          <MasterTable
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
            rows={filteredItems}
            columns={myPostBusinessTableData.columns}
            loading={isLoading}
          />
          <div className="w-[40%] mx-4 mb-[10rem]">
            <div className="flex justify-end items-center gap-2  ">
              <button className="bg-[#df8d29] px-3 py-2 text-white text-nowrap rounded-xl">
                CREATE LABEL
              </button>
              <button
                onClick={() => setIsActionButtonClicked(!isactionButtonClicked)}
                className="flex items-center gap-2 w-[7rem]  bg-[#df8d29] px-3 py-2 text-white rounded-xl"
              >
                Actions
                <Icon
                  icon="solar:alt-arrow-down-outline"
                  width="24"
                  height="24"
                />
              </button>
            </div>

            <div className="flex items-center justify-between text-white bg-[#df8d29] rounded-tr-xl rounded-tl-xl w-full px-3 py-2 mt-2 ">
              <h1>Parcel Post</h1>
              <h2>$12.90</h2>
            </div>

            {isactionButtonClicked && (
              <>
                <div className="flex flex-col  justify-start bg-[#f6f6f6] rounded-br-xl rounded-bl-xl">
                  <div className="flex items-center gap-8">
                    <img
                      src="https://www.hollywoodreporter.com/wp-content/uploads/2012/12/img_logo_blue.jpg"
                      height={50}
                      width={100}
                      className="ml-2"
                    />
                    <h1 className="font-semibold">MyPost</h1>
                  </div>

                  <div className="flex flex-col gap-4 mx-2 text-sm ">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold">Parcel Post</h1>
                      <p>$10.73</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold">Express Post</h1>
                      <p>$10.73</p>
                    </div>
                  </div>

                  <div className="flex justify-end my-2">
                    <h1 className="text-sm">Band 2 Zone 3 </h1>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 text-sm mt-7">
              <h1 className="font-bold">Express Post</h1>
              <p>Standard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPostBusinessIndex;
