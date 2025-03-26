import { Icon } from "@iconify/react/dist/iconify.js"
import type React from "react"
import { useState } from "react"
import type { ColumnConfig, TableData } from "../../../components/shared/Table"

interface Order {
  _id: string
  orderId: string
  orderDate: string
  totalPrice: number
  status: "Delivered" | "Out of Stock" | "Cancelled" | "In Stock"
}

interface Address {
  type: string
  address: string
  city: string
  state: string
  zip: string
  phoneNo: string
}

interface CustomerDetail {
  _id: string
  name: string
  businessName: string
  extension: string
  phoneNumber: string
  email: string
  registeredOn: string
  profileImage: string
  addresses: Address[]
  username: string
  password: string
  orders: Order[]
}

interface CustomerDetailProps {
  customerId: string
  onBack: () => void
  onEdit: (customerId: string) => void
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customerId, onBack, onEdit }) => {
  const [customer] = useState<CustomerDetail>({
    _id: customerId,
    name: "Jane Smith",
    businessName: "Opulent Jewel House",
    extension: "Woman Extension 14001",
    phoneNumber: "+1774923012912",
    email: "jane.smith@gmail.com",
    registeredOn: "2023-09-10",
    profileImage: "/placeholder.svg?height=80&width=80",
    addresses: [
      {
        type: "Home",
        address: "601 Finch, Stralia Blvd.",
        city: "Kingston",
        state: "NY",
        zip: "12401",
        phoneNo: "+1773-9999999199",
      },
      {
        type: "Office",
        address: "601 Finch, Stralia Blvd.",
        city: "Kingston",
        state: "NY",
        zip: "12401",
        phoneNo: "+1773-9999999199",
      },
    ],
    username: "janesmith@gmail.com",
    password: "********",
    orders: [
      {
        _id: "1",
        orderId: "01",
        orderDate: "2023-02-11",
        totalPrice: 242,
        status: "Out of Stock",
      },
      {
        _id: "2",
        orderId: "01",
        orderDate: "2023-02-05",
        totalPrice: 242,
        status: "Delivered",
      },
      {
        _id: "3",
        orderId: "01",
        orderDate: "2023-01-19",
        totalPrice: 242,
        status: "Cancelled",
      },
      {
        _id: "4",
        orderId: "01",
        orderDate: "2023-01-12",
        totalPrice: 242,
        status: "In Stock",
      },
      {
        _id: "5",
        orderId: "01",
        orderDate: "2023-01-12",
        totalPrice: 242,
        status: "In Stock",
      },
    ],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-[#D1FAE5] text-[#065F46]"
      case "Out of Stock":
        return "bg-[#FEE2E2] text-[#991B1B]"
      case "Cancelled":
        return "bg-[#FEF3C7] text-[#92400E]"
      case "In Stock":
        return "bg-[#D1FAE5] text-[#065F46]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const orderColumns: ColumnConfig<Order>[] = [
    { header: "Order ID", key: "orderId" },
    { header: "Order Date", key: "orderDate" },
    {
      header: "Total Price",
      key: "totalPrice",
      render: (value, row) => `$${row.totalPrice}`,
    },
    {
      header: "Status",
      key: "status",
      render: (value, row) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      key: "action",
      render: (_, row) => (
        <button className="p-1.5 bg-[#DF8D28] text-white rounded-lg hover:bg-[#C77E23]">
          <Icon icon="mdi:eye-outline" width={18} height={18} />
        </button>
      ),
    },
  ]

  const handleViewOrder = (order: TableData<Order>) => {
    console.log("View order:", order)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center mb-6 text-sm font-medium right-2">
        <button onClick={onBack} className="text-[#665A48] hover:text-[#DF8D28]">
          <Icon icon="mdi:home" className="inline mr-1 w-5 h-5" /> Dashboard
        </button>
        <Icon icon="mdi:chevron-right" className="mx-2 text-[#665A48]" />
        <span className="text-[#665A48]">Products</span>
        <Icon icon="mdi:chevron-right" className="mx-2 text-[#665A48]" />
        <span className="text-[#DF8D28]">Customer Detail</span>
      </div>

      {/* Main Header */}
      <h1 className="text-[28px] font-bold text-[#1A0D00] mb-6">Customer Details</h1>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-[#EFEFEF]">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div>
              <img
                src={customer.profileImage || "/placeholder.svg"}
                alt={customer.name}
                className="w-20 h-20 rounded-xl border-2 border-[#FFF5E9] object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1A0D00]">{customer.businessName}</h2>
              <div className="space-y-2 mt-3">
                <div className="flex items-center text-[#665A48]">
                  <Icon icon="mdi:account" className="mr-2 w-5 h-5" />
                  <span>{customer.extension}</span>
                </div>
                <div className="flex items-center text-[#665A48]">
                  <Icon icon="mdi:phone" className="mr-2 w-5 h-5" />
                  <span>{customer.phoneNumber}</span>
                </div>
                <div className="flex items-center text-[#665A48]">
                  <Icon icon="mdi:email" className="mr-2 w-5 h-5" />
                  <span>{customer.email}</span>
                </div>
                <div className="text-[#665A48]">
                  Registered on: {new Date(customer.registeredOn).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => onEdit(customer._id)}
            className="px-4 py-2 border border-[#DFDFDF] rounded-lg text-[#1A0D00] hover:bg-[#FFF5E9] flex items-center gap-2"
          >
            <Icon icon="mdi:pencil" className="w-5 h-5" /> Edit
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order History */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EFEFEF]">
          <div className="p-4 border-b border-[#EFEFEF]">
            <h3 className="font-semibold text-[#1A0D00]">Order History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-[#EFEFEF]">
              <thead className="bg-[#FFF5E9]">
                <tr>
                  {orderColumns.map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-sm font-medium text-[#665A48] uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#EFEFEF]">
                {customer.orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A0D00]">{order.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A0D00]">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A0D00]">${order.totalPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewOrder(order as any)}
                        className="p-1.5 bg-[#DF8D28] text-white rounded-lg hover:bg-[#C77E23]"
                      >
                        <Icon icon="mdi:eye-outline" width={18} height={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Address Book */}
          <div className="bg-white rounded-xl shadow-sm border border-[#EFEFEF]">
            <div className="p-4 border-b border-[#EFEFEF] flex justify-between items-center">
              <h3 className="font-semibold text-[#1A0D00]">Address Book</h3>
              <div className="w-6 h-6 bg-[#28A745] rounded-full flex items-center justify-center">
                <Icon icon="mdi:check" className="text-white w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-6">
              {customer.addresses.map((address, index) => (
                <div key={index} className="space-y-3">
                  <h4 className="font-medium text-[#DF8D28] text-sm">{address.type}</h4>
                  <div className="text-[#665A48] space-y-1">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                  </div>
                  <div className="text-[#665A48]">
                    <p className="font-medium">Phone no.</p>
                    <p>{address.phoneNo}</p>
                  </div>
                  {index < customer.addresses.length - 1 && (
                    <div className="pt-2">
                      <hr className="border-[#EFEFEF]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-[#EFEFEF]">
            <div className="p-4 border-b border-[#EFEFEF] flex justify-between items-center">
              <h3 className="font-semibold text-[#1A0D00]">Account Information</h3>
              <div className="w-6 h-6 bg-[#28A745] rounded-full flex items-center justify-center">
                <Icon icon="mdi:check" className="text-white w-4 h-4" />
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[#665A48] text-sm mb-1">Username</p>
                <p className="text-[#1A0D00]">{customer.username}</p>
              </div>
              <div>
                <p className="text-[#665A48] text-sm mb-1">Password</p>
                <p className="text-[#1A0D00] flex items-center">
                  {customer.password}
                  <button className="ml-2 text-[#665A48] hover:text-[#DF8D28]">
                    <Icon icon="mdi:eye-off" width={18} height={18} />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail