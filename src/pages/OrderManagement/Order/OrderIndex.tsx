import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/shared/tab";
import {
  Table,
  TableData,
  ColumnConfig,
} from "../../../components/shared/Table";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import { Link } from "react-router-dom";
import { FrontendRoutes } from "../../../routes/routes";
import Header from "../../../components/shared/table_heading/Header";

// Dummy datasets

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-[#e9fbef] text-[#6db289]";
    case "Pending":
      return "bg-[#d1d1d1] text-[#8d8d8d]";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    case "Not Completed":
      return "bg-[#f9ebea] text-[#ce8b8e]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const allOrders: TableData[] = [
  {
    _id: "1",
    order_Id: "#12",
    product: "Lipstick",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    status: "Completed",
    deliver_date: "2001-01-02",
  },
  {
    _id: "2",
    order_Id: "#12",
    product: "Lipstick",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    status: "Completed",
    deliver_date: "2001-01-02",
  },

  {
    _id: "3",
    order_Id: "#12",
    product: "Lipstick",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    status: "Completed",
    deliver_date: "2001-01-02",
  },

  {
    _id: "4",
    order_Id: "#12",
    product: "Lipstick",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    status: "Pending",
    deliver_date: "2001-01-02",
  },
  {
    _id: "5",
    order_Id: "#12",
    product: "Lipstick",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    status: "Cancelled",
    deliver_date: "2001-01-02",
  },
];

const cancelledOrders: TableData[] = [
  {
    _id: "1",
    order_Id: "#12",
    product: "Lipstick",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    cancellation_date: "2001-01-02",
    reason: "Wrong Product",
    status: "Completed",
  },
  {
    _id: "2",
    order_Id: "#12",
    product: "Bag",
    customer_name: "Alfonso Dokidis",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    cancellation_date: "2001-01-02",
    reason: "Color",
    status: "Completed",
  },
  {
    _id: "3",
    order_Id: "#12",
    product: "Shoes",
    customer_name: "Alfonso Dokidis",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    cancellation_date: "2001-01-02",
    reason: "Wrong Size",
    status: "Completed",
  },
];

const completedOrders: TableData[] = [
  {
    _id: "1",
    order_Id: "#12",
    customer_name: "Alfonso Dokidis",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    deliver_date: "2001-01-02",
    delivery_rider: "Leo Rhiel Madsen",
    feedback_rating: "4.5",
  },
  {
    _id: "2",
    order_Id: "#12",
    customer_name: "Alfonso Dokidis",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    deliver_date: "2001-01-02",
    delivery_rider: "Hanna Dias",
    feedback_rating: "3.5",
  },

  {
    _id: "3",
    order_Id: "#12",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    deliver_date: "2001-01-02",
    delivery_rider: "Wilson Rosser",
    feedback_rating: "2.5",
  },
];

const newOrders: TableData[] = [
  {
    _id: "1",
    order_Id: "#12",
    customer_name: "Alfonso Dokidis",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    total_items: "09",
    deliver_date: "2001-01-02",
  },
  {
    _id: "2",
    order_Id: "#12",
    customer_name: "Alfonso Dokidis",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    total_items: "09",
    deliver_date: "2001-01-02",
  },

  {
    _id: "3",
    order_Id: "#12",
    customer_name: "James Carder",
    order_date: (
      <div>
        2001-01-02
        <br /> 2:00 PM
      </div>
    ),
    total_amount: "$25.50",
    total_items: "09",
    deliver_date: "2001-01-02",
  },
];

