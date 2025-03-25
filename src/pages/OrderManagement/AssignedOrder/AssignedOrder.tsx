"use client"

import type React from "react"
import { useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Table, type TableData, type ColumnConfig } from "../../../components/shared/Table"
import { Modal } from "../../../components/shared"
import { Search } from "lucide-react"

interface Order {
  _id: string
  orderId: string
  customerName: string
  orderDate: string
  deliveryDate: string
  totalAmount: number
  status: "Assigned" | "Pending" | "In Progress" | "Delivered" | "Cancelled"
  isActive?: boolean
}

const AssignedOrder: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [orders, setOrders] = useState<Order[]>([
    {
      _id: "1",
      orderId: "#12",
      customerName: "James Carder",
      orderDate: "2001-01-02 2:00 PM",
      deliveryDate: "2001-01-02 2:00 PM",
      totalAmount: 25.5,
      status: "Assigned",
      isActive: true,
    },
    {
      _id: "2",
      orderId: "#12",
      customerName: "James Carder",
      orderDate: "2001-01-02 2:00 PM",
      deliveryDate: "2001-01-02 2:00 PM",
      totalAmount: 25.5,
      status: "Assigned",
      isActive: true,
    },
    {
      _id: "3",
      orderId: "#12",
      customerName: "James Carder",
      orderDate: "2001-01-02 2:00 PM",
      deliveryDate: "2001-01-02 2:00 PM",
      totalAmount: 25.5,
      status: "Assigned",
      isActive: true,
    },
    {
      _id: "4",
      orderId: "#12",
      customerName: "Alfonso Dokidis",
      orderDate: "2001-01-02 2:00 PM",
      deliveryDate: "2001-01-02 2:00 PM",
      totalAmount: 25.5,
      status: "Assigned",
      isActive: true,
    },
  ])

  const [newOrder, setNewOrder] = useState<Omit<Order, "_id">>({
    orderId: "",
    customerName: "",
    orderDate: "",
    deliveryDate: "",
    totalAmount: 0,
    status: "Assigned",
    isActive: true,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Assigned":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
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
              status: order.status === "Pending" ? "In Progress" : "Pending",
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assigned Orders</h1>

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
        <Modal onClose={() => setIsModalOpen(false)}>
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

export default AssignedOrder

