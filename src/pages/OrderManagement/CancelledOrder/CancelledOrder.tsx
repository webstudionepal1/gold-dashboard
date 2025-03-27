"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
// import { Search } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Modal } from "../../../components/shared"
import { Table, type ColumnConfig, type TableData } from "../../../components/shared/Table"

interface Order {
  _id: string
  orderId: string
  customerName: string
  orderDate: string
  cancelledDate: string
  cancellationReason: string
  totalAmount: number
  status: "Assigned" | "Completed" | "In Progress" | "Delivered" | "Cancelled"
  isActive?: boolean
}

const CancelledOrder: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [orders, setOrders] = useState<Order[]>([
    {
      _id: "1",
      orderId: "#19",
      customerName: "Robert Chen",
      orderDate: "2001-01-08 11:20 AM",
      cancelledDate: "2001-01-09 2:45 PM",
      cancellationReason: "Customer requested cancellation",
      totalAmount: 67.5,
      status: "Cancelled",
      isActive: false,
    },
    {
      _id: "2",
      orderId: "#23",
      customerName: "Jessica Miller",
      orderDate: "2001-01-10 3:15 PM",
      cancelledDate: "2001-01-11 9:30 AM",
      cancellationReason: "Item out of stock",
      totalAmount: 129.99,
      status: "Cancelled",
      isActive: false,
    },
    {
      _id: "3",
      orderId: "#27",
      customerName: "Thomas Wilson",
      orderDate: "2001-01-12 1:40 PM",
      cancelledDate: "2001-01-13 4:20 PM",
      cancellationReason: "Payment failed so that it is failed as the failed kjjdlkjjld kldjljljkdjlj ldjkljl ljdlkjldjljdlj",
      totalAmount: 89.95,
      status: "Cancelled",
      isActive: true,
    },
    {
      _id: "4",
      orderId: "#31",
      customerName: "Amanda Garcia",
      orderDate: "2001-01-15 10:10 AM",
      cancelledDate: "2001-01-16 11:55 AM",
      cancellationReason: "Shipping address issue",
      totalAmount: 45.75,
      status: "Cancelled",
      isActive: false,
    },
  ])

  const [newOrder, setNewOrder] = useState<Omit<Order, "_id">>({
    orderId: "",
    customerName: "",
    orderDate: "",
    cancelledDate: "",
    cancellationReason: "",
    totalAmount: 0,
    status: "Cancelled",
    isActive: false,
  })




  const handleViewDetails = (row: TableData<Order>) => {
    setSelectedOrder(row as Order)
    // You could open a modal or navigate to a details page here
    console.log("View details for order:", row)
  }

  const handleRestoreOrder = (row: TableData<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === row._id
          ? {
            ...order,
            status: "Assigned",
            isActive: true,
          }
          : order,
      ),
    )
    console.log("Restored order:", row)
  }

  const handleDeleteOrder = (row: TableData<Order>) => {
    setOrders((prev) => prev.filter((o) => o._id !== row._id))
  }



  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cancellationReason.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const columns: ColumnConfig<Order>[] = [
    { header: "Order Id", key: "orderId" },
    { header: "Customer Name", key: "customerName" },
    { header: "Order Date", key: "orderDate" },
    { header: "Cancelled Date", key: "cancelledDate" },

    {
      header: "Cancellation Reason",
      key: "cancellationReason",
      render: (value, row) => (
        <div className="break-words whitespace-normal max-w-[300px]">
          {row.cancellationReason}
        </div>
      )
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

  // Custom action buttons for each row
  const renderActionButtons = (row: TableData<Order>) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleViewDetails(row)}
        className="p-1 text-blue-600 hover:text-blue-800"
        title="View Details"
      >
        <Icon icon="mdi:eye-outline" width={18} height={18} />
      </button>
      <button
        onClick={() => handleRestoreOrder(row)}
        className="p-1 text-green-600 hover:text-green-800"
        title="Restore Order"
      >
        <Icon icon="mdi:restore" width={18} height={18} />
      </button>
      <button
        onClick={() => handleDeleteOrder(row)}
        className="p-1 text-red-600 hover:text-red-800"
        title="Delete Order"
      >
        <Icon icon="material-symbols:delete-outline-rounded" width={18} height={18} />
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cancelled Orders</h1>

      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search here..."
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md">
              <Icon icon="lucide:filter" width={16} height={16} />
              Filter
            </button>

            <select className="px-4 py-2 border rounded-md">
              <option>Sorts</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Amount (High)</option>
              <option>Amount (Low)</option>
            </select>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredOrders}

        showView={true}

        showSelectAll={true}
        onRowSelect={handleRowSelect}
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
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Cancelled Order</h2>
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
                <label className="block text-sm font-medium mb-1">Cancelled Date</label>
                <input
                  type="datetime-local"
                  value={newOrder.cancelledDate}
                  onChange={(e) => setNewOrder({ ...newOrder, cancelledDate: e.target.value })}
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cancellation Reason *</label>
                <textarea
                  value={newOrder.cancellationReason}
                  onChange={(e) => setNewOrder({ ...newOrder, cancellationReason: e.target.value })}
                  className="border rounded-md p-2 w-full"
                  rows={3}
                  required
                />

                <div className="mt-2 line-clamp-2 break-words text-sm text-gray-500">
                  Preview: {newOrder.cancellationReason}
                </div>
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
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CancelledOrder