// Dynamic config per tab
const tabConfig = {
  all: {
    data: allOrders,
    columns: [
      { key: "order_Id", header: "Order ID" },
      {
        key: "product",
        header: "Product",
        render: (_: any, row: any) => (
          <div className="flex items-center">
            <img
              src={
                "https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"
              }
              alt={row.product}
              className="w-10 h-10 rounded-md mr-3 object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{row.product}</div>
            </div>
          </div>
        ),
      },
      { key: "customer_name", header: "Customer Name" },
      { key: "order_date", header: "Order Date" },
      { key: "total_amount", header: "Total Amount" },
      {
        header: "Status",
        key: "status",
        render: (_: any, row: any) => (
          <span
            className={`px-5 py-1 rounded-full text-xs ${getStatusColor(
              row.status
            )}`}
          >
            {row.status}
          </span>
        ),
      },
    ],
  },
  new: {
    data: newOrders,
    columns: [
      { key: "order_Id", header: "Order ID" },
      { key: "customer_name", header: "Customer Name" },
      { key: "order_date", header: "Order Date" },
      { key: "total_amount", header: "Total Amount" },
      { key: "total_items", header: "Total Items" },
      { key: "deliver_date", header: "Deliver Date" },
    ],
  },
  cancelled: {
    data: cancelledOrders,
    columns: [
      { key: "order_Id", header: "Order ID" },
      {
        key: "product",
        header: "Product",
        render: (_: any, row: any) => (
          <div className="flex items-center">
            <img
              src={
                "https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"
              }
              alt={row.product}
              className="w-10 h-10 rounded-md  object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{row.product}</div>
            </div>
          </div>
        ),
      },
      { key: "customer_name", header: "Customer Name" },
      { key: "order_date", header: "Order Date" },
      { key: "total_amount", header: "Total Amount" },
      { key: "cancellation_date", header: "Cancellation Date" },
      { key: "reason", header: "Reason" },
      //   {
      //     header: "Status",
      //     key: "status",
      //     render: (_: any, row: any) => (
      //       <span
      //         className={`px-5 py-1 rounded-full text-xs ${getStatusColor(
      //           row.status
      //         )}`}
      //       >
      //         {row.status}
      //       </span>
      //     ),
      //   },
    ],
  },
  completed: {
    data: completedOrders,
    columns: [
      { key: "order_Id", header: "Order ID" },
      { key: "customer_name", header: "Customer Name" },
      { key: "order_date", header: "Order Date" },
      { key: "total_amount", header: "Total Amount" },
      { key: "deliver_date", header: "Deliver Date" },
      { key: "delivery_rider", header: "Delivery Rider" },
      {
        key: "feedback_rating",
        header: "Feedback Rating",
        render: (_: any, row: any) => (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span>{row.feedback_rating}</span>{" "}
              <Icon icon="openmoji:star" width="20" height="20" />
            </div>
          </div>
        ),
      },
    ],
  },
};

const OrderIndex = () => {
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabConfig>("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("");
  console.log(selectedFilter);
  const [selectedSort, setSelectedSort] = useState("");
  console.log(selectedSort);

  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];
  const filterItems = (items: any[]) => {
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handleSort = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const { data, columns } = tabConfig[selectedTab];

  return (
    <div className="container mx-auto px-4 py-3 ">
      {/* <div className="mt-2 mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-3xl">Orders</h1>
        <Link
          to={FrontendRoutes.ADDORDER}
          className="bg-[#e38b29] flex items-center transition-transform duration-200 ease-in-out hover:scale-105 text-white rounded-lg px-3 py-2"
        >
          <Icon
            icon="material-symbols-light:add-rounded"
            width="24"
            height="24"
            className="fill-white"
          />{" "}
          Add Orders
        </Link>
      </div> */}

      <Header
        text="Order"
        button={
          <button className="px-3 py-2  flex items-center  text-white bg-[#d49327] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
            <Link className="flex items-center" to={FrontendRoutes.ADDORDER}>
              <Icon
                icon="material-symbols-light:add-rounded"
                width="24"
                height="24"
                className="fill-white"
              />{" "}
              Add Order
            </Link>
          </button>
        }
      />
      <div className="bg-[#ffffff] border-[#eae9ec] border-2  rounded-xl ">
        <Tabs
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val as keyof typeof tabConfig)}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <TabsList>
              <TabsTrigger
                value="all"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                New Orders
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
              >
                Completed
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <SearchFilterSort
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSort={handleSort}
                filterOptions={filterOptions}
                sortOptions={sortOptions}
                placeholder="Search here..."
              />
            </div>
          </div>

          <TabsContent className="mx-3 " value={selectedTab}>
            <Table
              data={data}
              columns={columns}
              showView
              showDelete
              showEdit
              showAction
              showPagination={true}
              paginationDetails={{
                currentPage,
                limit: itemsPerPage,
                totalCount: filterItems.length,
              }}
              onItemsPerPageChange={handleItemsPerPageChange}
              onPageChange={handlePageChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderIndex;
