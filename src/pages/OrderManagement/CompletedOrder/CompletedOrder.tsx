
import type React from "react"
import { useState } from "react"
import { Modal } from "../../../components/shared"
import { Table, type ColumnConfig, type TableData } from "../../../components/shared/Table"
import { useOutsideClick } from "../../../hooks/UseOutsideClick"
import { SearchFilterSort } from "../../../components/global/SearchFilterSort"
interface Order {
  _id: string
  orderId: string
  customerName: string
  orderDate: string
  deliveryDate: string
  totalAmount: number
  status: "Assigned" | "Completed" | "In Progress" | "Delivered" | "Cancelled"
  isActive?: boolean
}

const CompletedOrder: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ref = useOutsideClick(() => setIsModalOpen(false))
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)


  const [orders, setOrders] = useState<Order[]>([
    {
      _id: "1",
      orderId: "#15",
      customerName: "Emily Johnson",
      orderDate: "2001-01-05 3:30 PM",
      deliveryDate: "2001-01-10 2:00 PM",
      totalAmount: 125.75,
      status: "Completed",
      isActive: true,
    },
    {
      _id: "2",
      orderId: "#18",
      customerName: "Michael Smith",
      orderDate: "2001-01-07 10:15 AM",
      deliveryDate: "2001-01-12 1:45 PM",
      totalAmount: 89.99,
      status: "Completed",
      isActive: true,
    },
    {
      _id: "3",
      orderId: "#22",
      customerName: "Sarah Williams",
      orderDate: "2001-01-10 9:20 AM",
      deliveryDate: "2001-01-15 11:30 AM",
      totalAmount: 45.5,
      status: "Completed",
      isActive: true,
    },
    {
      _id: "4",
      orderId: "#25",
      customerName: "David Brown",
      orderDate: "2001-01-12 4:45 PM",
      deliveryDate: "2001-01-17 3:15 PM",
      totalAmount: 199.99,
      status: "Completed",
      isActive: true,
    },
  ])

  const [newOrder, setNewOrder] = useState<Omit<Order, "_id">>({
    orderId: "",
    customerName: "",
    orderDate: "",
    deliveryDate: "",
    totalAmount: 0,
    status: "Completed",
    isActive: true,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Assigned":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-purple-100 text-purple-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }



  const handleToggleStatus = (row: TableData<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === row._id
          ? {
              ...order,
              isActive: !order.isActive,
            }
          : order,
      ),
    )
  }

  const handleDeleteOrder = (row: TableData<Order>) => {
    setOrders((prev) => prev.filter((o) => o._id !== row._id))
  }

  const handleSaveOrder = () => {
    if (newOrder.customerName.trim() && newOrder.orderId.trim()) {
      setOrders((prev) => [...prev, { ...newOrder, _id: Math.random().toString() }])
      setIsModalOpen(false)
    } else {
      alert("Please fill required fields")
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const columns: ColumnConfig<Order>[] = [
    { header: "Order Id", key: "orderId" },
    { header: "Customer Name", key: "customerName" },
    { header: "Order Date", key: "orderDate" },
    { header: "Delivery Date", key: "deliveryDate" },
    {
      header: "Total Amount",
      key: "totalAmount",
      render: (value, row) => `Rs. ${row.totalAmount.toFixed(2)}`,
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>{row.status}</span>
      ),
    },
  ]

  const handleRowSelect = (selectedIds: string[]) => {
    console.log("Selected rows:", selectedIds)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1)
  }

   // Filter options for the dropdown
   const filterOptions = [
    { value: "", label: "All Customers" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ]

  // Sort options for the dropdown
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "orders-high", label: "Orders (High)" },
    { value: "orders-low", label: "Orders (Low)" },
  ]
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilter = (filter: string) => {
    setSelectedFilter(filter)
    setCurrentPage(1)
  }

  const handleSort = (sort: string) => {
    setSelectedSort(sort)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assigned Orders</h1>

      </div>
       <SearchFilterSort
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          placeholder="Search here..."
        />

      <Table
        columns={columns}
        data={filteredOrders}
        showEdit={false}
        showDelete={false}
        showToggle={false}
        showView={false}
        showAction={false}
        showSelectAll={true}
        onRowSelect={handleRowSelect}
        onToggle={handleToggleStatus}
        deleteRow={handleDeleteOrder}
        showPagination={true}
        paginationDetails={{
          currentPage,
          limit: itemsPerPage,
          totalCount: filteredOrders.length,
        }}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        showBg={true}
      />

      {isModalOpen && (
        <Modal ref ={ref}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Order ID *</label>
                <input
                  value={newOrder.orderId}
                  onChange={(e) => setNewOrder({ ...newOrder, orderId: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order Date</label>
                <input
                  type="datetime-local"
                  value={newOrder.orderDate}
                  onChange={(e) => setNewOrder({ ...newOrder, orderDate: e.target.value })}
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Delivery Date</label>
                <input
                  type="datetime-local"
                  value={newOrder.deliveryDate}
                  onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newOrder.totalAmount}
                  onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number.parseFloat(e.target.value) })}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleSaveOrder} className="px-4 py-2 bg-[#DF8D28] text-white rounded-md">
                Create Order
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CompletedOrder

