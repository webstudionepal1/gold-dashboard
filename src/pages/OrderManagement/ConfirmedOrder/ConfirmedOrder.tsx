import type React from "react";
import { useState } from "react";
import {
  Table,
  type TableData,
  type ColumnConfig,
} from "../../../components/shared/Table";
import { Modal } from "../../../components/shared";
import { useOutsideClick } from "../../../hooks/UseOutsideClick";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";
import Header from "../../../components/shared/table_heading/Header";
import { useNavigate } from "react-router-dom";
interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  total_items: string;
  status:
    | "Confirmed"
    | "Not Confirmed"
    | "Pending"
    | "In Progress"
    | "Delivered"
    | "Cancelled";
  isActive?: boolean;
}

const ConfirmedOrder: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ref = useOutsideClick(() => setIsModalOpen(false));
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([
    {
      _id: "1",
      orderId: "#12",
      customerName: "James Carder",
      orderDate: "2001-01-02 ",
      deliveryDate: "2001-01-02 ",
      totalAmount: 25.5,
      total_items: "09",
      status: "Confirmed",
      isActive: true,
    },
    {
      _id: "2",
      orderId: "#12",
      customerName: "James Carder",
      orderDate: "2001-01-02 ",
      deliveryDate: "2001-01-02 ",
      totalAmount: 25.5,
      total_items: "09",

      status: "Confirmed",
      isActive: true,
    },
    {
      _id: "3",
      orderId: "#12",
      customerName: "James Carder",
      orderDate: "2001-01-02 ",
      deliveryDate: "2001-01-02 ",
      totalAmount: 25.5,
      total_items: "09",

      status: "Not Confirmed",
      isActive: true,
    },
    {
      _id: "4",
      orderId: "#12",
      customerName: "Alfonso Dokidis",
      orderDate: "2001-01-02 ",
      deliveryDate: "2001-01-02 ",
      totalAmount: 25.5,
      total_items: "09",

      status: "Confirmed",
      isActive: true,
    },
  ]);

  const [newOrder, setNewOrder] = useState<Omit<Order, "_id">>({
    orderId: "",
    customerName: "",
    orderDate: "",
    deliveryDate: "",
    totalAmount: 0,
    total_items: "09",

    status: "Confirmed",
    isActive: true,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-[#e9fbef] text-[#6db289]";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Not Confirmed":
        return "bg-[#f9ebea] text-[#ce8b8e]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleStatus = (row: TableData<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === row._id
          ? {
              ...order,
              status: order.status === "Pending" ? "In Progress" : "Pending",
              isActive: !order.isActive,
            }
          : order
      )
    );
  };

  const handleDeleteOrder = (row: TableData<Order>) => {
    setOrders((prev) => prev.filter((o) => o._id !== row._id));
  };

  const handleSaveOrder = () => {
    if (newOrder.customerName.trim() && newOrder.orderId.trim()) {
      setOrders((prev) => [
        ...prev,
        { ...newOrder, _id: Math.random().toString() },
      ]);
      setIsModalOpen(false);
    } else {
      alert("Please fill required fields");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnConfig<Order>[] = [
    { header: "Order Id", key: "orderId" },
    {
      header: "Customer Name",
      key: "customerName",
      render: (_: any, row: any) => (
        <div className="flex items-center justify-center">
          <img
            src={
              "https://imgs.search.brave.com/N7iiPmgTwP6DQJtXQfwaAm-6xOmlKftSIdIkAcau0yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE5/ODI1MjY3Mi9waG90/by9lbmdhZ2VtZW50/LWRpYW1vbmQtcmlu/Zy1qZXdlbHJ5LWlz/b2xhdGVkLW9uLXdo/aXQlRDElODMtYmFj/a2dyb3VuZC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9cDFu/Q2o0SDBkWnFURlBs/YTVxT0hMSnRDQUZJ/Y0F6NW5zeGU2UDJs/cWdXMD0"
            }
            alt={row.item_name}
            className="w-10 h-10 rounded-md mr-3 object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{row.customerName}</div>
          </div>
        </div>
      ),
    },
    { header: "Order Date", key: "orderDate" },
    { header: "Delivery Date", key: "deliveryDate" },
    {
      header: "Total Amount",
      key: "totalAmount",
      render: (value, row) => `Rs. ${row.totalAmount.toFixed(2)}`,
    },
    {
      header: "Total Items",
      key: "total_items",
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];
  // Filter options for the dropdown
  const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Sort options for the dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ];

  const handleRowSelect = (selectedIds: string[]) => {
    console.log("Selected rows:", selectedIds);
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

  const handleViewRow = () => {
    navigate(`/order/confirmed-order-details`);
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <Header text="Confirmed Orders" />

      <div className="bg-[#ffffff] p-4 border-[#eae9ec] border-2  rounded-xl">
        <SearchFilterSort
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          placeholder="Search here..."
          showView={false}
        />

        <Table
          columns={columns}
          data={filteredOrders}
          showSelectAll={true}
          onRowSelect={handleRowSelect}
          viewRow={handleViewRow}
          onToggle={handleToggleStatus}
          deleteRow={handleDeleteOrder}
          showView={true}
          showEdit={false}
          showDelete={false}
          showToggle={false}
          showPagination={true}
          paginationDetails={{
            currentPage,
            limit: itemsPerPage,
            totalCount: filteredOrders.length,
          }}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageChange}
          showBg={true}
          showAction={true}
        />
      </div>

      {isModalOpen && (
        <Modal ref={ref}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Order ID *
                </label>
                <input
                  value={newOrder.orderId}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, orderId: e.target.value })
                  }
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name *
                </label>
                <input
                  value={newOrder.customerName}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customerName: e.target.value })
                  }
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Order Date
                </label>
                <input
                  type="datetime-local"
                  value={newOrder.orderDate}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, orderDate: e.target.value })
                  }
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Date
                </label>
                <input
                  type="datetime-local"
                  value={newOrder.deliveryDate}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, deliveryDate: e.target.value })
                  }
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newOrder.totalAmount}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      totalAmount: Number.parseFloat(e.target.value),
                    })
                  }
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                className="px-4 py-2 bg-[#DF8D28] text-white rounded-md"
              >
                Create Order
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConfirmedOrder;
